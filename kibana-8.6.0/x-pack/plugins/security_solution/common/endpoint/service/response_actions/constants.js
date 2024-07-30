"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RESPONSE_ACTION_STATUS = exports.RESPONSE_ACTION_API_COMMANDS_NAMES = exports.ENDPOINT_CAPABILITIES = exports.CONSOLE_RESPONSE_ACTION_COMMANDS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
const RESPONSE_ACTION_STATUS = ['failed', 'pending', 'successful'];
exports.RESPONSE_ACTION_STATUS = RESPONSE_ACTION_STATUS;
/**
 * The Command names that are used in the API payload for the `{ command: '' }` attribute
 */
const RESPONSE_ACTION_API_COMMANDS_NAMES = ['isolate', 'unisolate', 'kill-process', 'suspend-process', 'running-processes', 'get-file'];
exports.RESPONSE_ACTION_API_COMMANDS_NAMES = RESPONSE_ACTION_API_COMMANDS_NAMES;
/**
 * The list of possible capabilities, reported by the endpoint in the metadata document
 */
const ENDPOINT_CAPABILITIES = ['isolation', 'kill_process', 'suspend_process', 'running_processes', 'get_file'];
exports.ENDPOINT_CAPABILITIES = ENDPOINT_CAPABILITIES;
/**
 * The list of possible console command names that generate a Response Action to be dispatched
 * to the Endpoint. (FYI: not all console commands are response actions)
 */
const CONSOLE_RESPONSE_ACTION_COMMANDS = ['isolate', 'release', 'kill-process', 'suspend-process', 'processes', 'get-file'];
exports.CONSOLE_RESPONSE_ACTION_COMMANDS = CONSOLE_RESPONSE_ACTION_COMMANDS;