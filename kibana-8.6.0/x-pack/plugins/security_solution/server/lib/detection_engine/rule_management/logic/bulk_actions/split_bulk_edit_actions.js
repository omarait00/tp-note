"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitBulkEditActions = void 0;
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Split bulk edit actions in 2 chunks: actions applied to params and
 * actions applied to attributes
 * @param actions BulkActionEditPayload[]
 * @returns lists of split actions
 */
const splitBulkEditActions = actions => {
  const splitActions = {
    attributesActions: [],
    paramsActions: []
  };
  return actions.reduce((acc, action) => {
    switch (action.type) {
      case _request_schema.BulkActionEditType.set_schedule:
        acc.attributesActions.push(action);
        acc.paramsActions.push(action);
        break;
      case _request_schema.BulkActionEditType.add_tags:
      case _request_schema.BulkActionEditType.set_tags:
      case _request_schema.BulkActionEditType.delete_tags:
      case _request_schema.BulkActionEditType.add_rule_actions:
      case _request_schema.BulkActionEditType.set_rule_actions:
        acc.attributesActions.push(action);
        break;
      default:
        acc.paramsActions.push(action);
    }
    return acc;
  }, splitActions);
};
exports.splitBulkEditActions = splitBulkEditActions;