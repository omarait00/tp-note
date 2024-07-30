"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateRule = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _i18n = require("@kbn/i18n");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DUPLICATE_TITLE = _i18n.i18n.translate('xpack.securitySolution.detectionEngine.rules.cloneRule.duplicateTitle', {
  defaultMessage: 'Duplicate'
});
const duplicateRule = async ({
  rule
}) => {
  // Generate a new static ruleId
  const ruleId = _uuid.default.v4();

  // If it's a prebuilt rule, reset Related Integrations, Required Fields and Setup Guide.
  // We do this because for now we don't allow the users to edit these fields for custom rules.
  const isPrebuilt = rule.params.immutable;
  const relatedIntegrations = isPrebuilt ? [] : rule.params.relatedIntegrations;
  const requiredFields = isPrebuilt ? [] : rule.params.requiredFields;
  const setup = isPrebuilt ? '' : rule.params.setup;
  return {
    name: `${rule.name} [${DUPLICATE_TITLE}]`,
    tags: rule.tags,
    alertTypeId: _securitysolutionRules.ruleTypeMappings[rule.params.type],
    consumer: _constants.SERVER_APP_ID,
    params: {
      ...rule.params,
      immutable: false,
      ruleId,
      relatedIntegrations,
      requiredFields,
      setup,
      exceptionsList: []
    },
    schedule: rule.schedule,
    enabled: false,
    actions: rule.actions,
    throttle: null,
    notifyWhen: null
  };
};
exports.duplicateRule = duplicateRule;