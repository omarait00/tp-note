"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationsEnabledDisabled = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNotificationsEnabledDisabled = detectionRuleMetric => {
  return {
    legacyNotificationEnabled: detectionRuleMetric.has_legacy_notification && detectionRuleMetric.enabled,
    legacyNotificationDisabled: detectionRuleMetric.has_legacy_notification && !detectionRuleMetric.enabled,
    notificationEnabled: detectionRuleMetric.has_notification && detectionRuleMetric.enabled,
    notificationDisabled: detectionRuleMetric.has_notification && !detectionRuleMetric.enabled
  };
};
exports.getNotificationsEnabledDisabled = getNotificationsEnabledDisabled;