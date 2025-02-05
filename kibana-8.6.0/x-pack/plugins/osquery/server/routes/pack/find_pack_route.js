"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPackRoute = void 0;
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _common = require("../../../../fleet/common");
var _types = require("../../../common/types");
var _common2 = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findPackRoute = router => {
  router.get({
    path: '/api/osquery/packs',
    validate: {
      query: _configSchema.schema.object({
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        pageSize: _configSchema.schema.maybe(_configSchema.schema.number()),
        sort: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('asc'), _configSchema.schema.literal('desc')]))
      }, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-readPacks`]
    }
  }, async (context, request, response) => {
    var _request$query$page, _request$query$pageSi, _request$query$sort, _request$query$sortOr;
    const coreContext = await context.core;
    const savedObjectsClient = coreContext.savedObjects.client;
    const soClientResponse = await savedObjectsClient.find({
      type: _types.packSavedObjectType,
      page: (_request$query$page = request.query.page) !== null && _request$query$page !== void 0 ? _request$query$page : 1,
      perPage: (_request$query$pageSi = request.query.pageSize) !== null && _request$query$pageSi !== void 0 ? _request$query$pageSi : 20,
      sortField: (_request$query$sort = request.query.sort) !== null && _request$query$sort !== void 0 ? _request$query$sort : 'updated_at',
      sortOrder: (_request$query$sortOr = request.query.sortOrder) !== null && _request$query$sortOr !== void 0 ? _request$query$sortOr : 'desc'
    });
    const packSavedObjects = (0, _lodash.map)(soClientResponse.saved_objects, pack => {
      const policyIds = (0, _lodash.map)((0, _lodash.filter)(pack.references, ['type', _common.AGENT_POLICY_SAVED_OBJECT_TYPE]), 'id');
      return {
        ...pack,
        policy_ids: policyIds
      };
    });
    return response.ok({
      body: {
        ...(0, _lodash.omit)(soClientResponse, 'saved_objects'),
        data: packSavedObjects
      }
    });
  });
};
exports.findPackRoute = findPackRoute;