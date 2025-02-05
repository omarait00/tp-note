"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSearchRoute = registerSearchRoute;
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../../src/plugins/data/server");
var _license_state = require("../lib/license_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerSearchRoute({
  router,
  licenseState
}) {
  router.post({
    path: '/api/graph/searchProxy',
    validate: {
      body: _configSchema.schema.object({
        index: _configSchema.schema.string(),
        body: _configSchema.schema.object({}, {
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
      uiSettings: {
        client: uiSettings
      },
      elasticsearch: {
        client: esClient
      }
    } = await core;
    const includeFrozen = await uiSettings.get(_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN);
    try {
      return response.ok({
        body: {
          resp: await esClient.asCurrentUser.search({
            index: request.body.index,
            body: request.body.body,
            track_total_hits: true,
            ...(includeFrozen ? {
              ignore_throttled: false
            } : {})
          })
        }
      });
    } catch (error) {
      return response.customError({
        statusCode: error.statusCode || 500,
        body: {
          message: error.message
        }
      });
    }
  }));
}