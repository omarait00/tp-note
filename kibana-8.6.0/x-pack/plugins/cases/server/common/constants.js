"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PUSH_CONNECTOR_ID_REFERENCE_NAME = exports.LICENSING_CASE_ASSIGNMENT_FEATURE = exports.EXTERNAL_REFERENCE_REF_NAME = exports.CONNECTOR_ID_REFERENCE_NAME = exports.COMMENT_REF_NAME = exports.CASE_REF_NAME = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The name of the saved object reference indicating the action connector ID. This is stored in the Saved Object reference
 * field's name property.
 */
const CONNECTOR_ID_REFERENCE_NAME = 'connectorId';

/**
 * The name of the saved object reference indicating the action connector ID that was used to push a case.
 */
exports.CONNECTOR_ID_REFERENCE_NAME = CONNECTOR_ID_REFERENCE_NAME;
const PUSH_CONNECTOR_ID_REFERENCE_NAME = 'pushConnectorId';

/**
 * The name of the saved object reference indicating the caseId reference
 */
exports.PUSH_CONNECTOR_ID_REFERENCE_NAME = PUSH_CONNECTOR_ID_REFERENCE_NAME;
const CASE_REF_NAME = `associated-${_constants.CASE_SAVED_OBJECT}`;

/**
 * The name of the saved object reference indicating the commentId reference
 */
exports.CASE_REF_NAME = CASE_REF_NAME;
const COMMENT_REF_NAME = `associated-${_constants.CASE_COMMENT_SAVED_OBJECT}`;

/**
 * The name of the saved object reference indicating the externalReferenceId reference
 */
exports.COMMENT_REF_NAME = COMMENT_REF_NAME;
const EXTERNAL_REFERENCE_REF_NAME = 'externalReferenceId';

/**
 * The name of the licensing feature to notify for feature usage with the licensing plugin
 */
exports.EXTERNAL_REFERENCE_REF_NAME = EXTERNAL_REFERENCE_REF_NAME;
const LICENSING_CASE_ASSIGNMENT_FEATURE = 'Cases user assignment';
exports.LICENSING_CASE_ASSIGNMENT_FEATURE = LICENSING_CASE_ASSIGNMENT_FEATURE;