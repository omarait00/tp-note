"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDecryptedAttributes = getDecryptedAttributes;
exports.getFakeKibanaRequest = getFakeKibanaRequest;
exports.loadRule = loadRule;
var _server = require("../../../spaces/server");
var _server2 = require("../../../../../src/core/server");
var _lib = require("../lib");
var _types = require("../types");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function loadRule(params) {
  const {
    paramValidator,
    ruleId,
    spaceId,
    context,
    ruleTypeRegistry,
    alertingEventLogger
  } = params;
  let enabled;
  let apiKey;
  try {
    const decryptedAttributes = await getDecryptedAttributes(context, ruleId, spaceId);
    apiKey = decryptedAttributes.apiKey;
    enabled = decryptedAttributes.enabled;
  } catch (err) {
    throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.Decrypt, err);
  }
  if (!enabled) {
    throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.Disabled, new Error(`Rule failed to execute because rule ran after it was disabled.`));
  }
  const fakeRequest = getFakeKibanaRequest(context, spaceId, apiKey);
  const rulesClient = context.getRulesClientWithRequest(fakeRequest);
  let rule;

  // Ensure API key is still valid and user has access
  try {
    rule = await rulesClient.get({
      id: ruleId
    });
  } catch (err) {
    throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.Read, err);
  }
  alertingEventLogger.setRuleName(rule.name);
  try {
    ruleTypeRegistry.ensureRuleTypeEnabled(rule.alertTypeId);
  } catch (err) {
    throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.License, err);
  }
  let validatedParams;
  try {
    validatedParams = (0, _lib.validateRuleTypeParams)(rule.params, paramValidator);
  } catch (err) {
    throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.Validate, err);
  }
  if (rule.monitoring) {
    if (rule.monitoring.run.history.length >= _common.MONITORING_HISTORY_LIMIT) {
      // Remove the first (oldest) record
      rule.monitoring.run.history.shift();
    }
  }
  return {
    rule,
    fakeRequest,
    apiKey,
    rulesClient,
    validatedParams
  };
}
async function getDecryptedAttributes(context, ruleId, spaceId) {
  const namespace = context.spaceIdToNamespace(spaceId);

  // Only fetch encrypted attributes here, we'll create a saved objects client
  // scoped with the API key to fetch the remaining data.
  const {
    attributes: {
      apiKey,
      enabled,
      consumer
    }
  } = await context.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', ruleId, {
    namespace
  });
  return {
    apiKey,
    enabled,
    consumer
  };
}
function getFakeKibanaRequest(context, spaceId, apiKey) {
  const requestHeaders = {};
  if (apiKey) {
    requestHeaders.authorization = `ApiKey ${apiKey}`;
  }
  const path = (0, _server.addSpaceIdToPath)('/', spaceId);
  const fakeRequest = _server2.CoreKibanaRequest.from({
    headers: requestHeaders,
    path: '/',
    route: {
      settings: {}
    },
    url: {
      href: '/'
    },
    raw: {
      req: {
        url: '/'
      }
    }
  });
  context.basePathService.set(fakeRequest, path);
  return fakeRequest;
}