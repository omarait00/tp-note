"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ServiceNowITSMConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _config.ServiceNowITSMConnectorTypeId;
  }
});
exports.getServiceNowITSMConnectorType = getServiceNowITSMConnectorType;
Object.defineProperty(exports, "serviceNowITSMTable", {
  enumerable: true,
  get: function () {
    return _config.serviceNowITSMTable;
  }
});
var _lodash = require("lodash");
var _types = require("../../../../../actions/common/types");
var _validators = require("../../lib/servicenow/validators");
var _schema = require("../../lib/servicenow/schema");
var _service = require("./service");
var _api = require("./api");
var i18n = _interopRequireWildcard(require("../../lib/servicenow/translations"));
var _config = require("../../lib/servicenow/config");
var _utils = require("../../lib/servicenow/utils");
var _create_service_wrapper = require("../../lib/servicenow/create_service_wrapper");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// connector type definition
function getServiceNowITSMConnectorType() {
  return {
    id: _config.ServiceNowITSMConnectorTypeId,
    minimumLicenseRequired: 'platinum',
    name: i18n.SERVICENOW_ITSM,
    supportedFeatureIds: [_types.AlertingConnectorFeatureId, _types.CasesConnectorFeatureId, _types.UptimeConnectorFeatureId, _types.SecurityConnectorFeatureId],
    validate: {
      config: {
        schema: _schema.ExternalIncidentServiceConfigurationSchema,
        customValidator: _validators.validate.config
      },
      secrets: {
        schema: _schema.ExternalIncidentServiceSecretConfigurationSchema,
        customValidator: _validators.validate.secrets
      },
      connector: _validators.validate.connector,
      params: {
        schema: _schema.ExecutorParamsSchemaITSM
      }
    },
    executor: (0, _lodash.curry)(executor)({
      actionTypeId: _config.ServiceNowITSMConnectorTypeId,
      createService: _service.createExternalService,
      api: _api.api
    })
  };
}

// action executor
const supportedSubActions = ['getFields', 'pushToService', 'getChoices', 'getIncident'];
async function executor({
  actionTypeId,
  createService,
  api
}, execOptions) {
  var _data;
  const {
    actionId,
    config,
    params,
    secrets,
    services,
    configurationUtilities,
    logger
  } = execOptions;
  const {
    subAction,
    subActionParams
  } = params;
  const connectorTokenClient = services.connectorTokenClient;
  const externalServiceConfig = _config.snExternalServiceConfig[actionTypeId];
  let data = null;
  const externalService = (0, _create_service_wrapper.createServiceWrapper)({
    connectorId: actionId,
    credentials: {
      config,
      secrets
    },
    logger,
    configurationUtilities,
    serviceConfig: externalServiceConfig,
    connectorTokenClient,
    createServiceFn: createService
  });
  const apiAsRecord = api;
  (0, _utils.throwIfSubActionIsNotSupported)({
    api: apiAsRecord,
    subAction,
    supportedSubActions,
    logger
  });
  if (subAction === 'pushToService') {
    const pushToServiceParams = subActionParams;
    data = await api.pushToService({
      externalService,
      params: pushToServiceParams,
      config,
      secrets,
      logger,
      commentFieldKey: externalServiceConfig.commentFieldKey
    });
    logger.debug(`response push to service for incident id: ${data.id}`);
  }
  if (subAction === 'getFields') {
    const getFieldsParams = subActionParams;
    data = await api.getFields({
      externalService,
      params: getFieldsParams,
      logger
    });
  }
  if (subAction === 'getChoices') {
    const getChoicesParams = subActionParams;
    data = await api.getChoices({
      externalService,
      params: getChoicesParams,
      logger
    });
  }
  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}