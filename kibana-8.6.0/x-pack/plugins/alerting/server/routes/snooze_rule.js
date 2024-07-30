"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snoozeScheduleSchema = exports.snoozeRuleRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("../lib");
var _lib2 = require("./lib");
var _types = require("../types");
var _validate_snooze_date = require("../lib/validate_snooze_date");
var _validate_rrule_by = require("../lib/validate_rrule_by");
var _validate_snooze_schedule = require("../lib/validate_snooze_schedule");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});
const snoozeScheduleSchema = _configSchema.schema.object({
  id: _configSchema.schema.maybe(_configSchema.schema.string()),
  duration: _configSchema.schema.number(),
  rRule: _configSchema.schema.object({
    dtstart: _configSchema.schema.string({
      validate: _validate_snooze_date.validateSnoozeStartDate
    }),
    tzid: _configSchema.schema.string(),
    freq: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal(0), _configSchema.schema.literal(1), _configSchema.schema.literal(2), _configSchema.schema.literal(3)])),
    interval: _configSchema.schema.maybe(_configSchema.schema.number({
      validate: interval => {
        if (interval < 1) return 'rRule interval must be > 0';
      }
    })),
    until: _configSchema.schema.maybe(_configSchema.schema.string({
      validate: _validate_snooze_date.validateSnoozeEndDate
    })),
    count: _configSchema.schema.maybe(_configSchema.schema.number({
      validate: count => {
        if (count < 1) return 'rRule count must be > 0';
      }
    })),
    byweekday: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string(), {
      validate: (0, _validate_rrule_by.createValidateRruleBy)('byweekday')
    })),
    bymonthday: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.number(), {
      validate: (0, _validate_rrule_by.createValidateRruleBy)('bymonthday')
    })),
    bymonth: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.number(), {
      validate: (0, _validate_rrule_by.createValidateRruleBy)('bymonth')
    }))
  })
}, {
  validate: _validate_snooze_schedule.validateSnoozeSchedule
});
exports.snoozeScheduleSchema = snoozeScheduleSchema;
const bodySchema = _configSchema.schema.object({
  snooze_schedule: snoozeScheduleSchema
});
const rewriteBodyReq = ({
  snooze_schedule: snoozeSchedule
}) => ({
  snoozeSchedule
});
const snoozeRuleRoute = (router, licenseState) => {
  router.post({
    path: `${_types.INTERNAL_BASE_ALERTING_API_PATH}/rule/{id}/_snooze`,
    validate: {
      params: paramSchema,
      body: bodySchema
    }
  }, router.handleLegacyErrors((0, _lib2.verifyAccessAndContext)(licenseState, async function (context, req, res) {
    const rulesClient = (await context.alerting).getRulesClient();
    const params = req.params;
    const body = rewriteBodyReq(req.body);
    try {
      await rulesClient.snooze({
        ...params,
        ...body
      });
      return res.noContent();
    } catch (e) {
      if (e instanceof _lib.RuleMutedError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  })));
};
exports.snoozeRuleRoute = snoozeRuleRoute;