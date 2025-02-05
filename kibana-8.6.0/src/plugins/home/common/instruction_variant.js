"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INSTRUCTION_VARIANT = void 0;
exports.getDisplayText = getDisplayText;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const INSTRUCTION_VARIANT = {
  ESC: 'esc',
  OSX: 'osx',
  DEB: 'deb',
  RPM: 'rpm',
  DOCKER: 'docker',
  WINDOWS: 'windows',
  NODE: 'node',
  DJANGO: 'django',
  FLASK: 'flask',
  RAILS: 'rails',
  RACK: 'rack',
  JS: 'js',
  GO: 'go',
  JAVA: 'java',
  DOTNET: 'dotnet',
  LINUX: 'linux',
  PHP: 'php',
  FLEET: 'fleet',
  OPEN_TELEMETRY: 'openTelemetry'
};
exports.INSTRUCTION_VARIANT = INSTRUCTION_VARIANT;
const DISPLAY_MAP = {
  [INSTRUCTION_VARIANT.ESC]: 'Elastic Cloud',
  [INSTRUCTION_VARIANT.OSX]: 'macOS',
  [INSTRUCTION_VARIANT.DEB]: 'Linux DEB',
  [INSTRUCTION_VARIANT.RPM]: 'Linux RPM',
  [INSTRUCTION_VARIANT.DOCKER]: 'Docker',
  [INSTRUCTION_VARIANT.WINDOWS]: 'Windows',
  [INSTRUCTION_VARIANT.NODE]: 'Node.js',
  [INSTRUCTION_VARIANT.DJANGO]: 'Django',
  [INSTRUCTION_VARIANT.FLASK]: 'Flask',
  [INSTRUCTION_VARIANT.RAILS]: 'Ruby on Rails',
  [INSTRUCTION_VARIANT.RACK]: 'Rack',
  [INSTRUCTION_VARIANT.JS]: 'RUM (JS)',
  [INSTRUCTION_VARIANT.GO]: 'Go',
  [INSTRUCTION_VARIANT.JAVA]: 'Java',
  [INSTRUCTION_VARIANT.DOTNET]: '.NET',
  [INSTRUCTION_VARIANT.LINUX]: 'Linux',
  [INSTRUCTION_VARIANT.PHP]: 'PHP',
  [INSTRUCTION_VARIANT.FLEET]: _i18n.i18n.translate('home.tutorial.instruction_variant.fleet', {
    defaultMessage: 'Elastic APM in Fleet'
  }),
  [INSTRUCTION_VARIANT.OPEN_TELEMETRY]: 'OpenTelemetry'
};

/**
 * Convert instruction variant id into display text.
 *
 * @params {String} id - instruction variant id as defined from INSTRUCTION_VARIANT
 * @return {String} display name
 */
function getDisplayText(id) {
  if (id in DISPLAY_MAP) {
    return DISPLAY_MAP[id];
  }
  return id;
}