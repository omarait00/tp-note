"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectTaggingPlugin = void 0;
var _features = require("./features");
var _saved_objects = require("./saved_objects");
var _request_handler_context = require("./request_handler_context");
var _routes = require("./routes");
var _usage = require("./usage");
var _services = require("./services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SavedObjectTaggingPlugin {
  setup({
    savedObjects,
    http
  }, {
    features,
    usageCollection,
    security
  }) {
    savedObjects.registerType(_saved_objects.tagType);
    const router = http.createRouter();
    (0, _routes.registerRoutes)({
      router
    });
    http.registerRouteHandlerContext('tags', async (context, req, res) => {
      return new _request_handler_context.TagsRequestHandlerContext(req, await context.core, security);
    });
    features.registerKibanaFeature(_features.savedObjectsTaggingFeature);
    if (usageCollection) {
      usageCollection.registerCollector((0, _usage.createTagUsageCollector)({
        usageCollection,
        kibanaIndex: savedObjects.getKibanaIndex()
      }));
    }
    return {};
  }
  start(core, {
    security
  }) {
    return {
      createTagClient: ({
        client
      }) => {
        return new _services.TagsClient({
          client
        });
      },
      createInternalAssignmentService: ({
        client
      }) => {
        return new _services.AssignmentService({
          client,
          authorization: security === null || security === void 0 ? void 0 : security.authz,
          typeRegistry: core.savedObjects.getTypeRegistry(),
          internal: true
        });
      }
    };
  }
}
exports.SavedObjectTaggingPlugin = SavedObjectTaggingPlugin;