"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatusMessage = exports.getMonitorSummary = exports.getMonitorAlertDocument = exports.getInstanceId = exports.generateFilterDSL = exports.formatFilterString = void 0;
exports.getTimestampRange = getTimestampRange;
exports.statusCheckAlertFactory = exports.hasFilters = exports.getUniqueIdsByLoc = void 0;
var _lodash = require("lodash");
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _esQuery = require("@kbn/es-query");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _common = require("../../../../../observability/common");
var _alerts = require("../../../../common/constants/alerts");
var _common2 = require("./common");
var _translations = require("./translations");
var _lib = require("../../../../common/lib");
var _get_monitor_status = require("../requests/get_monitor_status");
var _constants = require("../../../../common/constants");
var _get_index_pattern = require("../requests/get_index_pattern");
var _lib2 = require("../lib");
var _action_variables = require("./action_variables");
var _get_monitor_url = require("../../../../common/utils/get_monitor_url");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns the appropriate range for filtering the documents by `@timestamp`.
 *
 * We check monitor status by `monitor.timespan`, but need to first cut down on the number of documents
 * searched by filtering by `@timestamp`. To ensure that we catch as many documents as possible which could
 * likely contain a down monitor with a `monitor.timespan` in the given timerange, we create a filter
 * range for `@timestamp` that is the greater of either: from now to now - timerange interval - 24 hours
 * OR from now to now - rule interval
 * @param ruleScheduleLookback - string representing now minus the interval at which the rule is ran
 * @param timerangeLookback - string representing now minus the timerange configured by the user for checking down monitors
 */
function getTimestampRange({
  ruleScheduleLookback,
  timerangeLookback
}) {
  var _datemath$parse, _datemath$parse2, _min;
  const scheduleIntervalAbsoluteTime = (_datemath$parse = _datemath.default.parse(ruleScheduleLookback)) === null || _datemath$parse === void 0 ? void 0 : _datemath$parse.valueOf();
  const defaultIntervalAbsoluteTime = (_datemath$parse2 = _datemath.default.parse(timerangeLookback)) === null || _datemath$parse2 === void 0 ? void 0 : _datemath$parse2.subtract('24', 'hours').valueOf();
  const from = (_min = (0, _lodash.min)([scheduleIntervalAbsoluteTime, defaultIntervalAbsoluteTime])) !== null && _min !== void 0 ? _min : 'now-24h';
  return {
    to: 'now',
    from
  };
}
const getUniqueIdsByLoc = (downMonitorsByLocation, availabilityResults) => {
  const uniqueDownsIdsByLoc = uniqueDownMonitorIds(downMonitorsByLocation);
  const uniqueAvailIdsByLoc = uniqueAvailMonitorIds(availabilityResults);
  return new Set([...uniqueDownsIdsByLoc, ...uniqueAvailIdsByLoc]);
};
exports.getUniqueIdsByLoc = getUniqueIdsByLoc;
const hasFilters = filters => {
  if (!filters) return false;
  for (const list of Object.values(filters)) {
    if (list.length > 0) {
      return true;
    }
  }
  return false;
};
exports.hasFilters = hasFilters;
const generateFilterDSL = async (getIndexPattern, filters, search) => {
  const filtersExist = hasFilters(filters);
  if (!filtersExist && !search) return undefined;
  let filterString = '';
  if (filtersExist) {
    filterString = (0, _lib.stringifyKueries)(new Map(Object.entries(filters !== null && filters !== void 0 ? filters : {})));
  }
  const combinedString = (0, _lib.combineFiltersAndUserSearch)(filterString, search);
  return (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(combinedString !== null && combinedString !== void 0 ? combinedString : ''), await getIndexPattern());
};
exports.generateFilterDSL = generateFilterDSL;
const formatFilterString = async (uptimeEsClient, filters, search, libs) => await generateFilterDSL(() => {
  var _libs$requests, _libs$requests2;
  return libs !== null && libs !== void 0 && (_libs$requests = libs.requests) !== null && _libs$requests !== void 0 && _libs$requests.getIndexPattern ? libs === null || libs === void 0 ? void 0 : (_libs$requests2 = libs.requests) === null || _libs$requests2 === void 0 ? void 0 : _libs$requests2.getIndexPattern({
    uptimeEsClient
  }) : (0, _get_index_pattern.getUptimeIndexPattern)({
    uptimeEsClient
  });
}, filters, search);
exports.formatFilterString = formatFilterString;
const getMonitorSummary = (monitorInfo, statusMessage) => {
  var _monitorInfo$monitor$, _monitorInfo$monitor, _monitorInfo$monitor2, _monitorInfo$observer, _monitorInfo$observer2, _monitorInfo$observer3, _monitorInfo$url, _monitorInfo$monitor3, _monitorInfo$monitor$2, _monitorInfo$monitor4, _monitorInfo$monitor5, _monitorInfo$monitor6, _monitorInfo$error, _monitorInfo$observer4, _monitorInfo$observer5, _monitorInfo$observer6, _monitorInfo$agent;
  const monitorName = (_monitorInfo$monitor$ = (_monitorInfo$monitor = monitorInfo.monitor) === null || _monitorInfo$monitor === void 0 ? void 0 : _monitorInfo$monitor.name) !== null && _monitorInfo$monitor$ !== void 0 ? _monitorInfo$monitor$ : (_monitorInfo$monitor2 = monitorInfo.monitor) === null || _monitorInfo$monitor2 === void 0 ? void 0 : _monitorInfo$monitor2.id;
  const observerLocation = (_monitorInfo$observer = (_monitorInfo$observer2 = monitorInfo.observer) === null || _monitorInfo$observer2 === void 0 ? void 0 : (_monitorInfo$observer3 = _monitorInfo$observer2.geo) === null || _monitorInfo$observer3 === void 0 ? void 0 : _monitorInfo$observer3.name) !== null && _monitorInfo$observer !== void 0 ? _monitorInfo$observer : _constants.UNNAMED_LOCATION;
  const summary = {
    monitorUrl: (_monitorInfo$url = monitorInfo.url) === null || _monitorInfo$url === void 0 ? void 0 : _monitorInfo$url.full,
    monitorId: (_monitorInfo$monitor3 = monitorInfo.monitor) === null || _monitorInfo$monitor3 === void 0 ? void 0 : _monitorInfo$monitor3.id,
    monitorName: (_monitorInfo$monitor$2 = (_monitorInfo$monitor4 = monitorInfo.monitor) === null || _monitorInfo$monitor4 === void 0 ? void 0 : _monitorInfo$monitor4.name) !== null && _monitorInfo$monitor$2 !== void 0 ? _monitorInfo$monitor$2 : (_monitorInfo$monitor5 = monitorInfo.monitor) === null || _monitorInfo$monitor5 === void 0 ? void 0 : _monitorInfo$monitor5.id,
    monitorType: (_monitorInfo$monitor6 = monitorInfo.monitor) === null || _monitorInfo$monitor6 === void 0 ? void 0 : _monitorInfo$monitor6.type,
    latestErrorMessage: (_monitorInfo$error = monitorInfo.error) === null || _monitorInfo$error === void 0 ? void 0 : _monitorInfo$error.message,
    observerLocation: (_monitorInfo$observer4 = (_monitorInfo$observer5 = monitorInfo.observer) === null || _monitorInfo$observer5 === void 0 ? void 0 : (_monitorInfo$observer6 = _monitorInfo$observer5.geo) === null || _monitorInfo$observer6 === void 0 ? void 0 : _monitorInfo$observer6.name) !== null && _monitorInfo$observer4 !== void 0 ? _monitorInfo$observer4 : _constants.UNNAMED_LOCATION,
    observerHostname: (_monitorInfo$agent = monitorInfo.agent) === null || _monitorInfo$agent === void 0 ? void 0 : _monitorInfo$agent.name
  };
  return {
    ...summary,
    [_action_variables.ALERT_REASON_MSG]: `${monitorName} from ${observerLocation} ${statusMessage}`
  };
};
exports.getMonitorSummary = getMonitorSummary;
const getMonitorAlertDocument = monitorSummary => ({
  'monitor.id': monitorSummary.monitorId,
  'monitor.type': monitorSummary.monitorType,
  'monitor.name': monitorSummary.monitorName,
  'url.full': monitorSummary.monitorUrl,
  'observer.geo.name': monitorSummary.observerLocation,
  'error.message': monitorSummary.latestErrorMessage,
  'agent.name': monitorSummary.observerHostname,
  [_ruleDataUtils.ALERT_REASON]: monitorSummary.reason
});
exports.getMonitorAlertDocument = getMonitorAlertDocument;
const getStatusMessage = (downMonParams, availMonInfo, availability) => {
  let statusMessage = '';
  if (downMonParams !== null && downMonParams !== void 0 && downMonParams.info) {
    statusMessage = _translations.statusCheckTranslations.downMonitorsLabel(downMonParams.count, downMonParams.interval, downMonParams.numTimes);
  }
  let availabilityMessage = '';
  if (availMonInfo) {
    availabilityMessage = _translations.statusCheckTranslations.availabilityBreachLabel((availMonInfo.availabilityRatio * 100).toFixed(2), availability === null || availability === void 0 ? void 0 : availability.threshold, (0, _common.formatDurationFromTimeUnitChar)(availability === null || availability === void 0 ? void 0 : availability.range, availability === null || availability === void 0 ? void 0 : availability.rangeUnit));
  }
  if (availMonInfo && downMonParams !== null && downMonParams !== void 0 && downMonParams.info) {
    return _translations.statusCheckTranslations.downMonitorsAndAvailabilityBreachLabel(statusMessage, availabilityMessage);
  }
  return statusMessage + availabilityMessage;
};
exports.getStatusMessage = getStatusMessage;
const getInstanceId = (monitorInfo, monIdByLoc) => {
  var _monitorInfo$url2;
  const normalizeText = txt => {
    // replace url and name special characters with -
    return txt.replace(/[^A-Z0-9]+/gi, '_').toLowerCase();
  };
  const urlText = normalizeText(((_monitorInfo$url2 = monitorInfo.url) === null || _monitorInfo$url2 === void 0 ? void 0 : _monitorInfo$url2.full) || '');
  const monName = normalizeText(monitorInfo.monitor.name || '');
  if (monName) {
    return `${monName}_${urlText}_${monIdByLoc}`;
  }
  return `${urlText}_${monIdByLoc}`;
};
exports.getInstanceId = getInstanceId;
const getMonIdByLoc = (monitorId, location) => {
  return monitorId + '-' + location;
};
const uniqueDownMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());
const uniqueAvailMonitorIds = items => items.reduce((acc, {
  monitorId,
  location
}) => acc.add(getMonIdByLoc(monitorId, location)), new Set());
const statusCheckAlertFactory = (server, libs, plugins) => {
  var _plugins$observabilit;
  return {
    id: _alerts.CLIENT_ALERT_TYPES.MONITOR_STATUS,
    producer: 'uptime',
    name: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus', {
      defaultMessage: 'Uptime monitor status'
    }),
    validate: {
      params: _configSchema.schema.object({
        availability: _configSchema.schema.maybe(_configSchema.schema.object({
          range: _configSchema.schema.number(),
          rangeUnit: _configSchema.schema.string(),
          threshold: _configSchema.schema.string()
        })),
        filters: _configSchema.schema.maybe(_configSchema.schema.oneOf([
        // deprecated
        _configSchema.schema.object({
          'monitor.type': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          'observer.geo.name': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          tags: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
          'url.port': _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
        }), _configSchema.schema.string()])),
        // deprecated
        locations: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        numTimes: _configSchema.schema.number(),
        search: _configSchema.schema.maybe(_configSchema.schema.string()),
        shouldCheckStatus: _configSchema.schema.boolean(),
        shouldCheckAvailability: _configSchema.schema.boolean(),
        timerangeCount: _configSchema.schema.maybe(_configSchema.schema.number()),
        timerangeUnit: _configSchema.schema.maybe(_configSchema.schema.string()),
        // deprecated
        timerange: _configSchema.schema.maybe(_configSchema.schema.object({
          from: _configSchema.schema.string(),
          to: _configSchema.schema.string()
        })),
        version: _configSchema.schema.maybe(_configSchema.schema.number()),
        isAutoGenerated: _configSchema.schema.maybe(_configSchema.schema.boolean())
      })
    },
    defaultActionGroupId: _alerts.MONITOR_STATUS.id,
    actionGroups: [{
      id: _alerts.MONITOR_STATUS.id,
      name: _alerts.MONITOR_STATUS.name
    }],
    actionVariables: {
      context: [_action_variables.ACTION_VARIABLES[_action_variables.MESSAGE], _action_variables.ACTION_VARIABLES[_action_variables.MONITOR_WITH_GEO], ...((_plugins$observabilit = plugins.observability.getAlertDetailsConfig()) !== null && _plugins$observabilit !== void 0 && _plugins$observabilit.uptime.enabled ? [_action_variables.ACTION_VARIABLES[_action_variables.ALERT_DETAILS_URL]] : []), _action_variables.ACTION_VARIABLES[_action_variables.ALERT_REASON_MSG], _action_variables.ACTION_VARIABLES[_action_variables.VIEW_IN_APP_URL], ..._translations.commonMonitorStateI18],
      state: [..._translations.commonMonitorStateI18, ..._translations.commonStateTranslations]
    },
    isExportable: true,
    minimumLicenseRequired: 'basic',
    doesSetRecoveryContext: true,
    async executor({
      params: rawParams,
      rule: {
        schedule: {
          interval
        }
      },
      services: {
        alertFactory,
        alertWithLifecycle,
        getAlertStartedDate,
        getAlertUuid,
        savedObjectsClient,
        scopedClusterClient
      },
      spaceId,
      state,
      startedAt
    }) {
      const {
        availability,
        filters,
        isAutoGenerated,
        numTimes,
        search,
        shouldCheckAvailability,
        shouldCheckStatus,
        timerange: oldVersionTimeRange,
        timerangeCount,
        timerangeUnit
      } = rawParams;
      const {
        basePath
      } = server;
      const uptimeEsClient = (0, _lib2.createUptimeESClient)({
        esClient: scopedClusterClient.asCurrentUser,
        savedObjectsClient
      });
      const filterString = await formatFilterString(uptimeEsClient, filters, search, libs);
      const timespanInterval = `${String(timerangeCount)}${timerangeUnit}`;
      // Range filter for `monitor.timespan`, the range of time the ping is valid
      const timespanRange = oldVersionTimeRange || {
        from: `now-${timespanInterval}`,
        to: 'now'
      };
      // Range filter for `@timestamp`, the time the document was indexed
      const timestampRange = getTimestampRange({
        ruleScheduleLookback: `now-${interval}`,
        timerangeLookback: timespanRange.from
      });
      let downMonitorsByLocation = [];

      // if oldVersionTimeRange present means it's 7.7 format and
      // after that shouldCheckStatus should be explicitly false
      if (!(!oldVersionTimeRange && shouldCheckStatus === false)) {
        downMonitorsByLocation = await libs.requests.getMonitorStatus({
          uptimeEsClient,
          timespanRange,
          timestampRange,
          numTimes,
          locations: [],
          filters: filterString
        });
      }
      if (isAutoGenerated) {
        for (const monitorLoc of downMonitorsByLocation) {
          var _getAlertStartedDate;
          const monitorInfo = monitorLoc.monitorInfo;
          const monitorStatusMessageParams = (0, _get_monitor_status.getMonitorDownStatusMessageParams)(monitorInfo, monitorLoc.count, numTimes, timerangeCount, timerangeUnit, oldVersionTimeRange);
          const statusMessage = getStatusMessage(monitorStatusMessageParams);
          const monitorSummary = getMonitorSummary(monitorInfo, statusMessage);
          const alertId = getInstanceId(monitorInfo, monitorLoc.location);
          const alert = alertWithLifecycle({
            id: alertId,
            fields: getMonitorAlertDocument(monitorSummary)
          });
          const indexedStartedAt = (_getAlertStartedDate = getAlertStartedDate(alertId)) !== null && _getAlertStartedDate !== void 0 ? _getAlertStartedDate : startedAt.toISOString();
          const alertUuid = getAlertUuid(alertId);
          const relativeViewInAppUrl = (0, _get_monitor_url.getMonitorRouteFromMonitorId)({
            monitorId: monitorSummary.monitorId,
            dateRangeEnd: 'now',
            dateRangeStart: indexedStartedAt,
            filters: {
              'observer.geo.name': [monitorSummary.observerLocation]
            }
          });
          const context = {
            ...monitorSummary,
            statusMessage
          };
          alert.replaceState({
            ...state,
            ...context,
            ...(0, _common2.updateState)(state, true)
          });
          alert.scheduleActions(_alerts.MONITOR_STATUS.id, {
            [_action_variables.ALERT_DETAILS_URL]: (0, _common2.getAlertDetailsUrl)(basePath, spaceId, alertUuid),
            [_action_variables.VIEW_IN_APP_URL]: (0, _common2.getViewInAppUrl)(basePath, spaceId, relativeViewInAppUrl),
            ...context
          });
        }
        (0, _common2.setRecoveredAlertsContext)({
          alertFactory,
          basePath,
          getAlertUuid,
          spaceId
        });
        return (0, _common2.updateState)(state, downMonitorsByLocation.length > 0);
      }
      let availabilityResults = [];
      if (shouldCheckAvailability) {
        availabilityResults = await libs.requests.getMonitorAvailability({
          uptimeEsClient,
          ...availability,
          filters: JSON.stringify(filterString) || undefined
        });
      }
      const mergedIdsByLoc = getUniqueIdsByLoc(downMonitorsByLocation, availabilityResults);
      mergedIdsByLoc.forEach(monIdByLoc => {
        var _downMonitorsByLocati, _downMonitorsByLocati2, _getAlertStartedDate2;
        const availMonInfo = availabilityResults.find(({
          monitorId,
          location
        }) => getMonIdByLoc(monitorId, location) === monIdByLoc);
        const downMonInfo = (_downMonitorsByLocati = downMonitorsByLocation.find(({
          monitorId,
          location
        }) => getMonIdByLoc(monitorId, location) === monIdByLoc)) === null || _downMonitorsByLocati === void 0 ? void 0 : _downMonitorsByLocati.monitorInfo;
        const downMonCount = (_downMonitorsByLocati2 = downMonitorsByLocation.find(({
          monitorId,
          location
        }) => getMonIdByLoc(monitorId, location) === monIdByLoc)) === null || _downMonitorsByLocati2 === void 0 ? void 0 : _downMonitorsByLocati2.count;
        const monitorInfo = downMonInfo || (availMonInfo === null || availMonInfo === void 0 ? void 0 : availMonInfo.monitorInfo);
        const monitorStatusMessageParams = (0, _get_monitor_status.getMonitorDownStatusMessageParams)(downMonInfo, downMonCount, numTimes, timerangeCount, timerangeUnit, oldVersionTimeRange);
        const statusMessage = getStatusMessage(monitorStatusMessageParams, availMonInfo, availability);
        const monitorSummary = getMonitorSummary(monitorInfo, statusMessage);
        const alertId = getInstanceId(monitorInfo, monIdByLoc);
        const alert = alertWithLifecycle({
          id: alertId,
          fields: getMonitorAlertDocument(monitorSummary)
        });
        const alertUuid = getAlertUuid(alertId);
        const indexedStartedAt = (_getAlertStartedDate2 = getAlertStartedDate(alertId)) !== null && _getAlertStartedDate2 !== void 0 ? _getAlertStartedDate2 : startedAt.toISOString();
        const context = {
          ...monitorSummary,
          statusMessage
        };
        alert.replaceState({
          ...(0, _common2.updateState)(state, true),
          ...context
        });
        const relativeViewInAppUrl = (0, _get_monitor_url.getMonitorRouteFromMonitorId)({
          monitorId: monitorSummary.monitorId,
          dateRangeEnd: 'now',
          dateRangeStart: indexedStartedAt,
          filters: {
            'observer.geo.name': [monitorSummary.observerLocation]
          }
        });
        alert.scheduleActions(_alerts.MONITOR_STATUS.id, {
          [_action_variables.ALERT_DETAILS_URL]: (0, _common2.getAlertDetailsUrl)(basePath, spaceId, alertUuid),
          [_action_variables.VIEW_IN_APP_URL]: (0, _common2.getViewInAppUrl)(basePath, spaceId, relativeViewInAppUrl),
          ...context
        });
      });
      (0, _common2.setRecoveredAlertsContext)({
        alertFactory,
        basePath,
        getAlertUuid,
        spaceId
      });
      return (0, _common2.updateState)(state, downMonitorsByLocation.length > 0);
    }
  };
};
exports.statusCheckAlertFactory = statusCheckAlertFactory;