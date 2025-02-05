"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidIndexName = isValidIndexName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const windowWithTextEncoder = window;
function isValidIndexNameLength(indexName) {
  if (windowWithTextEncoder.TextEncoder && new windowWithTextEncoder.TextEncoder('utf-8').encode(indexName).length > 255) {
    return false;
  }

  // If TextEncoder is not available just check for string.length
  return indexName.length <= 255;
}

// rules taken from
// https://github.com/elastic/elasticsearch/blob/master/docs/reference/indices/create-index.asciidoc
function isValidIndexName(indexName) {
  return (
    // Lowercase only
    indexName === indexName.toLowerCase() &&
    // Cannot include \, /, *, ?, ", <, >, |, space character, comma, #, :
    /^[^\*\\/\?"<>|\s,#:]+$/.test(indexName) &&
    // Cannot start with -, _, +
    /^[^-_\+]+$/.test(indexName.charAt(0)) &&
    // Cannot be . or ..
    indexName !== '.' && indexName !== '..' &&
    // Cannot be longer than 255 bytes (note it is bytes,
    // so multi-byte characters will count towards the 255 limit faster)
    isValidIndexNameLength(indexName)
  );
}