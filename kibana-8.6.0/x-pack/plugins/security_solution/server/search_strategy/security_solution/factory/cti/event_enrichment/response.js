"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEventEnrichmentResponse = void 0;
var _build_query = require("../../../../../utils/build_query");
var _helpers = require("./helpers");
var _query = require("./query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const parseEventEnrichmentResponse = async (options, response, deps) => {
  const inspect = {
    dsl: [(0, _build_query.inspectStringifyObject)((0, _query.buildEventEnrichmentQuery)(options))]
  };
  const totalCount = (0, _helpers.getTotalCount)(response.rawResponse.hits.total);
  const enrichments = (0, _helpers.buildIndicatorEnrichments)(response.rawResponse.hits.hits);
  return {
    ...response,
    enrichments,
    inspect,
    totalCount
  };
};
exports.parseEventEnrichmentResponse = parseEventEnrichmentResponse;