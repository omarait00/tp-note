"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExploreRoute = registerExploreRoute;
var _elasticsearch = require("@elastic/elasticsearch");
var _configSchema = require("@kbn/config-schema");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _license_state = require("../lib/license_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerExploreRoute({
  router,
  licenseState
}) {
  router.post({
    path: '/api/graph/graphExplore',
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string(),
        query: _configSchema.schema.object({}, {
          unknowns: 'allow'
        })
      })
    }
  }, router.handleLegacyErrors(async ({
    core
  }, request, response) => {
    (0, _license_state.verifyApiAccess)(licenseState);
    licenseState.notifyUsage('Graph');
    const {
      elasticsearch: {
        client: esClient
      }
    } = await core;
    try {
      return response.ok({
        body: {
          resp: await esClient.asCurrentUser.transport.request({
            path: '/' + encodeURIComponent(request.body.index) + '/_graph/explore',
            body: request.body.query,
            method: 'POST'
          })
        }
      });
    } catch (error) {
      if (error instanceof _elasticsearch.errors.ResponseError) {
        var _errorBody$error$root, _errorBody$error;
        const errorBody = error.body;
        const relevantCause = ((_errorBody$error$root = (_errorBody$error = errorBody.error) === null || _errorBody$error === void 0 ? void 0 : _errorBody$error.root_cause) !== null && _errorBody$error$root !== void 0 ? _errorBody$error$root : []).find(cause => {
          return cause.reason.includes('Fielddata is disabled on text fields') || cause.reason.includes('No support for examining floating point') || cause.reason.includes('Sample diversifying key must be a single valued-field') || cause.reason.includes('Failed to parse query') || cause.reason.includes('Text fields are not optimised for operations') || cause.type === 'parsing_exception';
        });
        if (relevantCause) {
          throw _boom.default.badRequest(relevantCause.reason);
        }
      }
      throw error;
    }
  }));
}