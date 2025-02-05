"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPipelineDeleteRoute = registerPipelineDeleteRoute;
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../licensing/server");
var _check_license = require("../../lib/check_license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerPipelineDeleteRoute(router) {
  router.delete({
    path: '/api/logstash/pipeline/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, (0, _server.wrapRouteWithLicenseCheck)(_check_license.checkLicense, router.handleLegacyErrors(async (context, request, response) => {
    const {
      id
    } = request.params;
    const {
      client
    } = (await context.core).elasticsearch;
    try {
      await client.asCurrentUser.logstash.deletePipeline({
        id
      });
      return response.noContent();
    } catch (e) {
      if (e.statusCode === 404) {
        return response.notFound();
      }
      throw e;
    }
  })));
}