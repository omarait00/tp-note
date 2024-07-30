"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rulesReferencedByExceptionListsSchema = exports.rulesReferencedByExceptionListSchema = exports.ruleReferenceRuleInfoSchema = exports.exceptionListRuleReferencesSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _rule_schema = require("../../../rule_schema");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ruleReferenceRuleInfoSchema = t.exact(t.type({
  name: _rule_schema.RuleName,
  id: _rule_schema.RuleObjectId,
  rule_id: _rule_schema.RuleSignatureId,
  exception_lists: _securitysolutionIoTsListTypes.listArray
}));
exports.ruleReferenceRuleInfoSchema = ruleReferenceRuleInfoSchema;
const exceptionListRuleReferencesSchema = t.intersection([_securitysolutionIoTsListTypes.exceptionListSchema, t.exact(t.type({
  referenced_rules: t.array(ruleReferenceRuleInfoSchema)
}))]);
exports.exceptionListRuleReferencesSchema = exceptionListRuleReferencesSchema;
const rulesReferencedByExceptionListSchema = t.record(_securitysolutionIoTsListTypes.list_id, exceptionListRuleReferencesSchema);
exports.rulesReferencedByExceptionListSchema = rulesReferencedByExceptionListSchema;
const rulesReferencedByExceptionListsSchema = t.exact(t.type({
  references: t.array(rulesReferencedByExceptionListSchema)
}));
exports.rulesReferencedByExceptionListsSchema = rulesReferencedByExceptionListsSchema;