"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _connector_feature_config = require("../../../../../actions/common/connector_feature_config");
var _string_utils = require("../../lib/string_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ParamsSchema = _configSchema.schema.object({
  message: _configSchema.schema.string(),
  level: _configSchema.schema.oneOf([_configSchema.schema.literal('trace'), _configSchema.schema.literal('debug'), _configSchema.schema.literal('info'), _configSchema.schema.literal('warn'), _configSchema.schema.literal('error'), _configSchema.schema.literal('fatal')], {
    defaultValue: 'info'
  })
});
const ConnectorTypeId = '.server-log';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'basic',
    name: _i18n.i18n.translate('xpack.stackConnectors.serverLog.title', {
      defaultMessage: 'Server log'
    }),
    supportedFeatureIds: [_connector_feature_config.AlertingConnectorFeatureId, _connector_feature_config.UptimeConnectorFeatureId],
    validate: {
      params: {
        schema: ParamsSchema
      }
    },
    executor
  };
}

// action executor

async function executor(execOptions) {
  const {
    actionId,
    params,
    logger
  } = execOptions;
  const sanitizedMessage = (0, _string_utils.withoutControlCharacters)(params.message);
  try {
    logger[params.level](`Server log: ${sanitizedMessage}`);
  } catch (err) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.serverLog.errorLoggingErrorMessage', {
      defaultMessage: 'error logging message'
    });
    return {
      status: 'error',
      message,
      serviceMessage: err.message,
      actionId
    };
  }
  return {
    status: 'ok',
    actionId
  };
}