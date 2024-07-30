"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseResolverQuery = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class BaseResolverQuery {
  constructor({
    schema,
    indexPatterns,
    timeRange,
    isInternalRequest
  }) {
    (0, _defineProperty2.default)(this, "schema", void 0);
    (0, _defineProperty2.default)(this, "indexPatterns", void 0);
    (0, _defineProperty2.default)(this, "timeRange", void 0);
    (0, _defineProperty2.default)(this, "isInternalRequest", void 0);
    (0, _defineProperty2.default)(this, "resolverFields", void 0);
    const schemaOrDefault = schema ? schema : {
      id: 'process.entity_id',
      parent: 'process.parent.entity_id'
    };
    this.resolverFields = (0, _utils.resolverFields)(schemaOrDefault);
    this.schema = schemaOrDefault;
    this.indexPatterns = indexPatterns;
    this.timeRange = timeRange;
    this.isInternalRequest = isInternalRequest;
  }
  getRangeFilter() {
    return this.timeRange ? [{
      range: {
        '@timestamp': {
          gte: this.timeRange.from,
          lte: this.timeRange.to,
          format: 'strict_date_optional_time'
        }
      }
    }] : [];
  }
}
exports.BaseResolverQuery = BaseResolverQuery;