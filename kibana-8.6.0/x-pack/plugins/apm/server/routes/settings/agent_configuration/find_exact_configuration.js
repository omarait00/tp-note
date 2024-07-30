"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExactConfiguration = findExactConfiguration;
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _convert_settings_to_string = require("./convert_settings_to_string");
var _get_config_applied_to_agent_through_fleet = require("./get_config_applied_to_agent_through_fleet");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function findExactConfiguration({
  service,
  internalESClient
}) {
  const serviceNameFilter = service.name ? {
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: service.name
    }
  } : {
    bool: {
      must_not: [{
        exists: {
          field: _elasticsearch_fieldnames.SERVICE_NAME
        }
      }]
    }
  };
  const environmentFilter = service.environment ? {
    term: {
      [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: service.environment
    }
  } : {
    bool: {
      must_not: [{
        exists: {
          field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT
        }
      }]
    }
  };
  const params = {
    index: internalESClient.apmIndices.apmAgentConfigurationIndex,
    body: {
      query: {
        bool: {
          filter: [serviceNameFilter, environmentFilter]
        }
      }
    }
  };
  const [agentConfig, configsAppliedToAgentsThroughFleet] = await Promise.all([internalESClient.search('find_exact_agent_configuration', params), (0, _get_config_applied_to_agent_through_fleet.getConfigsAppliedToAgentsThroughFleet)(internalESClient)]);
  const hit = agentConfig.hits.hits[0];
  if (!hit) {
    return;
  }
  return {
    id: hit._id,
    ...(0, _convert_settings_to_string.convertConfigSettingsToString)(hit)._source,
    applied_by_agent: hit._source.applied_by_agent || configsAppliedToAgentsThroughFleet.hasOwnProperty(hit._source.etag)
  };
}