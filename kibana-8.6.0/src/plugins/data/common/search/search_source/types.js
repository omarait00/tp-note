"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortDirection = void 0;
exports.isSerializedSearchSource = isSerializedSearchSource;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
/**
 * search source interface
 * @public
 */
/**
 * high level search service
 * @public
 */
/**
 * @deprecated use {@link estypes.SortResults} instead.
 */
let SortDirection; // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
exports.SortDirection = SortDirection;
(function (SortDirection) {
  SortDirection["asc"] = "asc";
  SortDirection["desc"] = "desc";
})(SortDirection || (exports.SortDirection = SortDirection = {}));
function isSerializedSearchSource(maybeSerializedSearchSource) {
  return typeof maybeSerializedSearchSource === 'object' && maybeSerializedSearchSource !== null && !Array.isArray(maybeSerializedSearchSource);
}