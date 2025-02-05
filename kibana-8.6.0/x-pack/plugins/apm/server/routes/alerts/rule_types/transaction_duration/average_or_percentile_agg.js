"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.averageOrPercentileAgg = averageOrPercentileAgg;
exports.getMultiTermsSortOrder = getMultiTermsSortOrder;
var _apm_rule_types = require("../../../../../common/rules/apm_rule_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function averageOrPercentileAgg({
  aggregationType,
  transactionDurationField
}) {
  if (aggregationType === _apm_rule_types.AggregationType.Avg) {
    return {
      avgLatency: {
        avg: {
          field: transactionDurationField
        }
      }
    };
  }
  return {
    pctLatency: {
      percentiles: {
        field: transactionDurationField,
        percents: [aggregationType === _apm_rule_types.AggregationType.P95 ? 95 : 99],
        keyed: false
      }
    }
  };
}
function getMultiTermsSortOrder(aggregationType) {
  if (aggregationType === _apm_rule_types.AggregationType.Avg) {
    return {
      order: {
        avgLatency: 'desc'
      }
    };
  }
  const percentsKey = aggregationType === _apm_rule_types.AggregationType.P95 ? 95 : 99;
  return {
    order: {
      [`pctLatency.${percentsKey}`]: 'desc'
    }
  };
}