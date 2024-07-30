"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortOrderOrUndefined = exports.SortOrder = exports.SortFieldOrUndefined = exports.SortField = exports.DefaultSortOrderDesc = exports.DefaultSortOrderAsc = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _lodash = require("lodash");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SortField = t.string;
exports.SortField = SortField;
const SortFieldOrUndefined = t.union([SortField, t.undefined]);
exports.SortFieldOrUndefined = SortFieldOrUndefined;
const SortOrder = t.keyof({
  asc: null,
  desc: null
});
exports.SortOrder = SortOrder;
const SortOrderOrUndefined = t.union([SortOrder, t.undefined]);
exports.SortOrderOrUndefined = SortOrderOrUndefined;
const defaultSortOrder = order => {
  return new t.Type(`DefaultSortOrder${(0, _lodash.capitalize)(order)}`, SortOrder.is, (input, context) => input == null ? t.success(order) : SortOrder.validate(input, context), t.identity);
};

/**
 * Types the DefaultSortOrderAsc as:
 *   - If undefined, then a default sort order of 'asc' will be set
 *   - If a string is sent in, then the string will be validated to ensure it's a valid SortOrder
 */
const DefaultSortOrderAsc = defaultSortOrder('asc');

/**
 * Types the DefaultSortOrderDesc as:
 *   - If undefined, then a default sort order of 'desc' will be set
 *   - If a string is sent in, then the string will be validated to ensure it's a valid SortOrder
 */
exports.DefaultSortOrderAsc = DefaultSortOrderAsc;
const DefaultSortOrderDesc = defaultSortOrder('desc');
exports.DefaultSortOrderDesc = DefaultSortOrderDesc;