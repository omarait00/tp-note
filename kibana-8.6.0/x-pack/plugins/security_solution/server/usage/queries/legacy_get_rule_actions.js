"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetRuleActions = void 0;
var _rule_actions_legacy = require("../../lib/detection_engine/rule_actions_legacy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * Returns the legacy rule actions
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove "legacyRuleActions" code including this function
 */
const legacyGetRuleActions = async ({
  savedObjectsClient,
  maxSize,
  maxPerPage,
  logger
}) => {
  const query = {
    type: _rule_actions_legacy.legacyRuleActionsSavedObjectType,
    perPage: maxPerPage,
    namespaces: ['*']
  };
  logger.debug(`Getting legacy rule actions with point in time (PIT) query:', ${JSON.stringify(query)}`);
  const finder = savedObjectsClient.createPointInTimeFinder(query);
  let responses = [];
  for await (const response of finder.find()) {
    const extra = responses.length + response.saved_objects.length - maxSize;
    if (extra > 0) {
      responses = [...responses, ...response.saved_objects.slice(-response.saved_objects.length, -extra)];
    } else {
      responses = [...responses, ...response.saved_objects];
    }
  }
  try {
    finder.close();
  } catch (exception) {
    // This is just a pre-caution in case the finder does a throw we don't want to blow up
    // the response. We have seen this within e2e test containers but nothing happen in normal
    // operational conditions which is why this try/catch is here.
  }
  logger.debug(`Returning legacy rule actions response of length: "${responses.length}"`);
  return responses;
};
exports.legacyGetRuleActions = legacyGetRuleActions;