"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetRuleActionsSavedObject = void 0;
var _legacy_saved_object_mappings = require("./legacy_saved_object_mappings");
var _legacy_utils = require("./legacy_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyGetRuleActionsSavedObject = async ({
  ruleAlertId,
  savedObjectsClient,
  logger
}) => {
  const reference = {
    id: ruleAlertId,
    type: 'alert'
  };
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    saved_objects
  } = await savedObjectsClient.find({
    type: _legacy_saved_object_mappings.legacyRuleActionsSavedObjectType,
    perPage: 1,
    hasReference: reference
  });
  if (!saved_objects[0]) {
    return null;
  } else {
    return (0, _legacy_utils.legacyGetRuleActionsFromSavedObject)(saved_objects[0], logger);
  }
};
exports.legacyGetRuleActionsSavedObject = legacyGetRuleActionsSavedObject;