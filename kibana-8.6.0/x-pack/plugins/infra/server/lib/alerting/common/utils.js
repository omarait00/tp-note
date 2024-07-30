"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateIsStringElasticsearchJSONFilter = exports.validGroupByForContext = exports.unflattenObject = exports.termsAggField = exports.shouldTermsAggOnContainer = exports.oneOfLiterals = exports.hasAdditionalContext = exports.getViewInMetricsAppUrl = exports.getViewInInventoryAppUrl = exports.getContextForRecoveredAlerts = exports.getAlertDetailsUrl = exports.getAlertDetailsPageEnabledForApp = exports.flattenObject = exports.flattenAdditionalContext = exports.doFieldsExist = exports.createScopedLogger = exports.UNGROUPED_FACTORY_KEY = exports.NUMBER_OF_DOCUMENTS = exports.KUBERNETES_POD_UID = void 0;
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _common = require("../../../../../spaces/common");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _parse_technical_fields = require("../../../../../rule_registry/common/parse_technical_fields");
var _fieldTypes = require("@kbn/field-types");
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _metrics = require("../../../../common/alerting/metrics");
var _alert_link = require("../../../../common/alerting/metrics/alert_link");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALERT_CONTEXT_CONTAINER = 'container';
const ALERT_CONTEXT_ORCHESTRATOR = 'orchestrator';
const ALERT_CONTEXT_CLOUD = 'cloud';
const ALERT_CONTEXT_HOST = 'host';
const ALERT_CONTEXT_LABELS = 'labels';
const ALERT_CONTEXT_TAGS = 'tags';
const HOST_NAME = 'host.name';
const HOST_HOSTNAME = 'host.hostname';
const HOST_ID = 'host.id';
const CONTAINER_ID = 'container.id';
const SUPPORTED_ES_FIELD_TYPES = [_fieldTypes.ES_FIELD_TYPES.KEYWORD, _fieldTypes.ES_FIELD_TYPES.IP, _fieldTypes.ES_FIELD_TYPES.BOOLEAN];
const oneOfLiterals = arrayOfLiterals => _configSchema.schema.string({
  validate: value => arrayOfLiterals.includes(value) ? undefined : `must be one of ${arrayOfLiterals.join(' | ')}`
});
exports.oneOfLiterals = oneOfLiterals;
const validateIsStringElasticsearchJSONFilter = value => {
  if (value === '') {
    // Allow clearing the filter.
    return;
  }
  const errorMessage = 'filterQuery must be a valid Elasticsearch filter expressed in JSON';
  try {
    const parsedValue = JSON.parse(value);
    if (!(0, _lodash.isEmpty)(parsedValue.bool)) {
      return undefined;
    }
    return errorMessage;
  } catch (e) {
    return errorMessage;
  }
};
exports.validateIsStringElasticsearchJSONFilter = validateIsStringElasticsearchJSONFilter;
const UNGROUPED_FACTORY_KEY = '*';
exports.UNGROUPED_FACTORY_KEY = UNGROUPED_FACTORY_KEY;
const createScopedLogger = (logger, scope, alertExecutionDetails) => {
  const scopedLogger = logger.get(scope);
  const fmtMsg = msg => `[AlertId: ${alertExecutionDetails.alertId}][ExecutionId: ${alertExecutionDetails.executionId}] ${msg}`;
  return {
    ...scopedLogger,
    info: (msg, meta) => scopedLogger.info(fmtMsg(msg), meta),
    debug: (msg, meta) => scopedLogger.debug(fmtMsg(msg), meta),
    trace: (msg, meta) => scopedLogger.trace(fmtMsg(msg), meta),
    warn: (errorOrMessage, meta) => {
      if ((0, _lodash.isError)(errorOrMessage)) {
        scopedLogger.warn(errorOrMessage, meta);
      } else {
        scopedLogger.warn(fmtMsg(errorOrMessage), meta);
      }
    },
    error: (errorOrMessage, meta) => {
      if ((0, _lodash.isError)(errorOrMessage)) {
        scopedLogger.error(errorOrMessage, meta);
      } else {
        scopedLogger.error(fmtMsg(errorOrMessage), meta);
      }
    },
    fatal: (errorOrMessage, meta) => {
      if ((0, _lodash.isError)(errorOrMessage)) {
        scopedLogger.fatal(errorOrMessage, meta);
      } else {
        scopedLogger.fatal(fmtMsg(errorOrMessage), meta);
      }
    }
  };
};
exports.createScopedLogger = createScopedLogger;
const getAlertDetailsPageEnabledForApp = (config, appName) => {
  if (!config) return false;
  return config[appName].enabled;
};
exports.getAlertDetailsPageEnabledForApp = getAlertDetailsPageEnabledForApp;
const getViewInInventoryAppUrl = ({
  basePath,
  criteria,
  nodeType,
  spaceId,
  timestamp
}) => {
  const {
    metric,
    customMetric
  } = criteria[0];
  const fields = {
    [`${_ruleDataUtils.ALERT_RULE_PARAMETERS}.criteria.metric`]: [metric],
    [`${_ruleDataUtils.ALERT_RULE_PARAMETERS}.criteria.customMetric.id`]: [customMetric === null || customMetric === void 0 ? void 0 : customMetric.id],
    [`${_ruleDataUtils.ALERT_RULE_PARAMETERS}.criteria.customMetric.aggregation`]: [customMetric === null || customMetric === void 0 ? void 0 : customMetric.aggregation],
    [`${_ruleDataUtils.ALERT_RULE_PARAMETERS}.criteria.customMetric.field`]: [customMetric === null || customMetric === void 0 ? void 0 : customMetric.field],
    [`${_ruleDataUtils.ALERT_RULE_PARAMETERS}.nodeType`]: [nodeType],
    [_ruleDataUtils.TIMESTAMP]: timestamp
  };
  return (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, (0, _alert_link.getInventoryViewInAppUrl)((0, _parse_technical_fields.parseTechnicalFields)(fields, true)));
};
exports.getViewInInventoryAppUrl = getViewInInventoryAppUrl;
const getViewInMetricsAppUrl = (basePath, spaceId) => (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, _metrics.LINK_TO_METRICS_EXPLORER);
exports.getViewInMetricsAppUrl = getViewInMetricsAppUrl;
const getAlertDetailsUrl = (basePath, spaceId, alertUuid) => (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, `/app/observability/alerts/${alertUuid}`);
exports.getAlertDetailsUrl = getAlertDetailsUrl;
const KUBERNETES_POD_UID = 'kubernetes.pod.uid';
exports.KUBERNETES_POD_UID = KUBERNETES_POD_UID;
const NUMBER_OF_DOCUMENTS = 10;
exports.NUMBER_OF_DOCUMENTS = NUMBER_OF_DOCUMENTS;
const termsAggField = {
  [KUBERNETES_POD_UID]: CONTAINER_ID
};
exports.termsAggField = termsAggField;
const doFieldsExist = async (esClient, fields, index) => {
  // Get all supported fields
  const respMapping = await esClient.fieldCaps({
    index,
    fields: '*'
  });
  const fieldsExisted = {};
  const acceptableFields = new Set();
  Object.entries(respMapping.fields).forEach(([key, value]) => {
    const fieldTypes = Object.keys(value);
    const isSupportedType = fieldTypes.some(type => SUPPORTED_ES_FIELD_TYPES.includes(type));

    // Check if fieldName is something we can aggregate on
    if (isSupportedType) {
      acceptableFields.add(key);
    }
  });
  fields.forEach(field => {
    fieldsExisted[field] = acceptableFields.has(field);
  });
  return fieldsExisted;
};
exports.doFieldsExist = doFieldsExist;
const validGroupByForContext = [HOST_NAME, HOST_HOSTNAME, HOST_ID, KUBERNETES_POD_UID, CONTAINER_ID];
exports.validGroupByForContext = validGroupByForContext;
const hasAdditionalContext = (groupBy, validGroups) => {
  return groupBy ? Array.isArray(groupBy) ? groupBy.every(group => validGroups.includes(group)) : validGroups.includes(groupBy) : false;
};
exports.hasAdditionalContext = hasAdditionalContext;
const shouldTermsAggOnContainer = groupBy => {
  return groupBy && Array.isArray(groupBy) ? groupBy.includes(KUBERNETES_POD_UID) : groupBy === KUBERNETES_POD_UID;
};
exports.shouldTermsAggOnContainer = shouldTermsAggOnContainer;
const flattenAdditionalContext = additionalContext => {
  let flattenedContext = {};
  if (additionalContext) {
    Object.keys(additionalContext).forEach(context => {
      if (additionalContext[context]) {
        flattenedContext = {
          ...flattenedContext,
          ...flattenObject(additionalContext[context], [context + '.'])
        };
      }
    });
  }
  return flattenedContext;
};
exports.flattenAdditionalContext = flattenAdditionalContext;
const getContextForRecoveredAlerts = alertHits => {
  const alertHitsSource = alertHits && alertHits.length > 0 ? unflattenObject(alertHits[0]._source) : undefined;
  return {
    cloud: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_CLOUD],
    host: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_HOST],
    orchestrator: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_ORCHESTRATOR],
    container: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_CONTAINER],
    labels: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_LABELS],
    tags: alertHitsSource === null || alertHitsSource === void 0 ? void 0 : alertHitsSource[ALERT_CONTEXT_TAGS]
  };
};
exports.getContextForRecoveredAlerts = getContextForRecoveredAlerts;
const unflattenObject = object => Object.entries(object).reduce((acc, [key, value]) => {
  (0, _saferLodashSet.set)(acc, key, value);
  return acc;
}, {});

/**
 * Wrap the key with [] if it is a key from an Array
 * @param key The object key
 * @param isArrayItem Flag to indicate if it is the key of an Array
 */
exports.unflattenObject = unflattenObject;
const renderKey = (key, isArrayItem) => isArrayItem ? `[${key}]` : key;
const flattenObject = (obj, prefix = [], isArrayItem = false) => Object.keys(obj).reduce((acc, k) => {
  const nextValue = obj[k];
  if (typeof nextValue === 'object' && nextValue !== null) {
    const isNextValueArray = Array.isArray(nextValue);
    const dotSuffix = isNextValueArray ? '' : '.';
    if (Object.keys(nextValue).length > 0) {
      return {
        ...acc,
        ...flattenObject(nextValue, [...prefix, `${renderKey(k, isArrayItem)}${dotSuffix}`], isNextValueArray)
      };
    }
  }
  const fullPath = `${prefix.join('')}${renderKey(k, isArrayItem)}`;
  acc[fullPath] = nextValue;
  return acc;
}, {});
exports.flattenObject = flattenObject;