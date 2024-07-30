"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentPoliciesUsage = void 0;
var _common = require("../../common");
var _constants = require("../../common/constants");
var _services = require("../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_AGENT_POLICIES_USAGE = {
  count: 0,
  output_types: []
};
const getAgentPoliciesUsage = async (esClient, abortController) => {
  try {
    const res = await esClient.search({
      index: _common.AGENT_POLICY_INDEX,
      size: _constants.ES_SEARCH_LIMIT,
      track_total_hits: true,
      rest_total_hits_as_int: true
    }, {
      signal: abortController.signal
    });
    const agentPolicies = res.hits.hits;
    const outputTypes = new Set();
    agentPolicies.forEach(item => {
      var _ref;
      const source = (_ref = item._source) !== null && _ref !== void 0 ? _ref : {};
      Object.keys(source.data.outputs).forEach(output => {
        outputTypes.add(source.data.outputs[output].type);
      });
    });
    return {
      count: res.hits.total,
      output_types: Array.from(outputTypes)
    };
  } catch (error) {
    if (error.statusCode === 404) {
      _services.appContextService.getLogger().debug('Index .fleet-policies does not exist yet.');
    } else {
      throw error;
    }
    return DEFAULT_AGENT_POLICIES_USAGE;
  }
};
exports.getAgentPoliciesUsage = getAgentPoliciesUsage;