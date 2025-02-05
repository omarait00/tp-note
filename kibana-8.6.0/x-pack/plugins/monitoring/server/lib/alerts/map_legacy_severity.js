"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapLegacySeverity = mapLegacySeverity;
var _enums = require("../../../common/enums");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mapLegacySeverity(severity) {
  const floor = Math.floor(severity / 1000);
  if (floor <= 1) {
    return _enums.AlertSeverity.Warning;
  }
  return _enums.AlertSeverity.Danger;
}