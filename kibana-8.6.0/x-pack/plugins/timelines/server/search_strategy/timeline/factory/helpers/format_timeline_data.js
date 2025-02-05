"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTimelineData = void 0;
var _fp = require("lodash/fp");
var _to_array = require("../../../../../common/utils/to_array");
var _field_formatters = require("../../../../../common/utils/field_formatters");
var _get_timestamp = require("./get_timestamp");
var _get_nested_parent_path = require("./get_nested_parent_path");
var _build_object_recursive = require("./build_object_recursive");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatTimelineData = async (dataFields, ecsFields, hit) => (0, _fp.uniq)([...ecsFields, ...dataFields]).reduce(async (acc, fieldName) => {
  const flattenedFields = await acc;
  flattenedFields.node._id = hit._id;
  flattenedFields.node._index = hit._index;
  flattenedFields.node.ecs._id = hit._id;
  flattenedFields.node.ecs.timestamp = (0, _get_timestamp.getTimestamp)(hit);
  flattenedFields.node.ecs._index = hit._index;
  if (hit.sort && hit.sort.length > 1) {
    flattenedFields.cursor.value = hit.sort[0];
    flattenedFields.cursor.tiebreaker = hit.sort[1];
  }
  const waitForIt = await mergeTimelineFieldsWithHit(fieldName, flattenedFields, hit, dataFields, ecsFields);
  return Promise.resolve(waitForIt);
}, Promise.resolve({
  node: {
    ecs: {
      _id: ''
    },
    data: [],
    _id: '',
    _index: ''
  },
  cursor: {
    value: '',
    tiebreaker: null
  }
}));
exports.formatTimelineData = formatTimelineData;
const getValuesFromFields = async (fieldName, hit, nestedParentFieldName) => {
  if (_constants.ECS_METADATA_FIELDS.includes(fieldName)) {
    return [{
      field: fieldName,
      value: (0, _to_array.toStringArray)((0, _fp.get)(fieldName, hit))
    }];
  }
  let fieldToEval;
  if (nestedParentFieldName == null) {
    fieldToEval = {
      [fieldName]: hit.fields[fieldName]
    };
  } else {
    fieldToEval = {
      [nestedParentFieldName]: hit.fields[nestedParentFieldName]
    };
  }
  const formattedData = await (0, _field_formatters.getDataSafety)(_field_formatters.getDataFromFieldsHits, fieldToEval);
  return formattedData.reduce((acc, {
    field,
    values
  }) =>
  // nested fields return all field values, pick only the one we asked for
  field.includes(fieldName) ? [...acc, {
    field,
    value: values
  }] : acc, []);
};
const mergeTimelineFieldsWithHit = async (fieldName, flattenedFields, hit, dataFields, ecsFields) => {
  if (fieldName != null) {
    const nestedParentPath = (0, _get_nested_parent_path.getNestedParentPath)(fieldName, hit.fields);
    if (nestedParentPath != null || (0, _fp.has)(fieldName, hit.fields) || _constants.ECS_METADATA_FIELDS.includes(fieldName)) {
      const objectWithProperty = {
        node: {
          ...(0, _fp.get)('node', flattenedFields),
          data: dataFields.includes(fieldName) ? [...(0, _fp.get)('node.data', flattenedFields), ...(await getValuesFromFields(fieldName, hit, nestedParentPath))] : (0, _fp.get)('node.data', flattenedFields),
          ecs: ecsFields.includes(fieldName) ? {
            ...(0, _fp.get)('node.ecs', flattenedFields),
            ...(0, _build_object_recursive.buildObjectRecursive)(fieldName, hit.fields)
          } : (0, _fp.get)('node.ecs', flattenedFields)
        }
      };
      return (0, _fp.merge)(flattenedFields, objectWithProperty);
    } else {
      return flattenedFields;
    }
  } else {
    return flattenedFields;
  }
};