"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectMonitorsResponseCodec = exports.ProjectMonitorsRequestCodec = exports.ProjectMonitorThrottlingConfigCodec = exports.ProjectMonitorMetaDataCodec = exports.ProjectMonitorCodec = exports.LegacyProjectMonitorsRequestCodec = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _monitor_configs = require("./monitor_configs");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ProjectMonitorThrottlingConfigCodec = t.interface({
  download: t.number,
  upload: t.number,
  latency: t.number
});
exports.ProjectMonitorThrottlingConfigCodec = ProjectMonitorThrottlingConfigCodec;
const ProjectMonitorCodec = t.intersection([t.interface({
  type: t.string,
  id: t.string,
  name: t.string,
  schedule: t.number,
  locations: t.array(t.string)
}), t.partial({
  content: t.string,
  timeout: t.string,
  privateLocations: t.array(t.string),
  throttling: ProjectMonitorThrottlingConfigCodec,
  screenshot: _monitor_configs.ScreenshotOptionCodec,
  tags: t.union([t.string, t.array(t.string)]),
  ignoreHTTPSErrors: t.boolean,
  playwrightOptions: t.record(t.string, t.unknown),
  filter: t.interface({
    match: t.string
  }),
  params: t.record(t.string, t.unknown),
  enabled: t.boolean,
  urls: t.union([t.string, t.array(t.string)]),
  hosts: t.union([t.string, t.array(t.string)]),
  max_redirects: t.string,
  wait: t.string,
  hash: t.string
})]);
exports.ProjectMonitorCodec = ProjectMonitorCodec;
const ProjectMonitorsRequestCodec = t.interface({
  monitors: t.array(ProjectMonitorCodec)
});
exports.ProjectMonitorsRequestCodec = ProjectMonitorsRequestCodec;
const LegacyProjectMonitorsRequestCodec = t.interface({
  project: t.string,
  keep_stale: t.boolean,
  monitors: t.array(ProjectMonitorCodec)
});
exports.LegacyProjectMonitorsRequestCodec = LegacyProjectMonitorsRequestCodec;
const ProjectMonitorMetaDataCodec = t.interface({
  hash: t.string,
  journey_id: t.string
});
exports.ProjectMonitorMetaDataCodec = ProjectMonitorMetaDataCodec;
const ProjectMonitorsResponseCodec = t.intersection([t.interface({
  total: t.number,
  monitors: t.array(ProjectMonitorMetaDataCodec)
}), t.partial({
  after_key: t.string
})]);
exports.ProjectMonitorsResponseCodec = ProjectMonitorsResponseCodec;