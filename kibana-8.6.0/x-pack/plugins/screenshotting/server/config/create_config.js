"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = createConfig;
var _lodash = require("lodash");
var _default_chromium_sandbox_disabled = require("./default_chromium_sandbox_disabled");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Set up dynamic config defaults
 * - xpack.capture.browser.chromium.disableSandbox
 */
async function createConfig(parentLogger, config) {
  const logger = parentLogger.get('config');
  if (config.browser.chromium.disableSandbox != null) {
    // disableSandbox was set by user
    return config;
  }

  // disableSandbox was not set by user, apply default for OS
  const {
    os,
    disableSandbox
  } = await (0, _default_chromium_sandbox_disabled.getDefaultChromiumSandboxDisabled)();
  const osName = [os.os, os.dist, os.release].filter(Boolean).map(_lodash.upperFirst).join(' ').trim();
  logger.debug(`Running on OS: '${osName}'`);
  if (disableSandbox === true) {
    logger.warn(`Chromium sandbox provides an additional layer of protection, but is not supported for ${osName} OS. Automatically setting 'xpack.screenshotting.browser.chromium.disableSandbox: true'.`);
  } else {
    logger.info(`Chromium sandbox provides an additional layer of protection, and is supported for ${osName} OS. Automatically enabling Chromium sandbox.`);
  }
  return (0, _lodash.set)((0, _lodash.cloneDeep)(config), 'browser.chromium.disableSandbox', disableSandbox);
}