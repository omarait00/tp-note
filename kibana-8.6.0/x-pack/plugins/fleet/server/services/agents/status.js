"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentStatus = void 0;
exports.getAgentStatusById = getAgentStatusById;
exports.getAgentStatusForAgentPolicy = getAgentStatusForAgentPolicy;
exports.getIncomingDataByAgentsId = getIncomingDataByAgentsId;
var _pMap = _interopRequireDefault(require("p-map"));
var _esQuery = require("@kbn/es-query");
var _constants = require("../../constants");
var _services = require("../../../common/services");
var _errors = require("../../errors");
var _app_context = require("../app_context");
var _crud = require("./crud");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DATA_STREAM_INDEX_PATTERN = 'logs-*-*,metrics-*-*,traces-*-*,synthetics-*-*';
const MAX_AGENT_DATA_PREVIEW_SIZE = 20;
async function getAgentStatusById(esClient, agentId) {
  return (await (0, _crud.getAgentById)(esClient, agentId)).status;
}
const getAgentStatus = _services.AgentStatusKueryHelper.getAgentStatus;
exports.getAgentStatus = getAgentStatus;
function joinKuerys(...kuerys) {
  return kuerys.filter(kuery => kuery !== undefined).reduce((acc, kuery) => {
    if (kuery === undefined) {
      return acc;
    }
    const normalizedKuery = (0, _esQuery.fromKueryExpression)((0, _crud.removeSOAttributes)(kuery || ''));
    if (!acc) {
      return normalizedKuery;
    }
    return {
      type: 'function',
      function: 'and',
      arguments: [acc, normalizedKuery]
    };
  }, undefined);
}
async function getAgentStatusForAgentPolicy(esClient, agentPolicyId, filterKuery) {
  let pitId;
  try {
    pitId = await (0, _crud.openPointInTime)(esClient);
  } catch (error) {
    if (error.statusCode === 404) {
      _app_context.appContextService.getLogger().debug('Index .fleet-agents does not exist yet, skipping point in time.');
    } else {
      throw error;
    }
  }
  const [all, allActive, online, error, offline, updating] = await (0, _pMap.default)([undefined,
  // All agents, including inactive
  undefined,
  // All active agents
  _services.AgentStatusKueryHelper.buildKueryForOnlineAgents(), _services.AgentStatusKueryHelper.buildKueryForErrorAgents(), _services.AgentStatusKueryHelper.buildKueryForOfflineAgents(), _services.AgentStatusKueryHelper.buildKueryForUpdatingAgents()], (kuery, index) => (0, _crud.getAgentsByKuery)(esClient, {
    showInactive: index === 0,
    perPage: 0,
    page: 1,
    pitId,
    kuery: joinKuerys(...[kuery, filterKuery, agentPolicyId ? `${_constants.AGENTS_PREFIX}.policy_id:"${agentPolicyId}"` : undefined])
  }), {
    concurrency: 1
  });
  if (pitId) {
    await (0, _crud.closePointInTime)(esClient, pitId);
  }
  const result = {
    total: allActive.total,
    inactive: all.total - allActive.total,
    online: online.total,
    error: error.total,
    offline: offline.total,
    updating: updating.total,
    other: all.total - online.total - error.total - offline.total,
    /* @deprecated Agent events do not exists anymore */
    events: 0
  };
  return result;
}
async function getIncomingDataByAgentsId(esClient, agentsIds, returnDataPreview = false) {
  try {
    var _searchResult$aggrega, _searchResult$hits;
    const {
      has_all_requested: hasAllPrivileges
    } = await esClient.security.hasPrivileges({
      body: {
        index: [{
          names: [DATA_STREAM_INDEX_PATTERN],
          privileges: ['read']
        }]
      }
    });
    if (!hasAllPrivileges) {
      throw new _errors.FleetUnauthorizedError('Missing permissions to read data streams indices');
    }
    const searchResult = await esClient.search({
      index: DATA_STREAM_INDEX_PATTERN,
      allow_partial_search_results: true,
      _source: returnDataPreview,
      timeout: '5s',
      size: returnDataPreview ? MAX_AGENT_DATA_PREVIEW_SIZE : 0,
      body: {
        query: {
          bool: {
            filter: [{
              terms: {
                'agent.id': agentsIds
              }
            }, {
              range: {
                '@timestamp': {
                  gte: 'now-5m',
                  lte: 'now'
                }
              }
            }]
          }
        },
        aggs: {
          agent_ids: {
            terms: {
              field: 'agent.id',
              size: agentsIds.length
            }
          }
        }
      }
    });
    if (!((_searchResult$aggrega = searchResult.aggregations) !== null && _searchResult$aggrega !== void 0 && _searchResult$aggrega.agent_ids)) {
      return {
        items: agentsIds.map(id => {
          return {
            items: {
              [id]: {
                data: false
              }
            }
          };
        }),
        data: []
      };
    }

    // @ts-expect-error aggregation type is not specified
    const agentIdsWithData = searchResult.aggregations.agent_ids.buckets.map(bucket => bucket.key);
    const dataPreview = ((_searchResult$hits = searchResult.hits) === null || _searchResult$hits === void 0 ? void 0 : _searchResult$hits.hits) || [];
    const items = agentsIds.map(id => agentIdsWithData.includes(id) ? {
      [id]: {
        data: true
      }
    } : {
      [id]: {
        data: false
      }
    });
    return {
      items,
      dataPreview
    };
  } catch (e) {
    throw new Error(e);
  }
}