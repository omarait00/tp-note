"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimelinesRoute = void 0;
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _constants = require("../../../../../../common/constants");
var _utils = require("../../../../detection_engine/routes/utils");
var _custom_http_request_error = require("../../../../../utils/custom_http_request_error");
var _common = require("../../../utils/common");
var _timelines = require("../../../saved_object/timelines");
var _timelines2 = require("../../../schemas/timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTimelinesRoute = (router, _config, security) => {
  router.get({
    path: _constants.TIMELINES_URL,
    validate: {
      query: _common.escapeHatch
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const customHttpRequestError = message => new _custom_http_request_error.CustomHttpRequestError(message, 400);
    try {
      var _queryParams$search, _queryParams$sort_fie, _queryParams$sort_ord, _queryParams$status, _queryParams$timeline, _ref, _res;
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const queryParams = (0, _pipeable.pipe)(_timelines2.getTimelinesQuerySchema.decode(request.query), (0, _Either.fold)((0, _common.throwErrors)(customHttpRequestError), _function.identity));
      const onlyUserFavorite = (queryParams === null || queryParams === void 0 ? void 0 : queryParams.only_user_favorite) === 'true' ? true : false;
      const pageSize = queryParams !== null && queryParams !== void 0 && queryParams.page_size ? parseInt(queryParams.page_size, 10) : null;
      const pageIndex = queryParams !== null && queryParams !== void 0 && queryParams.page_index ? parseInt(queryParams.page_index, 10) : null;
      const search = (_queryParams$search = queryParams === null || queryParams === void 0 ? void 0 : queryParams.search) !== null && _queryParams$search !== void 0 ? _queryParams$search : null;
      const sortField = (_queryParams$sort_fie = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sort_field) !== null && _queryParams$sort_fie !== void 0 ? _queryParams$sort_fie : null;
      const sortOrder = (_queryParams$sort_ord = queryParams === null || queryParams === void 0 ? void 0 : queryParams.sort_order) !== null && _queryParams$sort_ord !== void 0 ? _queryParams$sort_ord : null;
      const status = (_queryParams$status = queryParams === null || queryParams === void 0 ? void 0 : queryParams.status) !== null && _queryParams$status !== void 0 ? _queryParams$status : null;
      const timelineType = (_queryParams$timeline = queryParams === null || queryParams === void 0 ? void 0 : queryParams.timeline_type) !== null && _queryParams$timeline !== void 0 ? _queryParams$timeline : null;
      const sort = sortField && sortOrder ? {
        sortField,
        sortOrder
      } : null;
      let res = null;
      let totalCount = null;
      if (pageSize == null && pageIndex == null) {
        const allActiveTimelines = await (0, _timelines.getAllTimeline)(frameworkRequest, false, {
          pageSize: 1,
          pageIndex: 1
        }, null, null, null, null);
        totalCount = allActiveTimelines.totalCount;
      }
      res = await (0, _timelines.getAllTimeline)(frameworkRequest, onlyUserFavorite, {
        pageSize: (_ref = pageSize !== null && pageSize !== void 0 ? pageSize : totalCount) !== null && _ref !== void 0 ? _ref : 1,
        pageIndex: pageIndex !== null && pageIndex !== void 0 ? pageIndex : 1
      }, search, sort, status, timelineType);
      return response.ok({
        body: (_res = res) !== null && _res !== void 0 ? _res : {}
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getTimelinesRoute = getTimelinesRoute;