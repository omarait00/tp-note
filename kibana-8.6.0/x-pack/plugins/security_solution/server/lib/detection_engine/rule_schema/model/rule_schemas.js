"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unifiedQueryRuleParams = exports.typeSpecificRuleParams = exports.thresholdRuleParams = exports.threatRuleParams = exports.savedQueryRuleParams = exports.ruleParams = exports.queryRuleParams = exports.notifyWhen = exports.newTermsRuleParams = exports.machineLearningRuleParams = exports.internalRuleUpdate = exports.internalRuleCreate = exports.eqlRuleParams = exports.baseRuleParams = exports.allRuleTypes = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _rule_schema = require("../../../../../common/detection_engine/rule_schema");
var _common = require("../../../../../common/detection_engine/schemas/common");
var _constants = require("../../../../../common/constants");
var _schemas = require("../../../../../common/detection_engine/rule_response_actions/schemas");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const nonEqlLanguages = t.keyof({
  kuery: null,
  lucene: null
});
const AlertSuppressionCamel = t.exact(t.type({
  groupBy: _rule_schema.AlertSuppressionGroupBy
}));
const baseRuleParams = t.exact(t.type({
  author: _rule_schema.RuleAuthorArray,
  buildingBlockType: t.union([_rule_schema.BuildingBlockType, t.undefined]),
  description: _rule_schema.RuleDescription,
  namespace: t.union([_rule_schema.AlertsIndexNamespace, t.undefined]),
  note: t.union([_rule_schema.InvestigationGuide, t.undefined]),
  falsePositives: _rule_schema.RuleFalsePositiveArray,
  from: _securitysolutionIoTsAlertingTypes.RuleIntervalFrom,
  ruleId: _rule_schema.RuleSignatureId,
  immutable: _rule_schema.IsRuleImmutable,
  license: t.union([_rule_schema.RuleLicense, t.undefined]),
  outputIndex: _rule_schema.AlertsIndex,
  timelineId: t.union([_rule_schema.TimelineTemplateId, t.undefined]),
  timelineTitle: t.union([_rule_schema.TimelineTemplateTitle, t.undefined]),
  meta: t.union([_rule_schema.RuleMetadata, t.undefined]),
  // maxSignals not used in ML rules but probably should be used
  maxSignals: _rule_schema.MaxSignals,
  riskScore: _securitysolutionIoTsAlertingTypes.RiskScore,
  riskScoreMapping: _securitysolutionIoTsAlertingTypes.RiskScoreMapping,
  ruleNameOverride: t.union([_rule_schema.RuleNameOverride, t.undefined]),
  severity: _securitysolutionIoTsAlertingTypes.Severity,
  severityMapping: _securitysolutionIoTsAlertingTypes.SeverityMapping,
  timestampOverride: t.union([_rule_schema.TimestampOverride, t.undefined]),
  timestampOverrideFallbackDisabled: t.union([_rule_schema.TimestampOverrideFallbackDisabled, t.undefined]),
  threat: _rule_schema.ThreatArray,
  to: _securitysolutionIoTsAlertingTypes.RuleIntervalTo,
  references: _rule_schema.RuleReferenceArray,
  version: _rule_schema.RuleVersion,
  exceptionsList: _rule_schema.ExceptionListArray,
  relatedIntegrations: t.union([_rule_schema.RelatedIntegrationArray, t.undefined]),
  requiredFields: t.union([_rule_schema.RequiredFieldArray, t.undefined]),
  setup: t.union([_rule_schema.SetupGuide, t.undefined])
}));
exports.baseRuleParams = baseRuleParams;
const eqlSpecificRuleParams = t.type({
  type: t.literal('eql'),
  language: t.literal('eql'),
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined]),
  query: _rule_schema.RuleQuery,
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  eventCategoryOverride: t.union([_rule_schema.EventCategoryOverride, t.undefined]),
  timestampField: t.union([_rule_schema.TimestampField, t.undefined]),
  tiebreakerField: t.union([_rule_schema.TiebreakerField, t.undefined])
});
const eqlRuleParams = t.intersection([baseRuleParams, eqlSpecificRuleParams]);
exports.eqlRuleParams = eqlRuleParams;
const threatSpecificRuleParams = t.type({
  type: t.literal('threat_match'),
  language: nonEqlLanguages,
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  query: _rule_schema.RuleQuery,
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  savedId: _common.savedIdOrUndefined,
  threatFilters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  threatQuery: _securitysolutionIoTsAlertingTypes.threat_query,
  threatMapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
  threatLanguage: t.union([nonEqlLanguages, t.undefined]),
  threatIndex: _securitysolutionIoTsAlertingTypes.threat_index,
  threatIndicatorPath: _securitysolutionIoTsAlertingTypes.threatIndicatorPathOrUndefined,
  concurrentSearches: _securitysolutionIoTsAlertingTypes.concurrentSearchesOrUndefined,
  itemsPerSearch: _securitysolutionIoTsAlertingTypes.itemsPerSearchOrUndefined,
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined])
});
const threatRuleParams = t.intersection([baseRuleParams, threatSpecificRuleParams]);
exports.threatRuleParams = threatRuleParams;
const querySpecificRuleParams = t.exact(t.type({
  type: t.literal('query'),
  language: nonEqlLanguages,
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  query: _rule_schema.RuleQuery,
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  savedId: _common.savedIdOrUndefined,
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined]),
  responseActions: _schemas.ResponseActionRuleParamsOrUndefined,
  alertSuppression: t.union([AlertSuppressionCamel, t.undefined])
}));
const queryRuleParams = t.intersection([baseRuleParams, querySpecificRuleParams]);
exports.queryRuleParams = queryRuleParams;
const savedQuerySpecificRuleParams = t.type({
  type: t.literal('saved_query'),
  // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
  // if the saved object gets deleted for some reason
  language: nonEqlLanguages,
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined]),
  query: t.union([_rule_schema.RuleQuery, t.undefined]),
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  savedId: _common.saved_id,
  responseActions: _schemas.ResponseActionRuleParamsOrUndefined,
  alertSuppression: t.union([AlertSuppressionCamel, t.undefined])
});
const savedQueryRuleParams = t.intersection([baseRuleParams, savedQuerySpecificRuleParams]);
exports.savedQueryRuleParams = savedQueryRuleParams;
const unifiedQueryRuleParams = t.intersection([baseRuleParams, t.union([querySpecificRuleParams, savedQuerySpecificRuleParams])]);
exports.unifiedQueryRuleParams = unifiedQueryRuleParams;
const thresholdSpecificRuleParams = t.type({
  type: t.literal('threshold'),
  language: nonEqlLanguages,
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  query: _rule_schema.RuleQuery,
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  savedId: _common.savedIdOrUndefined,
  threshold: _rule_schema.ThresholdNormalized,
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined])
});
const thresholdRuleParams = t.intersection([baseRuleParams, thresholdSpecificRuleParams]);
exports.thresholdRuleParams = thresholdRuleParams;
const machineLearningSpecificRuleParams = t.type({
  type: t.literal('machine_learning'),
  anomalyThreshold: _common.anomaly_threshold,
  machineLearningJobId: _securitysolutionIoTsAlertingTypes.machine_learning_job_id_normalized
});
const machineLearningRuleParams = t.intersection([baseRuleParams, machineLearningSpecificRuleParams]);
exports.machineLearningRuleParams = machineLearningRuleParams;
const newTermsSpecificRuleParams = t.type({
  type: t.literal('new_terms'),
  query: _rule_schema.RuleQuery,
  newTermsFields: _rule_schema.NewTermsFields,
  historyWindowStart: _rule_schema.HistoryWindowStart,
  index: t.union([_rule_schema.IndexPatternArray, t.undefined]),
  filters: t.union([_rule_schema.RuleFilterArray, t.undefined]),
  language: nonEqlLanguages,
  dataViewId: t.union([_rule_schema.DataViewId, t.undefined])
});
const newTermsRuleParams = t.intersection([baseRuleParams, newTermsSpecificRuleParams]);
exports.newTermsRuleParams = newTermsRuleParams;
const typeSpecificRuleParams = t.union([eqlSpecificRuleParams, threatSpecificRuleParams, querySpecificRuleParams, savedQuerySpecificRuleParams, thresholdSpecificRuleParams, machineLearningSpecificRuleParams, newTermsSpecificRuleParams]);
exports.typeSpecificRuleParams = typeSpecificRuleParams;
const ruleParams = t.intersection([baseRuleParams, typeSpecificRuleParams]);
exports.ruleParams = ruleParams;
const notifyWhen = t.union([t.literal('onActionGroupChange'), t.literal('onActiveAlert'), t.literal('onThrottleInterval'), t.null]);
exports.notifyWhen = notifyWhen;
const allRuleTypes = t.union([t.literal(_securitysolutionRules.SIGNALS_ID), t.literal(_securitysolutionRules.EQL_RULE_TYPE_ID), t.literal(_securitysolutionRules.INDICATOR_RULE_TYPE_ID), t.literal(_securitysolutionRules.ML_RULE_TYPE_ID), t.literal(_securitysolutionRules.QUERY_RULE_TYPE_ID), t.literal(_securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID), t.literal(_securitysolutionRules.THRESHOLD_RULE_TYPE_ID), t.literal(_securitysolutionRules.NEW_TERMS_RULE_TYPE_ID)]);
exports.allRuleTypes = allRuleTypes;
const internalRuleCreateRequired = t.type({
  name: _rule_schema.RuleName,
  tags: _rule_schema.RuleTagArray,
  alertTypeId: allRuleTypes,
  consumer: t.literal(_constants.SERVER_APP_ID),
  schedule: t.type({
    interval: t.string
  }),
  enabled: _rule_schema.IsRuleEnabled,
  actions: _securitysolutionIoTsAlertingTypes.RuleActionArrayCamel,
  params: ruleParams
});
const internalRuleCreateOptional = t.partial({
  throttle: t.union([_securitysolutionIoTsAlertingTypes.RuleActionThrottle, t.null]),
  notifyWhen
});
const internalRuleCreate = t.intersection([internalRuleCreateOptional, internalRuleCreateRequired]);
exports.internalRuleCreate = internalRuleCreate;
const internalRuleUpdateRequired = t.type({
  name: _rule_schema.RuleName,
  tags: _rule_schema.RuleTagArray,
  schedule: t.type({
    interval: t.string
  }),
  actions: _securitysolutionIoTsAlertingTypes.RuleActionArrayCamel,
  params: ruleParams
});
const internalRuleUpdateOptional = t.partial({
  throttle: t.union([_securitysolutionIoTsAlertingTypes.RuleActionThrottle, t.null]),
  notifyWhen
});
const internalRuleUpdate = t.intersection([internalRuleUpdateOptional, internalRuleUpdateRequired]);
exports.internalRuleUpdate = internalRuleUpdate;