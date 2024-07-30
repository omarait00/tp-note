"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allOptionText = exports.ENVIRONMENT_NOT_DEFINED = exports.ENVIRONMENT_ALL = void 0;
exports.getEnvironmentEsField = getEnvironmentEsField;
exports.getEnvironmentLabel = getEnvironmentLabel;
exports.getNextEnvironmentUrlParam = getNextEnvironmentUrlParam;
var _i18n = require("@kbn/i18n");
var _elasticsearch_fieldnames = require("./elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ENVIRONMENT_ALL_VALUE = 'ENVIRONMENT_ALL';
const ENVIRONMENT_NOT_DEFINED_VALUE = 'ENVIRONMENT_NOT_DEFINED';
const allOptionText = _i18n.i18n.translate('xpack.apm.filter.environment.allLabel', {
  defaultMessage: 'All'
});
exports.allOptionText = allOptionText;
function getEnvironmentLabel(environment) {
  if (!environment || environment === ENVIRONMENT_NOT_DEFINED_VALUE) {
    return _i18n.i18n.translate('xpack.apm.filter.environment.notDefinedLabel', {
      defaultMessage: 'Not defined'
    });
  }
  if (environment === ENVIRONMENT_ALL_VALUE) {
    return allOptionText;
  }
  return environment;
}
const ENVIRONMENT_ALL = {
  value: ENVIRONMENT_ALL_VALUE,
  label: getEnvironmentLabel(ENVIRONMENT_ALL_VALUE)
};
exports.ENVIRONMENT_ALL = ENVIRONMENT_ALL;
const ENVIRONMENT_NOT_DEFINED = {
  value: ENVIRONMENT_NOT_DEFINED_VALUE,
  label: getEnvironmentLabel(ENVIRONMENT_NOT_DEFINED_VALUE)
};
exports.ENVIRONMENT_NOT_DEFINED = ENVIRONMENT_NOT_DEFINED;
function getEnvironmentEsField(environment) {
  if (!environment || environment === ENVIRONMENT_NOT_DEFINED_VALUE || environment === ENVIRONMENT_ALL_VALUE) {
    return {};
  }
  return {
    [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: environment
  };
}

// returns the environment url param that should be used
// based on the requested environment. If the requested
// environment is different from the URL parameter, we'll
// return ENVIRONMENT_ALL. If it's not, we'll just return
// the current environment URL param
function getNextEnvironmentUrlParam({
  requestedEnvironment,
  currentEnvironmentUrlParam
}) {
  const normalizedRequestedEnvironment = requestedEnvironment || ENVIRONMENT_NOT_DEFINED.value;
  const normalizedQueryEnvironment = currentEnvironmentUrlParam || ENVIRONMENT_ALL.value;
  if (normalizedRequestedEnvironment === normalizedQueryEnvironment) {
    return currentEnvironmentUrlParam || ENVIRONMENT_ALL.value;
  }
  return ENVIRONMENT_ALL.value;
}