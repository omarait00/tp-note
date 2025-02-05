"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateValue = exports.truncateList = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// When we write rule execution status updates to saved objects or to event log,
// we can write warning/failure messages as well. In some cases those messages
// are built from N errors collected during the "big loop" of Detection Engine,
// where N can be a large number. When N is large the resulting message strings
// can take ~26MB of memory and make the resulting documents huge. These large
// documents may cause migrations to fail because a batch of 1000 documents can
// exceed Elasticsearch's `http.max_content_length` which defaults to 100mb.
// In order to fix that, we need to truncate messages to an adequate MAX length.
// https://github.com/elastic/kibana/pull/112257

const MAX_STRING_LENGTH = 10240;
const MAX_LIST_LENGTH = 20;
const truncateValue = (value, maxLength = MAX_STRING_LENGTH) => {
  if (value === undefined) {
    return value;
  }
  const str = (0, _lodash.toString)(value);
  return (0, _lodash.truncate)(str, {
    length: maxLength
  });
};
exports.truncateValue = truncateValue;
const truncateList = (list, maxLength = MAX_LIST_LENGTH) => {
  const deduplicatedList = (0, _lodash.uniq)(list);
  return (0, _lodash.take)(deduplicatedList, maxLength);
};
exports.truncateList = truncateList;