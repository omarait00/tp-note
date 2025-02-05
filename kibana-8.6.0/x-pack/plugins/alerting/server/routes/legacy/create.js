"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAlertRoute = exports.bodySchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _license_api_access = require("../../lib/license_api_access");
var _lib = require("../../lib");
var _error_handler = require("../lib/error_handler");
var _types = require("../../types");
var _rule_type_disabled = require("../../lib/errors/rule_type_disabled");
var _lib2 = require("../lib");
var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bodySchema = _configSchema.schema.object({
  name: _configSchema.schema.string(),
  alertTypeId: _configSchema.schema.string(),
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  consumer: _configSchema.schema.string(),
  tags: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: []
  }),
  throttle: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  })),
  params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
    defaultValue: {}
  }),
  schedule: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })
  }),
  actions: _configSchema.schema.arrayOf(_configSchema.schema.object({
    group: _configSchema.schema.string(),
    id: _configSchema.schema.string(),
    actionTypeId: _configSchema.schema.maybe(_configSchema.schema.string()),
    params: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any(), {
      defaultValue: {}
    })
  }), {
    defaultValue: []
  }),
  notifyWhen: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: _types.validateNotifyWhenType
  }))
});
exports.bodySchema = bodySchema;
const createAlertRoute = ({
  router,
  licenseState,
  usageCounter
}) => {
  router.post({
    path: `${_types.LEGACY_BASE_ALERT_API_PATH}/alert/{id?}`,
    validate: {
      params: _configSchema.schema.maybe(_configSchema.schema.object({
        id: _configSchema.schema.maybe(_configSchema.schema.string())
      })),
      body: bodySchema
    }
  }, (0, _error_handler.handleDisabledApiKeysError)(router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);
    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }
    const rulesClient = (await context.alerting).getRulesClient();
    const alert = req.body;
    const params = req.params;
    const notifyWhen = alert !== null && alert !== void 0 && alert.notifyWhen ? alert.notifyWhen : null;
    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('create', usageCounter);
    (0, _lib2.countUsageOfPredefinedIds)({
      predefinedId: params === null || params === void 0 ? void 0 : params.id,
      spaceId: rulesClient.getSpaceId(),
      usageCounter
    });
    try {
      const alertRes = await rulesClient.create({
        data: {
          ...alert,
          notifyWhen
        },
        options: {
          id: params === null || params === void 0 ? void 0 : params.id
        }
      });
      return res.ok({
        body: alertRes
      });
    } catch (e) {
      if (e instanceof _rule_type_disabled.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  })));
};
exports.createAlertRoute = createAlertRoute;