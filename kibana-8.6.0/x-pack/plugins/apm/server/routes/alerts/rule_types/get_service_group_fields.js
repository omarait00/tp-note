"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenSourceDoc = flattenSourceDoc;
exports.getServiceGroupFields = getServiceGroupFields;
exports.getServiceGroupFieldsAgg = getServiceGroupFieldsAgg;
var _service_groups = require("../../../../common/service_groups");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getServiceGroupFieldsAgg(topHitsOpts = {}) {
  return {
    source_fields: {
      top_hits: {
        size: 1,
        _source: {
          includes: _service_groups.SERVICE_GROUP_SUPPORTED_FIELDS
        },
        ...topHitsOpts
      }
    }
  };
}
function getServiceGroupFields(bucket) {
  var _bucket$source_fields, _bucket$source_fields2, _bucket$source_fields3;
  if (!bucket) {
    return {};
  }
  const sourceDoc = (_bucket$source_fields = bucket === null || bucket === void 0 ? void 0 : (_bucket$source_fields2 = bucket.source_fields) === null || _bucket$source_fields2 === void 0 ? void 0 : (_bucket$source_fields3 = _bucket$source_fields2.hits.hits[0]) === null || _bucket$source_fields3 === void 0 ? void 0 : _bucket$source_fields3._source) !== null && _bucket$source_fields !== void 0 ? _bucket$source_fields : {};
  return flattenSourceDoc(sourceDoc);
}
function flattenSourceDoc(val, path = []) {
  if (typeof val !== 'object') {
    return {
      [path.join('.')]: val
    };
  }
  return Object.keys(val).reduce((acc, key) => {
    const fieldMap = flattenSourceDoc(val[key], [...path, key]);
    return {
      ...acc,
      ...fieldMap
    };
  }, {});
}