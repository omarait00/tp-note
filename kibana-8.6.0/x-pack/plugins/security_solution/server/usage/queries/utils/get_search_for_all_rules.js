"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchForAllRules = void 0;
var _rule_monitoring = require("../../../lib/detection_engine/rule_monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given an aggregation of "aggs" this will return a search for all rules within 24 hours.
 * @param eventLogIndex The event log index such as ".kibana-event-log-8.2.0*"
 * @param aggs The aggregation to break things down by
 */
const getSearchForAllRules = ({
  eventLogIndex,
  aggs
}) => ({
  index: eventLogIndex,
  size: 0,
  track_total_hits: false,
  aggs,
  query: {
    bool: {
      filter: {
        bool: {
          must: [{
            range: {
              '@timestamp': {
                gte: 'now-24h',
                lte: 'now'
              }
            }
          }, {
            term: {
              'event.provider': _rule_monitoring.RULE_EXECUTION_LOG_PROVIDER
            }
          }]
        }
      }
    }
  }
});
exports.getSearchForAllRules = getSearchForAllRules;