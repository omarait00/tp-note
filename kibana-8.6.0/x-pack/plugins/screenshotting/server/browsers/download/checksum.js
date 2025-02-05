"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.md5 = md5;
var _crypto = require("crypto");
var _fs = require("fs");
var _stream = require("stream");
var _util = require("util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function md5(path) {
  const hash = (0, _crypto.createHash)('md5');
  const stream = (0, _fs.createReadStream)(path);
  stream.on('data', chunk => hash.update(chunk));
  await (0, _util.promisify)(_stream.finished)(stream, {
    writable: false
  });
  return hash.digest('hex');
}