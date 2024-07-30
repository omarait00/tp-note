"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;
var _sub_action_connector = require("./sub_action_connector");
var _case = require("./case");
var _executor = require("./executor");
var _validators = require("./validators");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateService = Service => {
  if (!(Service.prototype instanceof _case.CaseConnector) && !(Service.prototype instanceof _sub_action_connector.SubActionConnector)) {
    throw new Error('Service must be extend one of the abstract classes: SubActionConnector or CaseConnector');
  }
};
const register = ({
  actionTypeRegistry,
  connector,
  logger,
  configurationUtilities
}) => {
  validateService(connector.Service);
  const validators = (0, _validators.buildValidators)({
    connector,
    configurationUtilities
  });
  const executor = (0, _executor.buildExecutor)({
    connector,
    logger,
    configurationUtilities
  });
  actionTypeRegistry.register({
    id: connector.id,
    name: connector.name,
    minimumLicenseRequired: connector.minimumLicenseRequired,
    supportedFeatureIds: connector.supportedFeatureIds,
    validate: validators,
    executor,
    renderParameterTemplates: connector.renderParameterTemplates
  });
};
exports.register = register;