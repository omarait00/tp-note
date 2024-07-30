"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyBulkEditOperation = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * this method takes BulkEdit operation and applies it to rule, by mutating it
 * @param operation BulkEditOperation
 * @param rule object rule to update
 * @returns modified rule
 */
const applyBulkEditOperation = (operation, rule) => {
  var _get, _get2;
  const addItemsToArray = (arr, items) => Array.from(new Set([...arr, ...items]));
  const deleteItemsFromArray = (arr, items) => {
    const itemsSet = new Set(items);
    return arr.filter(item => !itemsSet.has(item));
  };
  switch (operation.operation) {
    case 'set':
      (0, _lodash.set)(rule, operation.field, operation.value);
      break;
    case 'add':
      (0, _lodash.set)(rule, operation.field, addItemsToArray((_get = (0, _lodash.get)(rule, operation.field)) !== null && _get !== void 0 ? _get : [], operation.value));
      break;
    case 'delete':
      (0, _lodash.set)(rule, operation.field, deleteItemsFromArray((_get2 = (0, _lodash.get)(rule, operation.field)) !== null && _get2 !== void 0 ? _get2 : [], operation.value || []));
      break;
  }
  return rule;
};
exports.applyBulkEditOperation = applyBulkEditOperation;