"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportRulesDetailsWithExceptionsSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionIoTsTypes = require("@kbn/securitysolution-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createSchema = (requiredFields, optionalFields) => {
  return t.intersection([t.exact(t.type(requiredFields)), t.exact(t.partial(optionalFields))]);
};
const exportRulesDetails = {
  exported_count: t.number,
  exported_rules_count: t.number,
  missing_rules: t.array(t.exact(t.type({
    rule_id: _securitysolutionIoTsTypes.NonEmptyString
  }))),
  missing_rules_count: t.number
};

// With exceptions
const exportRulesDetailsWithExceptionsSchema = createSchema(exportRulesDetails, _securitysolutionIoTsListTypes.exportExceptionDetails);
exports.exportRulesDetailsWithExceptionsSchema = exportRulesDetailsWithExceptionsSchema;