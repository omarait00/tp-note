"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetch = fetch;
var _axios = _interopRequireDefault(require("axios"));
var _crypto = require("crypto");
var _fs = require("fs");
var _path = require("path");
var _stream = require("stream");
var _util = require("util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Download a url and calculate it's checksum
 */
async function fetch(url, path, logger) {
  logger === null || logger === void 0 ? void 0 : logger.info(`Downloading ${url} to ${path}`);
  const hash = (0, _crypto.createHash)('md5');
  (0, _fs.mkdirSync)((0, _path.dirname)(path), {
    recursive: true
  });
  const handle = (0, _fs.openSync)(path, 'w');
  try {
    const response = await _axios.default.request({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    response.data.on('data', chunk => {
      (0, _fs.writeSync)(handle, chunk);
      hash.update(chunk);
    });
    await (0, _util.promisify)(_stream.finished)(response.data, {
      writable: false
    });
    logger === null || logger === void 0 ? void 0 : logger.info(`Downloaded ${url}`);
  } catch (error) {
    logger === null || logger === void 0 ? void 0 : logger.error(error);
    throw new Error(`Unable to download ${url}: ${error}`);
  } finally {
    (0, _fs.closeSync)(handle);
  }
  return hash.digest('hex');
}