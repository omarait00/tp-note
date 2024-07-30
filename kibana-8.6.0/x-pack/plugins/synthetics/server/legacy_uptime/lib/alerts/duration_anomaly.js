"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnomalySummary = exports.durationAnomalyAlertFactory = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _configSchema = require("@kbn/config-schema");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _anomaly_utils = require("../../../../../ml/common/util/anomaly_utils");
var _common = require("./common");
var _alerts = require("../../../../common/constants/alerts");
var _translations = require("./translations");
var _lib = require("../../../../common/lib");
var _translations2 = require("../../../../common/translations");
var _get_monitor_url = require("../../../../common/utils/get_monitor_url");
var _lib2 = require("../lib");
var _action_variables = require("./action_variables");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAnomalySummary = (anomaly, monitorInfo) => {
  var _monitorInfo$url;
  return {
    severity: (0, _anomaly_utils.getSeverityType)(anomaly.severity),
    severityScore: Math.round(anomaly.severity),
    anomalyStartTimestamp: (0, _moment.default)(anomaly.source.timestamp).toISOString(),
    monitor: anomaly.source['monitor.id'],
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    slowestAnomalyResponse: Math.round(anomaly.actualSort / 1000) + ' ms',
    expectedResponseTime: Math.round(anomaly.typicalSort / 1000) + ' ms',
    observerLocation: anomaly.entityValue,
    bucketSpan: anomaly.source.bucket_span
  };
};
exports.getAnomalySummary = getAnomalySummary;
const getAnomalies = async (plugins, savedObjectsClient, params, lastCheckedAt) => {
  const fakeRequest = {};
  const {
    getAnomaliesTableData
  } = plugins.ml.resultsServiceProvider(fakeRequest, savedObjectsClient);
  return await getAnomaliesTableData([(0, _lib.getMLJobId)(params.monitorId)], [], [], 'auto', params.severity,
  // Lookback window will be 2x Bucket time span, for uptime job, for now bucket
  // timespan will always be 15minute
  (0, _moment.default)(lastCheckedAt).subtract(30, 'minute').valueOf(), (0, _moment.default)().valueOf(), Intl.DateTimeFormat().resolvedOptions().timeZone, 500, 10, undefined);
};
const durationAnomalyAlertFactory = (server, libs, plugins) => ({
  id: _alerts.CLIENT_ALERT_TYPES.DURATION_ANOMALY,
  producer: 'uptime',
  name: _translations.durationAnomalyTranslations.alertFactoryName,
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      severity: _configSchema.schema.number()
    })
  },
  defaultActionGroupId: _alerts.DURATION_ANOMALY.id,
  actionGroups: [{
    id: _alerts.DURATION_ANOMALY.id,
    name: _alerts.DURATION_ANOMALY.name
  }],
  actionVariables: {
    context: [_action_variables.ACTION_VARIABLES[_action_variables.ALERT_REASON_MSG], _action_variables.ACTION_VARIABLES[_action_variables.VIEW_IN_APP_URL], ..._translations.durationAnomalyTranslations.actionVariables, ..._translations.commonStateTranslations],
    state: [..._translations.durationAnomalyTranslations.actionVariables, ..._translations.commonStateTranslations]
  },
  isExportable: true,
  minimumLicenseRequired: 'platinum',
  doesSetRecoveryContext: true,
  async executor({
    params,
    services: {
      alertFactory,
      alertWithLifecycle,
      getAlertStartedDate,
      savedObjectsClient,
      scopedClusterClient
    },
    spaceId,
    state,
    startedAt
  }) {
    var _await$getAnomalies;
    const uptimeEsClient = (0, _lib2.createUptimeESClient)({
      esClient: scopedClusterClient.asCurrentUser,
      savedObjectsClient
    });
    const {
      basePath
    } = server;
    const {
      anomalies
    } = (_await$getAnomalies = await getAnomalies(plugins, savedObjectsClient, params, state.lastCheckedAt)) !== null && _await$getAnomalies !== void 0 ? _await$getAnomalies : {};
    const foundAnomalies = (anomalies === null || anomalies === void 0 ? void 0 : anomalies.length) > 0;
    if (foundAnomalies) {
      const monitorInfo = await libs.requests.getLatestMonitor({
        uptimeEsClient,
        dateStart: 'now-15m',
        dateEnd: 'now',
        monitorId: params.monitorId
      });
      anomalies.forEach((anomaly, index) => {
        var _getAlertStartedDate;
        const summary = getAnomalySummary(anomaly, monitorInfo);
        const alertReasonMessage = (0, _common.generateAlertMessage)(_translations2.DurationAnomalyTranslations.defaultActionMessage, summary);
        const alertId = _alerts.DURATION_ANOMALY.id + index;
        const indexedStartedAt = (_getAlertStartedDate = getAlertStartedDate(alertId)) !== null && _getAlertStartedDate !== void 0 ? _getAlertStartedDate : startedAt.toISOString();
        const relativeViewInAppUrl = (0, _get_monitor_url.getMonitorRouteFromMonitorId)({
          monitorId: alertId,
          dateRangeEnd: 'now',
          dateRangeStart: indexedStartedAt
        });
        const alertInstance = alertWithLifecycle({
          id: alertId,
          fields: {
            'monitor.id': params.monitorId,
            'url.full': summary.monitorUrl,
            'observer.geo.name': summary.observerLocation,
            'anomaly.start': summary.anomalyStartTimestamp,
            'anomaly.bucket_span.minutes': summary.bucketSpan,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: anomaly.actualSort,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: anomaly.typicalSort,
            [_ruleDataUtils.ALERT_REASON]: alertReasonMessage
          }
        });
        alertInstance.replaceState({
          ...(0, _common.updateState)(state, false),
          ...summary
        });
        alertInstance.scheduleActions(_alerts.DURATION_ANOMALY.id, {
          [_action_variables.ALERT_REASON_MSG]: alertReasonMessage,
          [_action_variables.VIEW_IN_APP_URL]: (0, _common.getViewInAppUrl)(basePath, spaceId, relativeViewInAppUrl),
          ...summary
        });
      });
    }
    (0, _common.setRecoveredAlertsContext)({
      alertFactory
    });
    return (0, _common.updateState)(state, foundAnomalies);
  }
});
exports.durationAnomalyAlertFactory = durationAnomalyAlertFactory;