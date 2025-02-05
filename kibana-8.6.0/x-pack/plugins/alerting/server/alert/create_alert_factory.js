"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertFactory = createAlertFactory;
exports.getPublicAlertFactory = getPublicAlertFactory;
var _lodash = require("lodash");
var _alert = require("./alert");
var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createAlertFactory({
  alerts,
  logger,
  maxAlerts,
  canSetRecoveryContext = false
}) {
  // Keep track of which alerts we started with so we can determine which have recovered
  const originalAlerts = (0, _lodash.cloneDeep)(alerts);

  // Number of alerts reported
  let numAlertsCreated = 0;

  // Whether the number of alerts reported has reached max allowed
  let hasReachedAlertLimit = false;

  // Whether rule type has asked for the alert limit
  let hasRequestedAlertLimit = false;

  // Whether rule type has reported back if alert limit was reached
  let hasReportedLimitReached = false;
  let isDone = false;
  return {
    create: id => {
      if (isDone) {
        throw new Error(`Can't create new alerts after calling done() in AlertsFactory.`);
      }
      if (numAlertsCreated++ >= maxAlerts) {
        hasReachedAlertLimit = true;
        throw new Error(`Rule reported more than ${maxAlerts} alerts.`);
      }
      if (!alerts[id]) {
        alerts[id] = new _alert.Alert(id);
      }
      return alerts[id];
    },
    // namespace alert limit services for rule type executors to use
    alertLimit: {
      getValue: () => {
        hasRequestedAlertLimit = true;
        return maxAlerts;
      },
      setLimitReached: reached => {
        hasReportedLimitReached = true;
        hasReachedAlertLimit = reached;
      },
      checkLimitUsage: () => {
        // If the rule type has requested the value but never reported back, throw an error
        if (hasRequestedAlertLimit && !hasReportedLimitReached) {
          throw new Error(`Rule has not reported whether alert limit has been reached after requesting limit value!`);
        }
      }
    },
    hasReachedAlertLimit: () => hasReachedAlertLimit,
    done: () => {
      isDone = true;
      return {
        getRecoveredAlerts: () => {
          if (!canSetRecoveryContext) {
            logger.debug(`Set doesSetRecoveryContext to true on rule type to get access to recovered alerts.`);
            return [];
          }
          const {
            recoveredAlerts
          } = (0, _lib.processAlerts)({
            alerts,
            existingAlerts: originalAlerts,
            hasReachedAlertLimit,
            alertLimit: maxAlerts
          });
          return Object.keys(recoveredAlerts !== null && recoveredAlerts !== void 0 ? recoveredAlerts : {}).map(alertId => recoveredAlerts[alertId]);
        }
      };
    }
  };
}
function getPublicAlertFactory(alertFactory) {
  return {
    create: (...args) => alertFactory.create(...args),
    alertLimit: {
      getValue: () => alertFactory.alertLimit.getValue(),
      setLimitReached: (...args) => alertFactory.alertLimit.setLimitReached(...args)
    },
    done: () => alertFactory.done()
  };
}