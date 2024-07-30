"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkUpdateAgents = bulkUpdateAgents;
exports.closePointInTime = closePointInTime;
exports.countInactiveAgents = countInactiveAgents;
exports.deleteAgent = deleteAgent;
exports.getAgentByAccessAPIKeyId = getAgentByAccessAPIKeyId;
exports.getAgentById = getAgentById;
exports.getAgentDocuments = getAgentDocuments;
exports.getAgentPolicyForAgent = getAgentPolicyForAgent;
exports.getAgentTags = getAgentTags;
exports.getAgents = getAgents;
exports.getAgentsById = getAgentsById;
exports.getAgentsByKuery = getAgentsByKuery;
exports.getAllAgentsByKuery = getAllAgentsByKuery;
exports.getElasticsearchQuery = getElasticsearchQuery;
exports.isAgentDocument = isAgentDocument;
exports.openPointInTime = openPointInTime;
exports.removeSOAttributes = removeSOAttributes;
exports.updateAgent = updateAgent;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _esQuery = require("@kbn/es-query");
var _ = require("..");
var _constants = require("../../../common/constants");
var _services = require("../../../common/services");
var _constants2 = require("../../constants");
var _saved_object = require("../saved_object");
var _errors = require("../../errors");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ACTIVE_AGENT_CONDITION = 'active:true';
const INACTIVE_AGENT_CONDITION = `NOT (${ACTIVE_AGENT_CONDITION})`;
function _joinFilters(filters) {
  try {
    return filters.filter(filter => filter !== undefined).reduce((acc, kuery) => {
      if (kuery === undefined) {
        return acc;
      }
      const kueryNode = typeof kuery === 'string' ? (0, _esQuery.fromKueryExpression)(removeSOAttributes(kuery)) : kuery;
      if (!acc) {
        return kueryNode;
      }
      return {
        type: 'function',
        function: 'and',
        arguments: [acc, kueryNode]
      };
    }, undefined);
  } catch (err) {
    throw new _errors.FleetError(`Kuery is malformed: ${err.message}`);
  }
}
function removeSOAttributes(kuery) {
  return kuery.replace(/attributes\./g, '').replace(/fleet-agents\./g, '');
}
async function getAgents(esClient, options) {
  let agents = [];
  if ('agentIds' in options) {
    agents = await getAgentsById(esClient, options.agentIds);
  } else if ('kuery' in options) {
    var _options$showInactive;
    agents = (await getAllAgentsByKuery(esClient, {
      kuery: options.kuery,
      showInactive: (_options$showInactive = options.showInactive) !== null && _options$showInactive !== void 0 ? _options$showInactive : false
    })).agents;
  } else {
    throw new _errors.FleetError('Either options.agentIds or options.kuery are required to get agents');
  }
  return agents;
}
async function openPointInTime(esClient, index = _constants2.AGENTS_INDEX) {
  const pitKeepAlive = '10m';
  const pitRes = await esClient.openPointInTime({
    index,
    keep_alive: pitKeepAlive
  });
  return pitRes.id;
}
async function closePointInTime(esClient, pitId) {
  try {
    await esClient.closePointInTime({
      id: pitId
    });
  } catch (error) {
    _.appContextService.getLogger().warn(`Error closing point in time with id: ${pitId}. Error: ${error.message}`);
  }
}
async function getAgentTags(esClient, options) {
  const {
    kuery,
    showInactive = false
  } = options;
  const filters = [];
  if (kuery && kuery !== '') {
    filters.push(kuery);
  }
  if (showInactive === false) {
    filters.push(ACTIVE_AGENT_CONDITION);
  }
  const kueryNode = _joinFilters(filters);
  const body = kueryNode ? {
    query: (0, _esQuery.toElasticsearchQuery)(kueryNode)
  } : {};
  try {
    var _result$aggregations, _buckets$map;
    const result = await esClient.search({
      index: _constants2.AGENTS_INDEX,
      size: 0,
      body,
      aggs: {
        tags: {
          terms: {
            field: 'tags',
            size: _constants.SO_SEARCH_LIMIT
          }
        }
      }
    });
    const buckets = (_result$aggregations = result.aggregations) === null || _result$aggregations === void 0 ? void 0 : _result$aggregations.tags.buckets;
    return (_buckets$map = buckets === null || buckets === void 0 ? void 0 : buckets.map(bucket => bucket.key)) !== null && _buckets$map !== void 0 ? _buckets$map : [];
  } catch (err) {
    if ((0, _errors.isESClientError)(err) && err.meta.statusCode === 404) {
      return [];
    }
    throw err;
  }
}
function getElasticsearchQuery(kuery, showInactive = false, includeHosted = false, hostedPolicies = [], extraFilters = []) {
  const filters = [];
  if (kuery && kuery !== '') {
    filters.push(kuery);
  }
  if (showInactive === false) {
    filters.push(ACTIVE_AGENT_CONDITION);
  }
  if (!includeHosted && hostedPolicies.length > 0) {
    filters.push('NOT (policy_id:{policyIds})'.replace('{policyIds}', hostedPolicies.join(',')));
  }
  filters.push(...extraFilters);
  const kueryNode = _joinFilters(filters);
  return kueryNode ? (0, _esQuery.toElasticsearchQuery)(kueryNode) : undefined;
}
async function getAgentsByKuery(esClient, options) {
  var _options$sortField, _options$sortOrder;
  const {
    page = 1,
    perPage = 20,
    sortField = (_options$sortField = options.sortField) !== null && _options$sortField !== void 0 ? _options$sortField : 'enrolled_at',
    sortOrder = (_options$sortOrder = options.sortOrder) !== null && _options$sortOrder !== void 0 ? _options$sortOrder : 'desc',
    kuery,
    showInactive = false,
    showUpgradeable,
    searchAfter,
    pitId
  } = options;
  const filters = [];
  if (kuery && kuery !== '') {
    filters.push(kuery);
  }
  if (showInactive === false) {
    filters.push(ACTIVE_AGENT_CONDITION);
  }
  const kueryNode = _joinFilters(filters);
  const body = kueryNode ? {
    query: (0, _esQuery.toElasticsearchQuery)(kueryNode)
  } : {};
  const isDefaultSort = sortField === 'enrolled_at' && sortOrder === 'desc';
  // if using default sorting (enrolled_at), adding a secondary sort on hostname, so that the results are not changing randomly in case many agents were enrolled at the same time
  const secondarySort = isDefaultSort ? [{
    'local_metadata.host.hostname.keyword': {
      order: 'asc'
    }
  }] : [];
  const queryAgents = async (from, size) => esClient.search({
    from,
    size,
    track_total_hits: true,
    rest_total_hits_as_int: true,
    body: {
      ...body,
      sort: [{
        [sortField]: {
          order: sortOrder
        }
      }, ...secondarySort]
    },
    ...(pitId ? {
      pit: {
        id: pitId,
        keep_alive: '1m'
      }
    } : {
      index: _constants2.AGENTS_INDEX,
      ignore_unavailable: true
    }),
    ...(pitId && searchAfter ? {
      search_after: searchAfter,
      from: 0
    } : {})
  });
  const res = await queryAgents((page - 1) * perPage, perPage);
  let agents = res.hits.hits.map(_helpers.searchHitToAgent);
  let total = res.hits.total;
  // filtering for a range on the version string will not work,
  // nor does filtering on a flattened field (local_metadata), so filter here
  if (showUpgradeable) {
    // fixing a bug where upgradeable filter was not returning right results https://github.com/elastic/kibana/issues/117329
    // query all agents, then filter upgradeable, and return the requested page and correct total
    // if there are more than SO_SEARCH_LIMIT agents, the logic falls back to same as before
    if (total < _constants.SO_SEARCH_LIMIT) {
      const response = await queryAgents(0, _constants.SO_SEARCH_LIMIT);
      agents = response.hits.hits.map(_helpers.searchHitToAgent).filter(agent => (0, _services.isAgentUpgradeable)(agent, _.appContextService.getKibanaVersion()));
      total = agents.length;
      const start = (page - 1) * perPage;
      agents = agents.slice(start, start + perPage);
    } else {
      agents = agents.filter(agent => (0, _services.isAgentUpgradeable)(agent, _.appContextService.getKibanaVersion()));
    }
  }
  return {
    agents,
    total,
    page,
    perPage
  };
}
async function getAllAgentsByKuery(esClient, options) {
  const res = await getAgentsByKuery(esClient, {
    ...options,
    page: 1,
    perPage: _constants.SO_SEARCH_LIMIT
  });
  return {
    agents: res.agents,
    total: res.total
  };
}
async function countInactiveAgents(esClient, options) {
  const {
    kuery
  } = options;
  const filters = [INACTIVE_AGENT_CONDITION];
  if (kuery && kuery !== '') {
    filters.push((0, _saved_object.normalizeKuery)(_constants2.AGENTS_PREFIX, kuery));
  }
  const kueryNode = _joinFilters(filters);
  const body = kueryNode ? {
    query: (0, _esQuery.toElasticsearchQuery)(kueryNode)
  } : {};
  const res = await esClient.search({
    index: _constants2.AGENTS_INDEX,
    size: 0,
    track_total_hits: true,
    rest_total_hits_as_int: true,
    filter_path: 'hits.total',
    ignore_unavailable: true,
    body
  });
  return res.hits.total || 0;
}
async function getAgentById(esClient, agentId) {
  const agentNotFoundError = new _errors.AgentNotFoundError(`Agent ${agentId} not found`);
  try {
    const agentHit = await esClient.get({
      index: _constants2.AGENTS_INDEX,
      id: agentId
    });
    if (agentHit.found === false) {
      throw agentNotFoundError;
    }
    return (0, _helpers.searchHitToAgent)(agentHit);
  } catch (err) {
    if ((0, _errors.isESClientError)(err) && err.meta.statusCode === 404) {
      throw agentNotFoundError;
    }
    throw err;
  }
}
function isAgentDocument(maybeDocument) {
  return '_id' in maybeDocument && '_source' in maybeDocument;
}
async function getAgentDocuments(esClient, agentIds) {
  const res = await esClient.mget({
    index: _constants2.AGENTS_INDEX,
    body: {
      docs: agentIds.map(_id => ({
        _id
      }))
    }
  });
  return res.docs || [];
}
async function getAgentsById(esClient, agentIds) {
  const allDocs = await getAgentDocuments(esClient, agentIds);
  const agents = allDocs.reduce((results, doc) => {
    if (isAgentDocument(doc)) {
      results.push((0, _helpers.searchHitToAgent)(doc));
    }
    return results;
  }, []);
  return agents;
}
async function getAgentByAccessAPIKeyId(esClient, accessAPIKeyId) {
  const res = await esClient.search({
    index: _constants2.AGENTS_INDEX,
    ignore_unavailable: true,
    q: `access_api_key_id:${(0, _saved_object.escapeSearchQueryPhrase)(accessAPIKeyId)}`
  });
  const searchHit = res.hits.hits[0];
  const agent = searchHit && (0, _helpers.searchHitToAgent)(searchHit);
  if (!searchHit || !agent) {
    throw new _errors.AgentNotFoundError('Agent not found');
  }
  if (agent.access_api_key_id !== accessAPIKeyId) {
    throw new Error('Agent api key id is not matching');
  }
  if (!agent.active) {
    throw _boom.default.forbidden('Agent inactive');
  }
  return agent;
}
async function updateAgent(esClient, agentId, data) {
  await esClient.update({
    id: agentId,
    index: _constants2.AGENTS_INDEX,
    body: {
      doc: (0, _helpers.agentSOAttributesToFleetServerAgentDoc)(data)
    },
    refresh: 'wait_for'
  });
}
async function bulkUpdateAgents(esClient, updateData, errors) {
  if (updateData.length === 0) {
    return;
  }
  const body = updateData.flatMap(({
    agentId,
    data
  }) => [{
    update: {
      _id: agentId,
      retry_on_conflict: 3
    }
  }, {
    doc: {
      ...(0, _helpers.agentSOAttributesToFleetServerAgentDoc)(data)
    }
  }]);
  const res = await esClient.bulk({
    body,
    index: _constants2.AGENTS_INDEX,
    refresh: 'wait_for'
  });
  res.items.filter(item => item.update.error).forEach(item => {
    // @ts-expect-error it not assignable to ErrorCause
    errors[item.update._id] = item.update.error;
  });
}
async function deleteAgent(esClient, agentId) {
  try {
    await esClient.update({
      id: agentId,
      index: _constants2.AGENTS_INDEX,
      body: {
        doc: {
          active: false
        }
      }
    });
  } catch (err) {
    if ((0, _errors.isESClientError)(err) && err.meta.statusCode === 404) {
      throw new _errors.AgentNotFoundError('Agent not found');
    }
    throw err;
  }
}
async function getAgentPolicyForAgent(soClient, esClient, agentId) {
  const agent = await getAgentById(esClient, agentId);
  if (!agent.policy_id) {
    return;
  }
  const agentPolicy = await _.agentPolicyService.get(soClient, agent.policy_id, false);
  if (agentPolicy) {
    return agentPolicy;
  }
}