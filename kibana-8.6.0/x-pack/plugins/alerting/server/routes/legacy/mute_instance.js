"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.muteAlertInstanceRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _license_api_access = require("../../lib/license_api_access");
var _common = require("../../../common");
var _rename_keys = require("../lib/rename_keys");
var _rule_type_disabled = require("../../lib/errors/rule_type_disabled");
var _track_legacy_route_usage = require("../../lib/track_legacy_route_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramSchema = _configSchema.schema.object({
  alert_id: _configSchema.schema.string(),
  alert_instance_id: _configSchema.schema.string()
});
const muteAlertInstanceRoute = (router, licenseState, usageCounter) => {
  router.post({
    path: `${_common.LEGACY_BASE_ALERT_API_PATH}/alert/{alert_id}/alert_instance/{alert_instance_id}/_mute`,
    validate: {
      params: paramSchema
    }
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _license_api_access.verifyApiAccess)(licenseState);
    if (!context.alerting) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for alerting'
      });
    }
    (0, _track_legacy_route_usage.trackLegacyRouteUsage)('muteInstance', usageCounter);
    const rulesClient = (await context.alerting).getRulesClient();
    const renameMap = {
      alert_id: 'alertId',
      alert_instance_id: 'alertInstanceId'
    };
    const renamedQuery = (0, _rename_keys.renameKeys)(renameMap, req.params);
    try {
      await rulesClient.muteInstance(renamedQuery);
      return res.noContent();
    } catch (e) {
      if (e instanceof _rule_type_disabled.RuleTypeDisabledError) {
        return e.sendResponse(res);
      }
      throw e;
    }
  }));
};
exports.muteAlertInstanceRoute = muteAlertInstanceRoute;