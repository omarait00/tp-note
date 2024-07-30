"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OsqueryParamsCamelCase = exports.OsqueryParams = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _osqueryIoTsTypes = require("@kbn/osquery-io-ts-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const OsqueryParams = t.type({
  id: t.string,
  query: t.union([t.string, t.undefined]),
  ecs_mapping: t.union([_osqueryIoTsTypes.ecsMapping, t.undefined]),
  queries: t.union([_osqueryIoTsTypes.arrayQueries, t.undefined]),
  pack_id: t.union([t.string, t.undefined]),
  saved_query_id: t.union([t.string, t.undefined])
});
exports.OsqueryParams = OsqueryParams;
const OsqueryParamsCamelCase = t.type({
  id: t.string,
  query: t.union([t.string, t.undefined]),
  ecsMapping: t.union([_osqueryIoTsTypes.ecsMapping, t.undefined]),
  queries: t.union([_osqueryIoTsTypes.arrayQueries, t.undefined]),
  packId: t.union([t.string, t.undefined]),
  savedQueryId: t.union([t.string, t.undefined])
});
exports.OsqueryParamsCamelCase = OsqueryParamsCamelCase;