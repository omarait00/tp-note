"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatGeneralHistogramData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatGeneralHistogramData = data => data && data.length > 0 ? data.map(({
  key,
  count
}) => {
  var _count$doc_count;
  return {
    x: key,
    y: (_count$doc_count = count.doc_count) !== null && _count$doc_count !== void 0 ? _count$doc_count : count.value
  };
}) : null;
exports.formatGeneralHistogramData = formatGeneralHistogramData;