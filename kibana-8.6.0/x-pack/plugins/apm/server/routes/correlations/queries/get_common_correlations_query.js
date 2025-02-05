"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonCorrelationsQuery = getCommonCorrelationsQuery;
var _server = require("../../../../../observability/server");
var _environment_query = require("../../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getCommonCorrelationsQuery({
  start,
  end,
  kuery,
  query,
  environment
}) {
  return {
    bool: {
      filter: [query, ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
    }
  };
}