"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmActionVariables = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const apmActionVariables = {
  alertDetailsUrl: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.alertDetailsUrl', {
      defaultMessage: 'Link to the view within Elastic that shows further details and context surrounding this alert'
    }),
    name: 'alertDetailsUrl'
  },
  environment: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.environment', {
      defaultMessage: 'The transaction type the alert is created for'
    }),
    name: 'environment'
  },
  interval: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.intervalSize', {
      defaultMessage: 'The length and unit of the time period where the alert conditions were met'
    }),
    name: 'interval'
  },
  reason: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.reasonMessage', {
      defaultMessage: 'A concise description of the reason for the alert'
    }),
    name: 'reason'
  },
  serviceName: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.serviceName', {
      defaultMessage: 'The service the alert is created for'
    }),
    name: 'serviceName'
  },
  threshold: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.threshold', {
      defaultMessage: 'Any trigger value above this value will cause the alert to fire'
    }),
    name: 'threshold'
  },
  transactionType: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.transactionType', {
      defaultMessage: 'The transaction type the alert is created for'
    }),
    name: 'transactionType'
  },
  triggerValue: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.triggerValue', {
      defaultMessage: 'The value that breached the threshold and triggered the alert'
    }),
    name: 'triggerValue'
  },
  viewInAppUrl: {
    description: _i18n.i18n.translate('xpack.apm.alerts.action_variables.viewInAppUrl', {
      defaultMessage: 'Link to the view or feature within Elastic that can be used to investigate the alert and its context further'
    }),
    name: 'viewInAppUrl'
  }
};
exports.apmActionVariables = apmActionVariables;