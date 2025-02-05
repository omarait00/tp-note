"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlightTags = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// By default, ElasticSearch surrounds matched values in <em></em>. This is not ideal because it is possible that
// the value could contain <em></em> in the value. We define these custom tags that we would never expect to see
// inside a field value.
const highlightTags = {
  pre: '@kibana-highlighted-field@',
  post: '@/kibana-highlighted-field@'
};
exports.highlightTags = highlightTags;