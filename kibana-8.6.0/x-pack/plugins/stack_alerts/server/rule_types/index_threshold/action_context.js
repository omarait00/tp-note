"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMessages = addMessages;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_TITLE = (name, group) => _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeContextSubjectTitle', {
  defaultMessage: 'alert {name} group {group} met threshold',
  values: {
    name,
    group
  }
});
const RECOVERY_TITLE = (name, group) => _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeRecoveryContextSubjectTitle', {
  defaultMessage: 'alert {name} group {group} recovered',
  values: {
    name,
    group
  }
});
const DEFAULT_MESSAGE = (name, context, window) => _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeContextMessageDescription', {
  defaultMessage: `alert '{name}' is active for group '{group}':

- Value: {value}
- Conditions Met: {conditions} over {window}
- Timestamp: {date}`,
  values: {
    name,
    group: context.group,
    value: context.value,
    conditions: context.conditions,
    window,
    date: context.date
  }
});
const RECOVERY_MESSAGE = (name, context, window) => _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeRecoveryContextMessageDescription', {
  defaultMessage: `alert '{name}' is recovered for group '{group}':

- Value: {value}
- Conditions Met: {conditions} over {window}
- Timestamp: {date}`,
  values: {
    name,
    group: context.group,
    value: context.value,
    conditions: context.conditions,
    window,
    date: context.date
  }
});
function addMessages(ruleName, baseContext, params, isRecoveryMessage) {
  const title = isRecoveryMessage ? RECOVERY_TITLE(ruleName, baseContext.group) : DEFAULT_TITLE(ruleName, baseContext.group);
  const window = `${params.timeWindowSize}${params.timeWindowUnit}`;
  const message = isRecoveryMessage ? RECOVERY_MESSAGE(ruleName, baseContext, window) : DEFAULT_MESSAGE(ruleName, baseContext, window);
  return {
    ...baseContext,
    title,
    message
  };
}