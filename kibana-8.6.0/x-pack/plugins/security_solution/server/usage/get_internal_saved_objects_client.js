"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalSavedObjectsClient = getInternalSavedObjectsClient;
var _constants = require("../../../cases/common/constants");
var _rule_actions_legacy = require("../lib/detection_engine/rule_actions_legacy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

async function getInternalSavedObjectsClient(core) {
  return core.getStartServices().then(async ([coreStart]) => {
    // note: we include the "cases" and "alert" hidden types here otherwise we would not be able to query them. If at some point cases and alert is not considered a hidden type this can be removed
    return coreStart.savedObjects.createInternalRepository(['alert', _rule_actions_legacy.legacyRuleActionsSavedObjectType, ..._constants.SAVED_OBJECT_TYPES]);
  });
}