"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cypress = require("cypress");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-default-export
var _default = (0, _cypress.defineConfig)({
  defaultCommandTimeout: 60000,
  execTimeout: 120000,
  pageLoadTimeout: 12000,
  retries: {
    runMode: 1,
    openMode: 0
  },
  screenshotsFolder: '../../../target/kibana-osquery/cypress/screenshots',
  trashAssetsBeforeRuns: false,
  video: false,
  videosFolder: '../../../target/kibana-osquery/cypress/videos',
  viewportHeight: 900,
  viewportWidth: 1440,
  experimentalStudio: true,
  env: {
    'cypress-react-selector': {
      root: '#osquery-app'
    }
  },
  e2e: {
    baseUrl: 'http://localhost:5601',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
exports.default = _default;
module.exports = exports.default;