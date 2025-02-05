"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = download;
var _fs = require("fs");
var _del = _interopRequireDefault(require("del"));
var _checksum = require("./checksum");
var _fetch = require("./fetch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Clears the unexpected files in the browsers archivesPath
 * and ensures that all packages/archives are downloaded and
 * that their checksums match the declared value
 * @param  {BrowserSpec} browsers
 * @return {Promise<undefined>}
 */
async function download(paths, pkg, logger) {
  const removedFiles = await (0, _del.default)(`${paths.archivesPath}/**/*`, {
    force: true,
    onlyFiles: true,
    ignore: paths.getAllArchiveFilenames()
  });
  removedFiles.forEach(path => logger === null || logger === void 0 ? void 0 : logger.warn(`Deleting unexpected file ${path}`));
  const invalidChecksums = [];
  const {
    archiveFilename,
    archiveChecksum
  } = pkg;
  if (!archiveFilename || !archiveChecksum) {
    return;
  }
  const resolvedPath = paths.resolvePath(pkg);
  const foundChecksum = await (0, _checksum.md5)(resolvedPath).catch(() => 'MISSING');
  const pathExists = (0, _fs.existsSync)(resolvedPath);
  if (pathExists && foundChecksum === archiveChecksum) {
    logger === null || logger === void 0 ? void 0 : logger.debug(`Browser archive for ${pkg.platform}/${pkg.architecture} already found in ${resolvedPath}.`);
    return;
  }
  if (!pathExists) {
    logger === null || logger === void 0 ? void 0 : logger.warn(`Browser archive for ${pkg.platform}/${pkg.architecture} not found in ${resolvedPath}.`);
  }
  if (foundChecksum !== archiveChecksum) {
    logger === null || logger === void 0 ? void 0 : logger.warn(`Browser archive checksum for ${pkg.platform}/${pkg.architecture} ` + `is ${foundChecksum} but ${archiveChecksum} was expected.`);
  }
  const url = paths.getDownloadUrl(pkg);
  try {
    const downloadedChecksum = await (0, _fetch.fetch)(url, resolvedPath, logger);
    if (downloadedChecksum !== archiveChecksum) {
      logger === null || logger === void 0 ? void 0 : logger.warn(`Invalid checksum for ${pkg.platform}/${pkg.architecture}: ` + `expected ${archiveChecksum} got ${downloadedChecksum}`);
      invalidChecksums.push(`${url} => ${resolvedPath}`);
    }
  } catch (error) {
    throw new Error(`Failed to download ${url}: ${error}`);
  }
  if (invalidChecksums.length) {
    const error = new Error(`Error downloading browsers, checksums incorrect for:\n    - ${invalidChecksums.join('\n    - ')}`);
    logger === null || logger === void 0 ? void 0 : logger.error(error);
    throw error;
  }
}