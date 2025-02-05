"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventSchema = exports.ECS_VERSION = void 0;
var _configSchema = require("@kbn/config-schema");
var _semver = _interopRequireDefault(require("semver"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// ---------------------------------- WARNING ----------------------------------
// this file was generated, and should not be edited by hand
// ---------------------------------- WARNING ----------------------------------

// provides TypeScript and config-schema interfaces for ECS for use with
// the event log

const ECS_VERSION = '1.8.0';

// types and config-schema describing the es structures
exports.ECS_VERSION = ECS_VERSION;
const EventSchema = _configSchema.schema.maybe(_configSchema.schema.object({
  '@timestamp': ecsDate(),
  message: ecsString(),
  tags: ecsStringMulti(),
  ecs: _configSchema.schema.maybe(_configSchema.schema.object({
    version: ecsString()
  })),
  error: _configSchema.schema.maybe(_configSchema.schema.object({
    code: ecsString(),
    id: ecsString(),
    message: ecsString(),
    stack_trace: ecsString(),
    type: ecsString()
  })),
  event: _configSchema.schema.maybe(_configSchema.schema.object({
    action: ecsString(),
    category: ecsStringMulti(),
    code: ecsString(),
    created: ecsDate(),
    dataset: ecsString(),
    duration: ecsStringOrNumber(),
    end: ecsDate(),
    hash: ecsString(),
    id: ecsString(),
    ingested: ecsDate(),
    kind: ecsString(),
    module: ecsString(),
    original: ecsString(),
    outcome: ecsString(),
    provider: ecsString(),
    reason: ecsString(),
    reference: ecsString(),
    risk_score: ecsNumber(),
    risk_score_norm: ecsNumber(),
    sequence: ecsStringOrNumber(),
    severity: ecsStringOrNumber(),
    start: ecsDate(),
    timezone: ecsString(),
    type: ecsStringMulti(),
    url: ecsString()
  })),
  log: _configSchema.schema.maybe(_configSchema.schema.object({
    level: ecsString(),
    logger: ecsString()
  })),
  rule: _configSchema.schema.maybe(_configSchema.schema.object({
    author: ecsStringMulti(),
    category: ecsString(),
    description: ecsString(),
    id: ecsString(),
    license: ecsString(),
    name: ecsString(),
    reference: ecsString(),
    ruleset: ecsString(),
    uuid: ecsString(),
    version: ecsString()
  })),
  user: _configSchema.schema.maybe(_configSchema.schema.object({
    name: ecsString()
  })),
  kibana: _configSchema.schema.maybe(_configSchema.schema.object({
    server_uuid: ecsString(),
    task: _configSchema.schema.maybe(_configSchema.schema.object({
      id: ecsString(),
      scheduled: ecsDate(),
      schedule_delay: ecsStringOrNumber()
    })),
    alerting: _configSchema.schema.maybe(_configSchema.schema.object({
      instance_id: ecsString(),
      action_group_id: ecsString(),
      action_subgroup: ecsString(),
      status: ecsString(),
      outcome: ecsString()
    })),
    alert: _configSchema.schema.maybe(_configSchema.schema.object({
      flapping: ecsBoolean(),
      rule: _configSchema.schema.maybe(_configSchema.schema.object({
        consumer: ecsString(),
        execution: _configSchema.schema.maybe(_configSchema.schema.object({
          uuid: ecsString(),
          status: ecsString(),
          status_order: ecsStringOrNumber(),
          metrics: _configSchema.schema.maybe(_configSchema.schema.object({
            number_of_triggered_actions: ecsStringOrNumber(),
            number_of_generated_actions: ecsStringOrNumber(),
            alert_counts: _configSchema.schema.maybe(_configSchema.schema.object({
              active: ecsStringOrNumber(),
              new: ecsStringOrNumber(),
              recovered: ecsStringOrNumber()
            })),
            number_of_searches: ecsStringOrNumber(),
            total_indexing_duration_ms: ecsStringOrNumber(),
            es_search_duration_ms: ecsStringOrNumber(),
            total_search_duration_ms: ecsStringOrNumber(),
            execution_gap_duration_s: ecsStringOrNumber(),
            rule_type_run_duration_ms: ecsStringOrNumber(),
            process_alerts_duration_ms: ecsStringOrNumber(),
            trigger_actions_duration_ms: ecsStringOrNumber(),
            process_rule_duration_ms: ecsStringOrNumber(),
            claim_to_start_duration_ms: ecsStringOrNumber(),
            prepare_rule_duration_ms: ecsStringOrNumber(),
            total_run_duration_ms: ecsStringOrNumber(),
            total_enrichment_duration_ms: ecsStringOrNumber()
          }))
        })),
        rule_type_id: ecsString()
      }))
    })),
    saved_objects: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
      rel: ecsString(),
      namespace: ecsString(),
      id: ecsString(),
      type: ecsString(),
      type_id: ecsString()
    }))),
    space_ids: ecsStringMulti(),
    version: ecsVersion()
  }))
}));
exports.EventSchema = EventSchema;
function ecsStringMulti() {
  return _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()));
}
function ecsString() {
  return _configSchema.schema.maybe(_configSchema.schema.string());
}
function ecsNumber() {
  return _configSchema.schema.maybe(_configSchema.schema.number());
}
function ecsStringOrNumber() {
  return _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()]));
}
function ecsDate() {
  return _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateDate
  }));
}
function ecsBoolean() {
  return _configSchema.schema.maybe(_configSchema.schema.boolean());
}
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
function validateDate(isoDate) {
  if (ISO_DATE_PATTERN.test(isoDate)) return;
  return 'string is not a valid ISO date: ' + isoDate;
}
function ecsVersion() {
  return _configSchema.schema.maybe(_configSchema.schema.string({
    validate: validateVersion
  }));
}
function validateVersion(version) {
  if (_semver.default.valid(version)) return;
  return 'string is not a valid version: ' + version;
}