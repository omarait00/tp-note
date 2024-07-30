"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerApmRuleTypes = registerApmRuleTypes;
var _register_transaction_duration_rule_type = require("./rule_types/transaction_duration/register_transaction_duration_rule_type");
var _register_anomaly_rule_type = require("./rule_types/anomaly/register_anomaly_rule_type");
var _register_error_count_rule_type = require("./rule_types/error_count/register_error_count_rule_type");
var _register_transaction_error_rate_rule_type = require("./rule_types/transaction_error_rate/register_transaction_error_rate_rule_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerApmRuleTypes(dependencies) {
  (0, _register_transaction_duration_rule_type.registerTransactionDurationRuleType)(dependencies);
  (0, _register_anomaly_rule_type.registerAnomalyRuleType)(dependencies);
  (0, _register_error_count_rule_type.registerErrorCountRuleType)(dependencies);
  (0, _register_transaction_error_rate_rule_type.registerTransactionErrorRateRuleType)(dependencies);
}