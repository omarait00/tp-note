"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHits = exports.formatAuthenticationData = exports.authenticationsFieldsMap = exports.authenticationsFields = void 0;
var _fp = require("lodash/fp");
var _fp2 = require("@kbn/safer-lodash-set/fp");
var _to_array = require("../../../../../../common/utils/to_array");
var _ecs_fields = require("../../../../../../common/ecs/ecs_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const authenticationsFields = ['timestamp', 'source.ip', 'host.id', 'host.name'];
exports.authenticationsFields = authenticationsFields;
const authenticationsFieldsMap = {
  latest: '@timestamp',
  lastSuccess: {
    timestamp: '@timestamp',
    ..._ecs_fields.sourceFieldsMap,
    ..._ecs_fields.hostFieldsMap
  },
  lastFailure: {
    timestamp: '@timestamp',
    ..._ecs_fields.sourceFieldsMap,
    ..._ecs_fields.hostFieldsMap
  }
};
exports.authenticationsFieldsMap = authenticationsFieldsMap;
const formatAuthenticationData = hit => {
  let flattenedFields = {
    node: {
      _id: hit._id,
      stackedValue: [hit.stackedValue],
      failures: hit.failures,
      successes: hit.successes
    },
    cursor: {
      value: hit.cursor,
      tiebreaker: null
    }
  };
  const lastSuccessFields = getAuthenticationFields(authenticationsFields, hit, 'lastSuccess');
  if (Object.keys(lastSuccessFields).length > 0) {
    flattenedFields = (0, _fp2.set)('node.lastSuccess', lastSuccessFields, flattenedFields);
  }
  const lastFailureFields = getAuthenticationFields(authenticationsFields, hit, 'lastFailure');
  if (Object.keys(lastFailureFields).length > 0) {
    flattenedFields = (0, _fp2.set)('node.lastFailure', lastFailureFields, flattenedFields);
  }
  return flattenedFields;
};
exports.formatAuthenticationData = formatAuthenticationData;
const getAuthenticationFields = (fields, hit, parentField) => {
  return fields.reduce((flattenedFields, fieldName) => {
    const fieldPath = `${fieldName}`;
    const esField = (0, _fp.get)(`${parentField}['${fieldName}']`, authenticationsFieldsMap);
    if (!(0, _fp.isEmpty)(esField)) {
      const fieldValue = (0, _fp.get)(`${parentField}['${esField}']`, hit.fields);
      if (!(0, _fp.isEmpty)(fieldValue)) {
        return (0, _fp2.set)(fieldPath, (0, _to_array.toObjectArrayOfStrings)(fieldValue).map(({
          str
        }) => str), flattenedFields);
      }
    }
    return flattenedFields;
  }, {});
};
const getHits = response => (0, _fp.getOr)([], 'aggregations.stack_by.buckets', response.rawResponse).map(bucket => ({
  _id: (0, _fp.getOr)(`${bucket.key}+${bucket.doc_count}`, 'failures.lastFailure.hits.hits[0]._id', bucket),
  fields: {
    lastSuccess: (0, _fp.getOr)(null, 'successes.lastSuccess.hits.hits[0].fields', bucket),
    lastFailure: (0, _fp.getOr)(null, 'failures.lastFailure.hits.hits[0].fields', bucket)
  },
  stackedValue: bucket.key,
  failures: bucket.failures.doc_count,
  successes: bucket.successes.doc_count
}));
exports.getHits = getHits;