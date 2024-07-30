"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _mustache_renderer = require("../../../../../actions/server/lib/mustache_renderer");
var _types = require("../../../../../actions/common/types");
var _common = require("../../../../../actions/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ConfigSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  refresh: _configSchema.schema.boolean({
    defaultValue: false
  }),
  executionTimeField: _configSchema.schema.nullable(_configSchema.schema.string())
});

// params definition

// see: https://www.elastic.co/guide/en/elasticsearch/reference/current/actions-index.html
// - timeout not added here, as this seems to be a generic thing we want to do
//   eventually: https://github.com/elastic/kibana/projects/26#card-24087404
const ParamsSchema = _configSchema.schema.object({
  documents: _configSchema.schema.arrayOf(_configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.any())),
  indexOverride: _configSchema.schema.nullable(_configSchema.schema.string({
    validate: pattern => {
      if (!pattern.startsWith(_common.ALERT_HISTORY_PREFIX)) {
        return `index must start with "${_common.ALERT_HISTORY_PREFIX}"`;
      }
    }
  }))
});
const ConnectorTypeId = '.index';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'basic',
    name: _i18n.i18n.translate('xpack.stackConnectors.esIndex.title', {
      defaultMessage: 'Index'
    }),
    supportedFeatureIds: [_types.AlertingConnectorFeatureId, _types.UptimeConnectorFeatureId, _types.SecurityConnectorFeatureId],
    validate: {
      config: {
        schema: ConfigSchema
      },
      params: {
        schema: ParamsSchema
      }
    },
    executor,
    renderParameterTemplates
  };
}

// action executor

async function executor(execOptions) {
  const {
    actionId,
    config,
    params,
    services,
    logger
  } = execOptions;
  const index = params.indexOverride || config.index;
  const bulkBody = [];
  for (const document of params.documents) {
    const timeField = config.executionTimeField == null ? '' : config.executionTimeField.trim();
    if (timeField !== '') {
      document[timeField] = new Date();
    }
    bulkBody.push({
      index: {
        op_type: 'create'
      }
    });
    bulkBody.push(document);
  }
  const bulkParams = {
    index,
    body: bulkBody,
    refresh: config.refresh
  };
  try {
    const result = await services.scopedClusterClient.bulk(bulkParams);
    const err = (0, _lodash.find)(result.items, 'index.error.reason');
    if (err) {
      var _err$index, _err$index$error, _err$index2, _err$index2$error, _err$index3, _err$index3$error, _err$index3$error$cau;
      return wrapErr(`${(_err$index = err.index) === null || _err$index === void 0 ? void 0 : (_err$index$error = _err$index.error) === null || _err$index$error === void 0 ? void 0 : _err$index$error.reason}${(_err$index2 = err.index) !== null && _err$index2 !== void 0 && (_err$index2$error = _err$index2.error) !== null && _err$index2$error !== void 0 && _err$index2$error.caused_by ? ` (${(_err$index3 = err.index) === null || _err$index3 === void 0 ? void 0 : (_err$index3$error = _err$index3.error) === null || _err$index3$error === void 0 ? void 0 : (_err$index3$error$cau = _err$index3$error.caused_by) === null || _err$index3$error$cau === void 0 ? void 0 : _err$index3$error$cau.reason})` : ''}`, actionId, logger);
    }
    return {
      status: 'ok',
      data: result,
      actionId
    };
  } catch (err) {
    return wrapErr(err.message, actionId, logger);
  }
}
function renderParameterTemplates(params, variables, actionId) {
  const {
    documents,
    indexOverride
  } = (0, _mustache_renderer.renderMustacheObject)(params, variables);
  if (actionId === _common.AlertHistoryEsIndexConnectorId) {
    const alertHistoryDoc = (0, _common.buildAlertHistoryDocument)(variables);
    if (!alertHistoryDoc) {
      throw new Error(`error creating alert history document for ${actionId} connector`);
    }
    return {
      documents: [alertHistoryDoc],
      indexOverride
    };
  }
  return {
    documents,
    indexOverride: null
  };
}
function wrapErr(errMessage, actionId, logger) {
  const message = _i18n.i18n.translate('xpack.stackConnectors.esIndex.errorIndexingErrorMessage', {
    defaultMessage: 'error indexing documents'
  });
  logger.error(`error indexing documents: ${errMessage}`);
  return {
    status: 'error',
    actionId,
    message,
    serviceMessage: errMessage
  };
}