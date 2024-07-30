"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyGetBulkRuleActionsSavedObject = void 0;
var _lodash = require("lodash");
var _legacy_saved_object_mappings = require("./legacy_saved_object_mappings");
var _legacy_utils = require("./legacy_utils");
var _promise_pool = require("../../../../../utils/promise_pool");
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
const legacyGetBulkRuleActionsSavedObject = async ({
  alertIds,
  savedObjectsClient,
  logger
}) => {
  const references = alertIds.map(alertId => ({
    id: alertId,
    type: 'alert'
  }));
  const {
    results,
    errors
  } = await (0, _promise_pool.initPromisePool)({
    concurrency: 1,
    items: (0, _lodash.chunk)(references, 1000),
    executor: referencesChunk => savedObjectsClient.find({
      type: _legacy_saved_object_mappings.legacyRuleActionsSavedObjectType,
      perPage: 10000,
      hasReference: referencesChunk
    }).catch(error => {
      logger.error(`Error fetching rule actions: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    })
  });
  if (errors.length) {
    throw new AggregateError(errors, 'Error fetching rule actions');
  }
  const savedObjects = results.flatMap(({
    result
  }) => result.saved_objects);
  return savedObjects.reduce((acc, savedObject) => {
    const ruleAlertId = savedObject.references.find(reference => {
      // Find the first rule alert and assume that is the one we want since we should only ever have 1.
      return reference.type === 'alert';
    });
    // We check to ensure we have found a "ruleAlertId" and hopefully we have.
    const ruleAlertIdKey = ruleAlertId != null ? ruleAlertId.id : undefined;
    if (ruleAlertIdKey != null) {
      acc[ruleAlertIdKey] = (0, _legacy_utils.legacyGetRuleActionsFromSavedObject)(savedObject, logger);
    } else {
      logger.error(`Security Solution notification (Legacy) Was expecting to find a reference of type "alert" within ${savedObject.references} but did not. Skipping this notification.`);
    }
    return acc;
  }, {});
};
exports.legacyGetBulkRuleActionsSavedObject = legacyGetBulkRuleActionsSavedObject;