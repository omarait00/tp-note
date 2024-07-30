"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewRulesSchema = exports.TypeSpecificResponse = exports.TypeSpecificPatchProps = exports.TypeSpecificCreateProps = exports.ThresholdRuleUpdateProps = exports.ThresholdRulePatchProps = exports.ThresholdRuleCreateProps = exports.ThresholdRule = exports.ThresholdPatchParams = exports.ThreatMatchRuleUpdateProps = exports.ThreatMatchRulePatchProps = exports.ThreatMatchRuleCreateProps = exports.ThreatMatchRule = exports.ThreatMatchPatchParams = exports.SharedResponseProps = exports.SavedQueryRuleUpdateProps = exports.SavedQueryRulePatchProps = exports.SavedQueryRuleCreateProps = exports.SavedQueryRule = exports.SavedQueryPatchParams = exports.RuleUpdateProps = exports.RuleResponse = exports.RulePatchProps = exports.RuleCreateProps = exports.QueryRuleUpdateProps = exports.QueryRulePatchProps = exports.QueryRuleCreateProps = exports.QueryRule = exports.QueryPatchParams = exports.NewTermsRuleUpdateProps = exports.NewTermsRulePatchProps = exports.NewTermsRuleCreateProps = exports.NewTermsRule = exports.NewTermsPatchParams = exports.MachineLearningRuleUpdateProps = exports.MachineLearningRulePatchProps = exports.MachineLearningRuleCreateProps = exports.MachineLearningRule = exports.MachineLearningPatchParams = exports.EqlRuleUpdateProps = exports.EqlRulePatchProps = exports.EqlRuleCreateProps = exports.EqlRule = exports.EqlPatchParams = exports.BaseCreateProps = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
var _rule_monitoring = require("../../rule_monitoring");
var _schemas = require("../../rule_response_actions/schemas");
var _common = require("../../schemas/common");
var _misc_attributes = require("./common_attributes/misc_attributes");
var _field_overrides = require("./common_attributes/field_overrides");
var _saved_objects = require("./common_attributes/saved_objects");
var _related_integrations = require("./common_attributes/related_integrations");
var _required_fields = require("./common_attributes/required_fields");
var _timeline_template = require("./common_attributes/timeline_template");
var _eql_attributes = require("./specific_attributes/eql_attributes");
var _threshold_attributes = require("./specific_attributes/threshold_attributes");
var _new_terms_attributes = require("./specific_attributes/new_terms_attributes");
var _query_attributes = require("./specific_attributes/query_attributes");
var _build_rule_schemas = require("./build_rule_schemas");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// -------------------------------------------------------------------------------------------------
// Base schema

const baseSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    name: _misc_attributes.RuleName,
    description: _misc_attributes.RuleDescription,
    risk_score: _securitysolutionIoTsAlertingTypes.RiskScore,
    severity: _securitysolutionIoTsAlertingTypes.Severity
  },
  optional: {
    // Field overrides
    rule_name_override: _field_overrides.RuleNameOverride,
    timestamp_override: _field_overrides.TimestampOverride,
    timestamp_override_fallback_disabled: _field_overrides.TimestampOverrideFallbackDisabled,
    // Timeline template
    timeline_id: _timeline_template.TimelineTemplateId,
    timeline_title: _timeline_template.TimelineTemplateTitle,
    // Atributes related to SavedObjectsClient.resolve API
    outcome: _saved_objects.SavedObjectResolveOutcome,
    alias_target_id: _saved_objects.SavedObjectResolveAliasTargetId,
    alias_purpose: _saved_objects.SavedObjectResolveAliasPurpose,
    // Misc attributes
    license: _misc_attributes.RuleLicense,
    note: _misc_attributes.InvestigationGuide,
    building_block_type: _misc_attributes.BuildingBlockType,
    output_index: _misc_attributes.AlertsIndex,
    namespace: _misc_attributes.AlertsIndexNamespace,
    meta: _misc_attributes.RuleMetadata
  },
  defaultable: {
    // Main attributes
    version: _misc_attributes.RuleVersion,
    tags: _misc_attributes.RuleTagArray,
    enabled: _misc_attributes.IsRuleEnabled,
    // Field overrides
    risk_score_mapping: _securitysolutionIoTsAlertingTypes.RiskScoreMapping,
    severity_mapping: _securitysolutionIoTsAlertingTypes.SeverityMapping,
    // Rule schedule
    interval: _securitysolutionIoTsAlertingTypes.RuleInterval,
    from: _securitysolutionIoTsAlertingTypes.RuleIntervalFrom,
    to: _securitysolutionIoTsAlertingTypes.RuleIntervalTo,
    // Rule actions
    actions: _securitysolutionIoTsAlertingTypes.RuleActionArray,
    throttle: _securitysolutionIoTsAlertingTypes.RuleActionThrottle,
    // Rule exceptions
    exceptions_list: _misc_attributes.ExceptionListArray,
    // Misc attributes
    author: _misc_attributes.RuleAuthorArray,
    false_positives: _misc_attributes.RuleFalsePositiveArray,
    references: _misc_attributes.RuleReferenceArray,
    // maxSignals not used in ML rules but probably should be used
    max_signals: _misc_attributes.MaxSignals,
    threat: _misc_attributes.ThreatArray
  }
});
const responseRequiredFields = {
  id: _misc_attributes.RuleObjectId,
  rule_id: _misc_attributes.RuleSignatureId,
  immutable: _misc_attributes.IsRuleImmutable,
  updated_at: _common.updated_at,
  updated_by: _common.updated_by,
  created_at: _common.created_at,
  created_by: _common.created_by,
  // NOTE: For now, Related Integrations, Required Fields and Setup Guide are supported for prebuilt
  // rules only. We don't want to allow users to edit these 3 fields via the API. If we added them
  // to baseParams.defaultable, they would become a part of the request schema as optional fields.
  // This is why we add them here, in order to add them only to the response schema.
  related_integrations: _related_integrations.RelatedIntegrationArray,
  required_fields: _required_fields.RequiredFieldArray,
  setup: _misc_attributes.SetupGuide
};
const responseOptionalFields = {
  execution_summary: _rule_monitoring.RuleExecutionSummary
};
const BaseCreateProps = baseSchema.create;

// -------------------------------------------------------------------------------------------------
// Shared schemas

// "Shared" types are the same across all rule types, and built from "baseSchema" above
// with some variations for each route. These intersect with type specific schemas below
// to create the full schema for each route.
exports.BaseCreateProps = BaseCreateProps;
const SharedCreateProps = t.intersection([baseSchema.create, t.exact(t.partial({
  rule_id: _misc_attributes.RuleSignatureId
}))]);
const SharedUpdateProps = t.intersection([baseSchema.create, t.exact(t.partial({
  rule_id: _misc_attributes.RuleSignatureId
})), t.exact(t.partial({
  id: _misc_attributes.RuleObjectId
}))]);
const SharedPatchProps = t.intersection([baseSchema.patch, t.exact(t.partial({
  rule_id: _misc_attributes.RuleSignatureId,
  id: _misc_attributes.RuleObjectId
}))]);
const SharedResponseProps = t.intersection([baseSchema.response, t.exact(t.type(responseRequiredFields)), t.exact(t.partial(responseOptionalFields))]);

// -------------------------------------------------------------------------------------------------
// EQL rule schema
exports.SharedResponseProps = SharedResponseProps;
const eqlSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('eql'),
    language: t.literal('eql'),
    query: _misc_attributes.RuleQuery
  },
  optional: {
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    filters: _misc_attributes.RuleFilterArray,
    timestamp_field: _eql_attributes.TimestampField,
    event_category_override: _eql_attributes.EventCategoryOverride,
    tiebreaker_field: _eql_attributes.TiebreakerField
  },
  defaultable: {}
});
const EqlRule = t.intersection([SharedResponseProps, eqlSchema.response]);
exports.EqlRule = EqlRule;
const EqlRuleCreateProps = t.intersection([SharedCreateProps, eqlSchema.create]);
exports.EqlRuleCreateProps = EqlRuleCreateProps;
const EqlRuleUpdateProps = t.intersection([SharedUpdateProps, eqlSchema.create]);
exports.EqlRuleUpdateProps = EqlRuleUpdateProps;
const EqlRulePatchProps = t.intersection([SharedPatchProps, eqlSchema.patch]);
exports.EqlRulePatchProps = EqlRulePatchProps;
const EqlPatchParams = eqlSchema.patch;

// -------------------------------------------------------------------------------------------------
// Indicator Match rule schema
exports.EqlPatchParams = EqlPatchParams;
const threatMatchSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('threat_match'),
    query: _misc_attributes.RuleQuery,
    threat_query: _securitysolutionIoTsAlertingTypes.threat_query,
    threat_mapping: _securitysolutionIoTsAlertingTypes.threat_mapping,
    threat_index: _securitysolutionIoTsAlertingTypes.threat_index
  },
  optional: {
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    filters: _misc_attributes.RuleFilterArray,
    saved_id: _common.saved_id,
    threat_filters: _securitysolutionIoTsAlertingTypes.threat_filters,
    threat_indicator_path: _securitysolutionIoTsAlertingTypes.threat_indicator_path,
    threat_language: t.keyof({
      kuery: null,
      lucene: null
    }),
    concurrent_searches: _securitysolutionIoTsAlertingTypes.concurrent_searches,
    items_per_search: _securitysolutionIoTsAlertingTypes.items_per_search
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
});
const ThreatMatchRule = t.intersection([SharedResponseProps, threatMatchSchema.response]);
exports.ThreatMatchRule = ThreatMatchRule;
const ThreatMatchRuleCreateProps = t.intersection([SharedCreateProps, threatMatchSchema.create]);
exports.ThreatMatchRuleCreateProps = ThreatMatchRuleCreateProps;
const ThreatMatchRuleUpdateProps = t.intersection([SharedUpdateProps, threatMatchSchema.create]);
exports.ThreatMatchRuleUpdateProps = ThreatMatchRuleUpdateProps;
const ThreatMatchRulePatchProps = t.intersection([SharedPatchProps, threatMatchSchema.patch]);
exports.ThreatMatchRulePatchProps = ThreatMatchRulePatchProps;
const ThreatMatchPatchParams = threatMatchSchema.patch;

// -------------------------------------------------------------------------------------------------
// Custom Query rule schema
exports.ThreatMatchPatchParams = ThreatMatchPatchParams;
const querySchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('query')
  },
  optional: {
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    filters: _misc_attributes.RuleFilterArray,
    saved_id: _common.saved_id,
    response_actions: _schemas.ResponseActionArray,
    alert_suppression: _query_attributes.AlertSuppression
  },
  defaultable: {
    query: _misc_attributes.RuleQuery,
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
});
const QueryRule = t.intersection([SharedResponseProps, querySchema.response]);
exports.QueryRule = QueryRule;
const QueryRuleCreateProps = t.intersection([SharedCreateProps, querySchema.create]);
exports.QueryRuleCreateProps = QueryRuleCreateProps;
const QueryRuleUpdateProps = t.intersection([SharedUpdateProps, querySchema.create]);
exports.QueryRuleUpdateProps = QueryRuleUpdateProps;
const QueryRulePatchProps = t.intersection([SharedPatchProps, querySchema.patch]);
exports.QueryRulePatchProps = QueryRulePatchProps;
const QueryPatchParams = querySchema.patch;

// -------------------------------------------------------------------------------------------------
// Saved Query rule schema
exports.QueryPatchParams = QueryPatchParams;
const savedQuerySchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('saved_query'),
    saved_id: _common.saved_id
  },
  optional: {
    // Having language, query, and filters possibly defined adds more code confusion and probably user confusion
    // if the saved object gets deleted for some reason
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    query: _misc_attributes.RuleQuery,
    filters: _misc_attributes.RuleFilterArray,
    response_actions: _schemas.ResponseActionArray,
    alert_suppression: _query_attributes.AlertSuppression
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
});
const SavedQueryRule = t.intersection([SharedResponseProps, savedQuerySchema.response]);
exports.SavedQueryRule = SavedQueryRule;
const SavedQueryRuleCreateProps = t.intersection([SharedCreateProps, savedQuerySchema.create]);
exports.SavedQueryRuleCreateProps = SavedQueryRuleCreateProps;
const SavedQueryRuleUpdateProps = t.intersection([SharedUpdateProps, savedQuerySchema.create]);
exports.SavedQueryRuleUpdateProps = SavedQueryRuleUpdateProps;
const SavedQueryRulePatchProps = t.intersection([SharedPatchProps, savedQuerySchema.patch]);
exports.SavedQueryRulePatchProps = SavedQueryRulePatchProps;
const SavedQueryPatchParams = savedQuerySchema.patch;

// -------------------------------------------------------------------------------------------------
// Threshold rule schema
exports.SavedQueryPatchParams = SavedQueryPatchParams;
const thresholdSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('threshold'),
    query: _misc_attributes.RuleQuery,
    threshold: _threshold_attributes.Threshold
  },
  optional: {
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    filters: _misc_attributes.RuleFilterArray,
    saved_id: _common.saved_id
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
});
const ThresholdRule = t.intersection([SharedResponseProps, thresholdSchema.response]);
exports.ThresholdRule = ThresholdRule;
const ThresholdRuleCreateProps = t.intersection([SharedCreateProps, thresholdSchema.create]);
exports.ThresholdRuleCreateProps = ThresholdRuleCreateProps;
const ThresholdRuleUpdateProps = t.intersection([SharedUpdateProps, thresholdSchema.create]);
exports.ThresholdRuleUpdateProps = ThresholdRuleUpdateProps;
const ThresholdRulePatchProps = t.intersection([SharedPatchProps, thresholdSchema.patch]);
exports.ThresholdRulePatchProps = ThresholdRulePatchProps;
const ThresholdPatchParams = thresholdSchema.patch;

// -------------------------------------------------------------------------------------------------
// Machine Learning rule schema
exports.ThresholdPatchParams = ThresholdPatchParams;
const machineLearningSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('machine_learning'),
    anomaly_threshold: _common.anomaly_threshold,
    machine_learning_job_id: _securitysolutionIoTsAlertingTypes.machine_learning_job_id
  },
  optional: {},
  defaultable: {}
});
const MachineLearningRule = t.intersection([SharedResponseProps, machineLearningSchema.response]);
exports.MachineLearningRule = MachineLearningRule;
const MachineLearningRuleCreateProps = t.intersection([SharedCreateProps, machineLearningSchema.create]);
exports.MachineLearningRuleCreateProps = MachineLearningRuleCreateProps;
const MachineLearningRuleUpdateProps = t.intersection([SharedUpdateProps, machineLearningSchema.create]);
exports.MachineLearningRuleUpdateProps = MachineLearningRuleUpdateProps;
const MachineLearningRulePatchProps = t.intersection([SharedPatchProps, machineLearningSchema.patch]);
exports.MachineLearningRulePatchProps = MachineLearningRulePatchProps;
const MachineLearningPatchParams = machineLearningSchema.patch;

// -------------------------------------------------------------------------------------------------
// New Terms rule schema
exports.MachineLearningPatchParams = MachineLearningPatchParams;
const newTermsSchema = (0, _build_rule_schemas.buildRuleSchemas)({
  required: {
    type: t.literal('new_terms'),
    query: _misc_attributes.RuleQuery,
    new_terms_fields: _new_terms_attributes.NewTermsFields,
    history_window_start: _new_terms_attributes.HistoryWindowStart
  },
  optional: {
    index: _misc_attributes.IndexPatternArray,
    data_view_id: _misc_attributes.DataViewId,
    filters: _misc_attributes.RuleFilterArray
  },
  defaultable: {
    language: t.keyof({
      kuery: null,
      lucene: null
    })
  }
});
const NewTermsRule = t.intersection([SharedResponseProps, newTermsSchema.response]);
exports.NewTermsRule = NewTermsRule;
const NewTermsRuleCreateProps = t.intersection([SharedCreateProps, newTermsSchema.create]);
exports.NewTermsRuleCreateProps = NewTermsRuleCreateProps;
const NewTermsRuleUpdateProps = t.intersection([SharedUpdateProps, newTermsSchema.create]);
exports.NewTermsRuleUpdateProps = NewTermsRuleUpdateProps;
const NewTermsRulePatchProps = t.intersection([SharedPatchProps, newTermsSchema.patch]);
exports.NewTermsRulePatchProps = NewTermsRulePatchProps;
const NewTermsPatchParams = newTermsSchema.patch;

// -------------------------------------------------------------------------------------------------
// Combined type specific schemas
exports.NewTermsPatchParams = NewTermsPatchParams;
const TypeSpecificCreateProps = t.union([eqlSchema.create, threatMatchSchema.create, querySchema.create, savedQuerySchema.create, thresholdSchema.create, machineLearningSchema.create, newTermsSchema.create]);
exports.TypeSpecificCreateProps = TypeSpecificCreateProps;
const TypeSpecificPatchProps = t.union([eqlSchema.patch, threatMatchSchema.patch, querySchema.patch, savedQuerySchema.patch, thresholdSchema.patch, machineLearningSchema.patch, newTermsSchema.patch]);
exports.TypeSpecificPatchProps = TypeSpecificPatchProps;
const TypeSpecificResponse = t.union([eqlSchema.response, threatMatchSchema.response, querySchema.response, savedQuerySchema.response, thresholdSchema.response, machineLearningSchema.response, newTermsSchema.response]);

// -------------------------------------------------------------------------------------------------
// Final combined schemas
exports.TypeSpecificResponse = TypeSpecificResponse;
const RuleCreateProps = t.intersection([SharedCreateProps, TypeSpecificCreateProps]);
exports.RuleCreateProps = RuleCreateProps;
const RuleUpdateProps = t.intersection([TypeSpecificCreateProps, SharedUpdateProps]);
exports.RuleUpdateProps = RuleUpdateProps;
const RulePatchProps = t.intersection([TypeSpecificPatchProps, SharedPatchProps]);
exports.RulePatchProps = RulePatchProps;
const RuleResponse = t.intersection([SharedResponseProps, TypeSpecificResponse]);

// -------------------------------------------------------------------------------------------------
// Rule preview schemas

// TODO: Move to the rule_preview subdomain
exports.RuleResponse = RuleResponse;
const previewRulesSchema = t.intersection([SharedCreateProps, TypeSpecificCreateProps, t.type({
  invocationCount: t.number,
  timeframeEnd: t.string
})]);
exports.previewRulesSchema = previewRulesSchema;