"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggsService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

async function getConfigFn(uiSettingsClient) {
  // cache ui settings, only including items which are explicitly needed by aggs
  const uiSettingsCache = (0, _lodash.pick)(await uiSettingsClient.getAll(), _common.aggsRequiredUiSettings);
  return key => {
    return uiSettingsCache[key];
  };
}

/**
 * The aggs service provides a means of modeling and manipulating the various
 * Elasticsearch aggregations supported by Kibana, providing the ability to
 * output the correct DSL when you are ready to send your request to ES.
 */
class AggsService {
  constructor() {
    (0, _defineProperty2.default)(this, "aggsCommonService", new _common.AggsCommonService({
      shouldDetectTimeZone: false
    }));
    (0, _defineProperty2.default)(this, "calculateBounds", timeRange => (0, _common.calculateBounds)(timeRange));
  }
  setup({
    registerFunction
  }) {
    return this.aggsCommonService.setup({
      registerFunction
    });
  }
  start({
    fieldFormats,
    uiSettings,
    indexPatterns
  }) {
    return {
      asScopedToClient: async (savedObjectsClient, elasticsearchClient) => {
        const uiSettingsClient = uiSettings.asScopedToClient(savedObjectsClient);
        const {
          calculateAutoTimeExpression,
          types,
          createAggConfigs
        } = this.aggsCommonService.start({
          getConfig: await getConfigFn(uiSettingsClient),
          fieldFormats: await fieldFormats.fieldFormatServiceFactory(uiSettingsClient),
          getIndexPattern: (await indexPatterns.dataViewsServiceFactory(savedObjectsClient, elasticsearchClient)).get,
          calculateBounds: this.calculateBounds
        });
        return {
          calculateAutoTimeExpression,
          createAggConfigs,
          types
        };
      }
    };
  }
  stop() {}
}
exports.AggsService = AggsService;