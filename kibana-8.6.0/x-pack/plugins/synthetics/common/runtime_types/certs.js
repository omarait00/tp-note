"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetCertsParamsType = exports.CertType = exports.CertResultType = exports.CertMonitorType = void 0;
var t = _interopRequireWildcard(require("io-ts"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetCertsParamsType = t.intersection([t.type({
  pageIndex: t.number
}), t.partial({
  search: t.string,
  notValidBefore: t.string,
  notValidAfter: t.string,
  from: t.string,
  to: t.string,
  sortBy: t.string,
  direction: t.string,
  size: t.number
})]);
exports.GetCertsParamsType = GetCertsParamsType;
const CertMonitorType = t.partial({
  name: t.string,
  id: t.string,
  url: t.string
});
exports.CertMonitorType = CertMonitorType;
const CertType = t.intersection([t.type({
  monitors: t.array(CertMonitorType),
  sha256: t.string
}), t.partial({
  not_after: t.string,
  not_before: t.string,
  common_name: t.string,
  issuer: t.string,
  sha1: t.string
})]);
exports.CertType = CertType;
const CertResultType = t.type({
  certs: t.array(CertType),
  total: t.number
});
exports.CertResultType = CertResultType;