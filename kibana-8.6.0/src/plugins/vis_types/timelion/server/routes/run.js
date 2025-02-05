"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runRoute = runRoute;
var _configSchema = require("@kbn/config-schema");
var _lodash = _interopRequireDefault(require("lodash"));
var _chain_runner = _interopRequireDefault(require("../handlers/chain_runner"));
var _get_namespaced_settings = _interopRequireDefault(require("../lib/get_namespaced_settings"));
var _tl_config = _interopRequireDefault(require("../handlers/lib/tl_config"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// @ts-ignore

// @ts-ignore

// @ts-ignore

const timelionDefaults = (0, _get_namespaced_settings.default)();
function runRoute(router, {
  logger,
  getFunction,
  configManager,
  core
}) {
  router.post({
    path: '/api/timelion/run',
    validate: {
      body: _configSchema.schema.object({
        sheet: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        extended: _configSchema.schema.maybe(_configSchema.schema.object({
          es: _configSchema.schema.object({
            filter: _configSchema.schema.object({
              bool: _configSchema.schema.object({
                filter: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
                  unknowns: 'allow'
                }))),
                must: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
                  unknowns: 'allow'
                }))),
                should: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
                  unknowns: 'allow'
                }))),
                must_not: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({}, {
                  unknowns: 'allow'
                })))
              })
            })
          })
        })),
        time: _configSchema.schema.maybe(_configSchema.schema.object({
          from: _configSchema.schema.maybe(_configSchema.schema.string()),
          interval: _configSchema.schema.string(),
          timezone: _configSchema.schema.string(),
          to: _configSchema.schema.maybe(_configSchema.schema.string())
        })),
        searchSession: _configSchema.schema.maybe(_configSchema.schema.object({
          sessionId: _configSchema.schema.string(),
          isRestore: _configSchema.schema.boolean({
            defaultValue: false
          }),
          isStored: _configSchema.schema.boolean({
            defaultValue: false
          })
        }))
      })
    }
  }, router.handleLegacyErrors(async (context, request, response) => {
    const [, {
      dataViews
    }] = await core.getStartServices();
    const coreCtx = await context.core;
    const uiSettings = await coreCtx.uiSettings.client.getAll();
    const indexPatternsService = await dataViews.dataViewsServiceFactory(coreCtx.savedObjects.client, coreCtx.elasticsearch.client.asCurrentUser);
    const tlConfig = (0, _tl_config.default)({
      context,
      request,
      settings: _lodash.default.defaults(uiSettings, timelionDefaults),
      // Just in case they delete some setting.
      getFunction,
      getIndexPatternsService: () => indexPatternsService,
      getStartServices: core.getStartServices,
      esShardTimeout: configManager.getEsShardTimeout()
    });
    try {
      const chainRunner = (0, _chain_runner.default)(tlConfig);
      const sheet = await Promise.all(await chainRunner.processRequest(request.body));
      return response.ok({
        body: {
          sheet,
          stats: chainRunner.getStats()
        }
      });
    } catch (e) {
      return response.badRequest({
        body: {
          message: e.message
        }
      });
    }
  }));
}