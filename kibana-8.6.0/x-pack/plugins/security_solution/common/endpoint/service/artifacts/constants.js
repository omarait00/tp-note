"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLOBAL_ARTIFACT_TAG = exports.DEFAULT_EXCEPTION_LIST_ITEM_SEARCHABLE_FIELDS = exports.BY_POLICY_ARTIFACT_TAG_PREFIX = exports.ALL_ENDPOINT_ARTIFACT_LIST_IDS = void 0;
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BY_POLICY_ARTIFACT_TAG_PREFIX = 'policy:';
exports.BY_POLICY_ARTIFACT_TAG_PREFIX = BY_POLICY_ARTIFACT_TAG_PREFIX;
const GLOBAL_ARTIFACT_TAG = `${BY_POLICY_ARTIFACT_TAG_PREFIX}all`;
exports.GLOBAL_ARTIFACT_TAG = GLOBAL_ARTIFACT_TAG;
const ALL_ENDPOINT_ARTIFACT_LIST_IDS = [_securitysolutionListConstants.ENDPOINT_TRUSTED_APPS_LIST_ID, _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID, _securitysolutionListConstants.ENDPOINT_HOST_ISOLATION_EXCEPTIONS_LIST_ID, _securitysolutionListConstants.ENDPOINT_BLOCKLISTS_LIST_ID];
exports.ALL_ENDPOINT_ARTIFACT_LIST_IDS = ALL_ENDPOINT_ARTIFACT_LIST_IDS;
const DEFAULT_EXCEPTION_LIST_ITEM_SEARCHABLE_FIELDS = [`name`, `description`, `entries.value`, `entries.entries.value`, `item_id`];
exports.DEFAULT_EXCEPTION_LIST_ITEM_SEARCHABLE_FIELDS = DEFAULT_EXCEPTION_LIST_ITEM_SEARCHABLE_FIELDS;