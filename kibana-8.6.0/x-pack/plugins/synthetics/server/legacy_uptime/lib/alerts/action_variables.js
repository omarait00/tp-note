"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VIEW_IN_APP_URL = exports.MONITOR_WITH_GEO = exports.MESSAGE = exports.ALERT_REASON_MSG = exports.ALERT_DETAILS_URL = exports.ACTION_VARIABLES = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MESSAGE = 'message';
exports.MESSAGE = MESSAGE;
const MONITOR_WITH_GEO = 'downMonitorsWithGeo';
exports.MONITOR_WITH_GEO = MONITOR_WITH_GEO;
const ALERT_REASON_MSG = 'reason';
exports.ALERT_REASON_MSG = ALERT_REASON_MSG;
const ALERT_DETAILS_URL = 'alertDetailsUrl';
exports.ALERT_DETAILS_URL = ALERT_DETAILS_URL;
const VIEW_IN_APP_URL = 'viewInAppUrl';
exports.VIEW_IN_APP_URL = VIEW_IN_APP_URL;
const ACTION_VARIABLES = {
  [MESSAGE]: {
    name: MESSAGE,
    description: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus.actionVariables.context.message.description', {
      defaultMessage: 'A generated message summarizing the currently down monitors'
    })
  },
  [MONITOR_WITH_GEO]: {
    name: MONITOR_WITH_GEO,
    description: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus.actionVariables.context.downMonitorsWithGeo.description', {
      defaultMessage: 'A generated summary that shows some or all of the monitors detected as "down" by the alert'
    })
  },
  [ALERT_REASON_MSG]: {
    name: ALERT_REASON_MSG,
    description: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus.actionVariables.context.alertReasonMessage.description', {
      defaultMessage: 'A concise description of the reason for the alert'
    })
  },
  [ALERT_DETAILS_URL]: {
    name: ALERT_DETAILS_URL,
    description: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus.actionVariables.context.alertDetailUrl.description', {
      defaultMessage: 'Link to the view within Elastic that shows further details and context surrounding this alert'
    })
  },
  [VIEW_IN_APP_URL]: {
    name: VIEW_IN_APP_URL,
    description: _i18n.i18n.translate('xpack.synthetics.alerts.monitorStatus.actionVariables.context.viewInAppUrl.description', {
      defaultMessage: 'Link to the view or feature within Elastic that can be used to investigate the alert and its context further'
    })
  }
};
exports.ACTION_VARIABLES = ACTION_VARIABLES;