"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTablePaginationOptions = exports.createQueryFilterClauses = exports.createFilter = void 0;
var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createQueryFilterClauses = filterQuery => !(0, _fp.isEmpty)(filterQuery) ? [(0, _fp.isString)(filterQuery) ? JSON.parse(filterQuery) : filterQuery] : [];
exports.createQueryFilterClauses = createQueryFilterClauses;
const createFilter = filterQuery => (0, _fp.isString)(filterQuery) ? filterQuery : JSON.stringify(filterQuery);
exports.createFilter = createFilter;
const generateTablePaginationOptions = (activePage, limit) => {
  const cursorStart = activePage * limit;
  return {
    activePage,
    cursorStart,
    querySize: limit
  };
};
exports.generateTablePaginationOptions = generateTablePaginationOptions;