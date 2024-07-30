"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeSpecificSnakeToCamel = exports.typeSpecificCamelToSnake = exports.patchTypeSpecificSnakeToCamel = exports.internalRuleToAPIResponse = exports.convertPatchAPIToInternalSchema = exports.convertCreateAPIToInternalSchema = exports.commonParamsCamelToSnake = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../../../../../common/constants");
var _rule_schema = require("../../../../../common/detection_engine/rule_schema");
var _transform_actions = require("../../../../../common/detection_engine/transform_actions");
var _utils = require("../../../../../common/detection_engine/utils");
var _utility_types = require("../../../../../common/utility_types");
var _rule_monitoring = require("../../rule_monitoring");
var _rule_actions = require("./rule_actions");
var _utils2 = require("../utils/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// These functions provide conversions from the request API schema to the internal rule schema and from the internal rule schema
// to the response API schema. This provides static type-check assurances that the internal schema is in sync with the API schema for
// required and default-able fields. However, it is still possible to add an optional field to the API schema
// without causing a type-check error here.

// Converts params from the snake case API format to the internal camel case format AND applies default values where needed.
// Notice that params.language is possibly undefined for most rule types in the API but we default it to kuery to match
// the legacy API behavior
const typeSpecificSnakeToCamel = params => {
  switch (params.type) {
    case 'eql':
      {
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          dataViewId: params.data_view_id,
          query: params.query,
          filters: params.filters,
          timestampField: params.timestamp_field,
          eventCategoryOverride: params.event_category_override,
          tiebreakerField: params.tiebreaker_field
        };
      }
    case 'threat_match':
      {
        var _params$language, _params$threat_indica;
        return {
          type: params.type,
          language: (_params$language = params.language) !== null && _params$language !== void 0 ? _params$language : 'kuery',
          index: params.index,
          dataViewId: params.data_view_id,
          query: params.query,
          filters: params.filters,
          savedId: params.saved_id,
          threatFilters: params.threat_filters,
          threatQuery: params.threat_query,
          threatMapping: params.threat_mapping,
          threatLanguage: params.threat_language,
          threatIndex: params.threat_index,
          threatIndicatorPath: (_params$threat_indica = params.threat_indicator_path) !== null && _params$threat_indica !== void 0 ? _params$threat_indica : _constants.DEFAULT_INDICATOR_SOURCE_PATH,
          concurrentSearches: params.concurrent_searches,
          itemsPerSearch: params.items_per_search
        };
      }
    case 'query':
      {
        var _params$language2, _params$query, _params$response_acti;
        return {
          type: params.type,
          language: (_params$language2 = params.language) !== null && _params$language2 !== void 0 ? _params$language2 : 'kuery',
          index: params.index,
          dataViewId: params.data_view_id,
          query: (_params$query = params.query) !== null && _params$query !== void 0 ? _params$query : '',
          filters: params.filters,
          savedId: params.saved_id,
          responseActions: (_params$response_acti = params.response_actions) === null || _params$response_acti === void 0 ? void 0 : _params$response_acti.map(_transform_actions.transformRuleToAlertResponseAction),
          alertSuppression: (0, _utils2.convertAlertSuppressionToCamel)(params.alert_suppression)
        };
      }
    case 'saved_query':
      {
        var _params$language3, _params$response_acti2;
        return {
          type: params.type,
          language: (_params$language3 = params.language) !== null && _params$language3 !== void 0 ? _params$language3 : 'kuery',
          index: params.index,
          query: params.query,
          filters: params.filters,
          savedId: params.saved_id,
          dataViewId: params.data_view_id,
          responseActions: (_params$response_acti2 = params.response_actions) === null || _params$response_acti2 === void 0 ? void 0 : _params$response_acti2.map(_transform_actions.transformRuleToAlertResponseAction),
          alertSuppression: (0, _utils2.convertAlertSuppressionToCamel)(params.alert_suppression)
        };
      }
    case 'threshold':
      {
        var _params$language4;
        return {
          type: params.type,
          language: (_params$language4 = params.language) !== null && _params$language4 !== void 0 ? _params$language4 : 'kuery',
          index: params.index,
          dataViewId: params.data_view_id,
          query: params.query,
          filters: params.filters,
          savedId: params.saved_id,
          threshold: (0, _utils.normalizeThresholdObject)(params.threshold)
        };
      }
    case 'machine_learning':
      {
        return {
          type: params.type,
          anomalyThreshold: params.anomaly_threshold,
          machineLearningJobId: (0, _utils.normalizeMachineLearningJobIds)(params.machine_learning_job_id)
        };
      }
    case 'new_terms':
      {
        var _params$language5;
        return {
          type: params.type,
          query: params.query,
          newTermsFields: params.new_terms_fields,
          historyWindowStart: params.history_window_start,
          index: params.index,
          filters: params.filters,
          language: (_params$language5 = params.language) !== null && _params$language5 !== void 0 ? _params$language5 : 'kuery',
          dataViewId: params.data_view_id
        };
      }
    default:
      {
        return (0, _utility_types.assertUnreachable)(params);
      }
  }
};
exports.typeSpecificSnakeToCamel = typeSpecificSnakeToCamel;
const patchEqlParams = (params, existingRule) => {
  var _params$language6, _params$index, _params$data_view_id, _params$query2, _params$filters, _params$timestamp_fie, _params$event_categor, _params$tiebreaker_fi;
  return {
    type: existingRule.type,
    language: (_params$language6 = params.language) !== null && _params$language6 !== void 0 ? _params$language6 : existingRule.language,
    index: (_params$index = params.index) !== null && _params$index !== void 0 ? _params$index : existingRule.index,
    dataViewId: (_params$data_view_id = params.data_view_id) !== null && _params$data_view_id !== void 0 ? _params$data_view_id : existingRule.dataViewId,
    query: (_params$query2 = params.query) !== null && _params$query2 !== void 0 ? _params$query2 : existingRule.query,
    filters: (_params$filters = params.filters) !== null && _params$filters !== void 0 ? _params$filters : existingRule.filters,
    timestampField: (_params$timestamp_fie = params.timestamp_field) !== null && _params$timestamp_fie !== void 0 ? _params$timestamp_fie : existingRule.timestampField,
    eventCategoryOverride: (_params$event_categor = params.event_category_override) !== null && _params$event_categor !== void 0 ? _params$event_categor : existingRule.eventCategoryOverride,
    tiebreakerField: (_params$tiebreaker_fi = params.tiebreaker_field) !== null && _params$tiebreaker_fi !== void 0 ? _params$tiebreaker_fi : existingRule.tiebreakerField
  };
};
const patchThreatMatchParams = (params, existingRule) => {
  var _params$language7, _params$index2, _params$data_view_id2, _params$query3, _params$filters2, _params$saved_id, _params$threat_filter, _params$threat_query, _params$threat_mappin, _params$threat_langua, _params$threat_index, _params$threat_indica2, _params$concurrent_se, _params$items_per_sea;
  return {
    type: existingRule.type,
    language: (_params$language7 = params.language) !== null && _params$language7 !== void 0 ? _params$language7 : existingRule.language,
    index: (_params$index2 = params.index) !== null && _params$index2 !== void 0 ? _params$index2 : existingRule.index,
    dataViewId: (_params$data_view_id2 = params.data_view_id) !== null && _params$data_view_id2 !== void 0 ? _params$data_view_id2 : existingRule.dataViewId,
    query: (_params$query3 = params.query) !== null && _params$query3 !== void 0 ? _params$query3 : existingRule.query,
    filters: (_params$filters2 = params.filters) !== null && _params$filters2 !== void 0 ? _params$filters2 : existingRule.filters,
    savedId: (_params$saved_id = params.saved_id) !== null && _params$saved_id !== void 0 ? _params$saved_id : existingRule.savedId,
    threatFilters: (_params$threat_filter = params.threat_filters) !== null && _params$threat_filter !== void 0 ? _params$threat_filter : existingRule.threatFilters,
    threatQuery: (_params$threat_query = params.threat_query) !== null && _params$threat_query !== void 0 ? _params$threat_query : existingRule.threatQuery,
    threatMapping: (_params$threat_mappin = params.threat_mapping) !== null && _params$threat_mappin !== void 0 ? _params$threat_mappin : existingRule.threatMapping,
    threatLanguage: (_params$threat_langua = params.threat_language) !== null && _params$threat_langua !== void 0 ? _params$threat_langua : existingRule.threatLanguage,
    threatIndex: (_params$threat_index = params.threat_index) !== null && _params$threat_index !== void 0 ? _params$threat_index : existingRule.threatIndex,
    threatIndicatorPath: (_params$threat_indica2 = params.threat_indicator_path) !== null && _params$threat_indica2 !== void 0 ? _params$threat_indica2 : existingRule.threatIndicatorPath,
    concurrentSearches: (_params$concurrent_se = params.concurrent_searches) !== null && _params$concurrent_se !== void 0 ? _params$concurrent_se : existingRule.concurrentSearches,
    itemsPerSearch: (_params$items_per_sea = params.items_per_search) !== null && _params$items_per_sea !== void 0 ? _params$items_per_sea : existingRule.itemsPerSearch
  };
};
const patchQueryParams = (params, existingRule) => {
  var _params$language8, _params$index3, _params$data_view_id3, _params$query4, _params$filters3, _params$saved_id2, _params$response_acti3, _params$response_acti4;
  return {
    type: existingRule.type,
    language: (_params$language8 = params.language) !== null && _params$language8 !== void 0 ? _params$language8 : existingRule.language,
    index: (_params$index3 = params.index) !== null && _params$index3 !== void 0 ? _params$index3 : existingRule.index,
    dataViewId: (_params$data_view_id3 = params.data_view_id) !== null && _params$data_view_id3 !== void 0 ? _params$data_view_id3 : existingRule.dataViewId,
    query: (_params$query4 = params.query) !== null && _params$query4 !== void 0 ? _params$query4 : existingRule.query,
    filters: (_params$filters3 = params.filters) !== null && _params$filters3 !== void 0 ? _params$filters3 : existingRule.filters,
    savedId: (_params$saved_id2 = params.saved_id) !== null && _params$saved_id2 !== void 0 ? _params$saved_id2 : existingRule.savedId,
    responseActions: (_params$response_acti3 = (_params$response_acti4 = params.response_actions) === null || _params$response_acti4 === void 0 ? void 0 : _params$response_acti4.map(_transform_actions.transformRuleToAlertResponseAction)) !== null && _params$response_acti3 !== void 0 ? _params$response_acti3 : existingRule.responseActions,
    alertSuppression: (0, _utils2.convertAlertSuppressionToCamel)(params.alert_suppression)
  };
};
const patchSavedQueryParams = (params, existingRule) => {
  var _params$language9, _params$index4, _params$data_view_id4, _params$query5, _params$filters4, _params$saved_id3, _params$response_acti5, _params$response_acti6;
  return {
    type: existingRule.type,
    language: (_params$language9 = params.language) !== null && _params$language9 !== void 0 ? _params$language9 : existingRule.language,
    index: (_params$index4 = params.index) !== null && _params$index4 !== void 0 ? _params$index4 : existingRule.index,
    dataViewId: (_params$data_view_id4 = params.data_view_id) !== null && _params$data_view_id4 !== void 0 ? _params$data_view_id4 : existingRule.dataViewId,
    query: (_params$query5 = params.query) !== null && _params$query5 !== void 0 ? _params$query5 : existingRule.query,
    filters: (_params$filters4 = params.filters) !== null && _params$filters4 !== void 0 ? _params$filters4 : existingRule.filters,
    savedId: (_params$saved_id3 = params.saved_id) !== null && _params$saved_id3 !== void 0 ? _params$saved_id3 : existingRule.savedId,
    responseActions: (_params$response_acti5 = (_params$response_acti6 = params.response_actions) === null || _params$response_acti6 === void 0 ? void 0 : _params$response_acti6.map(_transform_actions.transformRuleToAlertResponseAction)) !== null && _params$response_acti5 !== void 0 ? _params$response_acti5 : existingRule.responseActions,
    alertSuppression: (0, _utils2.convertAlertSuppressionToCamel)(params.alert_suppression)
  };
};
const patchThresholdParams = (params, existingRule) => {
  var _params$language10, _params$index5, _params$data_view_id5, _params$query6, _params$filters5, _params$saved_id4;
  return {
    type: existingRule.type,
    language: (_params$language10 = params.language) !== null && _params$language10 !== void 0 ? _params$language10 : existingRule.language,
    index: (_params$index5 = params.index) !== null && _params$index5 !== void 0 ? _params$index5 : existingRule.index,
    dataViewId: (_params$data_view_id5 = params.data_view_id) !== null && _params$data_view_id5 !== void 0 ? _params$data_view_id5 : existingRule.dataViewId,
    query: (_params$query6 = params.query) !== null && _params$query6 !== void 0 ? _params$query6 : existingRule.query,
    filters: (_params$filters5 = params.filters) !== null && _params$filters5 !== void 0 ? _params$filters5 : existingRule.filters,
    savedId: (_params$saved_id4 = params.saved_id) !== null && _params$saved_id4 !== void 0 ? _params$saved_id4 : existingRule.savedId,
    threshold: params.threshold ? (0, _utils.normalizeThresholdObject)(params.threshold) : existingRule.threshold
  };
};
const patchMachineLearningParams = (params, existingRule) => {
  var _params$anomaly_thres;
  return {
    type: existingRule.type,
    anomalyThreshold: (_params$anomaly_thres = params.anomaly_threshold) !== null && _params$anomaly_thres !== void 0 ? _params$anomaly_thres : existingRule.anomalyThreshold,
    machineLearningJobId: params.machine_learning_job_id ? (0, _utils.normalizeMachineLearningJobIds)(params.machine_learning_job_id) : existingRule.machineLearningJobId
  };
};
const patchNewTermsParams = (params, existingRule) => {
  var _params$language11, _params$index6, _params$data_view_id6, _params$query7, _params$filters6, _params$new_terms_fie, _params$history_windo;
  return {
    type: existingRule.type,
    language: (_params$language11 = params.language) !== null && _params$language11 !== void 0 ? _params$language11 : existingRule.language,
    index: (_params$index6 = params.index) !== null && _params$index6 !== void 0 ? _params$index6 : existingRule.index,
    dataViewId: (_params$data_view_id6 = params.data_view_id) !== null && _params$data_view_id6 !== void 0 ? _params$data_view_id6 : existingRule.dataViewId,
    query: (_params$query7 = params.query) !== null && _params$query7 !== void 0 ? _params$query7 : existingRule.query,
    filters: (_params$filters6 = params.filters) !== null && _params$filters6 !== void 0 ? _params$filters6 : existingRule.filters,
    newTermsFields: (_params$new_terms_fie = params.new_terms_fields) !== null && _params$new_terms_fie !== void 0 ? _params$new_terms_fie : existingRule.newTermsFields,
    historyWindowStart: (_params$history_windo = params.history_window_start) !== null && _params$history_windo !== void 0 ? _params$history_windo : existingRule.historyWindowStart
  };
};
const parseValidationError = error => {
  if (error != null) {
    return new _securitysolutionEsUtils.BadRequestError(error);
  } else {
    return new _securitysolutionEsUtils.BadRequestError('unknown validation error');
  }
};
const patchTypeSpecificSnakeToCamel = (params, existingRule) => {
  // Here we do the validation of patch params by rule type to ensure that the fields that are
  // passed in to patch are of the correct type, e.g. `query` is a string. Since the combined patch schema
  // is a union of types where everything is optional, it's hard to do the validation before we know the rule type -
  // a patch request that defines `event_category_override` as a number would not be assignable to the EQL patch schema,
  // but would be assignable to the other rule types since they don't specify `event_category_override`.
  switch (existingRule.type) {
    case 'eql':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.EqlPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchEqlParams(validated, existingRule);
      }
    case 'threat_match':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.ThreatMatchPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchThreatMatchParams(validated, existingRule);
      }
    case 'query':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.QueryPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchQueryParams(validated, existingRule);
      }
    case 'saved_query':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.SavedQueryPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchSavedQueryParams(validated, existingRule);
      }
    case 'threshold':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.ThresholdPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchThresholdParams(validated, existingRule);
      }
    case 'machine_learning':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.MachineLearningPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchMachineLearningParams(validated, existingRule);
      }
    case 'new_terms':
      {
        const [validated, error] = (0, _securitysolutionIoTsUtils.validateNonExact)(params, _rule_schema.NewTermsPatchParams);
        if (validated == null) {
          throw parseValidationError(error);
        }
        return patchNewTermsParams(validated, existingRule);
      }
    default:
      {
        return (0, _utility_types.assertUnreachable)(existingRule);
      }
  }
};
exports.patchTypeSpecificSnakeToCamel = patchTypeSpecificSnakeToCamel;
const versionExcludedKeys = ['enabled', 'id', 'rule_id'];
const incrementVersion = (nextParams, existingRule) => {
  // The the version from nextParams if it's provided
  if (nextParams.version) {
    return nextParams.version;
  }

  // If the rule is immutable, keep the current version
  if (existingRule.immutable) {
    return existingRule.version;
  }

  // For custom rules, check modified params to deicide whether version increment is needed
  for (const key in nextParams) {
    if (!versionExcludedKeys.includes(key)) {
      return existingRule.version + 1;
    }
  }
  return existingRule.version;
};

// eslint-disable-next-line complexity
const convertPatchAPIToInternalSchema = (nextParams, existingRule) => {
  var _nextParams$name, _nextParams$tags, _nextParams$author, _nextParams$building_, _nextParams$descripti, _nextParams$false_pos, _nextParams$from, _nextParams$license, _nextParams$output_in, _nextParams$timeline_, _nextParams$timeline_2, _nextParams$meta, _nextParams$max_signa, _nextParams$related_i, _nextParams$required_, _nextParams$risk_scor, _nextParams$risk_scor2, _nextParams$rule_name, _nextParams$setup, _nextParams$severity, _nextParams$severity_, _nextParams$threat, _nextParams$timestamp, _nextParams$timestamp2, _nextParams$to, _nextParams$reference, _nextParams$namespace, _nextParams$note, _nextParams$exception, _nextParams$interval, _existingRule$throttl, _existingRule$notifyW;
  const typeSpecificParams = patchTypeSpecificSnakeToCamel(nextParams, existingRule.params);
  const existingParams = existingRule.params;
  return {
    name: (_nextParams$name = nextParams.name) !== null && _nextParams$name !== void 0 ? _nextParams$name : existingRule.name,
    tags: (_nextParams$tags = nextParams.tags) !== null && _nextParams$tags !== void 0 ? _nextParams$tags : existingRule.tags,
    params: {
      author: (_nextParams$author = nextParams.author) !== null && _nextParams$author !== void 0 ? _nextParams$author : existingParams.author,
      buildingBlockType: (_nextParams$building_ = nextParams.building_block_type) !== null && _nextParams$building_ !== void 0 ? _nextParams$building_ : existingParams.buildingBlockType,
      description: (_nextParams$descripti = nextParams.description) !== null && _nextParams$descripti !== void 0 ? _nextParams$descripti : existingParams.description,
      ruleId: existingParams.ruleId,
      falsePositives: (_nextParams$false_pos = nextParams.false_positives) !== null && _nextParams$false_pos !== void 0 ? _nextParams$false_pos : existingParams.falsePositives,
      from: (_nextParams$from = nextParams.from) !== null && _nextParams$from !== void 0 ? _nextParams$from : existingParams.from,
      immutable: existingParams.immutable,
      license: (_nextParams$license = nextParams.license) !== null && _nextParams$license !== void 0 ? _nextParams$license : existingParams.license,
      outputIndex: (_nextParams$output_in = nextParams.output_index) !== null && _nextParams$output_in !== void 0 ? _nextParams$output_in : existingParams.outputIndex,
      timelineId: (_nextParams$timeline_ = nextParams.timeline_id) !== null && _nextParams$timeline_ !== void 0 ? _nextParams$timeline_ : existingParams.timelineId,
      timelineTitle: (_nextParams$timeline_2 = nextParams.timeline_title) !== null && _nextParams$timeline_2 !== void 0 ? _nextParams$timeline_2 : existingParams.timelineTitle,
      meta: (_nextParams$meta = nextParams.meta) !== null && _nextParams$meta !== void 0 ? _nextParams$meta : existingParams.meta,
      maxSignals: (_nextParams$max_signa = nextParams.max_signals) !== null && _nextParams$max_signa !== void 0 ? _nextParams$max_signa : existingParams.maxSignals,
      relatedIntegrations: (_nextParams$related_i = nextParams.related_integrations) !== null && _nextParams$related_i !== void 0 ? _nextParams$related_i : existingParams.relatedIntegrations,
      requiredFields: (_nextParams$required_ = nextParams.required_fields) !== null && _nextParams$required_ !== void 0 ? _nextParams$required_ : existingParams.requiredFields,
      riskScore: (_nextParams$risk_scor = nextParams.risk_score) !== null && _nextParams$risk_scor !== void 0 ? _nextParams$risk_scor : existingParams.riskScore,
      riskScoreMapping: (_nextParams$risk_scor2 = nextParams.risk_score_mapping) !== null && _nextParams$risk_scor2 !== void 0 ? _nextParams$risk_scor2 : existingParams.riskScoreMapping,
      ruleNameOverride: (_nextParams$rule_name = nextParams.rule_name_override) !== null && _nextParams$rule_name !== void 0 ? _nextParams$rule_name : existingParams.ruleNameOverride,
      setup: (_nextParams$setup = nextParams.setup) !== null && _nextParams$setup !== void 0 ? _nextParams$setup : existingParams.setup,
      severity: (_nextParams$severity = nextParams.severity) !== null && _nextParams$severity !== void 0 ? _nextParams$severity : existingParams.severity,
      severityMapping: (_nextParams$severity_ = nextParams.severity_mapping) !== null && _nextParams$severity_ !== void 0 ? _nextParams$severity_ : existingParams.severityMapping,
      threat: (_nextParams$threat = nextParams.threat) !== null && _nextParams$threat !== void 0 ? _nextParams$threat : existingParams.threat,
      timestampOverride: (_nextParams$timestamp = nextParams.timestamp_override) !== null && _nextParams$timestamp !== void 0 ? _nextParams$timestamp : existingParams.timestampOverride,
      timestampOverrideFallbackDisabled: (_nextParams$timestamp2 = nextParams.timestamp_override_fallback_disabled) !== null && _nextParams$timestamp2 !== void 0 ? _nextParams$timestamp2 : existingParams.timestampOverrideFallbackDisabled,
      to: (_nextParams$to = nextParams.to) !== null && _nextParams$to !== void 0 ? _nextParams$to : existingParams.to,
      references: (_nextParams$reference = nextParams.references) !== null && _nextParams$reference !== void 0 ? _nextParams$reference : existingParams.references,
      namespace: (_nextParams$namespace = nextParams.namespace) !== null && _nextParams$namespace !== void 0 ? _nextParams$namespace : existingParams.namespace,
      note: (_nextParams$note = nextParams.note) !== null && _nextParams$note !== void 0 ? _nextParams$note : existingParams.note,
      // Always use the version from the request if specified. If it isn't specified, leave immutable rules alone and
      // increment the version of mutable rules by 1.
      version: incrementVersion(nextParams, existingParams),
      exceptionsList: (_nextParams$exception = nextParams.exceptions_list) !== null && _nextParams$exception !== void 0 ? _nextParams$exception : existingParams.exceptionsList,
      ...typeSpecificParams
    },
    schedule: {
      interval: (_nextParams$interval = nextParams.interval) !== null && _nextParams$interval !== void 0 ? _nextParams$interval : existingRule.schedule.interval
    },
    actions: nextParams.actions ? nextParams.actions.map(_transform_actions.transformRuleToAlertAction) : existingRule.actions,
    throttle: nextParams.throttle ? (0, _rule_actions.transformToAlertThrottle)(nextParams.throttle) : (_existingRule$throttl = existingRule.throttle) !== null && _existingRule$throttl !== void 0 ? _existingRule$throttl : null,
    notifyWhen: nextParams.throttle ? (0, _rule_actions.transformToNotifyWhen)(nextParams.throttle) : (_existingRule$notifyW = existingRule.notifyWhen) !== null && _existingRule$notifyW !== void 0 ? _existingRule$notifyW : null
  };
};

// eslint-disable-next-line complexity
exports.convertPatchAPIToInternalSchema = convertPatchAPIToInternalSchema;
const convertCreateAPIToInternalSchema = (input, immutable = false, defaultEnabled = true) => {
  var _input$rule_id, _input$tags, _input$author, _input$false_positive, _input$from, _input$output_index, _input$max_signals, _input$risk_score_map, _input$severity_mappi, _input$threat, _input$to, _input$references, _input$version, _input$exceptions_lis, _input$related_integr, _input$required_field, _input$setup, _input$interval, _input$enabled, _input$actions$map, _input$actions;
  const typeSpecificParams = typeSpecificSnakeToCamel(input);
  const newRuleId = (_input$rule_id = input.rule_id) !== null && _input$rule_id !== void 0 ? _input$rule_id : _uuid.default.v4();
  return {
    name: input.name,
    tags: (_input$tags = input.tags) !== null && _input$tags !== void 0 ? _input$tags : [],
    alertTypeId: _securitysolutionRules.ruleTypeMappings[input.type],
    consumer: _constants.SERVER_APP_ID,
    params: {
      author: (_input$author = input.author) !== null && _input$author !== void 0 ? _input$author : [],
      buildingBlockType: input.building_block_type,
      description: input.description,
      ruleId: newRuleId,
      falsePositives: (_input$false_positive = input.false_positives) !== null && _input$false_positive !== void 0 ? _input$false_positive : [],
      from: (_input$from = input.from) !== null && _input$from !== void 0 ? _input$from : 'now-6m',
      immutable,
      license: input.license,
      outputIndex: (_input$output_index = input.output_index) !== null && _input$output_index !== void 0 ? _input$output_index : '',
      timelineId: input.timeline_id,
      timelineTitle: input.timeline_title,
      meta: input.meta,
      maxSignals: (_input$max_signals = input.max_signals) !== null && _input$max_signals !== void 0 ? _input$max_signals : _constants.DEFAULT_MAX_SIGNALS,
      riskScore: input.risk_score,
      riskScoreMapping: (_input$risk_score_map = input.risk_score_mapping) !== null && _input$risk_score_map !== void 0 ? _input$risk_score_map : [],
      ruleNameOverride: input.rule_name_override,
      severity: input.severity,
      severityMapping: (_input$severity_mappi = input.severity_mapping) !== null && _input$severity_mappi !== void 0 ? _input$severity_mappi : [],
      threat: (_input$threat = input.threat) !== null && _input$threat !== void 0 ? _input$threat : [],
      timestampOverride: input.timestamp_override,
      timestampOverrideFallbackDisabled: input.timestamp_override_fallback_disabled,
      to: (_input$to = input.to) !== null && _input$to !== void 0 ? _input$to : 'now',
      references: (_input$references = input.references) !== null && _input$references !== void 0 ? _input$references : [],
      namespace: input.namespace,
      note: input.note,
      version: (_input$version = input.version) !== null && _input$version !== void 0 ? _input$version : 1,
      exceptionsList: (_input$exceptions_lis = input.exceptions_list) !== null && _input$exceptions_lis !== void 0 ? _input$exceptions_lis : [],
      relatedIntegrations: (_input$related_integr = input.related_integrations) !== null && _input$related_integr !== void 0 ? _input$related_integr : [],
      requiredFields: (_input$required_field = input.required_fields) !== null && _input$required_field !== void 0 ? _input$required_field : [],
      setup: (_input$setup = input.setup) !== null && _input$setup !== void 0 ? _input$setup : '',
      ...typeSpecificParams
    },
    schedule: {
      interval: (_input$interval = input.interval) !== null && _input$interval !== void 0 ? _input$interval : '5m'
    },
    enabled: (_input$enabled = input.enabled) !== null && _input$enabled !== void 0 ? _input$enabled : defaultEnabled,
    actions: (_input$actions$map = (_input$actions = input.actions) === null || _input$actions === void 0 ? void 0 : _input$actions.map(_transform_actions.transformRuleToAlertAction)) !== null && _input$actions$map !== void 0 ? _input$actions$map : [],
    throttle: (0, _rule_actions.transformToAlertThrottle)(input.throttle),
    notifyWhen: (0, _rule_actions.transformToNotifyWhen)(input.throttle)
  };
};

// Converts the internal rule data structure to the response API schema
exports.convertCreateAPIToInternalSchema = convertCreateAPIToInternalSchema;
const typeSpecificCamelToSnake = params => {
  switch (params.type) {
    case 'eql':
      {
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          data_view_id: params.dataViewId,
          query: params.query,
          filters: params.filters,
          timestamp_field: params.timestampField,
          event_category_override: params.eventCategoryOverride,
          tiebreaker_field: params.tiebreakerField
        };
      }
    case 'threat_match':
      {
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          data_view_id: params.dataViewId,
          query: params.query,
          filters: params.filters,
          saved_id: params.savedId,
          threat_filters: params.threatFilters,
          threat_query: params.threatQuery,
          threat_mapping: params.threatMapping,
          threat_language: params.threatLanguage,
          threat_index: params.threatIndex,
          threat_indicator_path: params.threatIndicatorPath,
          concurrent_searches: params.concurrentSearches,
          items_per_search: params.itemsPerSearch
        };
      }
    case 'query':
      {
        var _params$responseActio;
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          data_view_id: params.dataViewId,
          query: params.query,
          filters: params.filters,
          saved_id: params.savedId,
          response_actions: (_params$responseActio = params.responseActions) === null || _params$responseActio === void 0 ? void 0 : _params$responseActio.map(_transform_actions.transformAlertToRuleResponseAction),
          alert_suppression: (0, _utils2.convertAlertSuppressionToSnake)(params.alertSuppression)
        };
      }
    case 'saved_query':
      {
        var _params$responseActio2;
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          query: params.query,
          filters: params.filters,
          saved_id: params.savedId,
          data_view_id: params.dataViewId,
          response_actions: (_params$responseActio2 = params.responseActions) === null || _params$responseActio2 === void 0 ? void 0 : _params$responseActio2.map(_transform_actions.transformAlertToRuleResponseAction),
          alert_suppression: (0, _utils2.convertAlertSuppressionToSnake)(params.alertSuppression)
        };
      }
    case 'threshold':
      {
        return {
          type: params.type,
          language: params.language,
          index: params.index,
          data_view_id: params.dataViewId,
          query: params.query,
          filters: params.filters,
          saved_id: params.savedId,
          threshold: params.threshold
        };
      }
    case 'machine_learning':
      {
        return {
          type: params.type,
          anomaly_threshold: params.anomalyThreshold,
          machine_learning_job_id: params.machineLearningJobId
        };
      }
    case 'new_terms':
      {
        return {
          type: params.type,
          query: params.query,
          new_terms_fields: params.newTermsFields,
          history_window_start: params.historyWindowStart,
          index: params.index,
          filters: params.filters,
          language: params.language,
          data_view_id: params.dataViewId
        };
      }
    default:
      {
        return (0, _utility_types.assertUnreachable)(params);
      }
  }
};

// TODO: separate out security solution defined common params from Alerting framework common params
// so we can explicitly specify the return type of this function
exports.typeSpecificCamelToSnake = typeSpecificCamelToSnake;
const commonParamsCamelToSnake = params => {
  var _params$relatedIntegr, _params$requiredField, _params$setup;
  return {
    description: params.description,
    risk_score: params.riskScore,
    severity: params.severity,
    building_block_type: params.buildingBlockType,
    namespace: params.namespace,
    note: params.note,
    license: params.license,
    output_index: params.outputIndex,
    timeline_id: params.timelineId,
    timeline_title: params.timelineTitle,
    meta: params.meta,
    rule_name_override: params.ruleNameOverride,
    timestamp_override: params.timestampOverride,
    timestamp_override_fallback_disabled: params.timestampOverrideFallbackDisabled,
    author: params.author,
    false_positives: params.falsePositives,
    from: params.from,
    rule_id: params.ruleId,
    max_signals: params.maxSignals,
    risk_score_mapping: params.riskScoreMapping,
    severity_mapping: params.severityMapping,
    threat: params.threat,
    to: params.to,
    references: params.references,
    version: params.version,
    exceptions_list: params.exceptionsList,
    immutable: params.immutable,
    related_integrations: (_params$relatedIntegr = params.relatedIntegrations) !== null && _params$relatedIntegr !== void 0 ? _params$relatedIntegr : [],
    required_fields: (_params$requiredField = params.requiredFields) !== null && _params$requiredField !== void 0 ? _params$requiredField : [],
    setup: (_params$setup = params.setup) !== null && _params$setup !== void 0 ? _params$setup : ''
  };
};
exports.commonParamsCamelToSnake = commonParamsCamelToSnake;
const internalRuleToAPIResponse = (rule, ruleExecutionSummary, legacyRuleActions) => {
  var _rule$updatedBy, _rule$createdBy;
  const mergedExecutionSummary = (0, _rule_monitoring.mergeRuleExecutionSummary)(rule.executionStatus, ruleExecutionSummary !== null && ruleExecutionSummary !== void 0 ? ruleExecutionSummary : null);
  const isResolvedRule = obj => obj.outcome != null;
  return {
    // saved object properties
    outcome: isResolvedRule(rule) ? rule.outcome : undefined,
    alias_target_id: isResolvedRule(rule) ? rule.alias_target_id : undefined,
    alias_purpose: isResolvedRule(rule) ? rule.alias_purpose : undefined,
    // Alerting framework params
    id: rule.id,
    updated_at: rule.updatedAt.toISOString(),
    updated_by: (_rule$updatedBy = rule.updatedBy) !== null && _rule$updatedBy !== void 0 ? _rule$updatedBy : 'elastic',
    created_at: rule.createdAt.toISOString(),
    created_by: (_rule$createdBy = rule.createdBy) !== null && _rule$createdBy !== void 0 ? _rule$createdBy : 'elastic',
    name: rule.name,
    tags: rule.tags,
    interval: rule.schedule.interval,
    enabled: rule.enabled,
    // Security solution shared rule params
    ...commonParamsCamelToSnake(rule.params),
    // Type specific security solution rule params
    ...typeSpecificCamelToSnake(rule.params),
    // Actions
    throttle: (0, _rule_actions.transformFromAlertThrottle)(rule, legacyRuleActions),
    actions: (0, _rule_actions.transformActions)(rule.actions, legacyRuleActions),
    // Execution summary
    execution_summary: mergedExecutionSummary !== null && mergedExecutionSummary !== void 0 ? mergedExecutionSummary : undefined
  };
};
exports.internalRuleToAPIResponse = internalRuleToAPIResponse;