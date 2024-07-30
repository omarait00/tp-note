"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleToImport = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var _rule_schema = require("../../../rule_schema");
var _common = require("../../../schemas/common");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RuleToImport = t.intersection([_rule_schema.BaseCreateProps, _rule_schema.TypeSpecificCreateProps, t.exact(t.type({
  rule_id: _rule_schema.RuleSignatureId
})), t.exact(t.partial({
  id: _rule_schema.RuleObjectId,
  immutable: _securitysolutionIoTsTypes.OnlyFalseAllowed,
  updated_at: _common.updated_at,
  updated_by: _common.updated_by,
  created_at: _common.created_at,
  created_by: _common.created_by,
  related_integrations: _rule_schema.RelatedIntegrationArray,
  required_fields: _rule_schema.RequiredFieldArray,
  setup: _rule_schema.SetupGuide
}))]);
exports.RuleToImport = RuleToImport;