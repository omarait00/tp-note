"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCollectionIntervalRoute = setCollectionIntervalRoute;
var _elasticsearch_settings = require("../../../../../../common/http_api/elasticsearch_settings");
var _elasticsearch_settings2 = require("../../../../../lib/elasticsearch_settings");
var _errors = require("../../../../../lib/errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Cluster Settings Check Route
 */
function setCollectionIntervalRoute(server) {
  server.route({
    method: 'put',
    path: '/api/monitoring/v1/elasticsearch_settings/set/collection_interval',
    validate: {},
    async handler(req) {
      try {
        const response = await (0, _elasticsearch_settings2.setCollectionInterval)(req);
        return _elasticsearch_settings.putElasticsearchSettingsCollectionIntervalResponsePayloadRT.encode(response);
      } catch (err) {
        throw (0, _errors.handleSettingsError)(err);
      }
    }
  });
}