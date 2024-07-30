"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLifecycleExecutor = void 0;
var _Either = require("fp-ts/lib/Either");
var rt = _interopRequireWildcard(require("io-ts"));
var _uuid = require("uuid");
var _lodash = require("lodash");
var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
var _fetch_existing_alerts = require("./fetch_existing_alerts");
var _get_common_alert_fields = require("./get_common_alert_fields");
var _fetch_alert_by_uuid = require("./fetch_alert_by_uuid");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const trackedAlertStateRt = rt.type({
  alertId: rt.string,
  alertUuid: rt.string,
  started: rt.string
});
const alertTypeStateRt = () => rt.record(rt.string, rt.unknown);
const wrappedStateRt = () => rt.type({
  wrapped: alertTypeStateRt(),
  trackedAlerts: rt.record(rt.string, trackedAlertStateRt)
});

/**
 * This is redefined instead of derived from above `wrappedStateRt` because
 * there's no easy way to instantiate generic values such as the runtime type
 * factory function.
 */

const createLifecycleExecutor = (logger, ruleDataClient) => wrappedExecutor => async options => {
  const {
    services: {
      alertFactory,
      shouldWriteAlerts
    },
    state: previousState
  } = options;
  const ruleDataClientWriter = await ruleDataClient.getWriter();
  const state = (0, _Either.getOrElse)(() => ({
    wrapped: previousState,
    trackedAlerts: {}
  }))(wrappedStateRt().decode(previousState));
  const commonRuleFields = (0, _get_common_alert_fields.getCommonAlertFields)(options);
  const currentAlerts = {};
  const newAlertUuids = {};
  const lifecycleAlertServices = {
    alertWithLifecycle: ({
      id,
      fields
    }) => {
      currentAlerts[id] = fields;
      return alertFactory.create(id);
    },
    getAlertStartedDate: alertId => {
      var _state$trackedAlerts$, _state$trackedAlerts$2;
      return (_state$trackedAlerts$ = (_state$trackedAlerts$2 = state.trackedAlerts[alertId]) === null || _state$trackedAlerts$2 === void 0 ? void 0 : _state$trackedAlerts$2.started) !== null && _state$trackedAlerts$ !== void 0 ? _state$trackedAlerts$ : null;
    },
    getAlertUuid: alertId => {
      var _state$trackedAlerts$3;
      let existingUuid = ((_state$trackedAlerts$3 = state.trackedAlerts[alertId]) === null || _state$trackedAlerts$3 === void 0 ? void 0 : _state$trackedAlerts$3.alertUuid) || newAlertUuids[alertId];
      if (!existingUuid) {
        existingUuid = (0, _uuid.v4)();
        newAlertUuids[alertId] = existingUuid;
      }
      return existingUuid;
    },
    getAlertByAlertUuid: async alertUuid => {
      try {
        return await (0, _fetch_alert_by_uuid.fetchAlertByAlertUUID)(ruleDataClient, alertUuid);
      } catch (err) {
        return null;
      }
    }
  };
  const nextWrappedState = await wrappedExecutor({
    ...options,
    state: state.wrapped != null ? state.wrapped : {},
    services: {
      ...options.services,
      ...lifecycleAlertServices
    }
  });
  const currentAlertIds = Object.keys(currentAlerts);
  const trackedAlertIds = Object.keys(state.trackedAlerts);
  const newAlertIds = (0, _lodash.difference)(currentAlertIds, trackedAlertIds);
  const allAlertIds = [...new Set(currentAlertIds.concat(trackedAlertIds))];
  const trackedAlertStates = Object.values(state.trackedAlerts);
  logger.debug(`[Rule Registry] Tracking ${allAlertIds.length} alerts (${newAlertIds.length} new, ${trackedAlertStates.length} previous)`);
  const trackedAlertsDataMap = {};
  if (trackedAlertStates.length) {
    const result = await (0, _fetch_existing_alerts.fetchExistingAlerts)(ruleDataClient, trackedAlertStates, commonRuleFields);
    result.forEach(hit => {
      const alertInstanceId = hit._source ? hit._source[_technical_rule_data_field_names.ALERT_INSTANCE_ID] : void 0;
      if (alertInstanceId && hit._source) {
        trackedAlertsDataMap[alertInstanceId] = {
          indexName: hit._index,
          fields: hit._source
        };
      }
    });
  }
  const makeEventsDataMapFor = alertIds => alertIds.map(alertId => {
    var _alertData$fields$ALE;
    const alertData = trackedAlertsDataMap[alertId];
    const currentAlertData = currentAlerts[alertId];
    if (!alertData) {
      logger.debug(`[Rule Registry] Could not find alert data for ${alertId}`);
    }
    const isNew = !state.trackedAlerts[alertId];
    const isRecovered = !currentAlerts[alertId];
    const isActive = !isRecovered;
    const {
      alertUuid,
      started
    } = !isNew ? state.trackedAlerts[alertId] : {
      alertUuid: lifecycleAlertServices.getAlertUuid(alertId),
      started: commonRuleFields[_technical_rule_data_field_names.TIMESTAMP]
    };
    const event = {
      ...(alertData === null || alertData === void 0 ? void 0 : alertData.fields),
      ...commonRuleFields,
      ...currentAlertData,
      [_technical_rule_data_field_names.ALERT_DURATION]: (options.startedAt.getTime() - new Date(started).getTime()) * 1000,
      [_technical_rule_data_field_names.ALERT_TIME_RANGE]: isRecovered ? {
        gte: started,
        lte: commonRuleFields[_technical_rule_data_field_names.TIMESTAMP]
      } : {
        gte: started
      },
      [_technical_rule_data_field_names.ALERT_INSTANCE_ID]: alertId,
      [_technical_rule_data_field_names.ALERT_START]: started,
      [_technical_rule_data_field_names.ALERT_UUID]: alertUuid,
      [_technical_rule_data_field_names.ALERT_STATUS]: isRecovered ? _technical_rule_data_field_names.ALERT_STATUS_RECOVERED : _technical_rule_data_field_names.ALERT_STATUS_ACTIVE,
      [_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]: (_alertData$fields$ALE = alertData === null || alertData === void 0 ? void 0 : alertData.fields[_technical_rule_data_field_names.ALERT_WORKFLOW_STATUS]) !== null && _alertData$fields$ALE !== void 0 ? _alertData$fields$ALE : 'open',
      [_technical_rule_data_field_names.EVENT_KIND]: 'signal',
      [_technical_rule_data_field_names.EVENT_ACTION]: isNew ? 'open' : isActive ? 'active' : 'close',
      [_technical_rule_data_field_names.TAGS]: options.rule.tags,
      [_technical_rule_data_field_names.VERSION]: ruleDataClient.kibanaVersion,
      ...(isRecovered ? {
        [_technical_rule_data_field_names.ALERT_END]: commonRuleFields[_technical_rule_data_field_names.TIMESTAMP]
      } : {})
    };
    return {
      indexName: alertData === null || alertData === void 0 ? void 0 : alertData.indexName,
      event
    };
  });
  const trackedEventsToIndex = makeEventsDataMapFor(trackedAlertIds);
  const newEventsToIndex = makeEventsDataMapFor(newAlertIds);
  const allEventsToIndex = [...trackedEventsToIndex, ...newEventsToIndex];

  // Only write alerts if:
  // - writing is enabled
  //   AND
  //   - rule execution has not been cancelled due to timeout
  //     OR
  //   - if execution has been cancelled due to timeout, if feature flags are configured to write alerts anyway
  const writeAlerts = ruleDataClient.isWriteEnabled() && shouldWriteAlerts();
  if (allEventsToIndex.length > 0 && writeAlerts) {
    logger.debug(`[Rule Registry] Preparing to index ${allEventsToIndex.length} alerts.`);
    await ruleDataClientWriter.bulk({
      body: allEventsToIndex.flatMap(({
        event,
        indexName
      }) => [indexName ? {
        index: {
          _id: event[_technical_rule_data_field_names.ALERT_UUID],
          _index: indexName,
          require_alias: false
        }
      } : {
        index: {
          _id: event[_technical_rule_data_field_names.ALERT_UUID]
        }
      }, event])
    });
  } else {
    logger.debug(`[Rule Registry] Not indexing ${allEventsToIndex.length} alerts because writing has been disabled.`);
  }
  const nextTrackedAlerts = Object.fromEntries(allEventsToIndex.filter(({
    event
  }) => event[_technical_rule_data_field_names.ALERT_STATUS] !== _technical_rule_data_field_names.ALERT_STATUS_RECOVERED).map(({
    event
  }) => {
    const alertId = event[_technical_rule_data_field_names.ALERT_INSTANCE_ID];
    const alertUuid = event[_technical_rule_data_field_names.ALERT_UUID];
    const started = new Date(event[_technical_rule_data_field_names.ALERT_START]).toISOString();
    return [alertId, {
      alertId,
      alertUuid,
      started
    }];
  }));
  return {
    wrapped: nextWrappedState !== null && nextWrappedState !== void 0 ? nextWrappedState : {},
    trackedAlerts: writeAlerts ? nextTrackedAlerts : {}
  };
};
exports.createLifecycleExecutor = createLifecycleExecutor;