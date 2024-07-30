"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExecutionResultsUrl = exports.getRuleExecutionEventsUrl = exports.GET_RULE_EXECUTION_RESULTS_URL = exports.GET_RULE_EXECUTION_EVENTS_URL = void 0;
var _constants = require("../../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GET_RULE_EXECUTION_EVENTS_URL = `${_constants.INTERNAL_DETECTION_ENGINE_URL}/rules/{ruleId}/execution/events`;
exports.GET_RULE_EXECUTION_EVENTS_URL = GET_RULE_EXECUTION_EVENTS_URL;
const getRuleExecutionEventsUrl = ruleId => `${_constants.INTERNAL_DETECTION_ENGINE_URL}/rules/${ruleId}/execution/events`;
exports.getRuleExecutionEventsUrl = getRuleExecutionEventsUrl;
const GET_RULE_EXECUTION_RESULTS_URL = `${_constants.INTERNAL_DETECTION_ENGINE_URL}/rules/{ruleId}/execution/results`;
exports.GET_RULE_EXECUTION_RESULTS_URL = GET_RULE_EXECUTION_RESULTS_URL;
const getRuleExecutionResultsUrl = ruleId => `${_constants.INTERNAL_DETECTION_ENGINE_URL}/rules/${ruleId}/execution/results`;
exports.getRuleExecutionResultsUrl = getRuleExecutionResultsUrl;