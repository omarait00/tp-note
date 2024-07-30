"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigsAppliedToAgentsThroughFleet = getConfigsAppliedToAgentsThroughFleet;
var _server = require("../../../../../observability/server");
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getConfigsAppliedToAgentsThroughFleet(internalESClient) {
  var _response$aggregation, _response$aggregation2;
  const params = {
    index: internalESClient.apmIndices.metric,
    size: 0,
    body: {
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.METRICSET_NAME, 'agent_config'), ...(0, _server.rangeQuery)(_datemath.default.parse('now-15m').valueOf(), _datemath.default.parse('now').valueOf())]
        }
      },
      aggs: {
        config_by_etag: {
          terms: {
            field: 'labels.etag',
            size: 200
          }
        }
      }
    }
  };
  const response = await internalESClient.search('get_config_applied_to_agent_through_fleet', params);
  return (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.config_by_etag.buckets.reduce((configsAppliedToAgentsThroughFleet, bucket) => {
    configsAppliedToAgentsThroughFleet[bucket.key] = true;
    return configsAppliedToAgentsThroughFleet;
  }, {})) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
}