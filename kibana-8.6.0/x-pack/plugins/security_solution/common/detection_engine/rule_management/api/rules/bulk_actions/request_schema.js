"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThrottleForBulkActions = exports.PerformBulkActionRequestQuery = exports.PerformBulkActionRequestBody = exports.BulkActionType = exports.BulkActionEditType = exports.BulkActionEditPayloadRuleActions = exports.BulkActionEditPayload = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _securitysolutionIoTsAlertingTypes = require("@kbn/securitysolution-io-ts-alerting-types");
var _rule_schema = require("../../../../rule_schema");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let BulkActionType;
exports.BulkActionType = BulkActionType;
(function (BulkActionType) {
  BulkActionType["enable"] = "enable";
  BulkActionType["disable"] = "disable";
  BulkActionType["export"] = "export";
  BulkActionType["delete"] = "delete";
  BulkActionType["duplicate"] = "duplicate";
  BulkActionType["edit"] = "edit";
})(BulkActionType || (exports.BulkActionType = BulkActionType = {}));
let BulkActionEditType;
exports.BulkActionEditType = BulkActionEditType;
(function (BulkActionEditType) {
  BulkActionEditType["add_tags"] = "add_tags";
  BulkActionEditType["delete_tags"] = "delete_tags";
  BulkActionEditType["set_tags"] = "set_tags";
  BulkActionEditType["add_index_patterns"] = "add_index_patterns";
  BulkActionEditType["delete_index_patterns"] = "delete_index_patterns";
  BulkActionEditType["set_index_patterns"] = "set_index_patterns";
  BulkActionEditType["set_timeline"] = "set_timeline";
  BulkActionEditType["add_rule_actions"] = "add_rule_actions";
  BulkActionEditType["set_rule_actions"] = "set_rule_actions";
  BulkActionEditType["set_schedule"] = "set_schedule";
})(BulkActionEditType || (exports.BulkActionEditType = BulkActionEditType = {}));
const ThrottleForBulkActions = t.union([t.literal('rule'), (0, _securitysolutionIoTsTypes.TimeDuration)({
  allowedDurations: [[1, 'h'], [1, 'd'], [7, 'd']]
})]);
exports.ThrottleForBulkActions = ThrottleForBulkActions;
const BulkActionEditPayloadTags = t.type({
  type: t.union([t.literal(BulkActionEditType.add_tags), t.literal(BulkActionEditType.delete_tags), t.literal(BulkActionEditType.set_tags)]),
  value: _rule_schema.RuleTagArray
});
const BulkActionEditPayloadIndexPatterns = t.intersection([t.type({
  type: t.union([t.literal(BulkActionEditType.add_index_patterns), t.literal(BulkActionEditType.delete_index_patterns), t.literal(BulkActionEditType.set_index_patterns)]),
  value: _rule_schema.IndexPatternArray
}), t.exact(t.partial({
  overwrite_data_views: t.boolean
}))]);
const BulkActionEditPayloadTimeline = t.type({
  type: t.literal(BulkActionEditType.set_timeline),
  value: t.type({
    timeline_id: _rule_schema.TimelineTemplateId,
    timeline_title: _rule_schema.TimelineTemplateTitle
  })
});

/**
 * per rulesClient.bulkEdit rules actions operation contract (x-pack/plugins/alerting/server/rules_client/rules_client.ts)
 * normalized rule action object is expected (NormalizedAlertAction) as value for the edit operation
 */

const NormalizedRuleAction = t.exact(t.type({
  group: _securitysolutionIoTsAlertingTypes.RuleActionGroup,
  id: _securitysolutionIoTsAlertingTypes.RuleActionId,
  params: _securitysolutionIoTsAlertingTypes.RuleActionParams
}));
const BulkActionEditPayloadRuleActions = t.type({
  type: t.union([t.literal(BulkActionEditType.add_rule_actions), t.literal(BulkActionEditType.set_rule_actions)]),
  value: t.type({
    throttle: ThrottleForBulkActions,
    actions: t.array(NormalizedRuleAction)
  })
});
exports.BulkActionEditPayloadRuleActions = BulkActionEditPayloadRuleActions;
const BulkActionEditPayloadSchedule = t.type({
  type: t.literal(BulkActionEditType.set_schedule),
  value: t.type({
    interval: (0, _securitysolutionIoTsTypes.TimeDuration)({
      allowedUnits: ['s', 'm', 'h']
    }),
    lookback: (0, _securitysolutionIoTsTypes.TimeDuration)({
      allowedUnits: ['s', 'm', 'h']
    })
  })
});
const BulkActionEditPayload = t.union([BulkActionEditPayloadTags, BulkActionEditPayloadIndexPatterns, BulkActionEditPayloadTimeline, BulkActionEditPayloadRuleActions, BulkActionEditPayloadSchedule]);
exports.BulkActionEditPayload = BulkActionEditPayload;
const bulkActionDuplicatePayload = t.exact(t.type({
  include_exceptions: t.boolean
}));
const PerformBulkActionRequestBody = t.intersection([t.exact(t.type({
  query: t.union([_rule_schema.RuleQuery, t.undefined])
})), t.exact(t.partial({
  ids: (0, _securitysolutionIoTsTypes.NonEmptyArray)(t.string)
})), t.union([t.exact(t.type({
  action: t.union([t.literal(BulkActionType.delete), t.literal(BulkActionType.disable), t.literal(BulkActionType.enable), t.literal(BulkActionType.export)])
})), t.intersection([t.exact(t.type({
  action: t.literal(BulkActionType.duplicate)
})), t.exact(t.partial({
  [BulkActionType.duplicate]: bulkActionDuplicatePayload
}))]), t.exact(t.type({
  action: t.literal(BulkActionType.edit),
  [BulkActionType.edit]: (0, _securitysolutionIoTsTypes.NonEmptyArray)(BulkActionEditPayload)
}))])]);

/**
 * Query string parameters of the API route.
 */
exports.PerformBulkActionRequestBody = PerformBulkActionRequestBody;
const PerformBulkActionRequestQuery = t.exact(t.partial({
  dry_run: t.union([t.literal('true'), t.literal('false')])
}));
exports.PerformBulkActionRequestQuery = PerformBulkActionRequestQuery;