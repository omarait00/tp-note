"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.backgroundTaskUtilizationRoute = backgroundTaskUtilizationRoute;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _background_task_utilization_statistics = require("../monitoring/background_task_utilization_statistics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function backgroundTaskUtilizationRoute(params) {
  const {
    router,
    monitoringStats$,
    logger,
    taskManagerId,
    config,
    kibanaVersion,
    kibanaIndexName,
    getClusterClient,
    usageCounter
  } = params;
  const requiredHotStatsFreshness = config.monitored_stats_required_freshness;
  function getBackgroundTaskUtilization(monitoredStats) {
    const summarizedStats = (0, _background_task_utilization_statistics.summarizeUtilizationStats)({
      last_update: monitoredStats.last_update,
      stats: monitoredStats.stats.utilization
    });
    const now = Date.now();
    const timestamp = new Date(now).toISOString();
    return {
      process_uuid: taskManagerId,
      timestamp,
      ...summarizedStats
    };
  }
  const monitoredUtilization$ = new _rxjs.Subject();
  /* keep track of last utilization summary, as we'll return that to the next call to _background_task_utilization */
  let lastMonitoredStats = null;
  monitoringStats$.pipe((0, _operators.throttleTime)(requiredHotStatsFreshness), (0, _operators.tap)(stats => {
    lastMonitoredStats = stats;
  }),
  // Only calculate the summarized stats (calculates all running averages and evaluates state)
  // when needed by throttling down to the requiredHotStatsFreshness
  (0, _operators.map)(stats => getBackgroundTaskUtilization(stats))).subscribe(utilizationStats => {
    monitoredUtilization$.next(utilizationStats);
    if (utilizationStats.stats == null) {
      logger.debug('Unable to get Task Manager background task utilization metrics.');
    }
  });
  router.get({
    path: '/internal/task_manager/_background_task_utilization',
    // Uncomment when we determine that we can restrict API usage to Global admins based on telemetry
    // options: { tags: ['access:taskManager'] },
    validate: false
  }, async function (context, req, res) {
    // If we are able to count usage, we want to check whether the user has access to
    // the `taskManager` feature, which is only available as part of the Global All privilege.
    if (usageCounter) {
      const clusterClient = await getClusterClient();
      const hasPrivilegesResponse = await clusterClient.asScoped(req).asCurrentUser.security.hasPrivileges({
        body: {
          application: [{
            application: `kibana-${kibanaIndexName}`,
            resources: ['*'],
            privileges: [`api:${kibanaVersion}:taskManager`]
          }]
        }
      });

      // Keep track of total access vs admin access
      usageCounter.incrementCounter({
        counterName: `taskManagerBackgroundTaskUtilApiAccess`,
        counterType: 'taskManagerBackgroundTaskUtilApi',
        incrementBy: 1
      });
      if (hasPrivilegesResponse.has_all_requested) {
        usageCounter.incrementCounter({
          counterName: `taskManagerBackgroundTaskUtilApiAdminAccess`,
          counterType: 'taskManagerBackgroundTaskUtilApi',
          incrementBy: 1
        });
      }
    }
    return res.ok({
      body: lastMonitoredStats ? getBackgroundTaskUtilization(lastMonitoredStats) : {
        process_uuid: taskManagerId,
        timestamp: new Date().toISOString(),
        stats: {}
      }
    });
  });
  return monitoredUtilization$;
}