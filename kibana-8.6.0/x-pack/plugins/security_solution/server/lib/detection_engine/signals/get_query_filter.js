"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getQueryFilter = exports.getAllFilters = void 0;
var _esQuery = require("@kbn/es-query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getQueryFilter = ({
  query,
  language,
  filters,
  index,
  exceptionFilter
}) => {
  const indexPattern = {
    fields: [],
    title: index.join()
  };
  const config = {
    allowLeadingWildcards: true,
    queryStringOptions: {
      analyze_wildcard: true
    },
    ignoreFilterIfFieldNotInIndex: false,
    dateFormatTZ: 'Zulu'
  };
  const initialQuery = {
    query,
    language
  };
  const allFilters = getAllFilters(filters, exceptionFilter);
  return (0, _esQuery.buildEsQuery)(indexPattern, initialQuery, allFilters, config);
};
exports.getQueryFilter = getQueryFilter;
const getAllFilters = (filters, exceptionFilter) => {
  if (exceptionFilter != null) {
    return [...filters, exceptionFilter];
  } else {
    return [...filters];
  }
};
exports.getAllFilters = getAllFilters;