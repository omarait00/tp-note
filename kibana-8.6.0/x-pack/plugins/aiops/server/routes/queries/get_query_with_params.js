"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTermsQuery = exports.getQueryWithParams = void 0;
var _get_filters = require("./get_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTermsQuery = ({
  fieldName,
  fieldValue
}) => {
  return {
    term: {
      [fieldName]: fieldValue
    }
  };
};
exports.getTermsQuery = getTermsQuery;
const getQueryWithParams = ({
  params,
  termFilters
}) => {
  const searchQuery = JSON.parse(params.searchQuery);
  return {
    bool: {
      filter: [searchQuery, ...(0, _get_filters.getFilters)(params), ...(Array.isArray(termFilters) ? termFilters.map(getTermsQuery) : [])]
    }
  };
};
exports.getQueryWithParams = getQueryWithParams;