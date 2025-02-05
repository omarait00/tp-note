"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyCreateNotifications = void 0;
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
const legacyCreateNotifications = async ({
  rulesClient,
  actions,
  enabled,
  ruleAlertId,
  interval,
  name
}) => rulesClient.create({
  data: {
    name,
    tags: [],
    alertTypeId: _constants.LEGACY_NOTIFICATIONS_ID,
    consumer: _constants.SERVER_APP_ID,
    params: {
      ruleAlertId
    },
    schedule: {
      interval
    },
    enabled,
    actions,
    throttle: null,
    notifyWhen: null
  }
});
exports.legacyCreateNotifications = legacyCreateNotifications;