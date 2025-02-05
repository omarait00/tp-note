"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTotalUsage = void 0;
var _get_notifications_enabled_disabled = require("./get_notifications_enabled_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateTotalUsage = ({
  detectionRuleMetric,
  updatedUsage,
  totalType
}) => {
  const {
    legacyNotificationEnabled,
    legacyNotificationDisabled,
    notificationEnabled,
    notificationDisabled
  } = (0, _get_notifications_enabled_disabled.getNotificationsEnabledDisabled)(detectionRuleMetric);
  return {
    enabled: detectionRuleMetric.enabled ? updatedUsage[totalType].enabled + 1 : updatedUsage[totalType].enabled,
    disabled: !detectionRuleMetric.enabled ? updatedUsage[totalType].disabled + 1 : updatedUsage[totalType].disabled,
    alerts: updatedUsage[totalType].alerts + detectionRuleMetric.alert_count_daily,
    cases: updatedUsage[totalType].cases + detectionRuleMetric.cases_count_total,
    legacy_notifications_enabled: legacyNotificationEnabled ? updatedUsage[totalType].legacy_notifications_enabled + 1 : updatedUsage[totalType].legacy_notifications_enabled,
    legacy_notifications_disabled: legacyNotificationDisabled ? updatedUsage[totalType].legacy_notifications_disabled + 1 : updatedUsage[totalType].legacy_notifications_disabled,
    notifications_enabled: notificationEnabled ? updatedUsage[totalType].notifications_enabled + 1 : updatedUsage[totalType].notifications_enabled,
    notifications_disabled: notificationDisabled ? updatedUsage[totalType].notifications_disabled + 1 : updatedUsage[totalType].notifications_disabled
  };
};
exports.updateTotalUsage = updateTotalUsage;