"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchAlertByUuid = exports.registerAlertStatusRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _expand_dotted_object = require("../../common/utils/expand_dotted_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerAlertStatusRoute = (router, ruleRegistry) => {
  router.get({
    path: _constants.ALERT_STATUS_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        alertUuid: _configSchema.schema.string()
      })
    }
  }, async (_context, request, response) => {
    const client = await ruleRegistry.getRacClientWithRequest(request);
    const {
      alertUuid
    } = request.query;
    const body = await searchAlertByUuid(client, alertUuid);
    return response.ok({
      body
    });
  });
};
exports.registerAlertStatusRoute = registerAlertStatusRoute;
const searchAlertByUuid = async (client, alertUuid) => {
  var _await$client$getAuth;
  const indices = (_await$client$getAuth = await client.getAuthorizedAlertsIndices(['siem'])) === null || _await$client$getAuth === void 0 ? void 0 : _await$client$getAuth.filter(index => index !== _constants.PREVIEW_ALERTS_INDEX);
  if (!indices) {
    return {
      events: []
    };
  }
  const result = await client.find({
    query: {
      match: {
        [_constants.ALERT_UUID_PROPERTY]: alertUuid
      }
    },
    track_total_hits: false,
    size: 1,
    index: indices.join(',')
  });
  const events = result.hits.hits.map(hit => {
    // the alert indexes flattens many properties. this util unflattens them as session view expects structured json.
    hit._source = (0, _expand_dotted_object.expandDottedObject)(hit._source);
    return hit;
  });
  return {
    events
  };
};
exports.searchAlertByUuid = searchAlertByUuid;