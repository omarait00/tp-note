"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventMetadataRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_event_metadata = require("./get_event_metadata");
var _processor_event = require("../../../common/processor_event");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const eventMetadataRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/event_metadata/{processorEvent}/{id}',
  options: {
    tags: ['access:apm']
  },
  params: t.type({
    path: t.type({
      processorEvent: _processor_event.processorEventRt,
      id: t.string
    })
  }),
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      path: {
        processorEvent,
        id
      }
    } = resources.params;
    const metadata = await (0, _get_event_metadata.getEventMetadata)({
      apmEventClient,
      processorEvent,
      id
    });
    return {
      metadata
    };
  }
});
const eventMetadataRouteRepository = eventMetadataRoute;
exports.eventMetadataRouteRepository = eventMetadataRouteRepository;