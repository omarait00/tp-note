"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuthzFilter = getAuthzFilter;
var _server = require("../../../alerting/server");
var _technical_rule_data_field_names = require("../../common/technical_rule_data_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getAuthzFilter(authorization, operation) {
  const {
    filter
  } = await authorization.getAuthorizationFilter(_server.AlertingAuthorizationEntity.Alert, {
    type: _server.AlertingAuthorizationFilterType.ESDSL,
    fieldNames: {
      consumer: _technical_rule_data_field_names.ALERT_RULE_CONSUMER,
      ruleTypeId: _technical_rule_data_field_names.ALERT_RULE_TYPE_ID
    }
  }, operation);
  return filter;
}