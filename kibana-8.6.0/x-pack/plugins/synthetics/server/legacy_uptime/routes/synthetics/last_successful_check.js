"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLastSuccessfulCheckRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _synthetics = require("../../../../common/runtime_types/ping/synthetics");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createLastSuccessfulCheckRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_SUCCESSFUL_CHECK,
  validate: {
    query: _configSchema.schema.object({
      monitorId: _configSchema.schema.string(),
      stepIndex: _configSchema.schema.number(),
      timestamp: _configSchema.schema.string(),
      location: _configSchema.schema.maybe(_configSchema.schema.string())
    })
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      timestamp,
      monitorId,
      stepIndex,
      location
    } = request.query;
    const check = await libs.requests.getLastSuccessfulCheck({
      uptimeEsClient,
      monitorId,
      timestamp,
      location
    });
    if (check === null) {
      return response.notFound();
    }
    if (!check.monitor.check_group) {
      return response.ok({
        body: check
      });
    }
    const screenshot = await libs.requests.getJourneyScreenshot({
      uptimeEsClient,
      checkGroup: check.monitor.check_group,
      stepIndex
    });
    if (screenshot === null) {
      return response.ok({
        body: check
      });
    }
    if (check.synthetics) {
      check.synthetics.isScreenshotRef = (0, _synthetics.isRefResult)(screenshot);
      check.synthetics.isFullScreenshot = (0, _synthetics.isFullScreenshot)(screenshot);
    }
    return response.ok({
      body: check
    });
  }
});
exports.createLastSuccessfulCheckRoute = createLastSuccessfulCheckRoute;