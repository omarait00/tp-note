"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unflattenObject = exports.stripOutUndefinedValues = exports.mapFormFields = exports.flattenObject = void 0;
var _saferLodashSet = require("@kbn/safer-lodash-set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const unflattenObject = object => Object.entries(object).reduce((acc, [key, value]) => {
  (0, _saferLodashSet.set)(acc, key, value);
  return acc;
}, {});

/**
 * Wrap the key with [] if it is a key from an Array
 * @param key The object key
 * @param isArrayItem Flag to indicate if it is the key of an Array
 */
exports.unflattenObject = unflattenObject;
const renderKey = (key, isArrayItem) => isArrayItem ? `[${key}]` : key;
const flattenObject = (obj, prefix = [], isArrayItem = false) => Object.keys(obj).reduce((acc, k) => {
  const nextValue = obj[k];
  if (typeof nextValue === 'object' && nextValue !== null) {
    const isNextValueArray = Array.isArray(nextValue);
    const dotSuffix = isNextValueArray ? '' : '.';
    if (Object.keys(nextValue).length > 0) {
      return {
        ...acc,
        ...flattenObject(nextValue, [...prefix, `${renderKey(k, isArrayItem)}${dotSuffix}`], isNextValueArray)
      };
    }
  }
  const fullPath = `${prefix.join('')}${renderKey(k, isArrayItem)}`;
  acc[fullPath] = nextValue;
  return acc;
}, {});

/**
 * Deeply remove all "undefined" value inside an Object
 *
 * @param obj The object to process
 * @returns The object without any "undefined"
 */
exports.flattenObject = flattenObject;
const stripOutUndefinedValues = obj => {
  return Object.entries(obj).filter(({
    1: value
  }) => value !== undefined).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return {
        ...acc,
        [key]: stripOutUndefinedValues(value)
      };
    }
    return {
      ...acc,
      [key]: value
    };
  }, {});
};

/**
 * Helper to map the object of fields to any of its value
 *
 * @param formFields key value pair of path and form Fields
 * @param fn Iterator function to execute on the field
 */
exports.stripOutUndefinedValues = stripOutUndefinedValues;
const mapFormFields = (formFields, fn) => Object.entries(formFields).reduce((acc, [key, field]) => {
  acc[key] = fn(field);
  return acc;
}, {});
exports.mapFormFields = mapFormFields;