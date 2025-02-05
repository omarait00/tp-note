"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraMetadataRequestRT = exports.InfraMetadataRT = exports.InfraMetadataProjectRT = exports.InfraMetadataOSRT = exports.InfraMetadataMachineRT = exports.InfraMetadataInstanceRT = exports.InfraMetadataInfoRT = exports.InfraMetadataHostRT = exports.InfraMetadataFeatureRT = exports.InfraMetadataCloudRT = exports.InfraMetadataAgentRT = exports.InfraMetadataAccountRT = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _types = require("../inventory_models/types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const InfraMetadataRequestRT = rt.type({
  nodeId: rt.string,
  nodeType: _types.ItemTypeRT,
  sourceId: rt.string,
  timeRange: rt.type({
    from: rt.number,
    to: rt.number
  })
});
exports.InfraMetadataRequestRT = InfraMetadataRequestRT;
const InfraMetadataFeatureRT = rt.type({
  name: rt.string,
  source: rt.string
});
exports.InfraMetadataFeatureRT = InfraMetadataFeatureRT;
const InfraMetadataOSRT = rt.partial({
  codename: rt.string,
  family: rt.string,
  kernel: rt.string,
  name: rt.string,
  platform: rt.string,
  version: rt.string,
  build: rt.string
});
exports.InfraMetadataOSRT = InfraMetadataOSRT;
const InfraMetadataHostRT = rt.partial({
  name: rt.string,
  hostname: rt.string,
  id: rt.string,
  ip: rt.union([rt.array(rt.string), rt.string]),
  mac: rt.union([rt.array(rt.string), rt.string]),
  os: InfraMetadataOSRT,
  architecture: rt.string,
  containerized: rt.boolean
});
exports.InfraMetadataHostRT = InfraMetadataHostRT;
const InfraMetadataInstanceRT = rt.partial({
  id: rt.string,
  name: rt.string
});
exports.InfraMetadataInstanceRT = InfraMetadataInstanceRT;
const InfraMetadataAccountRT = rt.partial({
  id: rt.string,
  name: rt.string
});
exports.InfraMetadataAccountRT = InfraMetadataAccountRT;
const InfraMetadataProjectRT = rt.partial({
  id: rt.string
});
exports.InfraMetadataProjectRT = InfraMetadataProjectRT;
const InfraMetadataMachineRT = rt.partial({
  interface: rt.string,
  type: rt.string
});
exports.InfraMetadataMachineRT = InfraMetadataMachineRT;
const InfraMetadataCloudRT = rt.partial({
  instance: InfraMetadataInstanceRT,
  provider: rt.string,
  account: InfraMetadataAccountRT,
  availability_zone: rt.string,
  project: InfraMetadataProjectRT,
  machine: InfraMetadataMachineRT,
  region: rt.string
});
exports.InfraMetadataCloudRT = InfraMetadataCloudRT;
const InfraMetadataAgentRT = rt.partial({
  id: rt.string,
  version: rt.string,
  policy: rt.string
});
exports.InfraMetadataAgentRT = InfraMetadataAgentRT;
const InfraMetadataInfoRT = rt.partial({
  cloud: InfraMetadataCloudRT,
  host: InfraMetadataHostRT,
  agent: InfraMetadataAgentRT
});
exports.InfraMetadataInfoRT = InfraMetadataInfoRT;
const InfraMetadataRequiredRT = rt.type({
  id: rt.string,
  name: rt.string,
  features: rt.array(InfraMetadataFeatureRT)
});
const InfraMetadataOptionalRT = rt.partial({
  info: InfraMetadataInfoRT
});
const InfraMetadataRT = rt.intersection([InfraMetadataRequiredRT, InfraMetadataOptionalRT]);
exports.InfraMetadataRT = InfraMetadataRT;