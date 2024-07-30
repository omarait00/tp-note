"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkEditActionToRulesClientOperation = void 0;
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
var _utility_types = require("../../../../../../common/utility_types");
var _rule_actions = require("../../normalization/rule_actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getThrottleOperation = throttle => ({
  field: 'throttle',
  operation: 'set',
  value: (0, _rule_actions.transformToAlertThrottle)(throttle)
});
const getNotifyWhenOperation = throttle => ({
  field: 'notifyWhen',
  operation: 'set',
  value: (0, _rule_actions.transformToNotifyWhen)(throttle)
});

/**
 * converts bulk edit action to format of rulesClient.bulkEdit operation
 * @param action BulkActionEditForRuleAttributes
 * @returns rulesClient BulkEditOperation
 */
const bulkEditActionToRulesClientOperation = action => {
  switch (action.type) {
    // tags actions
    case _request_schema.BulkActionEditType.add_tags:
      return [{
        field: 'tags',
        operation: 'add',
        value: action.value
      }];
    case _request_schema.BulkActionEditType.delete_tags:
      return [{
        field: 'tags',
        operation: 'delete',
        value: action.value
      }];
    case _request_schema.BulkActionEditType.set_tags:
      return [{
        field: 'tags',
        operation: 'set',
        value: action.value
      }];

    // rule actions
    case _request_schema.BulkActionEditType.add_rule_actions:
      return [{
        field: 'actions',
        operation: 'add',
        value: action.value.actions
      }, getThrottleOperation(action.value.throttle), getNotifyWhenOperation(action.value.throttle)];
    case _request_schema.BulkActionEditType.set_rule_actions:
      return [{
        field: 'actions',
        operation: 'set',
        value: action.value.actions
      }, getThrottleOperation(action.value.throttle), getNotifyWhenOperation(action.value.throttle)];

    // schedule actions
    case _request_schema.BulkActionEditType.set_schedule:
      return [{
        field: 'schedule',
        operation: 'set',
        value: {
          interval: action.value.interval
        }
      }];
    default:
      return (0, _utility_types.assertUnreachable)(action);
  }
};
exports.bulkEditActionToRulesClientOperation = bulkEditActionToRulesClientOperation;