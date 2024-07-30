"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorSchema = void 0;
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
var t = _interopRequireWildcard(require("io-ts"));
var _rule_schema = require("../../rule_schema");
var _schemas = require("../common/schemas");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// We use id: t.string intentionally and _never_ the id from global schemas as
// sometimes echo back out the id that the user gave us and it is not guaranteed
// to be a UUID but rather just a string
const partial = t.exact(t.partial({
  id: t.string,
  rule_id: _rule_schema.RuleSignatureId,
  list_id: _securitysolutionIoTsTypes.NonEmptyString,
  item_id: _securitysolutionIoTsTypes.NonEmptyString
}));
const required = t.exact(t.type({
  error: t.type({
    status_code: _schemas.status_code,
    message: _schemas.message
  })
}));
const errorSchema = t.intersection([partial, required]);
exports.errorSchema = errorSchema;