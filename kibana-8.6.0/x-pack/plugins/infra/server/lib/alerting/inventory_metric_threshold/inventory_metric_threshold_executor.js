"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createInventoryMetricThresholdExecutor = exports.WARNING_ACTIONS_ID = exports.WARNING_ACTIONS = exports.FIRED_ACTIONS_ID = exports.FIRED_ACTIONS = void 0;
var _i18n = require("@kbn/i18n");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _lodash = require("lodash");
var _metrics = require("../../../../common/alerting/metrics");
var _formatters = require("../../../../common/formatters");
var _get_custom_metric_label = require("../../../../common/formatters/get_custom_metric_label");
var _snapshot_metric_formats = require("../../../../common/formatters/snapshot_metric_formats");
var _snapshot_metric_i18n = require("../../../../common/snapshot_metric_i18n");
var _messages = require("../common/messages");
var _utils = require("../common/utils");
var _evaluate_condition = require("./evaluate_condition");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const createInventoryMetricThresholdExecutor = libs => libs.metricsRules.createLifecycleRuleExecutor(async ({
  services,
  params,
  executionId,
  spaceId,
  startedAt,
  rule: {
    id: ruleId
  }
}) => {
  const startTime = Date.now();
  const {
    criteria,
    filterQuery,
    sourceId = 'default',
    nodeType,
    alertOnNoData
  } = params;
  if (criteria.length === 0) throw new Error('Cannot execute an alert with 0 conditions');
  const logger = (0, _utils.createScopedLogger)(libs.logger, 'inventoryRule', {
    alertId: ruleId,
    executionId
  });
  const esClient = services.scopedClusterClient.asCurrentUser;
  const {
    alertWithLifecycle,
    savedObjectsClient,
    getAlertStartedDate,
    getAlertUuid,
    getAlertByAlertUuid
  } = services;
  const alertFactory = (id, reason, additionalContext) => alertWithLifecycle({
    id,
    fields: {
      [_ruleDataUtils.ALERT_REASON]: reason,
      [_ruleDataUtils.ALERT_RULE_PARAMETERS]: params,
      // the type assumes the object is already flattened when writing the same way as when reading https://github.com/elastic/kibana/blob/main/x-pack/plugins/rule_registry/common/field_map/runtime_type_from_fieldmap.ts#L60
      ...(0, _utils.flattenAdditionalContext)(additionalContext)
    }
  });
  if (!params.filterQuery && params.filterQueryText) {
    try {
      const {
        fromKueryExpression
      } = await Promise.resolve().then(() => _interopRequireWildcard(require('@kbn/es-query')));
      fromKueryExpression(params.filterQueryText);
    } catch (e) {
      var _getAlertStartedDate;
      logger.error(e.message);
      const actionGroupId = FIRED_ACTIONS.id; // Change this to an Error action group when able
      const reason = (0, _messages.buildInvalidQueryAlertReason)(params.filterQueryText);
      const alert = alertFactory(_utils.UNGROUPED_FACTORY_KEY, reason);
      const indexedStartedDate = (_getAlertStartedDate = getAlertStartedDate(_utils.UNGROUPED_FACTORY_KEY)) !== null && _getAlertStartedDate !== void 0 ? _getAlertStartedDate : startedAt.toISOString();
      const alertUuid = getAlertUuid(_utils.UNGROUPED_FACTORY_KEY);
      alert.scheduleActions(actionGroupId, {
        alertDetailsUrl: (0, _utils.getAlertDetailsUrl)(libs.basePath, spaceId, alertUuid),
        alertState: _messages.stateToAlertMessage[_metrics.AlertStates.ERROR],
        group: _utils.UNGROUPED_FACTORY_KEY,
        metric: mapToConditionsLookup(criteria, c => c.metric),
        reason,
        timestamp: startedAt.toISOString(),
        value: null,
        viewInAppUrl: (0, _utils.getViewInInventoryAppUrl)({
          basePath: libs.basePath,
          criteria,
          nodeType,
          timestamp: indexedStartedDate,
          spaceId
        })
      });
      return {};
    }
  }
  const source = await libs.sources.getSourceConfiguration(savedObjectsClient, sourceId);
  const [,, {
    logViews
  }] = await libs.getStartServices();
  const logQueryFields = await logViews.getClient(savedObjectsClient, esClient).getResolvedLogView(sourceId).then(({
    indices
  }) => ({
    indexPattern: indices
  }), () => undefined);
  const compositeSize = libs.configuration.alerting.inventory_threshold.group_by_page_size;
  const results = await Promise.all(criteria.map(condition => (0, _evaluate_condition.evaluateCondition)({
    compositeSize,
    condition,
    esClient,
    executionTimestamp: startedAt,
    filterQuery,
    logger,
    logQueryFields,
    nodeType,
    source
  })));
  let scheduledActionsCount = 0;
  const inventoryItems = Object.keys((0, _lodash.first)(results));
  for (const group of inventoryItems) {
    // AND logic; all criteria must be across the threshold
    const shouldAlertFire = results.every(result => {
      var _result$group;
      return (_result$group = result[group]) === null || _result$group === void 0 ? void 0 : _result$group.shouldFire;
    });
    const shouldAlertWarn = results.every(result => {
      var _result$group2;
      return (_result$group2 = result[group]) === null || _result$group2 === void 0 ? void 0 : _result$group2.shouldWarn;
    });
    // AND logic; because we need to evaluate all criteria, if one of them reports no data then the
    // whole alert is in a No Data/Error state
    const isNoData = results.some(result => {
      var _result$group3;
      return (_result$group3 = result[group]) === null || _result$group3 === void 0 ? void 0 : _result$group3.isNoData;
    });
    const isError = results.some(result => {
      var _result$group4;
      return (_result$group4 = result[group]) === null || _result$group4 === void 0 ? void 0 : _result$group4.isError;
    });
    const nextState = isError ? _metrics.AlertStates.ERROR : isNoData ? _metrics.AlertStates.NO_DATA : shouldAlertFire ? _metrics.AlertStates.ALERT : shouldAlertWarn ? _metrics.AlertStates.WARNING : _metrics.AlertStates.OK;
    let reason;
    if (nextState === _metrics.AlertStates.ALERT || nextState === _metrics.AlertStates.WARNING) {
      reason = results.map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildFiredAlertReason, nextState === _metrics.AlertStates.WARNING)).join('\n');
    }
    if (alertOnNoData) {
      if (nextState === _metrics.AlertStates.NO_DATA) {
        reason = results.filter(result => result[group].isNoData).map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildNoDataAlertReason)).join('\n');
      } else if (nextState === _metrics.AlertStates.ERROR) {
        reason = results.filter(result => result[group].isError).map(result => buildReasonWithVerboseMetricName(group, result[group], _messages.buildErrorAlertReason)).join('\n');
      }
    }
    if (reason) {
      var _getAlertStartedDate2;
      const actionGroupId = nextState === _metrics.AlertStates.WARNING ? WARNING_ACTIONS.id : FIRED_ACTIONS.id;
      const additionalContext = results && results.length > 0 ? results[0][group].context : null;
      const alert = alertFactory(group, reason, additionalContext);
      const indexedStartedDate = (_getAlertStartedDate2 = getAlertStartedDate(group)) !== null && _getAlertStartedDate2 !== void 0 ? _getAlertStartedDate2 : startedAt.toISOString();
      const alertUuid = getAlertUuid(group);
      scheduledActionsCount++;
      const context = {
        alertDetailsUrl: (0, _utils.getAlertDetailsUrl)(libs.basePath, spaceId, alertUuid),
        alertState: _messages.stateToAlertMessage[nextState],
        group,
        reason,
        metric: mapToConditionsLookup(criteria, c => c.metric),
        timestamp: startedAt.toISOString(),
        threshold: mapToConditionsLookup(criteria, c => c.threshold),
        value: mapToConditionsLookup(results, result => formatMetric(result[group].metric, result[group].currentValue)),
        viewInAppUrl: (0, _utils.getViewInInventoryAppUrl)({
          basePath: libs.basePath,
          criteria,
          nodeType,
          timestamp: indexedStartedDate,
          spaceId
        }),
        ...additionalContext
      };
      alert.scheduleActions(actionGroupId, context);
    }
  }
  const {
    getRecoveredAlerts
  } = services.alertFactory.done();
  const recoveredAlerts = getRecoveredAlerts();
  for (const alert of recoveredAlerts) {
    var _getAlertStartedDate3;
    const recoveredAlertId = alert.getId();
    const indexedStartedDate = (_getAlertStartedDate3 = getAlertStartedDate(recoveredAlertId)) !== null && _getAlertStartedDate3 !== void 0 ? _getAlertStartedDate3 : startedAt.toISOString();
    const alertUuid = getAlertUuid(recoveredAlertId);
    const alertHits = alertUuid ? await getAlertByAlertUuid(alertUuid) : undefined;
    const additionalContext = (0, _utils.getContextForRecoveredAlerts)(alertHits);
    alert.setContext({
      alertDetailsUrl: (0, _utils.getAlertDetailsUrl)(libs.basePath, spaceId, alertUuid),
      alertState: _messages.stateToAlertMessage[_metrics.AlertStates.OK],
      group: recoveredAlertId,
      metric: mapToConditionsLookup(criteria, c => c.metric),
      threshold: mapToConditionsLookup(criteria, c => c.threshold),
      timestamp: startedAt.toISOString(),
      viewInAppUrl: (0, _utils.getViewInInventoryAppUrl)({
        basePath: libs.basePath,
        criteria,
        nodeType,
        timestamp: indexedStartedDate,
        spaceId
      }),
      ...additionalContext
    });
  }
  const stopTime = Date.now();
  logger.debug(`Scheduled ${scheduledActionsCount} actions in ${stopTime - startTime}ms`);
});
exports.createInventoryMetricThresholdExecutor = createInventoryMetricThresholdExecutor;
const formatThreshold = (metric, value) => {
  const metricFormatter = (0, _lodash.get)(_snapshot_metric_formats.METRIC_FORMATTERS, metric, _snapshot_metric_formats.METRIC_FORMATTERS.count);
  const formatter = (0, _formatters.createFormatter)(metricFormatter.formatter, metricFormatter.template);
  const threshold = Array.isArray(value) ? value.map(v => {
    if (metricFormatter.formatter === 'percent') {
      v = Number(v) / 100;
    }
    if (metricFormatter.formatter === 'bits') {
      v = Number(v) / 8;
    }
    return formatter(v);
  }) : value;
  return threshold;
};
const buildReasonWithVerboseMetricName = (group, resultItem, buildReason, useWarningThreshold) => {
  var _toMetricOpt;
  if (!resultItem) return '';
  const thresholdToFormat = useWarningThreshold ? resultItem.warningThreshold : resultItem.threshold;
  const resultWithVerboseMetricName = {
    ...resultItem,
    group,
    metric: ((_toMetricOpt = (0, _snapshot_metric_i18n.toMetricOpt)(resultItem.metric)) === null || _toMetricOpt === void 0 ? void 0 : _toMetricOpt.text) || (resultItem.metric === 'custom' && resultItem.customMetric ? (0, _get_custom_metric_label.getCustomMetricLabel)(resultItem.customMetric) : resultItem.metric),
    currentValue: formatMetric(resultItem.metric, resultItem.currentValue),
    threshold: formatThreshold(resultItem.metric, thresholdToFormat),
    comparator: useWarningThreshold ? resultItem.warningComparator : resultItem.comparator
  };
  return buildReason(resultWithVerboseMetricName);
};
const mapToConditionsLookup = (list, mapFn) => list.map(mapFn).reduce((result, value, i) => ({
  ...result,
  [`condition${i}`]: value
}), {});
const FIRED_ACTIONS_ID = 'metrics.inventory_threshold.fired';
exports.FIRED_ACTIONS_ID = FIRED_ACTIONS_ID;
const FIRED_ACTIONS = {
  id: FIRED_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.threshold.fired', {
    defaultMessage: 'Alert'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;
const WARNING_ACTIONS_ID = 'metrics.inventory_threshold.warning';
exports.WARNING_ACTIONS_ID = WARNING_ACTIONS_ID;
const WARNING_ACTIONS = {
  id: WARNING_ACTIONS_ID,
  name: _i18n.i18n.translate('xpack.infra.metrics.alerting.threshold.warning', {
    defaultMessage: 'Warning'
  })
};
exports.WARNING_ACTIONS = WARNING_ACTIONS;
const formatMetric = (metric, value) => {
  const metricFormatter = (0, _lodash.get)(_snapshot_metric_formats.METRIC_FORMATTERS, metric, _snapshot_metric_formats.METRIC_FORMATTERS.count);
  if (isNaN(value)) {
    return _i18n.i18n.translate('xpack.infra.metrics.alerting.inventory.noDataFormattedValue', {
      defaultMessage: '[NO DATA]'
    });
  }
  const formatter = (0, _formatters.createFormatter)(metricFormatter.formatter, metricFormatter.template);
  return formatter(value);
};