"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ROLL_TOTAL_INDICES_INTERVAL = exports.ROLL_INDICES_START = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Roll total indices every 24h
 */
const ROLL_TOTAL_INDICES_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * Start rolling indices after 5 minutes up
 */
exports.ROLL_TOTAL_INDICES_INTERVAL = ROLL_TOTAL_INDICES_INTERVAL;
const ROLL_INDICES_START = 5 * 60 * 1000;
exports.ROLL_INDICES_START = ROLL_INDICES_START;