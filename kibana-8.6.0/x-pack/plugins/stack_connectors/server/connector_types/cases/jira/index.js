"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _types = require("../../../../../actions/common/types");
var _validators = require("./validators");
var _schema = require("./schema");
var _service = require("./service");
var _api = require("./api");
var i18n = _interopRequireWildcard(require("./translations"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const supportedSubActions = ['getFields', 'getIncident', 'pushToService', 'issueTypes', 'fieldsByIssueType', 'issues', 'issue'];
const ConnectorTypeId = '.jira';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: i18n.NAME,
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
      params: {
        schema: _schema.ExecutorParamsSchema
      }
    },
    executor
  };
}

// action executor
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
    const errorMessage = `[Action][ExternalService] Unsupported subAction type ${subAction}.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (!supportedSubActions.includes(subAction)) {
    const errorMessage = `[Action][ExternalService] subAction ${subAction} not implemented.`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (subAction === 'getIncident') {
    const getIncidentParams = subActionParams;
    const res = await _api.api.getIncident({
      externalService,
      params: getIncidentParams
    });
    if (res != null) {
      data = res;
    }
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
  if (subAction === 'issueTypes') {
    const getIssueTypesParams = subActionParams;
    data = await _api.api.issueTypes({
      externalService,
      params: getIssueTypesParams
    });
  }
  if (subAction === 'fieldsByIssueType') {
    const getFieldsByIssueTypeParams = subActionParams;
    data = await _api.api.fieldsByIssueType({
      externalService,
      params: getFieldsByIssueTypeParams
    });
  }
  if (subAction === 'getFields') {
    data = await _api.api.getFields({
      externalService,
      params: subActionParams
    });
  }
  if (subAction === 'issues') {
    const getIssuesParams = subActionParams;
    data = await _api.api.issues({
      externalService,
      params: getIssuesParams
    });
  }
  if (subAction === 'issue') {
    const getIssueParams = subActionParams;
    data = await _api.api.issue({
      externalService,
      params: getIssueParams
    });
  }
  return {
    status: 'ok',
    data: (_data = data) !== null && _data !== void 0 ? _data : {},
    actionId
  };
}