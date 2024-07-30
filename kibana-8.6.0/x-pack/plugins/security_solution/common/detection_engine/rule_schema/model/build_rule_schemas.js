"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRuleSchemas = exports.buildResponseRuleSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildRuleSchemas = fields => {
  return {
    create: buildCreateRuleSchema(fields.required, fields.optional, fields.defaultable),
    patch: buildPatchRuleSchema(fields.required, fields.optional, fields.defaultable),
    response: buildResponseRuleSchema(fields.required, fields.optional, fields.defaultable)
  };
};
exports.buildRuleSchemas = buildRuleSchemas;
const buildCreateRuleSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields)), t.exact(t.partial(defaultableFields))]);
};
const buildPatchRuleSchema = (requiredFields, optionalFields, defaultableFields) => {
  return t.intersection([t.partial(requiredFields), t.partial(optionalFields), t.partial(defaultableFields)]);
};
const buildResponseRuleSchema = (requiredFields, optionalFields, defaultableFields) => {
  // This bit of logic is to force all fields to be accounted for in conversions from the internal
  // rule schema to the response schema. Rather than use `t.partial`, which makes each field optional,
  // we make each field required but possibly undefined. The result is that if a field is forgotten in
  // the conversion from internal schema to response schema TS will report an error. If we just used t.partial
  // instead, then optional fields can be accidentally omitted from the conversion - and any actual values
  // in those fields internally will be stripped in the response.
  const optionalWithUndefined = Object.keys(optionalFields).reduce((acc, key) => {
    acc[key] = t.union([optionalFields[key], t.undefined]);
    return acc;
  }, {});
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.type(optionalWithUndefined)), t.exact(t.type(defaultableFields))]);
};
exports.buildResponseRuleSchema = buildResponseRuleSchema;