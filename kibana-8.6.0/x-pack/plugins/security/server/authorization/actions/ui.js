"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UIActions = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _server = require("../../../../features/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UIActions {
  constructor(versionNumber) {
    (0, _defineProperty2.default)(this, "prefix", void 0);
    this.prefix = `ui:${versionNumber}:`;
  }
  get(featureId, ...uiCapabilityParts) {
    if (!featureId || !(0, _lodash.isString)(featureId)) {
      throw new Error('featureId is required and must be a string');
    }
    if (!uiCapabilityParts || !Array.isArray(uiCapabilityParts)) {
      throw new Error('uiCapabilityParts is required and must be an array');
    }
    if (uiCapabilityParts.length === 0 || uiCapabilityParts.findIndex(part => !part || !(0, _lodash.isString)(part) || !_server.uiCapabilitiesRegex.test(part)) >= 0) {
      throw new Error(`UI capabilities are required, and must all be strings matching the pattern ${_server.uiCapabilitiesRegex}`);
    }
    return `${this.prefix}${featureId}/${uiCapabilityParts.join('/')}`;
  }
}
exports.UIActions = UIActions;