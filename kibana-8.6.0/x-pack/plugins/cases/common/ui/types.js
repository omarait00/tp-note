"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatusAll = exports.SortFieldCase = exports.SeverityAll = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const StatusAll = 'all';
exports.StatusAll = StatusAll;
const SeverityAll = 'all';
exports.SeverityAll = SeverityAll;
let SortFieldCase;
exports.SortFieldCase = SortFieldCase;
(function (SortFieldCase) {
  SortFieldCase["createdAt"] = "createdAt";
  SortFieldCase["closedAt"] = "closedAt";
})(SortFieldCase || (exports.SortFieldCase = SortFieldCase = {}));