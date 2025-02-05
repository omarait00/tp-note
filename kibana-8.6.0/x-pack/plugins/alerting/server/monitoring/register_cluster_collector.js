"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerClusterCollector = registerClusterCollector;
var _server = require("../../../task_manager/server");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerClusterCollector({
  monitoringCollection,
  core
}) {
  monitoringCollection.registerMetric({
    type: 'cluster_rules',
    schema: {
      overdue: {
        count: {
          type: 'long'
        },
        delay: {
          p50: {
            type: 'long'
          },
          p99: {
            type: 'long'
          }
        }
      }
    },
    fetch: async () => {
      try {
        var _results$hits$total, _ref, _aggregations$overdue, _ref2, _ref3;
        const [_, pluginStart] = await core.getStartServices();
        const results = await pluginStart.taskManager.aggregate((0, _server.aggregateTaskOverduePercentilesForType)('alerting'));
        const totalOverdueTasks = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value;
        const aggregations = results.aggregations;
        const overdueByValues = (_ref = aggregations === null || aggregations === void 0 ? void 0 : (_aggregations$overdue = aggregations.overdueByPercentiles) === null || _aggregations$overdue === void 0 ? void 0 : _aggregations$overdue.values) !== null && _ref !== void 0 ? _ref : {};

        /**
         * Response format
         * {
         *   "aggregations": {
         *     "overdueBy": {
         *       "values": {
         *         "50.0": 3027400
         *         "99.0": 3035402
         *       }
         *     }
         *   }
         * }
         */

        const metrics = {
          overdue: {
            count: totalOverdueTasks !== null && totalOverdueTasks !== void 0 ? totalOverdueTasks : 0,
            delay: {
              p50: (_ref2 = overdueByValues['50.0']) !== null && _ref2 !== void 0 ? _ref2 : 0,
              p99: (_ref3 = overdueByValues['99.0']) !== null && _ref3 !== void 0 ? _ref3 : 0
            }
          }
        };
        if (isNaN(metrics.overdue.delay.p50)) {
          metrics.overdue.delay.p50 = 0;
        }
        if (isNaN(metrics.overdue.delay.p99)) {
          metrics.overdue.delay.p99 = 0;
        }
        return metrics;
      } catch (err) {
        return _types.EMPTY_CLUSTER_RULES_METRICS;
      }
    }
  });
}