"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBrowserFieldsByFeatureId = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var t = _interopRequireWildcard(require("io-ts"));
var _constants = require("../../common/constants");
var _route_validation = require("./utils/route_validation");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getBrowserFieldsByFeatureId = router => {
  router.get({
    path: `${_constants.BASE_RAC_ALERTS_API_PATH}/browser_fields`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(t.exact(t.type({
        featureIds: t.union([t.string, t.array(t.string)])
      })))
    },
    options: {
      tags: ['access:rac']
    }
  }, async (context, request, response) => {
    try {
      var _indices$filter;
      const racContext = await context.rac;
      const alertsClient = await racContext.getAlertsClient();
      const {
        featureIds = []
      } = request.query;
      const indices = await alertsClient.getAuthorizedAlertsIndices(Array.isArray(featureIds) ? featureIds : [featureIds]);
      const o11yIndices = (_indices$filter = indices === null || indices === void 0 ? void 0 : indices.filter(index => index.startsWith('.alerts-observability'))) !== null && _indices$filter !== void 0 ? _indices$filter : [];
      if (o11yIndices.length === 0) {
        return response.notFound({
          body: {
            message: `No alerts-observability indices found for featureIds [${featureIds}]`,
            attributes: {
              success: false
            }
          }
        });
      }
      const browserFields = await alertsClient.getBrowserFields({
        indices: o11yIndices,
        metaFields: ['_id', '_index'],
        allowNoIndex: true
      });
      return response.ok({
        body: browserFields
      });
    } catch (error) {
      const formatedError = (0, _securitysolutionEsUtils.transformError)(error);
      const contentType = {
        'content-type': 'application/json'
      };
      const defaultedHeaders = {
        ...contentType
      };
      return response.customError({
        headers: defaultedHeaders,
        statusCode: formatedError.statusCode,
        body: {
          message: formatedError.message,
          attributes: {
            success: false
          }
        }
      });
    }
  });
};
exports.getBrowserFieldsByFeatureId = getBrowserFieldsByFeatureId;