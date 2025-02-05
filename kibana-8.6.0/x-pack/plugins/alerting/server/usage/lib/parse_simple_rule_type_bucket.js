"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSimpleRuleTypeBucket = parseSimpleRuleTypeBucket;
var _replace_dots_with_underscores = require("./replace_dots_with_underscores");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function parseSimpleRuleTypeBucket(ruleTypeBuckets) {
  const buckets = ruleTypeBuckets;
  return (buckets !== null && buckets !== void 0 ? buckets : []).reduce((acc, bucket) => {
    var _bucket$doc_count;
    const ruleType = (0, _replace_dots_with_underscores.replaceDotSymbols)(bucket.key);
    return {
      ...acc,
      [ruleType]: (_bucket$doc_count = bucket.doc_count) !== null && _bucket$doc_count !== void 0 ? _bucket$doc_count : 0
    };
  }, {});
}