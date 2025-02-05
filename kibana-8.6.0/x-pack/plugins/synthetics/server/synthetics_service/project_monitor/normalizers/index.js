"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizeProjectMonitors = exports.normalizeProjectMonitor = void 0;
var _runtime_types = require("../../../../common/runtime_types");
var _browser_monitor = require("./browser_monitor");
var _icmp_monitor = require("./icmp_monitor");
var _tcp_monitor = require("./tcp_monitor");
var _http_monitor = require("./http_monitor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const normalizeProjectMonitor = props => {
  const {
    monitor
  } = props;
  const type = monitor.type || _runtime_types.DataStream.BROWSER;
  switch (type) {
    case _runtime_types.DataStream.BROWSER:
      return (0, _browser_monitor.getNormalizeBrowserFields)(props);
    case _runtime_types.DataStream.HTTP:
      return (0, _http_monitor.getNormalizeHTTPFields)(props);
    case _runtime_types.DataStream.TCP:
      return (0, _tcp_monitor.getNormalizeTCPFields)(props);
    case _runtime_types.DataStream.ICMP:
      return (0, _icmp_monitor.getNormalizeICMPFields)(props);
    default:
      throw new Error(`Unsupported monitor type ${monitor.type}`);
  }
};
exports.normalizeProjectMonitor = normalizeProjectMonitor;
const normalizeProjectMonitors = ({
  locations = [],
  privateLocations = [],
  monitors = [],
  projectId,
  namespace,
  version
}) => {
  return monitors.map(monitor => {
    return normalizeProjectMonitor({
      monitor,
      locations,
      privateLocations,
      projectId,
      namespace,
      version
    });
  });
};
exports.normalizeProjectMonitors = normalizeProjectMonitors;