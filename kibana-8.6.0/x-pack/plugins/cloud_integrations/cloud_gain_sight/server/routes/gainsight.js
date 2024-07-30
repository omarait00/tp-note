"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderGainsightLibraryFactory = exports.registerGainsightWidgetRoute = exports.registerGainsightStyleRoute = exports.registerGainsightRoute = exports.GAINSIGHT_WIDGET_PATH = exports.GAINSIGHT_STYLE_PATH = exports.GAINSIGHT_LIBRARY_PATH = void 0;
var _path = _interopRequireDefault(require("path"));
var _promises = _interopRequireDefault(require("fs/promises"));
var _crypto = require("crypto");
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** @internal exported for testing */
const GAINSIGHT_LIBRARY_PATH = _path.default.join(__dirname, '..', 'assets', 'gainsight_library.js');
exports.GAINSIGHT_LIBRARY_PATH = GAINSIGHT_LIBRARY_PATH;
const GAINSIGHT_WIDGET_PATH = _path.default.join(__dirname, '..', 'assets', 'gainsight_widget.js');
exports.GAINSIGHT_WIDGET_PATH = GAINSIGHT_WIDGET_PATH;
const GAINSIGHT_STYLE_PATH = _path.default.join(__dirname, '..', 'assets', 'gainsight_style.css');

/** @internal exported for testing */
exports.GAINSIGHT_STYLE_PATH = GAINSIGHT_STYLE_PATH;
const renderGainsightLibraryFactory = (dist = true, filePath = GAINSIGHT_LIBRARY_PATH) => (0, _lodash.once)(async () => {
  const srcBuffer = await _promises.default.readFile(filePath);
  return {
    body: srcBuffer,
    // In dist mode, return a long max-age, otherwise use etag + must-revalidate
    headers: dist ? {
      'cache-control': `max-age=${DAY * 365}`
    } : {
      'cache-control': 'must-revalidate',
      etag: calculateHash(srcBuffer)
    }
  };
});
exports.renderGainsightLibraryFactory = renderGainsightLibraryFactory;
function calculateHash(srcBuffer) {
  const hash = (0, _crypto.createHash)('sha1');
  hash.update(srcBuffer);
  return hash.digest('hex');
}
const registerGainsightRoute = ({
  httpResources,
  packageInfo
}) => {
  const renderGainsightLibrary = renderGainsightLibraryFactory(packageInfo.dist, GAINSIGHT_LIBRARY_PATH);

  /**
   * Register a custom JS endpoint in order to achieve best caching possible with `max-age` similar to plugin bundles.
   */
  httpResources.register({
    // Use the build number in the URL path to leverage max-age caching on production builds
    path: `/internal/cloud/${packageInfo.buildNum}/gainsight.js`,
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, req, res) => {
    try {
      return res.renderJs(await renderGainsightLibrary());
    } catch (e) {
      return res.customError({
        body: `Could not load Gainsight library from disk due to error: ${e.toString()}`,
        statusCode: 500
      });
    }
  });
};
exports.registerGainsightRoute = registerGainsightRoute;
const registerGainsightStyleRoute = ({
  httpResources,
  packageInfo
}) => {
  const renderGainsightLibrary = renderGainsightLibraryFactory(packageInfo.dist, GAINSIGHT_STYLE_PATH);

  /**
   * Register a custom endpoint in order to achieve best caching possible with `max-age` similar to plugin bundles.
   */
  httpResources.register({
    // Use the build number in the URL path to leverage max-age caching on production builds
    path: `/internal/cloud/${packageInfo.buildNum}/gainsight.css`,
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, req, res) => {
    try {
      return res.renderCss(await renderGainsightLibrary());
    } catch (e) {
      return res.customError({
        body: `Could not load Gainsight library from disk due to error: ${e.toString()}`,
        statusCode: 500
      });
    }
  });
};
exports.registerGainsightStyleRoute = registerGainsightStyleRoute;
const registerGainsightWidgetRoute = ({
  httpResources,
  packageInfo
}) => {
  const renderGainsightLibrary = renderGainsightLibraryFactory(packageInfo.dist, GAINSIGHT_WIDGET_PATH);

  /**
   * Register a custom JS endpoint in order to achieve best caching possible with `max-age` similar to plugin bundles.
   */
  httpResources.register({
    // Use the build number in the URL path to leverage max-age caching on production builds
    path: `/internal/cloud/${packageInfo.buildNum}/gainsight_widget.js`,
    validate: false,
    options: {
      authRequired: false
    }
  }, async (context, req, res) => {
    try {
      return res.renderJs(await renderGainsightLibrary());
    } catch (e) {
      return res.customError({
        body: `Could not load Gainsight library from disk due to error: ${e.toString()}`,
        statusCode: 500
      });
    }
  });
};
exports.registerGainsightWidgetRoute = registerGainsightWidgetRoute;