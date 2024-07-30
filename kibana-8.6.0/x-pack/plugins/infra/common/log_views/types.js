"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logViewStatusRT = exports.logViewRT = exports.logViewOriginRT = exports.logViewIndexStatusRT = exports.logViewFieldColumnConfigurationRT = exports.logViewColumnConfigurationRT = exports.logViewAttributesRT = exports.logIndexReferenceRT = exports.logIndexNameReferenceRT = exports.logDataViewReferenceRT = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const logViewOriginRT = rt.keyof({
  stored: null,
  internal: null,
  'infra-source-stored': null,
  'infra-source-internal': null,
  'infra-source-fallback': null
});
exports.logViewOriginRT = logViewOriginRT;
// Kibana data views
const logDataViewReferenceRT = rt.type({
  type: rt.literal('data_view'),
  dataViewId: rt.string
});
exports.logDataViewReferenceRT = logDataViewReferenceRT;
// Index name
const logIndexNameReferenceRT = rt.type({
  type: rt.literal('index_name'),
  indexName: rt.string
});
exports.logIndexNameReferenceRT = logIndexNameReferenceRT;
const logIndexReferenceRT = rt.union([logDataViewReferenceRT, logIndexNameReferenceRT]);
exports.logIndexReferenceRT = logIndexReferenceRT;
const logViewCommonColumnConfigurationRT = rt.strict({
  id: rt.string
});
const logViewTimestampColumnConfigurationRT = rt.strict({
  timestampColumn: logViewCommonColumnConfigurationRT
});
const logViewMessageColumnConfigurationRT = rt.strict({
  messageColumn: logViewCommonColumnConfigurationRT
});
const logViewFieldColumnConfigurationRT = rt.strict({
  fieldColumn: rt.intersection([logViewCommonColumnConfigurationRT, rt.strict({
    field: rt.string
  })])
});
exports.logViewFieldColumnConfigurationRT = logViewFieldColumnConfigurationRT;
const logViewColumnConfigurationRT = rt.union([logViewTimestampColumnConfigurationRT, logViewMessageColumnConfigurationRT, logViewFieldColumnConfigurationRT]);
exports.logViewColumnConfigurationRT = logViewColumnConfigurationRT;
const logViewAttributesRT = rt.strict({
  name: rt.string,
  description: rt.string,
  logIndices: logIndexReferenceRT,
  logColumns: rt.array(logViewColumnConfigurationRT)
});
exports.logViewAttributesRT = logViewAttributesRT;
const logViewRT = rt.exact(rt.intersection([rt.type({
  id: rt.string,
  origin: logViewOriginRT,
  attributes: logViewAttributesRT
}), rt.partial({
  updatedAt: rt.number,
  version: rt.string
})]));
exports.logViewRT = logViewRT;
const logViewIndexStatusRT = rt.keyof({
  available: null,
  empty: null,
  missing: null,
  unknown: null
});
exports.logViewIndexStatusRT = logViewIndexStatusRT;
const logViewStatusRT = rt.strict({
  index: logViewIndexStatusRT
});
exports.logViewStatusRT = logViewStatusRT;