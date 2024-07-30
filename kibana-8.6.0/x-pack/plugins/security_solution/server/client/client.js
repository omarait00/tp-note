"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AppClient {
  constructor(_spaceId, config) {
    (0, _defineProperty2.default)(this, "signalsIndex", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "previewIndex", void 0);
    (0, _defineProperty2.default)(this, "sourcererDataViewId", void 0);
    (0, _defineProperty2.default)(this, "getSignalsIndex", () => this.signalsIndex);
    (0, _defineProperty2.default)(this, "getPreviewIndex", () => this.previewIndex);
    (0, _defineProperty2.default)(this, "getSourcererDataViewId", () => this.sourcererDataViewId);
    (0, _defineProperty2.default)(this, "getSpaceId", () => this.spaceId);
    this.config = config;
    const configuredSignalsIndex = this.config.signalsIndex;
    this.signalsIndex = `${configuredSignalsIndex}-${_spaceId}`;
    this.previewIndex = `${_constants.DEFAULT_PREVIEW_INDEX}-${_spaceId}`;
    this.sourcererDataViewId = `${_constants.DEFAULT_DATA_VIEW_ID}-${_spaceId}`;
    this.spaceId = _spaceId;
  }
}
exports.AppClient = AppClient;