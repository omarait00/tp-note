"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisTypeTimeseriesPlugin = void 0;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _get_vis_data = require("./lib/get_vis_data");
var _vis = require("./routes/vis");
var _fields = require("./routes/fields");
var _ui_settings = require("./ui_settings");
var _search_strategies = require("./lib/search_strategies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

class VisTypeTimeseriesPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;
    this.initializerContext = initializerContext;
  }
  setup(core, plugins) {
    const logger = this.initializerContext.logger.get('visTypeTimeseries');
    core.uiSettings.register((0, _ui_settings.getUiSettings)());
    const config$ = this.initializerContext.config.create();
    // Global config contains things like the ES shard timeout
    const globalConfig$ = this.initializerContext.config.legacy.globalConfig$;
    const router = core.http.createRouter();
    const searchStrategyRegistry = new _search_strategies.SearchStrategyRegistry();
    const framework = {
      core,
      plugins,
      config$,
      globalConfig$,
      logger,
      searchStrategyRegistry,
      getEsShardTimeout: () => (0, _rxjs.firstValueFrom)(globalConfig$.pipe((0, _operators.map)(config => config.elasticsearch.shardTimeout.asMilliseconds()))),
      getIndexPatternsService: async requestContext => {
        const [, {
          dataViews
        }] = await core.getStartServices();
        const {
          elasticsearch,
          savedObjects
        } = await requestContext.core;
        return await dataViews.dataViewsServiceFactory(savedObjects.client, elasticsearch.client.asCurrentUser);
      },
      getFieldFormatsService: async uiSettings => {
        const [, {
          fieldFormats
        }] = await core.getStartServices();
        return fieldFormats.fieldFormatServiceFactory(uiSettings);
      }
    };
    searchStrategyRegistry.addStrategy(new _search_strategies.DefaultSearchStrategy());
    searchStrategyRegistry.addStrategy(new _search_strategies.RollupSearchStrategy());
    (0, _vis.visDataRoutes)(router, framework);
    (0, _fields.fieldsRoutes)(router, framework);
    return {
      getVisData: async (requestContext, fakeRequest, options) => {
        return await (0, _get_vis_data.getVisData)(requestContext, {
          ...fakeRequest,
          body: options
        }, framework);
      }
    };
  }
  start(core) {}
}
exports.VisTypeTimeseriesPlugin = VisTypeTimeseriesPlugin;