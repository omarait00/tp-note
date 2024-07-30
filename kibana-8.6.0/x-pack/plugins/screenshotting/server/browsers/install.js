"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.install = install;
var _del = _interopRequireDefault(require("del"));
var _path = _interopRequireDefault(require("path"));
var _download = require("./download");
var _checksum = require("./download/checksum");
var _extract = require("./extract");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * "install" a browser by type into installs path by extracting the downloaded
 * archive. If there is an error extracting the archive an `ExtractError` is thrown
 */
async function install(paths, logger, pkg, chromiumPath = _path.default.resolve(__dirname, '../../chromium')) {
  const binaryPath = paths.getBinaryPath(pkg, chromiumPath);
  const binaryChecksum = await (0, _checksum.md5)(binaryPath).catch(() => 'MISSING');
  if (binaryChecksum !== pkg.binaryChecksum) {
    logger === null || logger === void 0 ? void 0 : logger.warn(`Found browser binary checksum for ${pkg.platform}/${pkg.architecture} in ${binaryPath}` + ` is ${binaryChecksum} but ${pkg.binaryChecksum} was expected. Re-installing...`);
    try {
      await (0, _del.default)(chromiumPath);
    } catch (error) {
      logger.error(error);
    }
    try {
      await (0, _download.download)(paths, pkg, logger);
      const archive = _path.default.join(paths.archivesPath, pkg.architecture, pkg.archiveFilename);
      logger.info(`Extracting [${archive}] to [${chromiumPath}]`);
      await (0, _extract.extract)(archive, chromiumPath);
    } catch (error) {
      logger.error(error);
    }
  }
  logger.info(`Browser executable: ${binaryPath}`);
  return binaryPath;
}