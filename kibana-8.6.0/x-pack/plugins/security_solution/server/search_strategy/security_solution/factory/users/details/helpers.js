"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatUserItem = exports.fieldNameToAggField = exports.USER_FIELDS = void 0;
var _fp = require("@kbn/safer-lodash-set/fp");
var _fp2 = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const USER_FIELDS = ['user.id', 'user.domain', 'user.name', 'host.os.name', 'host.ip', 'host.os.family'];
exports.USER_FIELDS = USER_FIELDS;
const fieldNameToAggField = fieldName => fieldName.replace(/\./g, '_');
exports.fieldNameToAggField = fieldNameToAggField;
const formatUserItem = aggregations => {
  const firstLastSeen = {
    firstSeen: (0, _fp2.get)('first_seen.value_as_string', aggregations),
    lastSeen: (0, _fp2.get)('last_seen.value_as_string', aggregations)
  };
  return USER_FIELDS.reduce((flattenedFields, fieldName) => {
    const aggField = fieldNameToAggField(fieldName);
    if ((0, _fp2.has)(aggField, aggregations)) {
      const data = (0, _fp2.get)(aggField, aggregations);
      const fieldValue = data.buckets.map(obj => obj.key);
      return (0, _fp.set)(fieldName, fieldValue, flattenedFields);
    }
    return flattenedFields;
  }, firstLastSeen);
};
exports.formatUserItem = formatUserItem;