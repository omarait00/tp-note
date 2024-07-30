"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSharedExceptionListRoute = exports.CreateSharedExceptionListRequestParams = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _uuid = _interopRequireDefault(require("uuid"));
var _constants = require("../../../../../common/constants");
var _utils = require("../../../detection_engine/routes/utils");
var _route_validation = require("../../../../utils/build_validation/route_validation");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * URL path parameters of the API route.
 */
const CreateSharedExceptionListRequestParams = t.exact(t.type({
  name: t.string,
  description: t.string
}));
exports.CreateSharedExceptionListRequestParams = CreateSharedExceptionListRequestParams;
const createSharedExceptionListRoute = router => {
  router.post({
    path: _constants.SHARED_EXCEPTION_LIST_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(CreateSharedExceptionListRequestParams)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const {
      description,
      name
    } = request.body;
    try {
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'licensing', 'lists']);
      const listsClient = ctx.securitySolution.getExceptionListClient();
      const createdSharedList = await (listsClient === null || listsClient === void 0 ? void 0 : listsClient.createExceptionList({
        description,
        immutable: false,
        listId: _uuid.default.v4(),
        meta: undefined,
        name,
        namespaceType: 'single',
        tags: [],
        type: 'detection',
        version: 1
      }));
      return response.ok({
        body: createdSharedList
      });
    } catch (exc) {
      return siemResponse.error({
        body: exc.message,
        statusCode: 404
      });
    }
  });
};
exports.createSharedExceptionListRoute = createSharedExceptionListRoute;