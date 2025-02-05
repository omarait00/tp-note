"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPodNodeName = void 0;
var _lodash = require("lodash");
var _inventory_models = require("../../../../common/inventory_models");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPodNodeName = async (framework, requestContext, sourceConfiguration, nodeId, nodeType, timeRange) => {
  const fields = (0, _inventory_models.findInventoryFields)(nodeType);
  const params = {
    allow_no_indices: true,
    ignore_unavailable: true,
    terminate_after: 1,
    index: sourceConfiguration.metricAlias,
    body: {
      size: 1,
      _source: ['kubernetes.node.name'],
      sort: [{
        [_constants.TIMESTAMP_FIELD]: 'desc'
      }],
      query: {
        bool: {
          filter: [{
            match: {
              [fields.id]: nodeId
            }
          }, {
            exists: {
              field: `kubernetes.node.name`
            }
          }, {
            range: {
              [_constants.TIMESTAMP_FIELD]: {
                gte: timeRange.from,
                lte: timeRange.to,
                format: 'epoch_millis'
              }
            }
          }]
        }
      }
    }
  };
  const response = await framework.callWithRequest(requestContext, 'search', params);
  const firstHit = (0, _lodash.first)(response.hits.hits);
  if (firstHit) {
    return (0, _lodash.get)(firstHit, '_source.kubernetes.node.name');
  }
};
exports.getPodNodeName = getPodNodeName;