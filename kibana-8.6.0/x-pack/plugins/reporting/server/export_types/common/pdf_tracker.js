"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTracker = getTracker;
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TRANSACTION_TYPE = 'reporting';
const SPANTYPE_SETUP = 'setup';
function getTracker() {
  const apmTrans = _elasticApmNode.default.startTransaction('generate-pdf', TRANSACTION_TYPE);
  let apmScreenshots = null;
  return {
    startScreenshots() {
      apmScreenshots = (apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.startSpan('screenshots-pipeline', SPANTYPE_SETUP)) || null;
    },
    endScreenshots() {
      if (apmScreenshots) apmScreenshots.end();
    },
    setCpuUsage(cpu) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('cpu', cpu, false);
    },
    setMemoryUsage(memory) {
      apmTrans === null || apmTrans === void 0 ? void 0 : apmTrans.setLabel('memory', memory, false);
    },
    end() {
      if (apmTrans) apmTrans.end();
    }
  };
}