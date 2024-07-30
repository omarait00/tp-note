"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Alert = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _common = require("../../common");
var _lib = require("../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class Alert {
  constructor(id, {
    state,
    meta = {}
  } = {}) {
    (0, _defineProperty2.default)(this, "scheduledExecutionOptions", void 0);
    (0, _defineProperty2.default)(this, "meta", void 0);
    (0, _defineProperty2.default)(this, "state", void 0);
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "id", void 0);
    this.id = id;
    this.state = state || {};
    this.context = {};
    this.meta = meta;
  }
  getId() {
    return this.id;
  }
  hasScheduledActions() {
    return this.scheduledExecutionOptions !== undefined;
  }
  isThrottled(throttle) {
    if (this.scheduledExecutionOptions === undefined) {
      return false;
    }
    const throttleMills = throttle ? (0, _lib.parseDuration)(throttle) : 0;
    if (this.meta.lastScheduledActions && this.scheduledActionGroupIsUnchanged(this.meta.lastScheduledActions, this.scheduledExecutionOptions) && this.meta.lastScheduledActions.date.getTime() + throttleMills > Date.now()) {
      return true;
    }
    return false;
  }
  scheduledActionGroupHasChanged() {
    if (!this.meta.lastScheduledActions && this.scheduledExecutionOptions) {
      // it is considered a change when there are no previous scheduled actions
      // and new scheduled actions
      return true;
    }
    if (this.meta.lastScheduledActions && this.scheduledExecutionOptions) {
      // compare previous and new scheduled actions if both exist
      return !this.scheduledActionGroupIsUnchanged(this.meta.lastScheduledActions, this.scheduledExecutionOptions);
    }
    // no previous and no new scheduled actions
    return false;
  }
  scheduledActionGroupIsUnchanged(lastScheduledActions, scheduledExecutionOptions) {
    return lastScheduledActions.group === scheduledExecutionOptions.actionGroup;
  }
  getLastScheduledActions() {
    return this.meta.lastScheduledActions;
  }
  getScheduledActionOptions() {
    return this.scheduledExecutionOptions;
  }
  unscheduleActions() {
    this.scheduledExecutionOptions = undefined;
    return this;
  }
  getState() {
    return this.state;
  }
  getContext() {
    return this.context;
  }
  hasContext() {
    return !(0, _lodash.isEmpty)(this.context);
  }
  scheduleActions(actionGroup, context = {}) {
    this.ensureHasNoScheduledActions();
    this.setContext(context);
    this.scheduledExecutionOptions = {
      actionGroup,
      context,
      state: this.state
    };
    return this;
  }
  setContext(context) {
    this.context = context;
    return this;
  }
  ensureHasNoScheduledActions() {
    if (this.hasScheduledActions()) {
      throw new Error('Alert instance execution has already been scheduled, cannot schedule twice');
    }
  }
  replaceState(state) {
    this.state = state;
    return this;
  }
  updateLastScheduledActions(group) {
    this.meta.lastScheduledActions = {
      group,
      date: new Date()
    };
  }

  /**
   * Used to serialize alert instance state
   */
  toJSON() {
    return _common.rawAlertInstance.encode(this.toRaw());
  }
  toRaw() {
    return {
      state: this.state,
      meta: this.meta
    };
  }
}
exports.Alert = Alert;