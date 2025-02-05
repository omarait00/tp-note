"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeMissingFieldsWithSource = void 0;
var _fp = require("lodash/fp");
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _filter_field_entries = require("../utils/filter_field_entries");
var _recursive_unboxing_fields = require("../utils/recursive_unboxing_fields");
var _is_type_object = require("../utils/is_type_object");
var _array_in_path_exists = require("../utils/array_in_path_exists");
var _is_nested_object = require("../utils/is_nested_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Merges only missing sections of "doc._source" with its "doc.fields" on a "best effort" basis. See ../README.md for more information
 * on this function and the general strategies.
 * @param doc The document with "_source" and "fields"
 * @param ignoreFields Any fields that we should ignore and never merge from "fields". If the value exists
 * within doc._source it will be untouched and used. If the value does not exist within the doc._source,
 * it will not be added from fields.
 * @returns The two merged together in one object where we can
 */
const mergeMissingFieldsWithSource = ({
  doc,
  ignoreFields
}) => {
  var _doc$_source, _doc$fields;
  const source = (_doc$_source = doc._source) !== null && _doc$_source !== void 0 ? _doc$_source : {};
  const fields = (_doc$fields = doc.fields) !== null && _doc$fields !== void 0 ? _doc$fields : {};
  const fieldEntries = Object.entries(fields);
  const filteredEntries = (0, _filter_field_entries.filterFieldEntries)(fieldEntries, ignoreFields);
  const transformedSource = filteredEntries.reduce((merged, [fieldsKey, fieldsValue]) => {
    if (hasEarlyReturnConditions({
      fieldsValue,
      fieldsKey,
      merged
    })) {
      return merged;
    }
    const valueInMergedDocument = (0, _fp.get)(fieldsKey, merged);
    const valueToMerge = (0, _recursive_unboxing_fields.recursiveUnboxingFields)(fieldsValue, valueInMergedDocument);
    return (0, _saferLodashSet.set)(merged, fieldsKey, valueToMerge);
  }, {
    ...source
  });
  return {
    ...doc,
    _source: transformedSource
  };
};

/**
 * Returns true if any early return conditions are met which are
 *   - If the fieldsValue is an empty array return
 *   - If the value to merge in is not undefined, return early
 *   - If an array within the path exists, do an early return
 *   - If the value matches a type object, do an early return
 * @param fieldsValue The field value to check
 * @param fieldsKey The key of the field we are checking
 * @param merged The merge document which is what we are testing conditions against
 * @returns true if we should return early, otherwise false
 */
exports.mergeMissingFieldsWithSource = mergeMissingFieldsWithSource;
const hasEarlyReturnConditions = ({
  fieldsValue,
  fieldsKey,
  merged
}) => {
  const valueInMergedDocument = (0, _fp.get)(fieldsKey, merged);
  return fieldsValue.length === 0 || valueInMergedDocument !== undefined || (0, _array_in_path_exists.arrayInPathExists)(fieldsKey, merged) || (0, _is_nested_object.isNestedObject)(fieldsValue) || (0, _is_type_object.isTypeObject)(fieldsValue);
};