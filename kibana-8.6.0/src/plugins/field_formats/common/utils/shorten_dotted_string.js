"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shortenDottedString = shortenDottedString;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DOT_PREFIX_RE = /(.).+?\./g;

/**
 * Convert a dot.notated.string into a short
 * version (d.n.string)
 *
 * @return {unknown}
 */
function shortenDottedString(input) {
  return typeof input !== 'string' ? input : input.replace(DOT_PREFIX_RE, '$1.');
}