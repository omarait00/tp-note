"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterSource = void 0;
var _field_names = require("../../../../../../common/field_maps/field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const filterSource = doc => {
  var _doc$_source;
  const docSource = (_doc$_source = doc._source) !== null && _doc$_source !== void 0 ? _doc$_source : {};
  const {
    event,
    kibana,
    signal,
    threshold_result: siemSignalsThresholdResult,
    [_field_names.ALERT_THRESHOLD_RESULT]: alertThresholdResult,
    ...filteredSource
  } = docSource || {
    event: null,
    kibana: null,
    signal: null,
    threshold_result: null,
    [_field_names.ALERT_THRESHOLD_RESULT]: null
  };
  return filteredSource;
};
exports.filterSource = filterSource;