"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPutPluginStateRoute = exports.registerGetPluginStateRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _plugin_state_utils = require("../helpers/plugin_state_utils");
var _constants = require("../../common/constants");
var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const registerGetPluginStateRoute = router => {
  router.get({
    path: `${_constants.API_BASE_PATH}/state`,
    validate: false
  }, async (context, request, response) => {
    const coreContext = await context.core;
    const savedObjectsClient = coreContext.savedObjects.client;
    const pluginState = await (0, _plugin_state_utils.getPluginState)(savedObjectsClient);
    return response.ok({
      body: {
        pluginState
      }
    });
  });
};
exports.registerGetPluginStateRoute = registerGetPluginStateRoute;
const registerPutPluginStateRoute = router => {
  router.put({
    path: `${_constants.API_BASE_PATH}/state`,
    validate: {
      body: _configSchema.schema.object({
        status: _configSchema.schema.maybe(_configSchema.schema.string()),
        guide: _configSchema.schema.maybe(_configSchema.schema.object({
          status: _configSchema.schema.string(),
          guideId: _configSchema.schema.string(),
          isActive: _configSchema.schema.boolean(),
          steps: _configSchema.schema.arrayOf(_configSchema.schema.object({
            status: _configSchema.schema.string(),
            id: _configSchema.schema.string()
          }))
        }))
      })
    }
  }, async (context, request, response) => {
    const {
      status,
      guide
    } = request.body;
    const coreContext = await context.core;
    const savedObjectsClient = coreContext.savedObjects.client;
    if (status) {
      await (0, _plugin_state_utils.updatePluginStatus)(savedObjectsClient, status);
    }
    if (guide) {
      await (0, _helpers.updateGuideState)(savedObjectsClient, guide);
    }
    const pluginState = await (0, _plugin_state_utils.getPluginState)(savedObjectsClient);
    return response.ok({
      body: {
        pluginState
      }
    });
  });
};
exports.registerPutPluginStateRoute = registerPutPluginStateRoute;