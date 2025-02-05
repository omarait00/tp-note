"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetMonitorDetailsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createGetMonitorDetailsRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.MONITOR_DETAILS,
  validate: {
    query: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      dateStart: _configSchema.schema.maybe(_configSchema.schema.string()),
      dateEnd: _configSchema.schema.maybe(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    context,
    request
  }) => {
    var _await$context$alerti;
    const {
      monitorId,
      dateStart,
      dateEnd
    } = request.query;
    const rulesClient = (_await$context$alerti = await context.alerting) === null || _await$context$alerti === void 0 ? void 0 : _await$context$alerti.getRulesClient();
    return await libs.requests.getMonitorDetails({
      uptimeEsClient,
      monitorId,
      dateStart,
      dateEnd,
      rulesClient
    });
  }
});
exports.createGetMonitorDetailsRoute = createGetMonitorDetailsRoute;