"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitorManagementEnablementResultCodec = exports.FetchMonitorOverviewQueryArgsCodec = exports.FetchMonitorManagementListQueryArgsCodec = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FetchMonitorManagementListQueryArgsCodec = t.partial({
  page: t.number,
  perPage: t.number,
  sortField: t.string,
  sortOrder: t.union([t.literal('desc'), t.literal('asc')]),
  query: t.string,
  searchFields: t.array(t.string),
  tags: t.array(t.string),
  locations: t.array(t.string),
  monitorType: t.array(t.string)
});
exports.FetchMonitorManagementListQueryArgsCodec = FetchMonitorManagementListQueryArgsCodec;
const FetchMonitorOverviewQueryArgsCodec = t.partial({
  query: t.string,
  searchFields: t.array(t.string),
  tags: t.array(t.string),
  locations: t.array(t.string),
  monitorType: t.array(t.string),
  sortField: t.string,
  sortOrder: t.string
});
exports.FetchMonitorOverviewQueryArgsCodec = FetchMonitorOverviewQueryArgsCodec;
const MonitorManagementEnablementResultCodec = t.type({
  isEnabled: t.boolean,
  canEnable: t.boolean,
  canManageApiKeys: t.boolean,
  areApiKeysEnabled: t.boolean,
  isValidApiKey: t.boolean
});
exports.MonitorManagementEnablementResultCodec = MonitorManagementEnablementResultCodec;