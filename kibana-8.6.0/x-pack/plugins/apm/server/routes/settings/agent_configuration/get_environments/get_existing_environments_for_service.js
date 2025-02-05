"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExistingEnvironmentsForService = getExistingEnvironmentsForService;
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _all_option = require("../../../../../common/agent_configuration/all_option");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getExistingEnvironmentsForService({
  serviceName,
  internalESClient,
  size
}) {
  var _resp$aggregations;
  const bool = serviceName ? {
    filter: [{
      term: {
        [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
      }
    }]
  } : {
    must_not: [{
      exists: {
        field: _elasticsearch_fieldnames.SERVICE_NAME
      }
    }]
  };
  const params = {
    index: internalESClient.apmIndices.apmAgentConfigurationIndex,
    body: {
      size: 0,
      query: {
        bool
      },
      aggs: {
        environments: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
            missing: _all_option.ALL_OPTION_VALUE,
            size
          }
        }
      }
    }
  };
  const resp = await internalESClient.search('get_existing_environments_for_service', params);
  const existingEnvironments = ((_resp$aggregations = resp.aggregations) === null || _resp$aggregations === void 0 ? void 0 : _resp$aggregations.environments.buckets.map(bucket => bucket.key)) || [];
  return existingEnvironments;
}