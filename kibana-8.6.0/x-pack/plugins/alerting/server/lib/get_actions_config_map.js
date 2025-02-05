"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionsConfigMap = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getActionsConfigMap = actionsConfig => {
  var _actionsConfig$connec;
  const configsByConnectorType = (_actionsConfig$connec = actionsConfig.connectorTypeOverrides) === null || _actionsConfig$connec === void 0 ? void 0 : _actionsConfig$connec.reduce((config, configByConnectorType) => {
    return {
      ...config,
      [configByConnectorType.id]: (0, _lodash.omit)(configByConnectorType, 'id')
    };
  }, {});
  return {
    default: (0, _lodash.omit)(actionsConfig, 'connectorTypeOverrides'),
    ...configsByConnectorType
  };
};
exports.getActionsConfigMap = getActionsConfigMap;