"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataSource = void 0;
var _build_query = require("../../../../../utils/build_query");
var _queryThreat_intel_source = require("./query.threat_intel_source.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const dataSource = {
  buildDsl: options => (0, _queryThreat_intel_source.buildTiDataSourceQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryThreat_intel_source.buildTiDataSourceQuery)(options))]
    };
    return {
      ...response,
      inspect
    };
  }
};
exports.dataSource = dataSource;