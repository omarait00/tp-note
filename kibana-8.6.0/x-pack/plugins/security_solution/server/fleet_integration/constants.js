"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ENDPOINT_INTEGRATION_CONFIG_KEY = exports.ENDPOINT_CONFIG_PRESET_NGAV = exports.ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL = exports.ENDPOINT_CONFIG_PRESET_EDR_COMPLETE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Endpoint Security integration presets.
 * The default endpoint policy configuration can be overrided based on the preset.
 */

const ENDPOINT_CONFIG_PRESET_NGAV = 'NGAV';
exports.ENDPOINT_CONFIG_PRESET_NGAV = ENDPOINT_CONFIG_PRESET_NGAV;
const ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL = 'EDREssential';
exports.ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL = ENDPOINT_CONFIG_PRESET_EDR_ESSENTIAL;
const ENDPOINT_CONFIG_PRESET_EDR_COMPLETE = 'EDRComplete';
exports.ENDPOINT_CONFIG_PRESET_EDR_COMPLETE = ENDPOINT_CONFIG_PRESET_EDR_COMPLETE;
const ENDPOINT_INTEGRATION_CONFIG_KEY = 'ENDPOINT_INTEGRATION_CONFIG';
exports.ENDPOINT_INTEGRATION_CONFIG_KEY = ENDPOINT_INTEGRATION_CONFIG_KEY;