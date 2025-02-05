"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = splitInterval;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function splitInterval(interval) {
  if (!interval.match(/[0-9]+[mshdwMy]+/g)) {
    throw new Error('Malformed `interval`: ' + interval);
  }
  const parts = interval.match(/[0-9]+|[mshdwMy]+/g);
  return {
    count: parts[0],
    unit: parts[1]
  };
}
module.exports = exports.default;