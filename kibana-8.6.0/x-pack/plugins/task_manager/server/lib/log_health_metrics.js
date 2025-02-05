"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logHealthMetrics = logHealthMetrics;
exports.resetLastLogLevel = resetLastLogLevel;
var _utils = require("@kbn/utils");
var _lodash = require("lodash");
var _monitoring = require("../monitoring");
var _calculate_health_status = require("./calculate_health_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var LogLevel;
(function (LogLevel) {
  LogLevel["Info"] = "info";
  LogLevel["Warn"] = "warn";
  LogLevel["Error"] = "error";
  LogLevel["Debug"] = "debug";
})(LogLevel || (LogLevel = {}));
let lastLogLevel = null;
function resetLastLogLevel() {
  lastLogLevel = null;
}
function logHealthMetrics(monitoredHealth, logger, config, shouldRunTasks) {
  let logLevel = config.monitored_stats_health_verbose_log.level === 'info' ? LogLevel.Info : LogLevel.Debug;
  const enabled = config.monitored_stats_health_verbose_log.enabled;
  const healthWithoutCapacity = {
    ...monitoredHealth,
    stats: {
      ...monitoredHealth.stats,
      capacity_estimation: undefined
    }
  };
  const statusWithoutCapacity = (0, _calculate_health_status.calculateHealthStatus)(healthWithoutCapacity, config, shouldRunTasks, logger);
  if (statusWithoutCapacity === _monitoring.HealthStatus.Warning) {
    logLevel = LogLevel.Warn;
  } else if (statusWithoutCapacity === _monitoring.HealthStatus.Error && !(0, _lodash.isEmpty)(monitoredHealth.stats)) {
    logLevel = LogLevel.Error;
  }
  const message = `Latest Monitored Stats: ${JSON.stringify(monitoredHealth)}`;
  // TODO: remove when docs support "main"
  const docsBranch = _utils.kibanaPackageJson.branch === 'main' ? 'master' : 'main';
  const docLink = `https://www.elastic.co/guide/en/kibana/${docsBranch}/task-manager-health-monitoring.html`;
  const detectedProblemMessage = `Task Manager detected a degradation in performance. This is usually temporary, and Kibana can recover automatically. If the problem persists, check the docs for troubleshooting information: ${docLink} .`;

  // Drift looks at runtime stats which are not available when task manager is not running tasks
  if (enabled && shouldRunTasks) {
    var _monitoredHealth$stat, _monitoredHealth$stat2;
    const driftInSeconds = ((_monitoredHealth$stat = (_monitoredHealth$stat2 = monitoredHealth.stats.runtime) === null || _monitoredHealth$stat2 === void 0 ? void 0 : _monitoredHealth$stat2.value.drift.p99) !== null && _monitoredHealth$stat !== void 0 ? _monitoredHealth$stat : 0) / 1000;
    if (driftInSeconds >= config.monitored_stats_health_verbose_log.warn_delayed_task_start_in_seconds) {
      var _monitoredHealth$stat3, _monitoredHealth$stat4;
      const taskTypes = Object.keys((_monitoredHealth$stat3 = (_monitoredHealth$stat4 = monitoredHealth.stats.runtime) === null || _monitoredHealth$stat4 === void 0 ? void 0 : _monitoredHealth$stat4.value.drift_by_type) !== null && _monitoredHealth$stat3 !== void 0 ? _monitoredHealth$stat3 : {}).reduce((accum, typeName) => {
        var _monitoredHealth$stat5, _monitoredHealth$stat6;
        if (((_monitoredHealth$stat5 = monitoredHealth.stats.runtime) === null || _monitoredHealth$stat5 === void 0 ? void 0 : _monitoredHealth$stat5.value.drift_by_type[typeName].p99) === ((_monitoredHealth$stat6 = monitoredHealth.stats.runtime) === null || _monitoredHealth$stat6 === void 0 ? void 0 : _monitoredHealth$stat6.value.drift.p99)) {
          accum.push(typeName);
        }
        return accum;
      }, []).join(', ');
      logger.warn(`Detected delay task start of ${driftInSeconds}s for task(s) "${taskTypes}" (which exceeds configured value of ${config.monitored_stats_health_verbose_log.warn_delayed_task_start_in_seconds}s)`);
      logLevel = LogLevel.Warn;
    }
    switch (logLevel) {
      case LogLevel.Info:
        logger.info(message);
        break;
      case LogLevel.Warn:
        logger.warn(message);
        break;
      case LogLevel.Error:
        logger.error(message);
        break;
      default:
        logger.debug(message);
    }
  } else {
    // This is legacy support - we used to always show this
    logger.debug(message);
    if (logLevel !== LogLevel.Debug && lastLogLevel === LogLevel.Debug) {
      logger.debug(detectedProblemMessage);
    }
  }
  lastLogLevel = logLevel;
}