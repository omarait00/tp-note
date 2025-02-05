"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToDataStreamFormat = convertToDataStreamFormat;
var _monitor_defaults = require("../../../common/constants/monitor_defaults");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function convertToDataStreamFormat(monitor) {
  var _monitor$enabled, _monitor$namespace;
  return {
    type: monitor.type,
    id: monitor.id,
    // Schedule is needed by service at root level as well
    schedule: monitor.schedule,
    enabled: (_monitor$enabled = monitor.enabled) !== null && _monitor$enabled !== void 0 ? _monitor$enabled : true,
    data_stream: {
      namespace: (_monitor$namespace = monitor.namespace) !== null && _monitor$namespace !== void 0 ? _monitor$namespace : _monitor_defaults.DEFAULT_NAMESPACE_STRING
    },
    streams: [{
      data_stream: {
        dataset: monitor.type,
        type: 'synthetics'
      },
      ...monitor
    }]
  };
}