"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetTotalIOBytesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _constants = require("../../common/constants");
/* * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerGetTotalIOBytesRoute = router => {
  router.get({
    path: _constants.GET_TOTAL_IO_BYTES_ROUTE,
    validate: {
      query: _configSchema.schema.object({
        sessionEntityId: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const client = (await context.core).elasticsearch.client.asCurrentUser;
    const {
      sessionEntityId
    } = request.query;
    try {
      var _search$aggregations;
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
          size: 0,
          aggs: {
            total_bytes_captured: {
              sum: {
                field: _constants.TOTAL_BYTES_CAPTURED_PROPERTY
              }
            }
          }
        }
      });
      const agg = (_search$aggregations = search.aggregations) === null || _search$aggregations === void 0 ? void 0 : _search$aggregations.total_bytes_captured;
      return response.ok({
        body: {
          total: (agg === null || agg === void 0 ? void 0 : agg.value) || 0
        }
      });
    } catch (err) {
      var _err$meta;
      // unauthorized
      if ((err === null || err === void 0 ? void 0 : (_err$meta = err.meta) === null || _err$meta === void 0 ? void 0 : _err$meta.statusCode) === 403) {
        return response.ok({
          body: {
            total: 0
          }
        });
      }
      return response.badRequest(err.message);
    }
  });
};
exports.registerGetTotalIOBytesRoute = registerGetTotalIOBytesRoute;