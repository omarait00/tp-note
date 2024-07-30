"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spanLinksRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _create_apm_server_route = require("../apm_routes/create_apm_server_route");
var _get_span_links_details = require("./get_span_links_details");
var _get_linked_children = require("./get_linked_children");
var _default_api_types = require("../default_api_types");
var _processor_event = require("../../../common/processor_event");
var _get_linked_parents = require("./get_linked_parents");
var _get_apm_event_client = require("../../lib/helpers/get_apm_event_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const linkedParentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}/span_links/{spanId}/parents',
  params: t.type({
    path: t.type({
      traceId: t.string,
      spanId: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt, t.type({
      processorEvent: _processor_event.processorEventRt
    })])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params: {
        query,
        path
      }
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const linkedParents = await (0, _get_linked_parents.getLinkedParentsOfSpan)({
      apmEventClient,
      traceId: path.traceId,
      spanId: path.spanId,
      start: query.start,
      end: query.end,
      processorEvent: query.processorEvent
    });
    return {
      spanLinksDetails: await (0, _get_span_links_details.getSpanLinksDetails)({
        apmEventClient,
        spanLinks: linkedParents,
        kuery: query.kuery,
        start: query.start,
        end: query.end
      })
    };
  }
});
const linkedChildrenRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/traces/{traceId}/span_links/{spanId}/children',
  params: t.type({
    path: t.type({
      traceId: t.string,
      spanId: t.string
    }),
    query: t.intersection([_default_api_types.kueryRt, _default_api_types.rangeRt])
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params: {
        query,
        path
      }
    } = resources;
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const linkedChildren = await (0, _get_linked_children.getLinkedChildrenOfSpan)({
      apmEventClient,
      traceId: path.traceId,
      spanId: path.spanId,
      start: query.start,
      end: query.end
    });
    return {
      spanLinksDetails: await (0, _get_span_links_details.getSpanLinksDetails)({
        apmEventClient,
        spanLinks: linkedChildren,
        kuery: query.kuery,
        start: query.start,
        end: query.end
      })
    };
  }
});
const spanLinksRouteRepository = {
  ...linkedParentsRoute,
  ...linkedChildrenRoute
};
exports.spanLinksRouteRepository = spanLinksRouteRepository;