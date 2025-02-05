"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMergeStrategy = void 0;
var _utility_types = require("../../../../../../common/utility_types");
var _merge_all_fields_with_source = require("./merge_all_fields_with_source");
var _merge_missing_fields_with_source = require("./merge_missing_fields_with_source");
var _merge_no_fields = require("./merge_no_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMergeStrategy = mergeStrategy => {
  switch (mergeStrategy) {
    case 'allFields':
      {
        return _merge_all_fields_with_source.mergeAllFieldsWithSource;
      }
    case 'missingFields':
      {
        return _merge_missing_fields_with_source.mergeMissingFieldsWithSource;
      }
    case 'noFields':
      {
        return _merge_no_fields.mergeNoFields;
      }
    default:
      return (0, _utility_types.assertUnreachable)(mergeStrategy);
  }
};
exports.getMergeStrategy = getMergeStrategy;