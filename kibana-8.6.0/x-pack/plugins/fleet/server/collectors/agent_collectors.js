"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentUsage = exports.getAgentData = void 0;
var _common = require("../../common");
var AgentService = _interopRequireWildcard(require("../services/agents"));
var _services = require("../services");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAgentUsage = async (soClient, esClient) => {
  // TODO: unsure if this case is possible at all.
  if (!soClient || !esClient) {
    return {
      total_enrolled: 0,
      healthy: 0,
      unhealthy: 0,
      offline: 0,
      total_all_statuses: 0,
      updating: 0
    };
  }
  const {
    total,
    inactive,
    online,
    error,
    offline,
    updating
  } = await AgentService.getAgentStatusForAgentPolicy(esClient);
  return {
    total_enrolled: total,
    healthy: online,
    unhealthy: error,
    offline,
    total_all_statuses: total + inactive,
    updating
  };
};
exports.getAgentUsage = getAgentUsage;
const DEFAULT_AGENT_DATA = {
  agent_checkin_status: {
    error: 0,
    degraded: 0
  },
  agents_per_policy: [],
  agents_per_version: []
};
const getAgentData = async (esClient, abortController) => {
  try {
    var _buckets2, _response$aggregation, _buckets3, _response$aggregation2;
    const transformLastCheckinStatusBuckets = resp => {
      var _buckets, _resp$aggregations;
      return ((_buckets = (resp === null || resp === void 0 ? void 0 : (_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.last_checkin_status).buckets) !== null && _buckets !== void 0 ? _buckets : []).reduce((acc, bucket) => {
        if (acc[bucket.key] !== undefined) acc[bucket.key] = bucket.doc_count;
        return acc;
      }, {
        error: 0,
        degraded: 0
      });
    };
    const response = await esClient.search({
      index: _common.AGENTS_INDEX,
      query: {
        bool: {
          filter: [{
            term: {
              active: 'true'
            }
          }]
        }
      },
      size: 0,
      aggs: {
        versions: {
          terms: {
            field: 'agent.version'
          }
        },
        last_checkin_status: {
          terms: {
            field: 'last_checkin_status'
          }
        },
        policies: {
          terms: {
            field: 'policy_id'
          }
        }
      }
    }, {
      signal: abortController.signal
    });
    const agentsPerVersion = ((_buckets2 = (response === null || response === void 0 ? void 0 : (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : _response$aggregation.versions).buckets) !== null && _buckets2 !== void 0 ? _buckets2 : []).map(bucket => ({
      version: bucket.key,
      count: bucket.doc_count
    }));
    const statuses = transformLastCheckinStatusBuckets(response);
    const agentsPerPolicy = ((_buckets3 = (response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.policies).buckets) !== null && _buckets3 !== void 0 ? _buckets3 : []).map(bucket => bucket.doc_count);
    return {
      agent_checkin_status: statuses,
      agents_per_policy: agentsPerPolicy,
      agents_per_version: agentsPerVersion
    };
  } catch (error) {
    if (error.statusCode === 404) {
      _services.appContextService.getLogger().debug('Index .fleet-agents does not exist yet.');
    } else {
      throw error;
    }
    return DEFAULT_AGENT_DATA;
  }
};
exports.getAgentData = getAgentData;