"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConnectorType = getConnectorType;
var _i18n = require("@kbn/i18n");
var _types = require("../../../../../actions/common/types");
var _validators = require("./validators");
var _schema = require("./schema");
var _service = require("./service");
var _api = require("./api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const supportedSubActions = ['pushToService'];

// connector type definition
function getConnectorType() {
  return {
    id: '.swimlane',
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.swimlane.title', {
      defaultMessage: 'Swimlane'
    }),
    supportedFeatureIds: [_types.AlertingConnectorFeatureId, _types.CasesConnectorFeatureId, _types.SecurityConnectorFeatureId],
    validate: {
      config: {
        schema: _schema.SwimlaneServiceConfigurationSchema,
        customValidator: _validators.validate.config
      },
      secrets: {
        schema: _schema.SwimlaneSecretsConfigurationSchema,
        customValidator: _validators.validate.secrets
      },
      params: {
        schema: _schema.ExecutorParamsSchema
      }
    },
    executor
  };
}
async function executor(execOptions) {
  var _data;
  const {
    actionId,
    config,
    params,
    secrets,
    configurationUtilities,
    logger
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  let data = null;
  const externalService = (0, _service.createExternalService)({
    config,
    secrets
  }, logger, configurationUtilities);
  if (!_api.api[subAction]) {
    const errorMessage = `[Action][ExternalService] -> [Swimlane] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] -> [Swimlane] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (subAction === 'pushToService') {
    const pushToServiceParams = subActionParams;
    data = await _api.api.pushToService({
      externalService,
      params: pushToServiceParams,
      logger
    });
    logger.debug(`response push to service for incident id: ${data.id}`);
  }
  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}