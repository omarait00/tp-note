"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchAlerts = exports.registerAlertsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _expand_dotted_object = require("../../common/utils/expand_dotted_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerAlertsRoute = (router, ruleRegistry) => {
  router.get({
    path: _constants.ALERTS_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        sessionEntityId: _configSchema.schema.string(),
        investigatedAlertId: _configSchema.schema.maybe(_configSchema.schema.string()),
        cursor: _configSchema.schema.maybe(_configSchema.schema.string()),
        range: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
      })
    }
  }, async (_context, request, response) => {
    const client = await ruleRegistry.getRacClientWithRequest(request);
    const {
      sessionEntityId,
      investigatedAlertId,
      range,
      cursor
    } = request.query;
    try {
      const body = await searchAlerts(client, sessionEntityId, _constants.ALERTS_PER_PAGE, investigatedAlertId, range, cursor);
      return response.ok({
        body
      });
    } catch (err) {
      return response.badRequest(err.message);
    }
  });
};
exports.registerAlertsRoute = registerAlertsRoute;
const searchAlerts = async (client, sessionEntityId, size, investigatedAlertId, range, cursor) => {
  var _await$client$getAuth;
  const indices = (_await$client$getAuth = await client.getAuthorizedAlertsIndices(['siem'])) === null || _await$client$getAuth === void 0 ? void 0 : _await$client$getAuth.filter(index => index !== _constants.PREVIEW_ALERTS_INDEX);
  if (!indices) {
    return {
      events: []
    };
  }
  try {
    var _results$hits$total;
    const results = await client.find({
      query: {
        bool: {
          must: [{
            term: {
              [_constants.ENTRY_SESSION_ENTITY_ID_PROPERTY]: sessionEntityId
            }
          }, range && {
            range: {
              [_constants.ALERT_ORIGINAL_TIME_PROPERTY]: {
                gte: range[0],
                lte: range[1]
              }
            }
          }].filter(item => !!item)
        }
      },
      track_total_hits: true,
      size,
      index: indices.join(','),
      sort: [{
        '@timestamp': 'asc'
      }],
      search_after: cursor ? [cursor] : undefined
    });

    // if an alert is being investigated, fetch it on it's own, as it's not guaranteed to come back in the above request.
    // we only need to do this for the first page of alerts.
    if (!cursor && investigatedAlertId) {
      const investigatedAlertSearch = await client.find({
        query: {
          match: {
            [_constants.ALERT_UUID_PROPERTY]: investigatedAlertId
          }
        },
        size: 1,
        index: indices.join(',')
      });
      if (investigatedAlertSearch.hits.hits.length > 0) {
        results.hits.hits.unshift(investigatedAlertSearch.hits.hits[0]);
      }
    }
    const events = results.hits.hits.map(hit => {
      // the alert indexes flattens many properties. this util unflattens them as session view expects structured json.
      hit._source = (0, _expand_dotted_object.expandDottedObject)(hit._source);
      return hit;
    });
    const total = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value;
    return {
      total,
      events
    };
  } catch (err) {
    // unauthorized
    if (err.output.statusCode === 404) {
      return {
        total: 0,
        events: []
      };
    }
    throw err;
  }
};
exports.searchAlerts = searchAlerts;