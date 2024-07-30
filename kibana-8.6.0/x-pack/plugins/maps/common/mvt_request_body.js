"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeMvtResponseBody = decodeMvtResponseBody;
exports.encodeMvtResponseBody = encodeMvtResponseBody;
exports.getAggsTileRequest = getAggsTileRequest;
exports.getHitsTileRequest = getHitsTileRequest;
var _risonNode = _interopRequireDefault(require("rison-node"));
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function decodeMvtResponseBody(encodedRequestBody) {
  return _risonNode.default.decode(decodeURIComponent(encodedRequestBody).replace('%25', '%'));
}
function encodeMvtResponseBody(unencodedRequestBody) {
  // URL encoding replaces unsafe ASCII characters with a '%' followed by two hexadecimal digits
  // encodeURIComponent does not encode '%'
  // This causes preexisting '%' to break decoding because they are not valid URL encoding
  // To prevent this, properly url encode '%' before calling encodeURIComponent
  return encodeURIComponent(_risonNode.default.encode(unencodedRequestBody).replace('%', '%25'));
}
function getAggsTileRequest({
  encodedRequestBody,
  geometryFieldName,
  gridPrecision,
  hasLabels,
  index,
  renderAs = _constants.RENDER_AS.POINT,
  x,
  y,
  z
}) {
  const requestBody = decodeMvtResponseBody(encodedRequestBody);
  return {
    path: `/${encodeURIComponent(index)}/_mvt/${geometryFieldName}/${z}/${x}/${y}`,
    body: {
      size: 0,
      // no hits
      grid_precision: gridPrecision,
      exact_bounds: false,
      extent: 4096,
      // full resolution,
      query: requestBody.query,
      grid_agg: renderAs === _constants.RENDER_AS.HEX ? 'geohex' : 'geotile',
      grid_type: renderAs === _constants.RENDER_AS.GRID || renderAs === _constants.RENDER_AS.HEX ? 'grid' : 'centroid',
      aggs: requestBody.aggs,
      fields: requestBody.fields,
      runtime_mappings: requestBody.runtime_mappings,
      with_labels: hasLabels
    }
  };
}
function getHitsTileRequest({
  encodedRequestBody,
  geometryFieldName,
  hasLabels,
  index,
  x,
  y,
  z
}) {
  const requestBody = decodeMvtResponseBody(encodedRequestBody);
  return {
    path: `/${encodeURIComponent(index)}/_mvt/${geometryFieldName}/${z}/${x}/${y}`,
    body: {
      grid_precision: 0,
      // no aggs
      exact_bounds: true,
      extent: 4096,
      // full resolution,
      query: requestBody.query,
      fields: requestBody.fields ? requestBody.fields : [],
      runtime_mappings: requestBody.runtime_mappings,
      sort: requestBody.sort ? requestBody.sort : [],
      track_total_hits: typeof requestBody.size === 'number' ? requestBody.size + 1 : false,
      with_labels: hasLabels
    }
  };
}