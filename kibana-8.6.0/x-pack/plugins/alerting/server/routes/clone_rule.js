"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneRuleRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../lib");
var _lib2 = require("./lib");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  newId: _configSchema.schema.maybe(_configSchema.schema.string())
});
const rewriteBodyRes = ({
  actions,
  alertTypeId,
  scheduledTaskId,
  createdBy,
  updatedBy,
  createdAt,
  updatedAt,
  apiKeyOwner,
  notifyWhen,
  muteAll,
  mutedInstanceIds,
  executionStatus,
  snoozeSchedule,
  isSnoozedUntil,
  lastRun,
  nextRun,
  ...rest
}) => ({
  ...rest,
  api_key_owner: apiKeyOwner,
  created_by: createdBy,
  updated_by: updatedBy,
  snooze_schedule: snoozeSchedule,
  ...(isSnoozedUntil ? {
    is_snoozed_until: isSnoozedUntil
  } : {}),
  ...(alertTypeId ? {
    rule_type_id: alertTypeId
  } : {}),
  ...(scheduledTaskId ? {
    scheduled_task_id: scheduledTaskId
  } : {}),
  ...(createdAt ? {
    created_at: createdAt
  } : {}),
  ...(updatedAt ? {
    updated_at: updatedAt
  } : {}),
  ...(notifyWhen ? {
    notify_when: notifyWhen
  } : {}),
  ...(muteAll !== undefined ? {
    mute_all: muteAll
  } : {}),
  ...(mutedInstanceIds ? {
    muted_alert_ids: mutedInstanceIds
  } : {}),
  ...(executionStatus ? {
    execution_status: {
      status: executionStatus.status,
      last_execution_date: executionStatus.lastExecutionDate,
      last_duration: executionStatus.lastDuration
    }
  } : {}),
  ...(actions ? {
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
    }))
  } : {}),
  ...(lastRun ? {
    last_run: (0, _lib2.rewriteRuleLastRun)(lastRun)
  } : {}),
  ...(nextRun ? {
    next_run: nextRun
  } : {})
});
const cloneRuleRoute = (router, licenseState) => {
  router.post({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_clone/{newId?}`,
    validate: {
      params: paramSchema
    }
  }, (0, _lib2.handleDisabledApiKeysError)(router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const {
      id,
      newId
    } = req.params;
    try {
      const cloneRule = await rulesClient.clone(id, {
        newId
      });
      return res.ok({
        body: rewriteBodyRes(cloneRule)
      });
    } catch (e) {
      if (e instanceof _lib.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  }))));
};
exports.cloneRuleRoute = cloneRuleRoute;