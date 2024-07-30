"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isElasticCloudDeployment = exports.getPreviousDiagTaskTimestamp = exports.getPreviousDailyTaskTimestamp = exports.extractEndpointPolicyConfig = exports.exceptionListItemToTelemetryEntry = exports.createUsageCounterLabel = exports.createTaskMetric = exports.batchTelemetryRecords = exports.addDefaultAdvancedPolicyConfigSettings = void 0;
exports.isPackagePolicyList = isPackagePolicyList;
exports.trustedApplicationToTelemetryEntry = exports.tlog = exports.templateExceptionList = exports.setIsElasticCloudDeployment = exports.ruleExceptionListItemToTelemetryEvent = exports.metricsResponseToValueListMetaData = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _lodash = require("lodash");
var _filterlists = require("./filterlists");
var _constants = require("./constants");
var _mapping = require("../../../common/endpoint/service/trusted_apps/mapping");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Determines the when the last run was in order to execute to.
 *
 * @param executeTo
 * @param lastExecutionTimestamp
 * @returns the timestamp to search from
 */
const getPreviousDiagTaskTimestamp = (executeTo, lastExecutionTimestamp) => {
  if (lastExecutionTimestamp === undefined) {
    return (0, _moment.default)(executeTo).subtract(5, 'minutes').toISOString();
  }
  if ((0, _moment.default)(executeTo).diff(lastExecutionTimestamp, 'minutes') >= 10) {
    return (0, _moment.default)(executeTo).subtract(10, 'minutes').toISOString();
  }
  return lastExecutionTimestamp;
};

/**
 * Determines the when the last run was in order to execute to.
 *
 * @param executeTo
 * @param lastExecutionTimestamp
 * @returns the timestamp to search from
 */
exports.getPreviousDiagTaskTimestamp = getPreviousDiagTaskTimestamp;
const getPreviousDailyTaskTimestamp = (executeTo, lastExecutionTimestamp) => {
  if (lastExecutionTimestamp === undefined) {
    return (0, _moment.default)(executeTo).subtract(24, 'hours').toISOString();
  }
  if ((0, _moment.default)(executeTo).diff(lastExecutionTimestamp, 'hours') >= 24) {
    return (0, _moment.default)(executeTo).subtract(24, 'hours').toISOString();
  }
  return lastExecutionTimestamp;
};

/**
 * Chunks an Array<T> into an Array<Array<T>>
 * This is to prevent overloading the telemetry channel + user resources
 *
 * @param telemetryRecords
 * @param batchSize
 * @returns the batch of records
 */
exports.getPreviousDailyTaskTimestamp = getPreviousDailyTaskTimestamp;
const batchTelemetryRecords = (telemetryRecords, batchSize) => [...Array(Math.ceil(telemetryRecords.length / batchSize))].map(_ => telemetryRecords.splice(0, batchSize));

/**
 * User defined type guard for PackagePolicy
 *
 * @param data the union type of package policies
 * @returns type confirmation
 */
exports.batchTelemetryRecords = batchTelemetryRecords;
function isPackagePolicyList(data) {
  if (data === undefined || data.length < 1) {
    return false;
  }
  return data[0].inputs !== undefined;
}

/**
 * Maps trusted application to shared telemetry object
 *
 * @param trustedAppExceptionItem
 * @returns collection of trusted applications
 */
const trustedApplicationToTelemetryEntry = trustedAppExceptionItem => {
  return {
    id: trustedAppExceptionItem.id,
    name: trustedAppExceptionItem.name,
    created_at: trustedAppExceptionItem.created_at,
    updated_at: trustedAppExceptionItem.updated_at,
    entries: trustedAppExceptionItem.entries,
    os_types: trustedAppExceptionItem.os_types,
    scope: (0, _mapping.tagsToEffectScope)(trustedAppExceptionItem.tags)
  };
};

/**
 * Maps endpoint lists to shared telemetry object
 *
 * @param exceptionListItem
 * @returns collection of endpoint exceptions
 */
exports.trustedApplicationToTelemetryEntry = trustedApplicationToTelemetryEntry;
const exceptionListItemToTelemetryEntry = exceptionListItem => {
  return {
    id: exceptionListItem.id,
    name: exceptionListItem.name,
    created_at: exceptionListItem.created_at,
    updated_at: exceptionListItem.updated_at,
    entries: exceptionListItem.entries,
    os_types: exceptionListItem.os_types
  };
};

/**
 * Maps detection rule exception list items to shared telemetry object
 *
 * @param exceptionListItem
 * @param ruleVersion
 * @returns collection of detection rule exceptions
 */
exports.exceptionListItemToTelemetryEntry = exceptionListItemToTelemetryEntry;
const ruleExceptionListItemToTelemetryEvent = (exceptionListItem, ruleVersion) => {
  return {
    id: exceptionListItem.item_id,
    name: exceptionListItem.description,
    rule_version: ruleVersion,
    created_at: exceptionListItem.created_at,
    updated_at: exceptionListItem.updated_at,
    entries: exceptionListItem.entries,
    os_types: exceptionListItem.os_types
  };
};

/**
 * Consructs the list telemetry schema from a collection of endpoint exceptions
 *
 * @param listData
 * @param listType
 * @returns lists telemetry schema
 */
exports.ruleExceptionListItemToTelemetryEvent = ruleExceptionListItemToTelemetryEvent;
const templateExceptionList = (listData, clusterInfo, licenseInfo, listType) => {
  return listData.map(item => {
    const template = {
      '@timestamp': (0, _moment.default)().toISOString(),
      cluster_uuid: clusterInfo.cluster_uuid,
      cluster_name: clusterInfo.cluster_name,
      license_id: licenseInfo === null || licenseInfo === void 0 ? void 0 : licenseInfo.uid
    };

    // cast exception list type to a TelemetryEvent for allowlist filtering
    const filteredListItem = (0, _filterlists.copyAllowlistedFields)(_filterlists.filterList.exceptionLists, item);
    if (listType === _constants.LIST_DETECTION_RULE_EXCEPTION) {
      template.detection_rule = filteredListItem;
      return template;
    }
    if (listType === _constants.LIST_TRUSTED_APPLICATION) {
      template.trusted_application = filteredListItem;
      return template;
    }
    if (listType === _constants.LIST_ENDPOINT_EXCEPTION) {
      template.endpoint_exception = filteredListItem;
      return template;
    }
    if (listType === _constants.LIST_ENDPOINT_EVENT_FILTER) {
      template.endpoint_event_filter = filteredListItem;
      return template;
    }
    return null;
  });
};

/**
 * Convert counter label list to kebab case
 *
 * @param label_list the list of labels to create standardized UsageCounter from
 * @returns a string label for usage in the UsageCounter
 */
exports.templateExceptionList = templateExceptionList;
const createUsageCounterLabel = labelList => labelList.join('-');

/**
 * Resiliantly handles an edge case where the endpoint config details are not present
 *
 * @returns the endpoint policy configuration
 */
exports.createUsageCounterLabel = createUsageCounterLabel;
const extractEndpointPolicyConfig = policyData => {
  var _policyData$inputs$, _policyData$inputs$$c;
  const epPolicyConfig = policyData === null || policyData === void 0 ? void 0 : (_policyData$inputs$ = policyData.inputs[0]) === null || _policyData$inputs$ === void 0 ? void 0 : (_policyData$inputs$$c = _policyData$inputs$.config) === null || _policyData$inputs$$c === void 0 ? void 0 : _policyData$inputs$$c.policy;
  return epPolicyConfig ? epPolicyConfig : null;
};
exports.extractEndpointPolicyConfig = extractEndpointPolicyConfig;
const addDefaultAdvancedPolicyConfigSettings = policyConfig => {
  return (0, _lodash.merge)(_constants.DEFAULT_ADVANCED_POLICY_CONFIG_SETTINGS, policyConfig);
};
exports.addDefaultAdvancedPolicyConfigSettings = addDefaultAdvancedPolicyConfigSettings;
const metricsResponseToValueListMetaData = ({
  listMetricsResponse,
  itemMetricsResponse,
  exceptionListMetricsResponse,
  indicatorMatchMetricsResponse
}) => {
  var _listMetricsResponse$, _listMetricsResponse$2, _listMetricsResponse$3, _listMetricsResponse$4, _listMetricsResponse$5, _itemMetricsResponse$, _itemMetricsResponse$2, _itemMetricsResponse$3, _exceptionListMetrics, _exceptionListMetrics2, _exceptionListMetrics3, _indicatorMatchMetric, _indicatorMatchMetric2, _indicatorMatchMetric3;
  return {
    total_list_count: (_listMetricsResponse$ = listMetricsResponse === null || listMetricsResponse === void 0 ? void 0 : (_listMetricsResponse$2 = listMetricsResponse.aggregations) === null || _listMetricsResponse$2 === void 0 ? void 0 : _listMetricsResponse$2.total_value_list_count) !== null && _listMetricsResponse$ !== void 0 ? _listMetricsResponse$ : 0,
    types: (_listMetricsResponse$3 = listMetricsResponse === null || listMetricsResponse === void 0 ? void 0 : (_listMetricsResponse$4 = listMetricsResponse.aggregations) === null || _listMetricsResponse$4 === void 0 ? void 0 : (_listMetricsResponse$5 = _listMetricsResponse$4.type_breakdown) === null || _listMetricsResponse$5 === void 0 ? void 0 : _listMetricsResponse$5.buckets.map(breakdown => ({
      type: breakdown.key,
      count: breakdown.doc_count
    }))) !== null && _listMetricsResponse$3 !== void 0 ? _listMetricsResponse$3 : [],
    lists: (_itemMetricsResponse$ = itemMetricsResponse === null || itemMetricsResponse === void 0 ? void 0 : (_itemMetricsResponse$2 = itemMetricsResponse.aggregations) === null || _itemMetricsResponse$2 === void 0 ? void 0 : (_itemMetricsResponse$3 = _itemMetricsResponse$2.value_list_item_count) === null || _itemMetricsResponse$3 === void 0 ? void 0 : _itemMetricsResponse$3.buckets.map(itemCount => ({
      id: itemCount.key,
      count: itemCount.doc_count
    }))) !== null && _itemMetricsResponse$ !== void 0 ? _itemMetricsResponse$ : [],
    included_in_exception_lists_count: (_exceptionListMetrics = exceptionListMetricsResponse === null || exceptionListMetricsResponse === void 0 ? void 0 : (_exceptionListMetrics2 = exceptionListMetricsResponse.aggregations) === null || _exceptionListMetrics2 === void 0 ? void 0 : (_exceptionListMetrics3 = _exceptionListMetrics2.vl_included_in_exception_lists_count) === null || _exceptionListMetrics3 === void 0 ? void 0 : _exceptionListMetrics3.value) !== null && _exceptionListMetrics !== void 0 ? _exceptionListMetrics : 0,
    used_in_indicator_match_rule_count: (_indicatorMatchMetric = indicatorMatchMetricsResponse === null || indicatorMatchMetricsResponse === void 0 ? void 0 : (_indicatorMatchMetric2 = indicatorMatchMetricsResponse.aggregations) === null || _indicatorMatchMetric2 === void 0 ? void 0 : (_indicatorMatchMetric3 = _indicatorMatchMetric2.vl_used_in_indicator_match_rule_count) === null || _indicatorMatchMetric3 === void 0 ? void 0 : _indicatorMatchMetric3.value) !== null && _indicatorMatchMetric !== void 0 ? _indicatorMatchMetric : 0
  };
};
exports.metricsResponseToValueListMetaData = metricsResponseToValueListMetaData;
let isElasticCloudDeployment = false;
exports.isElasticCloudDeployment = isElasticCloudDeployment;
const setIsElasticCloudDeployment = value => {
  exports.isElasticCloudDeployment = isElasticCloudDeployment = value;
};
exports.setIsElasticCloudDeployment = setIsElasticCloudDeployment;
const tlog = (logger, message) => {
  if (isElasticCloudDeployment) {
    logger.info(message);
  } else {
    logger.debug(message);
  }
};
exports.tlog = tlog;
const createTaskMetric = (name, passed, startTime, errorMessage) => {
  const endTime = Date.now();
  return {
    name,
    passed,
    time_executed_in_ms: endTime - startTime,
    start_time: startTime,
    end_time: endTime,
    error_message: errorMessage
  };
};
exports.createTaskMetric = createTaskMetric;