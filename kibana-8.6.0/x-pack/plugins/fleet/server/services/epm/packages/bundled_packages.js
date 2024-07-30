"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBundledPackageByName = getBundledPackageByName;
exports.getBundledPackages = getBundledPackages;
var _promises = _interopRequireDefault(require("fs/promises"));
var _path = _interopRequireDefault(require("path"));
var _errors = require("../../../errors");
var _app_context = require("../../app_context");
var _registry = require("../registry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getBundledPackages() {
  var _config$developer;
  const config = _app_context.appContextService.getConfig();
  const bundledPackageLocation = config === null || config === void 0 ? void 0 : (_config$developer = config.developer) === null || _config$developer === void 0 ? void 0 : _config$developer.bundledPackageLocation;
  if (!bundledPackageLocation) {
    throw new _errors.FleetError('xpack.fleet.developer.bundledPackageLocation is not configured');
  }

  // If the bundled package directory is missing, we log a warning during setup,
  // so we can safely ignore this case here and just retun and empty array
  try {
    await _promises.default.stat(bundledPackageLocation);
  } catch (error) {
    return [];
  }
  try {
    const dirContents = await _promises.default.readdir(bundledPackageLocation);
    const zipFiles = dirContents.filter(file => file.endsWith('.zip'));
    const result = await Promise.all(zipFiles.map(async zipFile => {
      const file = await _promises.default.readFile(_path.default.join(bundledPackageLocation, zipFile));
      const {
        pkgName,
        pkgVersion
      } = (0, _registry.splitPkgKey)(zipFile.replace(/\.zip$/, ''));
      return {
        name: pkgName,
        version: pkgVersion,
        buffer: file
      };
    }));
    return result;
  } catch (err) {
    const logger = _app_context.appContextService.getLogger();
    logger.debug(`Unable to read bundled packages from ${bundledPackageLocation}`);
    return [];
  }
}
async function getBundledPackageByName(name) {
  const bundledPackages = await getBundledPackages();
  const bundledPackage = bundledPackages.find(pkg => pkg.name === name);
  return bundledPackage;
}