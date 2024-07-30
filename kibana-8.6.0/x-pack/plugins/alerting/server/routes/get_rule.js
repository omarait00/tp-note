"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleRoute = exports.getInternalRuleRoute = void 0;
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _lib = require("./lib");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const rewriteBodyRes = ({
  alertTypeId,
  createdBy,
  updatedBy,
  createdAt,
  updatedAt,
  apiKeyOwner,
  notifyWhen,
  muteAll,
  mutedInstanceIds,
  executionStatus,
  actions,
  scheduledTaskId,
  snoozeSchedule,
  isSnoozedUntil,
  lastRun,
  nextRun,
  ...rest
}) => ({
  ...rest,
  rule_type_id: alertTypeId,
  created_by: createdBy,
  updated_by: updatedBy,
  created_at: createdAt,
  updated_at: updatedAt,
  api_key_owner: apiKeyOwner,
  notify_when: notifyWhen,
  muted_alert_ids: mutedInstanceIds,
  mute_all: muteAll,
  ...(isSnoozedUntil !== undefined ? {
    is_snoozed_until: isSnoozedUntil
  } : {}),
  snooze_schedule: snoozeSchedule,
  scheduled_task_id: scheduledTaskId,
  execution_status: executionStatus && {
    ...(0, _lodash.omit)(executionStatus, 'lastExecutionDate', 'lastDuration'),
    last_execution_date: executionStatus.lastExecutionDate,
    last_duration: executionStatus.lastDuration
  },
  actions: actions.map(({
    group,
    id,
    actionTypeId,
    params
  }) => ({
    group,
    id,
    params,
    connector_type_id: actionTypeId
  })),
  ...(lastRun ? {
    last_run: (0, _lib.rewriteRuleLastRun)(lastRun)
  } : {}),
  ...(nextRun ? {
    next_run: nextRun
  } : {})
});
const buildGetRuleRoute = ({
  licenseState,
  path,
  router,
  excludeFromPublicApi = false
}) => {
  router.get({
    path,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors((0, _lib.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      id
    } = req.params;
    const rule = await rulesClient.get({
      id,
      excludeFromPublicApi,
      includeSnoozeData: true
    });
    return res.ok({
      body: rewriteBodyRes(rule)
    });
  })));
};
const getRuleRoute = (router, licenseState) => buildGetRuleRoute({
  excludeFromPublicApi: true,
  licenseState,
  path: `${_types.BASE_ALERTING_API_PATH}/rule/{id}`,
  router
});
exports.getRuleRoute = getRuleRoute;
const getInternalRuleRoute = (router, licenseState) => buildGetRuleRoute({
  excludeFromPublicApi: false,
  licenseState,
  path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}`,
  router
});
exports.getInternalRuleRoute = getInternalRuleRoute;