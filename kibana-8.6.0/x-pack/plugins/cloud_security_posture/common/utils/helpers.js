"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truthy = exports.isNonNullable = exports.extractErrorMessage = exports.createCspRuleSearchFilterByPackagePolicy = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @example
 * declare const foo: Array<string | undefined | null>
 * foo.filter(isNonNullable) // foo is Array<string>
 */
const isNonNullable = v => v !== null && v !== undefined;
exports.isNonNullable = isNonNullable;
const truthy = value => !!value;
exports.truthy = truthy;
const extractErrorMessage = (e, defaultMessage = 'Unknown Error') => {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  return defaultMessage; // TODO: i18n
};
exports.extractErrorMessage = extractErrorMessage;
const createCspRuleSearchFilterByPackagePolicy = ({
  packagePolicyId,
  policyId
}) => `${_constants.CSP_RULE_SAVED_OBJECT_TYPE}.attributes.package_policy_id: "${packagePolicyId}"${policyId ? ` AND ${_constants.CSP_RULE_SAVED_OBJECT_TYPE}.attributes.policy_id: "${policyId}"` : ''}`;
exports.createCspRuleSearchFilterByPackagePolicy = createCspRuleSearchFilterByPackagePolicy;