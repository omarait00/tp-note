"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateHealthStatus = calculateHealthStatus;
var _lodash = require("lodash");
var _monitoring = require("../monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function calculateHealthStatus(summarizedStats, config, shouldRunTasks, logger) {
  const now = Date.now();

  // if "hot" health stats are any more stale than monitored_stats_required_freshness
  // times a multiplier, consider the system unhealthy
  const requiredHotStatsFreshness = config.monitored_stats_required_freshness * 3;

  // if "cold" health stats are any more stale than the configured refresh
  // times a multiplier, consider the system unhealthy
  const requiredColdStatsFreshness = config.monitored_aggregated_stats_refresh_rate * 1.5;
  if (hasStatus(summarizedStats.stats, _monitoring.HealthStatus.Error)) {
    return _monitoring.HealthStatus.Error;
  }

  // Hot timestamps look at runtime stats which are not available when tasks are not running
  if (shouldRunTasks) {
    if (hasExpiredHotTimestamps(summarizedStats, now, requiredHotStatsFreshness)) {
      logger.debug('setting HealthStatus.Error because of expired hot timestamps');
      return _monitoring.HealthStatus.Error;
    }
  }
  if (hasExpiredColdTimestamps(summarizedStats, now, requiredColdStatsFreshness)) {
    logger.debug('setting HealthStatus.Error because of expired cold timestamps');
    return _monitoring.HealthStatus.Error;
  }
  if (hasStatus(summarizedStats.stats, _monitoring.HealthStatus.Warning)) {
    return _monitoring.HealthStatus.Warning;
  }
  return _monitoring.HealthStatus.OK;
}
function hasStatus(stats, status) {
  return Object.values(stats).map(stat => (stat === null || stat === void 0 ? void 0 : stat.status) === status).includes(true);
}

/**
 * If certain "hot" stats are not fresh, then the _health api will should return a Red status
 * @param monitoringStats The monitored stats
 * @param now The time to compare against
 * @param requiredFreshness How fresh should these stats be
 */
function hasExpiredHotTimestamps(monitoringStats, now, requiredFreshness) {
  var _monitoringStats$stat;
  const diff = now - getOldestTimestamp(monitoringStats.last_update, (_monitoringStats$stat = monitoringStats.stats.runtime) === null || _monitoringStats$stat === void 0 ? void 0 : _monitoringStats$stat.value.polling.last_successful_poll);
  return diff > requiredFreshness;
}
function hasExpiredColdTimestamps(monitoringStats, now, requiredFreshness) {
  var _monitoringStats$stat2;
  return now - getOldestTimestamp((_monitoringStats$stat2 = monitoringStats.stats.workload) === null || _monitoringStats$stat2 === void 0 ? void 0 : _monitoringStats$stat2.timestamp) > requiredFreshness;
}
function getOldestTimestamp(...timestamps) {
  const validTimestamps = timestamps.map(timestamp => (0, _lodash.isString)(timestamp) ? Date.parse(timestamp) : NaN).filter(timestamp => !isNaN(timestamp));
  return validTimestamps.length ? Math.min(...validTimestamps) : 0;
}