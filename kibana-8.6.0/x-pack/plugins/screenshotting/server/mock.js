"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockScreenshottingStart = createMockScreenshottingStart;
var _mock = require("./browsers/mock");
var _mock2 = require("./screenshots/mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createMockScreenshottingStart() {
  const driver = (0, _mock.createMockBrowserDriverFactory)();
  const {
    getScreenshots
  } = (0, _mock2.createMockScreenshots)();
  const {
    diagnose
  } = driver;
  return {
    diagnose,
    getScreenshots
  };
}