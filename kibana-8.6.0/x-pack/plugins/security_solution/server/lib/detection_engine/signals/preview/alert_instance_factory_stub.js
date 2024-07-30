"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alertInstanceFactoryStub = void 0;
var _alert = require("../../../../../../alerting/server/alert");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const alertInstanceFactoryStub = id => ({
  getState() {
    return {};
  },
  replaceState(state) {
    return new _alert.Alert('', {
      state: {},
      meta: {
        lastScheduledActions: {
          group: 'default',
          date: new Date()
        }
      }
    });
  },
  scheduleActions(actionGroup, alertcontext) {
    return new _alert.Alert('', {
      state: {},
      meta: {
        lastScheduledActions: {
          group: 'default',
          date: new Date()
        }
      }
    });
  },
  setContext(alertContext) {
    return new _alert.Alert('', {
      state: {},
      meta: {
        lastScheduledActions: {
          group: 'default',
          date: new Date()
        }
      }
    });
  },
  getContext() {
    return {};
  },
  hasContext() {
    return false;
  }
});
exports.alertInstanceFactoryStub = alertInstanceFactoryStub;