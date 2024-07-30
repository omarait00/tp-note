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

function addMessages(ruleName, baseContext, params, isRecovered = false) {
  const title = _i18n.i18n.translate('xpack.stackAlerts.esQuery.alertTypeContextSubjectTitle', {
    defaultMessage: `rule '{name}' {verb}`,
    values: {
      name: ruleName,
      verb: isRecovered ? 'recovered' : 'matched query'
    }
  });
  const window = `${params.timeWindowSize}${params.timeWindowUnit}`;
  const message = _i18n.i18n.translate('xpack.stackAlerts.esQuery.alertTypeContextMessageDescription', {
    defaultMessage: `rule '{name}' is {verb}:

- Value: {value}
- Conditions Met: {conditions} over {window}
- Timestamp: {date}
- Link: {link}`,
    values: {
      name: ruleName,
      value: baseContext.value,
      conditions: baseContext.conditions,
      window,
      date: baseContext.date,
      link: baseContext.link,
      verb: isRecovered ? 'recovered' : 'active'
    }
  });
  return {
    ...baseContext,
    title,
    message
  };
}