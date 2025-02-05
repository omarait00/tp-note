"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScreenshottingPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _browsers = require("./browsers");
var _config = require("./config");
var _screenshots = require("./screenshots");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ScreenshottingPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "packageInfo", void 0);
    (0, _defineProperty2.default)(this, "screenshotMode", void 0);
    (0, _defineProperty2.default)(this, "browserDriverFactory", void 0);
    (0, _defineProperty2.default)(this, "screenshots", void 0);
    this.logger = context.logger.get();
    this.config = context.config.get();
    this.packageInfo = context.env.packageInfo;
  }
  setup({
    http
  }, {
    screenshotMode,
    cloud
  }) {
    this.screenshotMode = screenshotMode;
    this.browserDriverFactory = (async () => {
      const paths = new _browsers.ChromiumArchivePaths();
      const logger = this.logger.get('chromium');
      const [config, binaryPath] = await Promise.all([(0, _config.createConfig)(this.logger, this.config), (0, _browsers.install)(paths, logger, (0, _utils.getChromiumPackage)())]);
      const basePath = http.basePath.serverBasePath;
      return new _browsers.HeadlessChromiumDriverFactory(this.screenshotMode, config, logger, binaryPath, basePath);
    })();
    this.browserDriverFactory.catch(error => {
      this.logger.error('Error in screenshotting setup, it may not function properly.');
      this.logger.error(error);
    });
    this.screenshots = (async () => {
      const browserDriverFactory = await this.browserDriverFactory;
      return new _screenshots.Screenshots(browserDriverFactory, this.logger, this.packageInfo, http, this.config, cloud);
    })();
    // Already handled in `browserDriverFactory`
    this.screenshots.catch(() => {});
    return {};
  }
  start({}) {
    return {
      diagnose: () => (0, _rxjs.from)(this.browserDriverFactory).pipe((0, _operators.switchMap)(factory => factory.diagnose())),
      getScreenshots: options => (0, _rxjs.from)(this.screenshots).pipe((0, _operators.switchMap)(screenshots => screenshots.getScreenshots(options)))
    };
  }
  stop() {}
}
exports.ScreenshottingPlugin = ScreenshottingPlugin;