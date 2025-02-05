"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogViewsService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _log_views_client = require("./log_views_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LogViewsService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "internalLogViews", new Map());
    this.logger = logger;
  }
  setup() {
    const {
      internalLogViews
    } = this;
    return {
      defineInternalLogView(logViewId, logViewAttributes) {
        internalLogViews.set(logViewId, {
          id: logViewId,
          origin: 'internal',
          attributes: logViewAttributes,
          updatedAt: Date.now()
        });
      }
    };
  }
  start({
    config,
    dataViews,
    elasticsearch,
    infraSources,
    savedObjects
  }) {
    const {
      internalLogViews,
      logger
    } = this;
    return {
      getClient(savedObjectsClient, elasticsearchClient, request) {
        return new _log_views_client.LogViewsClient(logger, dataViews.dataViewsServiceFactory(savedObjectsClient, elasticsearchClient, request), savedObjectsClient, infraSources, internalLogViews, config);
      },
      getScopedClient(request) {
        const savedObjectsClient = savedObjects.getScopedClient(request);
        const elasticsearchClient = elasticsearch.client.asScoped(request).asCurrentUser;
        return this.getClient(savedObjectsClient, elasticsearchClient, request);
      }
    };
  }
}
exports.LogViewsService = LogViewsService;