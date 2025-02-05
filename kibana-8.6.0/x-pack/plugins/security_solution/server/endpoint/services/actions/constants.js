"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_RESPONSE_INDICES = exports.ACTION_REQUEST_INDICES = exports.ACTIONS_SEARCH_PAGE_SIZE = void 0;
var _common = require("../../../../../fleet/common");
var _constants = require("../../../../common/endpoint/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The Page Size to be used when searching against the Actions indexes (both requests and responses)
 */
const ACTIONS_SEARCH_PAGE_SIZE = 10000;
exports.ACTIONS_SEARCH_PAGE_SIZE = ACTIONS_SEARCH_PAGE_SIZE;
const ACTION_REQUEST_INDICES = [_common.AGENT_ACTIONS_INDEX, _constants.ENDPOINT_ACTIONS_INDEX];
// search all responses indices irrelevant of namespace
exports.ACTION_REQUEST_INDICES = ACTION_REQUEST_INDICES;
const ACTION_RESPONSE_INDICES = [_common.AGENT_ACTIONS_RESULTS_INDEX, _constants.ENDPOINT_ACTION_RESPONSES_INDEX_PATTERN];
exports.ACTION_RESPONSE_INDICES = ACTION_RESPONSE_INDICES;