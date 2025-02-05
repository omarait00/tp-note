"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdSignalHistory = exports.buildPreviousThresholdAlertRequest = void 0;
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _build_signal_history = require("./build_signal_history");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getThresholdSignalHistory = async ({
  from,
  to,
  frameworkRuleId,
  bucketByFields,
  ruleDataReader
}) => {
  var _response$_shards$fai;
  const request = buildPreviousThresholdAlertRequest({
    from,
    to,
    frameworkRuleId,
    bucketByFields
  });
  const response = await ruleDataReader.search(request);
  return {
    signalHistory: (0, _build_signal_history.buildThresholdSignalHistory)({
      alerts: response.hits.hits
    }),
    searchErrors: (0, _utils.createErrorsFromShard)({
      errors: (_response$_shards$fai = response._shards.failures) !== null && _response$_shards$fai !== void 0 ? _response$_shards$fai : []
    })
  };
};
exports.getThresholdSignalHistory = getThresholdSignalHistory;
const buildPreviousThresholdAlertRequest = ({
  from,
  to,
  frameworkRuleId,
  bucketByFields
}) => {
  return {
    // We should switch over to @elastic/elasticsearch/lib/api/types instead of typesWithBodyKey where possible,
    // but api/types doesn't have a complete type for `sort`
    body: {
      size: 10000,
      sort: [{
        '@timestamp': 'desc'
      }],
      query: {
        bool: {
          must: [{
            range: {
              '@timestamp': {
                lte: to,
                gte: from,
                format: 'strict_date_optional_time'
              }
            }
          }, {
            term: {
              [_ruleDataUtils.ALERT_RULE_UUID]: frameworkRuleId
            }
          },
          // We might find a signal that was generated on the interval for old data... make sure to exclude those.
          {
            range: {
              'signal.original_time': {
                gte: from
              }
            }
          }, ...bucketByFields.map(field => {
            return {
              bool: {
                should: [{
                  term: {
                    'signal.rule.threshold.field': field
                  }
                }, {
                  term: {
                    'kibana.alert.rule.parameters.threshold.field': field
                  }
                }],
                minimum_should_match: 1
              }
            };
          })]
        }
      }
    }
  };
};
exports.buildPreviousThresholdAlertRequest = buildPreviousThresholdAlertRequest;