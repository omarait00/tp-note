"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isIndexPatternsBulkEditAction = void 0;
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * helper utility that defines whether bulk edit action is related to index patterns, i.e. one of:
 * 'add_index_patterns', 'delete_index_patterns', 'set_index_patterns'
 * @param editAction {@link BulkActionEditType}
 * @returns {boolean}
 */
const isIndexPatternsBulkEditAction = editAction => [_request_schema.BulkActionEditType.add_index_patterns, _request_schema.BulkActionEditType.delete_index_patterns, _request_schema.BulkActionEditType.set_index_patterns].includes(editAction);
exports.isIndexPatternsBulkEditAction = isIndexPatternsBulkEditAction;