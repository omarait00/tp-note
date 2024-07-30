"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchProcessWithIOEvents = exports.registerIOEventsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _process_tree = require("../../common/types/process_tree");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerIOEventsRoute = router => {
  router.get({
    path: _constants.IO_EVENTS_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        sessionEntityId: _configSchema.schema.string(),
        cursor: _configSchema.schema.maybe(_configSchema.schema.string()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number())
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      sessionEntityId,
      cursor,
      pageSize = _constants.IO_EVENTS_PER_PAGE
    } = request.query;
    try {
      var _search$hits$total;
      const search = await client.search({
        index: [_constants.PROCESS_EVENTS_INDEX],
        body: {
          query: {
            bool: {
              must: [{
                term: {
                  [_constants.ENTRY_SESSION_ENTITY_ID_PROPERTY]: sessionEntityId
                }
              }, {
                term: {
                  [_ruleDataUtils.EVENT_ACTION]: 'text_output'
                }
              }]
            }
          },
          size: Math.min(pageSize, _constants.IO_EVENTS_PER_PAGE),
          sort: [{
            [_ruleDataUtils.TIMESTAMP]: 'asc'
          }],
          search_after: cursor ? [cursor] : undefined
        }
      });
      const events = search.hits.hits;
      const total = typeof search.hits.total === 'number' ? search.hits.total : (_search$hits$total = search.hits.total) === null || _search$hits$total === void 0 ? void 0 : _search$hits$total.value;
      return response.ok({
        body: {
          total,
          events
        }
      });
    } catch (err) {
      var _err$meta;
      // unauthorized
      if ((err === null || err === void 0 ? void 0 : (_err$meta = err.meta) === null || _err$meta === void 0 ? void 0 : _err$meta.statusCode) === 403) {
        return response.ok({
          body: {
            total: 0,
            events: []
          }
        });
      }
      return response.badRequest(err.message);
    }
  });
};
exports.registerIOEventsRoute = registerIOEventsRoute;
const searchProcessWithIOEvents = async (client, sessionEntityId, range) => {
  var _search$aggregations;
  const rangeFilter = range ? [{
    range: {
      [_ruleDataUtils.TIMESTAMP]: {
        gte: range[0],
        lte: range[1]
      }
    }
  }] : [];
  const search = await client.search({
    index: [_constants.PROCESS_EVENTS_INDEX],
    body: {
      query: {
        bool: {
          must: [{
            term: {
              [_ruleDataUtils.EVENT_ACTION]: 'text_output'
            }
          }, {
            term: {
              [_constants.ENTRY_SESSION_ENTITY_ID_PROPERTY]: sessionEntityId
            }
          }, ...rangeFilter]
        }
      },
      size: 0,
      aggs: {
        custom_agg: {
          terms: {
            field: _constants.PROCESS_ENTITY_ID_PROPERTY,
            size: _constants.PROCESS_EVENTS_PER_PAGE
          }
        }
      }
    }
  });
  const agg = (_search$aggregations = search.aggregations) === null || _search$aggregations === void 0 ? void 0 : _search$aggregations.custom_agg;
  const buckets = (agg === null || agg === void 0 ? void 0 : agg.buckets) || [];
  return buckets.map(bucket => ({
    _source: {
      event: {
        kind: _process_tree.EventKind.event,
        action: _process_tree.EventAction.text_output,
        id: bucket.key
      },
      process: {
        entity_id: bucket.key
      }
    }
  }));
};
exports.searchProcessWithIOEvents = searchProcessWithIOEvents;