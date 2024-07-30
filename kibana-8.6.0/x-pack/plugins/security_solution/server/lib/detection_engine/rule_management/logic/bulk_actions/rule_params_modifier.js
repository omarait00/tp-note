"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleParamsModifier = exports.deleteItemsFromArray = exports.addItemsToArray = void 0;
var _moment = _interopRequireDefault(require("moment"));
var _date_interval_utils = require("../../../../../../../../../src/plugins/data/common/search/aggs/utils/date_interval_utils");
var _request_schema = require("../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
var _invariant = require("../../../../../../common/utils/invariant");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable complexity */

const addItemsToArray = (arr, items) => Array.from(new Set([...arr, ...items]));
exports.addItemsToArray = addItemsToArray;
const deleteItemsFromArray = (arr, items) => {
  const itemsSet = new Set(items);
  return arr.filter(item => !itemsSet.has(item));
};
exports.deleteItemsFromArray = deleteItemsFromArray;
const applyBulkActionEditToRuleParams = (existingRuleParams, action) => {
  var _ruleParams$index;
  let ruleParams = {
    ...existingRuleParams
  };
  switch (action.type) {
    // index_patterns actions
    // index pattern is not present in machine learning rule type, so we throw error on it
    case _request_schema.BulkActionEditType.add_index_patterns:
      (0, _invariant.invariant)(ruleParams.type !== 'machine_learning', "Index patterns can't be added. Machine learning rule doesn't have index patterns property");
      if (ruleParams.dataViewId != null && !action.overwrite_data_views) {
        break;
      }
      if (action.overwrite_data_views) {
        ruleParams.dataViewId = undefined;
      }
      ruleParams.index = addItemsToArray((_ruleParams$index = ruleParams.index) !== null && _ruleParams$index !== void 0 ? _ruleParams$index : [], action.value);
      break;
    case _request_schema.BulkActionEditType.delete_index_patterns:
      (0, _invariant.invariant)(ruleParams.type !== 'machine_learning', "Index patterns can't be deleted. Machine learning rule doesn't have index patterns property");
      if (ruleParams.dataViewId != null && !action.overwrite_data_views) {
        break;
      }
      if (action.overwrite_data_views) {
        ruleParams.dataViewId = undefined;
      }
      if (ruleParams.index) {
        ruleParams.index = deleteItemsFromArray(ruleParams.index, action.value);
      }
      break;
    case _request_schema.BulkActionEditType.set_index_patterns:
      (0, _invariant.invariant)(ruleParams.type !== 'machine_learning', "Index patterns can't be overwritten. Machine learning rule doesn't have index patterns property");
      if (ruleParams.dataViewId != null && !action.overwrite_data_views) {
        break;
      }
      if (action.overwrite_data_views) {
        ruleParams.dataViewId = undefined;
      }
      ruleParams.index = action.value;
      break;

    // timeline actions
    case _request_schema.BulkActionEditType.set_timeline:
      ruleParams = {
        ...ruleParams,
        timelineId: action.value.timeline_id || undefined,
        timelineTitle: action.value.timeline_title || undefined
      };
      break;

    // update look-back period in from and meta.from fields
    case _request_schema.BulkActionEditType.set_schedule:
      {
        var _parseInterval, _parseInterval2;
        const interval = (_parseInterval = (0, _date_interval_utils.parseInterval)(action.value.interval)) !== null && _parseInterval !== void 0 ? _parseInterval : _moment.default.duration(0);
        const parsedFrom = (_parseInterval2 = (0, _date_interval_utils.parseInterval)(action.value.lookback)) !== null && _parseInterval2 !== void 0 ? _parseInterval2 : _moment.default.duration(0);
        const from = parsedFrom.asSeconds() + interval.asSeconds();
        ruleParams = {
          ...ruleParams,
          meta: {
            ...ruleParams.meta,
            from: action.value.lookback
          },
          from: `now-${from}s`
        };
      }
  }
  return ruleParams;
};

/**
 * takes list of bulkEdit actions and apply them to rule.params by mutating it
 * @param existingRuleParams
 * @param actions
 * @returns mutated params
 */
const ruleParamsModifier = (existingRuleParams, actions) => {
  const modifiedParams = actions.reduce((acc, action) => ({
    ...acc,
    ...applyBulkActionEditToRuleParams(acc, action)
  }), existingRuleParams);

  // increment version even if actions are empty, as attributes can be modified as well outside of ruleParamsModifier
  // version must not be modified for immutable rule. Otherwise prebuilt rules upgrade flow will be broken
  if (existingRuleParams.immutable === false) {
    modifiedParams.version += 1;
  }
  return modifiedParams;
};
exports.ruleParamsModifier = ruleParamsModifier;