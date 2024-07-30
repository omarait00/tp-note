"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BfetchServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _configSchema = require("@kbn/config-schema");
var _std = require("@kbn/std");
var _common = require("../common");
var _streaming = require("./streaming");
var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const streamingHeaders = {
  'Content-Type': 'application/x-ndjson',
  Connection: 'keep-alive',
  'Transfer-Encoding': 'chunked',
  'X-Accel-Buffering': 'no'
};
class BfetchServerPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "addStreamingResponseRoute", ({
      getStartServices,
      router,
      logger
    }) => (path, handler, method = 'POST', pluginRouter, options) => {
      const httpRouter = pluginRouter || router;
      const routeDefinition = {
        path: `/${(0, _common.removeLeadingSlash)(path)}`,
        validate: {
          body: _configSchema.schema.any(),
          query: _configSchema.schema.object({
            compress: _configSchema.schema.boolean({
              defaultValue: false
            })
          })
        },
        options
      };
      const routeHandler = async (context, request, response) => {
        const handlerInstance = handler(request, context);
        const data = request.body;
        const compress = request.query.compress;
        return response.ok({
          headers: streamingHeaders,
          body: (0, _streaming.createStream)(handlerInstance.getResponseStream(data), logger, compress)
        });
      };
      switch (method) {
        case 'GET':
          httpRouter.get(routeDefinition, routeHandler);
          break;
        case 'POST':
          httpRouter.post(routeDefinition, routeHandler);
          break;
        case 'PUT':
          httpRouter.put(routeDefinition, routeHandler);
          break;
        case 'DELETE':
          httpRouter.delete(routeDefinition, routeHandler);
          break;
        default:
          throw new Error(`Handler for method ${method} is not defined`);
      }
    });
    (0, _defineProperty2.default)(this, "addBatchProcessingRoute", addStreamingResponseRoute => (path, handler) => {
      addStreamingResponseRoute(path, request => {
        const handlerInstance = handler(request);
        return {
          getResponseStream: ({
            batch
          }) => (0, _std.map$)(batch, async (batchItem, id) => {
            try {
              const result = await handlerInstance.onBatchItem(batchItem);
              return {
                id,
                result
              };
            } catch (error) {
              return {
                id,
                error: (0, _common.normalizeError)(error)
              };
            }
          })
        };
      });
    });
    this.initializerContext = initializerContext;
  }
  setup(core, plugins) {
    const logger = this.initializerContext.logger.get();
    const router = core.http.createRouter();
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    const addStreamingResponseRoute = this.addStreamingResponseRoute({
      getStartServices: core.getStartServices,
      router,
      logger
    });
    const addBatchProcessingRoute = this.addBatchProcessingRoute(addStreamingResponseRoute);
    return {
      addBatchProcessingRoute,
      addStreamingResponseRoute
    };
  }
  start(core, plugins) {
    return {};
  }
  stop() {}
}
exports.BfetchServerPlugin = BfetchServerPlugin;