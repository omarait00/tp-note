"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineObject = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _timeline = require("../../../../common/types/timeline");
var _timelines = require("../saved_object/timelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TimelineObject {
  constructor({
    id = null,
    type = _timeline.TimelineType.default,
    version = null,
    frameworkRequest
  }) {
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "version", void 0);
    (0, _defineProperty2.default)(this, "frameworkRequest", void 0);
    (0, _defineProperty2.default)(this, "data", void 0);
    this.id = id;
    this.type = type;
    this.version = version;
    this.frameworkRequest = frameworkRequest;
    this.data = null;
  }
  async getTimeline() {
    this.data = this.id != null ? this.type === _timeline.TimelineType.template ? await (0, _timelines.getTimelineTemplateOrNull)(this.frameworkRequest, this.id) : await (0, _timelines.getTimelineOrNull)(this.frameworkRequest, this.id) : null;
    return this.data;
  }
  get getData() {
    return this.data;
  }
  get isImmutable() {
    var _this$data;
    return ((_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.status) === _timeline.TimelineStatus.immutable;
  }
  get isExists() {
    return this.data != null;
  }
  get isUpdatable() {
    return this.isExists && !this.isImmutable;
  }
  get isCreatable() {
    return !this.isExists;
  }
  get isUpdatableViaImport() {
    return this.type === _timeline.TimelineType.template && this.isExists;
  }
  get getVersion() {
    return this.version;
  }
  get getId() {
    return this.id;
  }
}
exports.TimelineObject = TimelineObject;