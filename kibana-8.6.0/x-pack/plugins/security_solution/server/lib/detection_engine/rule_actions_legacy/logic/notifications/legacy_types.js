"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyRulesNotificationParams = exports.legacyIsNotificationAlertExecutor = exports.legacyIsAlertType = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyIsAlertType = partialAlert => {
  return partialAlert.alertTypeId === _constants.LEGACY_NOTIFICATIONS_ID;
};

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyIsAlertType = legacyIsAlertType;
/**
 * This returns true because by default a NotificationAlertTypeDefinition is an AlertType
 * since we are only increasing the strictness of params.
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyIsNotificationAlertExecutor = obj => {
  return true;
};

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyIsNotificationAlertExecutor = legacyIsNotificationAlertExecutor;
/**
 * This is the notification type used within legacy_rules_notification_alert_type for the alert params.
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @see legacy_rules_notification_alert_type
 */
const legacyRulesNotificationParams = _configSchema.schema.object({
  ruleAlertId: _configSchema.schema.string()
});

/**
 * This legacy rules notification type used within legacy_rules_notification_alert_type for the alert params.
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @see legacy_rules_notification_alert_type
 */
exports.legacyRulesNotificationParams = legacyRulesNotificationParams;