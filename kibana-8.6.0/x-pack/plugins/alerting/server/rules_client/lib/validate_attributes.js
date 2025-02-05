"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSortField = exports.validateSearchFields = exports.validateOperationOnAttributes = exports.validateFilterKueryNode = exports.iterateFilterKureyNode = exports.getFieldNameAttribute = void 0;
var _lodash = require("lodash");
var _mappings = require("../../saved_objects/mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const astFunctionType = ['is', 'range', 'nested'];
const getFieldNameAttribute = (fieldName, attributesToIgnore) => {
  const fieldNameSplit = (fieldName || '').split('.').filter(fn => !attributesToIgnore.includes(fn));
  return fieldNameSplit.length > 0 ? fieldNameSplit[0] : '';
};
exports.getFieldNameAttribute = getFieldNameAttribute;
const validateOperationOnAttributes = (astFilter, sortField, searchFields, excludedFieldNames) => {
  if (sortField) {
    validateSortField(sortField, excludedFieldNames);
  }
  if (!(0, _lodash.isEmpty)(searchFields)) {
    validateSearchFields(searchFields !== null && searchFields !== void 0 ? searchFields : [], excludedFieldNames);
  }
  if (astFilter) {
    validateFilterKueryNode({
      astFilter,
      excludedFieldNames
    });
  }
};
exports.validateOperationOnAttributes = validateOperationOnAttributes;
const validateSortField = (sortField, excludedFieldNames) => {
  if (excludedFieldNames.filter(efn => sortField.split('.')[0].includes(efn)).length > 0) {
    throw new Error(`Sort is not supported on this field ${sortField}`);
  }
};
exports.validateSortField = validateSortField;
const validateSearchFields = (searchFields, excludedFieldNames) => {
  const excludedSearchFields = searchFields.filter(sf => excludedFieldNames.filter(efn => sf.split('.')[0].includes(efn)).length > 0);
  if (excludedSearchFields.length > 0) {
    throw new Error(`Search field ${excludedSearchFields.join()} not supported`);
  }
};
exports.validateSearchFields = validateSearchFields;
const iterateFilterKureyNode = ({
  astFilter,
  hasNestedKey = false,
  nestedKeys,
  storeValue,
  path = 'arguments',
  action = () => {}
}) => {
  let localStoreValue = storeValue;
  let localNestedKeys;
  let localFieldName = '';
  if (localStoreValue === undefined) {
    localStoreValue = astFilter.type === 'function' && astFunctionType.includes(astFilter.function);
  }
  astFilter.arguments.forEach((ast, index) => {
    if (hasNestedKey && ast.type === 'literal' && ast.value != null) {
      localNestedKeys = ast.value;
    } else if (ast.type === 'literal' && ast.value && typeof ast.value === 'string') {
      const key = ast.value.replace('.attributes', '');
      const mappingKey = 'properties.' + key.split('.').join('.properties.');
      const field = (0, _lodash.get)(_mappings.alertMappings, mappingKey);
      if (field != null && field.type === 'nested') {
        localNestedKeys = ast.value;
      }
    }
    if (ast.arguments) {
      const myPath = `${path}.${index}`;
      iterateFilterKureyNode({
        astFilter: ast,
        storeValue: ast.type === 'function' && astFunctionType.includes(ast.function),
        path: `${myPath}.arguments`,
        hasNestedKey: ast.type === 'function' && ast.function === 'nested',
        nestedKeys: localNestedKeys || nestedKeys,
        action
      });
    }
    if (localStoreValue) {
      const fieldName = nestedKeys != null ? `${nestedKeys}.${ast.value}` : ast.value;
      if (index === 0) {
        localFieldName = fieldName;
      }
      action({
        ast,
        index,
        fieldName,
        localFieldName
      });
    }
  });
};
exports.iterateFilterKureyNode = iterateFilterKureyNode;
const validateFilterKueryNode = ({
  astFilter,
  excludedFieldNames,
  hasNestedKey = false,
  nestedKeys,
  storeValue,
  path = 'arguments'
}) => {
  const action = ({
    index,
    fieldName
  }) => {
    if (index === 0) {
      const firstAttribute = getFieldNameAttribute(fieldName, ['alert', 'attributes']);
      if (excludedFieldNames.includes(firstAttribute)) {
        throw new Error(`Filter is not supported on this field ${fieldName}`);
      }
    }
  };
  iterateFilterKureyNode({
    astFilter,
    hasNestedKey,
    nestedKeys,
    storeValue,
    path,
    action
  });
};
exports.validateFilterKueryNode = validateFilterKueryNode;