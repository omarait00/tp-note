"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsGetPingStatusesRoute = void 0;
var _constants = require("../../../common/constants");
var _query_pings = require("../../common/pings/query_pings");
var _get_pings = require("./get_pings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsGetPingStatusesRoute = libs => ({
  method: 'GET',
  path: _constants.SYNTHETICS_API_URLS.PING_STATUSES,
  validate: {
    query: _get_pings.getPingsRouteQuerySchema
  },
  handler: async ({
    uptimeEsClient,
    request,
    response
  }) => {
    const {
      from,
      to,
      index,
      monitorId,
      status,
      sort,
      size,
      pageIndex,
      locations,
      excludedLocations
    } = request.query;
    const result = await (0, _query_pings.queryPings)({
      uptimeEsClient,
      dateRange: {
        from,
        to
      },
      index,
      monitorId,
      status,
      sort,
      size,
      pageIndex,
      locations: locations ? JSON.parse(locations) : [],
      excludedLocations,
      fields: ['@timestamp', 'config_id', 'summary.*', 'error.*', 'observer.geo.name'],
      fieldsExtractorFn: extractPingStatus
    });
    return {
      ...result,
      from,
      to
    };
  }
});
exports.syntheticsGetPingStatusesRoute = syntheticsGetPingStatusesRoute;
function grabPingError(doc) {
  var _doc$fields, _doc$fields$errorCod, _doc$fields$errorId, _doc$fields$errorSta, _doc$fields$errorTyp, _doc$fields$errorMes;
  const docContainsError = Object.keys((_doc$fields = doc === null || doc === void 0 ? void 0 : doc.fields) !== null && _doc$fields !== void 0 ? _doc$fields : {}).some(key => key.startsWith('error.'));
  if (!docContainsError) {
    return undefined;
  }
  return {
    code: (_doc$fields$errorCod = doc.fields['error.code']) === null || _doc$fields$errorCod === void 0 ? void 0 : _doc$fields$errorCod[0],
    id: (_doc$fields$errorId = doc.fields['error.id']) === null || _doc$fields$errorId === void 0 ? void 0 : _doc$fields$errorId[0],
    stack_trace: (_doc$fields$errorSta = doc.fields['error.stack_trace']) === null || _doc$fields$errorSta === void 0 ? void 0 : _doc$fields$errorSta[0],
    type: (_doc$fields$errorTyp = doc.fields['error.type']) === null || _doc$fields$errorTyp === void 0 ? void 0 : _doc$fields$errorTyp[0],
    message: (_doc$fields$errorMes = doc.fields['error.message']) === null || _doc$fields$errorMes === void 0 ? void 0 : _doc$fields$errorMes[0]
  };
}
function extractPingStatus(doc) {
  var _doc$fields$Timestam, _doc$fields$config_id, _doc$fields$observer, _doc$fields$summaryU, _doc$fields$summaryD;
  return {
    timestamp: (_doc$fields$Timestam = doc.fields['@timestamp']) === null || _doc$fields$Timestam === void 0 ? void 0 : _doc$fields$Timestam[0],
    docId: doc._id,
    config_id: (_doc$fields$config_id = doc.fields.config_id) === null || _doc$fields$config_id === void 0 ? void 0 : _doc$fields$config_id[0],
    locationId: (_doc$fields$observer = doc.fields['observer.geo.name']) === null || _doc$fields$observer === void 0 ? void 0 : _doc$fields$observer[0],
    summary: {
      up: (_doc$fields$summaryU = doc.fields['summary.up']) === null || _doc$fields$summaryU === void 0 ? void 0 : _doc$fields$summaryU[0],
      down: (_doc$fields$summaryD = doc.fields['summary.down']) === null || _doc$fields$summaryD === void 0 ? void 0 : _doc$fields$summaryD[0]
    },
    error: grabPingError(doc)
  };
}