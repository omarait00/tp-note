"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateFactory = void 0;
var _perf_hooks = require("perf_hooks");
var _lodash = require("lodash");
var _utils = require("../../signals/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkCreateFactory = (alertWithPersistence, refreshForBulkCreate, ruleExecutionLogger) => async (wrappedDocs, maxAlerts, enrichAlerts) => {
  if (wrappedDocs.length === 0) {
    return {
      errors: [],
      success: true,
      enrichmentDuration: '0',
      bulkCreateDuration: '0',
      createdItemsCount: 0,
      createdItems: [],
      alertsWereTruncated: false
    };
  }
  const start = _perf_hooks.performance.now();
  let enrichmentsTimeStart = 0;
  let enrichmentsTimeFinish = 0;
  let enrichAlertsWrapper;
  if (enrichAlerts) {
    enrichAlertsWrapper = async (alerts, params) => {
      enrichmentsTimeStart = _perf_hooks.performance.now();
      try {
        const enrichedAlerts = await enrichAlerts(alerts, params);
        return enrichedAlerts;
      } catch (error) {
        ruleExecutionLogger.error(`Enrichments failed ${error}`);
        throw error;
      } finally {
        enrichmentsTimeFinish = _perf_hooks.performance.now();
      }
    };
  }
  const {
    createdAlerts,
    errors,
    alertsWereTruncated
  } = await alertWithPersistence(wrappedDocs.map(doc => ({
    _id: doc._id,
    // `fields` should have already been merged into `doc._source`
    _source: doc._source
  })), refreshForBulkCreate, maxAlerts, enrichAlertsWrapper);
  const end = _perf_hooks.performance.now();
  ruleExecutionLogger.debug(`individual bulk process time took: ${(0, _utils.makeFloatString)(end - start)} milliseconds`);
  if (!(0, _lodash.isEmpty)(errors)) {
    ruleExecutionLogger.debug(`[-] bulkResponse had errors with responses of: ${JSON.stringify(errors)}`);
    return {
      errors: Object.keys(errors),
      success: false,
      enrichmentDuration: (0, _utils.makeFloatString)(enrichmentsTimeFinish - enrichmentsTimeStart),
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      createdItemsCount: createdAlerts.length,
      createdItems: createdAlerts,
      alertsWereTruncated
    };
  } else {
    return {
      errors: [],
      success: true,
      bulkCreateDuration: (0, _utils.makeFloatString)(end - start),
      enrichmentDuration: (0, _utils.makeFloatString)(enrichmentsTimeFinish - enrichmentsTimeStart),
      createdItemsCount: createdAlerts.length,
      createdItems: createdAlerts,
      alertsWereTruncated
    };
  }
};
exports.bulkCreateFactory = bulkCreateFactory;