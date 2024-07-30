"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeRangeMetadataRoute = void 0;
var _ioTsUtils = require("@kbn/io-ts-utils");
var t = _interopRequireWildcard(require("io-ts"));
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
var _get_is_using_service_destination_metrics = require("../../lib/helpers/spans/get_is_using_service_destination_metrics");
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _default_api_types = require("../default_api_types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const timeRangeMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/time_range_metadata',
  params: t.type({
    query: t.intersection([t.type({
      useSpanName: _ioTsUtils.toBooleanRt
    }), _default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      query: {
        useSpanName,
        start,
        end,
        kuery
      }
    } = resources.params;
    const [isUsingServiceDestinationMetrics] = await Promise.all([(0, _get_is_using_service_destination_metrics.getIsUsingServiceDestinationMetrics)({
      apmEventClient,
      useSpanName,
      start,
      end,
      kuery
    })]);
    return {
      isUsingServiceDestinationMetrics
    };
  }
});
exports.timeRangeMetadataRoute = timeRangeMetadataRoute;