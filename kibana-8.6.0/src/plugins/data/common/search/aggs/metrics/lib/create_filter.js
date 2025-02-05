"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMetricFilter = void 0;
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createMetricFilter = (aggConfig, key) => {
  const indexPattern = aggConfig.getIndexPattern();
  if (aggConfig.getField()) {
    return (0, _esQuery.buildExistsFilter)(aggConfig.getField(), indexPattern);
  }
};
exports.createMetricFilter = createMetricFilter;