"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.technicalRuleFieldMap = void 0;
var _pick_with_patterns = require("../../pick_with_patterns");
var Fields = _interopRequireWildcard(require("../../technical_rule_data_field_names"));
var _ecs_field_map = require("./ecs_field_map");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const technicalRuleFieldMap = {
  ...(0, _pick_with_patterns.pickWithPatterns)(_ecs_field_map.ecsFieldMap, Fields.TIMESTAMP, Fields.EVENT_KIND, Fields.EVENT_ACTION, Fields.TAGS),
  [Fields.ALERT_RULE_PARAMETERS]: {
    type: 'flattened',
    ignore_above: 4096
  },
  [Fields.ALERT_RULE_TYPE_ID]: {
    type: 'keyword',
    required: true
  },
  [Fields.ALERT_RULE_CONSUMER]: {
    type: 'keyword',
    required: true
  },
  [Fields.ALERT_RULE_PRODUCER]: {
    type: 'keyword',
    required: true
  },
  [Fields.SPACE_IDS]: {
    type: 'keyword',
    array: true,
    required: true
  },
  [Fields.ALERT_UUID]: {
    type: 'keyword',
    required: true
  },
  [Fields.ALERT_INSTANCE_ID]: {
    type: 'keyword',
    required: true
  },
  [Fields.ALERT_START]: {
    type: 'date'
  },
  [Fields.ALERT_TIME_RANGE]: {
    type: 'date_range',
    format: 'epoch_millis||strict_date_optional_time'
  },
  [Fields.ALERT_END]: {
    type: 'date'
  },
  [Fields.ALERT_DURATION]: {
    type: 'long'
  },
  [Fields.ALERT_SEVERITY]: {
    type: 'keyword'
  },
  [Fields.ALERT_STATUS]: {
    type: 'keyword',
    required: true
  },
  [Fields.ALERT_FLAPPING]: {
    type: 'boolean'
  },
  [Fields.VERSION]: {
    type: 'version',
    array: false,
    required: false
  },
  [Fields.ECS_VERSION]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RISK_SCORE]: {
    type: 'float',
    array: false,
    required: false
  },
  [Fields.ALERT_WORKFLOW_STATUS]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_WORKFLOW_USER]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_WORKFLOW_REASON]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_SYSTEM_STATUS]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_ACTION_GROUP]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_REASON]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_AUTHOR]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_CATEGORY]: {
    type: 'keyword',
    array: false,
    required: true
  },
  [Fields.ALERT_RULE_UUID]: {
    type: 'keyword',
    array: false,
    required: true
  },
  [Fields.ALERT_RULE_CREATED_AT]: {
    type: 'date',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_CREATED_BY]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_DESCRIPTION]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_ENABLED]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_EXECUTION_UUID]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_FROM]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_INTERVAL]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_LICENSE]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_NAME]: {
    type: 'keyword',
    array: false,
    required: true
  },
  [Fields.ALERT_RULE_NOTE]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_REFERENCES]: {
    type: 'keyword',
    array: true,
    required: false
  },
  [Fields.ALERT_RULE_RULE_ID]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_RULE_NAME_OVERRIDE]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_TAGS]: {
    type: 'keyword',
    array: true,
    required: false
  },
  [Fields.ALERT_RULE_TO]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_TYPE]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_UPDATED_AT]: {
    type: 'date',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_UPDATED_BY]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_RULE_VERSION]: {
    type: 'keyword',
    array: false,
    required: false
  },
  [Fields.ALERT_SUPPRESSION_FIELD]: {
    type: 'keyword',
    array: true,
    required: false
  },
  [Fields.ALERT_SUPPRESSION_VALUE]: {
    type: 'keyword',
    array: true,
    required: false
  },
  [Fields.ALERT_SUPPRESSION_START]: {
    type: 'date',
    array: false,
    required: false
  },
  [Fields.ALERT_SUPPRESSION_END]: {
    type: 'date',
    array: false,
    required: false
  },
  [Fields.ALERT_SUPPRESSION_DOCS_COUNT]: {
    type: 'long',
    array: false,
    required: false
  }
};
exports.technicalRuleFieldMap = technicalRuleFieldMap;