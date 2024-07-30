"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUGIN_NAME = exports.PLUGIN_ID = exports.CHANGE_POINT_DETECTION_ENABLED = exports.AIOPS_ENABLED = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * PLUGIN_ID is used as a unique identifier for the aiops plugin
 */
const PLUGIN_ID = 'aiops';

/**
 * PLUGIN_NAME is used as the display name for the aiops plugin
 */
exports.PLUGIN_ID = PLUGIN_ID;
const PLUGIN_NAME = 'AIOps';

/**
 * This is an internal hard coded feature flag so we can easily turn on/off the
 * "Explain log rate spikes UI" during development until the first release.
 */
exports.PLUGIN_NAME = PLUGIN_NAME;
const AIOPS_ENABLED = true;
exports.AIOPS_ENABLED = AIOPS_ENABLED;
const CHANGE_POINT_DETECTION_ENABLED = false;
exports.CHANGE_POINT_DETECTION_ENABLED = CHANGE_POINT_DETECTION_ENABLED;