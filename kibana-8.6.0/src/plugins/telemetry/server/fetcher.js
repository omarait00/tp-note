"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FetcherTask = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _server = require("../../../core/server");
var _get_next_attempt_date = require("./get_next_attempt_date");
var _telemetry_config = require("../common/telemetry_config");
var _telemetry_repository = require("./telemetry_repository");
var _constants = require("../common/constants");
var _is_report_interval_expired = require("../common/is_report_interval_expired");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
class FetcherTask {
  // Let's initially assume we are not online

  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "initialCheckDelayMs", 5 * MINUTE);
    (0, _defineProperty2.default)(this, "connectivityCheckIntervalMs", 12 * HOUR);
    (0, _defineProperty2.default)(this, "config$", void 0);
    (0, _defineProperty2.default)(this, "currentKibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "subscriptions", new _rxjs.Subscription());
    (0, _defineProperty2.default)(this, "isOnline$", new _rxjs.BehaviorSubject(false));
    (0, _defineProperty2.default)(this, "lastReported$", new _rxjs.BehaviorSubject(0));
    (0, _defineProperty2.default)(this, "internalRepository", void 0);
    (0, _defineProperty2.default)(this, "telemetryCollectionManager", void 0);
    this.config$ = initializerContext.config.create();
    this.currentKibanaVersion = initializerContext.env.packageInfo.version;
    this.logger = initializerContext.logger.get('fetcher');
  }
  start({
    savedObjects
  }, {
    telemetryCollectionManager
  }) {
    this.internalRepository = new _server.SavedObjectsClient(savedObjects.createInternalRepository());
    this.telemetryCollectionManager = telemetryCollectionManager;
    this.subscriptions.add(this.validateConnectivity());
    this.subscriptions.add(this.startSendIfDueSubscription());
  }
  stop() {
    this.subscriptions.unsubscribe();
  }

  /**
   * Periodically validates the connectivity from the server to our remote telemetry URL.
   * OPTIONS is less intrusive as it does not contain any payload and is used here to check if the endpoint is reachable.
   */
  validateConnectivity() {
    return (0, _rxjs.timer)(this.initialCheckDelayMs, this.connectivityCheckIntervalMs).pipe(
    // Skip any further processing if already online
    (0, _rxjs.filter)(() => !this.isOnline$.value),
    // Fetch current state and configs
    (0, _rxjs.exhaustMap)(async () => await this.getCurrentConfigs()),
    // Skip if opted-out, or should only send from the browser
    (0, _rxjs.filter)(({
      telemetryOptIn,
      telemetrySendUsageFrom
    }) => telemetryOptIn === true && telemetrySendUsageFrom === 'server'),
    // Skip if already failed three times for this version
    (0, _rxjs.filter)(({
      failureCount,
      failureVersion,
      currentVersion
    }) => !(failureCount > 2 && failureVersion === currentVersion)), (0, _rxjs.exhaustMap)(async ({
      telemetryUrl,
      failureCount
    }) => {
      try {
        await (0, _nodeFetch.default)(telemetryUrl, {
          method: 'options'
        });
        this.isOnline$.next(true);
      } catch (err) {
        this.logger.error(`Cannot reach the remote telemetry endpoint ${telemetryUrl}`);
        await this.updateReportFailure({
          failureCount
        });
      }
    })).subscribe();
  }
  startSendIfDueSubscription() {
    return (0, _rxjs.merge)(
    // Attempt to send telemetry...
    // ... whenever connectivity changes
    this.isOnline$,
    // ... when lastReported$ has a new value...
    this.lastReported$.pipe((0, _rxjs.filter)(Boolean), (0, _rxjs.mergeMap)(lastReported =>
    // ... set a timer of 24h from there (+ a random seed to avoid concurrent emissions from multiple Kibana instances).
    // Emitting again every 1 minute after the next attempt date in case we reach a deadlock in further checks (like Kibana is not healthy at the moment of sending).
    (0, _rxjs.timer)((0, _get_next_attempt_date.getNextAttemptDate)(lastReported), MINUTE).pipe(
    // Cancel this observable if lastReported$ emits again
    (0, _rxjs.takeUntil)(this.lastReported$.pipe((0, _rxjs.skip)(1))))))).pipe((0, _rxjs.filter)(() => this.isOnline$.value), (0, _rxjs.exhaustMap)(() => this.sendIfDue())).subscribe();
  }
  async sendIfDue() {
    var _this$telemetryCollec;
    // Skip this run if Kibana is not in a healthy state to fetch telemetry.
    if (!(await ((_this$telemetryCollec = this.telemetryCollectionManager) === null || _this$telemetryCollec === void 0 ? void 0 : _this$telemetryCollec.shouldGetTelemetry()))) {
      return;
    }
    let telemetryConfig;
    try {
      telemetryConfig = await this.getCurrentConfigs();
    } catch (err) {
      this.logger.warn(`Error getting telemetry configs. (${err})`);
      return;
    }
    if (!telemetryConfig || !this.shouldSendReport(telemetryConfig)) {
      return;
    }
    let clusters = [];
    try {
      clusters = await this.fetchTelemetry();
    } catch (err) {
      this.logger.warn(`Error fetching usage. (${err})`);
      return;
    }
    try {
      const {
        telemetryUrl
      } = telemetryConfig;
      await this.sendTelemetry(telemetryUrl, clusters);
      await this.updateLastReported();
    } catch (err) {
      await this.updateReportFailure(telemetryConfig);
      this.logger.warn(`Error sending telemetry usage data. (${err})`);
    }
  }
  async getCurrentConfigs() {
    const telemetrySavedObject = await (0, _telemetry_repository.getTelemetrySavedObject)(this.internalRepository);
    const config = await (0, _rxjs.firstValueFrom)(this.config$);
    const currentKibanaVersion = this.currentKibanaVersion;
    const configTelemetrySendUsageFrom = config.sendUsageFrom;
    const allowChangingOptInStatus = config.allowChangingOptInStatus;
    const configTelemetryOptIn = typeof config.optIn === 'undefined' ? null : config.optIn;
    const telemetryUrl = (0, _telemetry_config.getTelemetryChannelEndpoint)({
      channelName: 'snapshot',
      env: config.sendUsageTo
    });
    const {
      failureCount,
      failureVersion
    } = (0, _telemetry_config.getTelemetryFailureDetails)({
      telemetrySavedObject
    });
    const lastReported = telemetrySavedObject ? telemetrySavedObject.lastReported : void 0;

    // If the lastReported value in the SO is more recent than the in-memory one, refresh the memory (another instance or the browser may have reported it)
    if (lastReported && lastReported > this.lastReported$.value) {
      this.lastReported$.next(lastReported);
    }
    return {
      telemetryOptIn: (0, _telemetry_config.getTelemetryOptIn)({
        currentKibanaVersion,
        telemetrySavedObject,
        allowChangingOptInStatus,
        configTelemetryOptIn
      }),
      telemetrySendUsageFrom: (0, _telemetry_config.getTelemetrySendUsageFrom)({
        telemetrySavedObject,
        configTelemetrySendUsageFrom
      }),
      telemetryUrl,
      failureCount,
      failureVersion,
      currentVersion: currentKibanaVersion,
      lastReported
    };
  }
  async updateLastReported() {
    this.lastReported$.next(Date.now());
    (0, _telemetry_repository.updateTelemetrySavedObject)(this.internalRepository, {
      reportFailureCount: 0,
      lastReported: this.lastReported$.value
    }).catch(err => {
      err.message = `Failed to update the telemetry saved object: ${err.message}`;
      this.logger.debug(err);
    });
  }
  async updateReportFailure({
    failureCount
  }) {
    this.isOnline$.next(false);
    (0, _telemetry_repository.updateTelemetrySavedObject)(this.internalRepository, {
      reportFailureCount: failureCount + 1,
      reportFailureVersion: this.currentKibanaVersion
    }).catch(err => {
      err.message = `Failed to update the telemetry saved object: ${err.message}`;
      this.logger.debug(err);
    });
  }
  shouldSendReport({
    telemetryOptIn,
    telemetrySendUsageFrom,
    lastReported
  }) {
    if (telemetryOptIn && telemetrySendUsageFrom === 'server') {
      // Check both: in-memory and SO-driven value.
      // This will avoid the server retrying over and over when it has issues with storing the state in the SO.
      if ((0, _is_report_interval_expired.isReportIntervalExpired)(this.lastReported$.value) && (0, _is_report_interval_expired.isReportIntervalExpired)(lastReported)) {
        return true;
      }
    }
    return false;
  }
  async fetchTelemetry() {
    return await this.telemetryCollectionManager.getStats({
      unencrypted: false
    });
  }
  async sendTelemetry(telemetryUrl, payload) {
    this.logger.debug(`Sending usage stats.`);
    await Promise.all(payload.map(async ({
      clusterUuid,
      stats
    }) => {
      await (0, _nodeFetch.default)(telemetryUrl, {
        method: 'post',
        body: stats,
        headers: {
          'Content-Type': 'application/json',
          'X-Elastic-Stack-Version': this.currentKibanaVersion,
          'X-Elastic-Cluster-ID': clusterUuid,
          'X-Elastic-Content-Encoding': _constants.PAYLOAD_CONTENT_ENCODING
        }
      });
    }));
  }
}
exports.FetcherTask = FetcherTask;