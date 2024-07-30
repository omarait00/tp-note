"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ML_DF_NOTIFICATION_INDEX_PATTERN = void 0;
exports.registerTransformsAuditMessagesRoutes = registerTransformsAuditMessagesRoutes;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../../common/constants");
var _common = require("../../../common/api_schemas/common");
var _ = require("..");
var _error_utils = require("./error_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ML_DF_NOTIFICATION_INDEX_PATTERN = '.transform-notifications-read';
exports.ML_DF_NOTIFICATION_INDEX_PATTERN = ML_DF_NOTIFICATION_INDEX_PATTERN;
function registerTransformsAuditMessagesRoutes({
  router,
  license
}) {
  /**
   * @apiGroup Transforms Audit Messages
   *
   * @api {get} /api/transform/transforms/:transformId/messages Transforms Messages
   * @apiName GetTransformsMessages
   * @apiDescription Get transforms audit messages
   *
   * @apiSchema (params) transformIdParamSchema
   */
  router.get({
    path: (0, _.addBasePath)('transforms/{transformId}/messages'),
    validate: {
      params: _common.transformIdParamSchema,
      query: _configSchema.schema.object({
        sortField: _configSchema.schema.string(),
        sortDirection: _configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')])
      })
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    var _req$query$sortField, _req$query, _req$query$sortDirect, _req$query2;
    const {
      transformId
    } = req.params;
    const sortField = (_req$query$sortField = (_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.sortField) !== null && _req$query$sortField !== void 0 ? _req$query$sortField : 'timestamp';
    const sortDirection = (_req$query$sortDirect = (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.sortDirection) !== null && _req$query$sortDirect !== void 0 ? _req$query$sortDirect : 'desc';

    // search for audit messages,
    // transformId is optional. without it, all transforms will be listed.
    const query = {
      bool: {
        filter: [{
          bool: {
            must_not: {
              term: {
                level: 'activity'
              }
            }
          }
        }]
      }
    };

    // if no transformId specified, load all of the messages
    if (transformId !== undefined) {
      query.bool.filter.push({
        bool: {
          should: [{
            term: {
              transform_id: '' // catch system messages
            }
          }, {
            term: {
              transform_id: transformId // messages for specified transformId
            }
          }]
        }
      });
    }

    try {
      const esClient = (await ctx.core).elasticsearch.client;
      const resp = await esClient.asCurrentUser.search({
        index: ML_DF_NOTIFICATION_INDEX_PATTERN,
        ignore_unavailable: true,
        size: _constants.DEFAULT_MAX_AUDIT_MESSAGE_SIZE,
        body: {
          sort: [{
            [sortField]: {
              order: sortDirection
            }
          }, {
            transform_id: {
              order: 'asc'
            }
          }],
          query
        },
        track_total_hits: true
      });
      const totalHits = typeof resp.hits.total === 'number' ? resp.hits.total : resp.hits.total.value;
      let messages = [];
      // TODO: remove typeof checks when appropriate overloading is added for the `search` API
      if (typeof resp.hits.total === 'number' && resp.hits.total > 0 || typeof resp.hits.total === 'object' && resp.hits.total.value > 0) {
        messages = resp.hits.hits.map(hit => hit._source);
      }
      return res.ok({
        body: {
          messages,
          total: totalHits
        }
      });
    } catch (e) {
      return res.customError((0, _error_utils.wrapError)((0, _error_utils.wrapEsError)(e)));
    }
  }));
}