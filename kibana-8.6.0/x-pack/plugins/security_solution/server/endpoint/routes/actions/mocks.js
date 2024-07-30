"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mockAuditLogSearchResult = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const mockAuditLogSearchResult = results => {
  var _results$length, _results$map;
  const response = {
    body: {
      hits: {
        total: {
          value: (_results$length = results === null || results === void 0 ? void 0 : results.length) !== null && _results$length !== void 0 ? _results$length : 0,
          relation: 'eq'
        },
        hits: (_results$map = results === null || results === void 0 ? void 0 : results.map(a => ({
          _index: a._index,
          _id: Math.random().toString(36).split('.')[1],
          _score: 0.0,
          _source: a._source
        }))) !== null && _results$map !== void 0 ? _results$map : []
      }
    },
    statusCode: 200,
    headers: {},
    warnings: [],
    meta: {}
  };
  return response;
};
exports.mockAuditLogSearchResult = mockAuditLogSearchResult;