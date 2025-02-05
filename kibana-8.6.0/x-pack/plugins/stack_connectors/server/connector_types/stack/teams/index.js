"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _url = require("url");
var _lodash = require("lodash");
var _axios = _interopRequireDefault(require("axios"));
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _pipeable = require("fp-ts/lib/pipeable");
var _Option = require("fp-ts/lib/Option");
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var _types = require("../../../../../actions/common/types");
var _http_response_retry_header = require("../../lib/http_response_retry_header");
var _result_type = require("../../lib/result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const secretsSchemaProps = {
  webhookUrl: _configSchema.schema.string()
};
const SecretsSchema = _configSchema.schema.object(secretsSchemaProps);

// params definition

const ParamsSchema = _configSchema.schema.object({
  message: _configSchema.schema.string({
    minLength: 1
  })
});
const ConnectorTypeId = '.teams';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.teams.title', {
      defaultMessage: 'Microsoft Teams'
    }),
    supportedFeatureIds: [_types.AlertingConnectorFeatureId, _types.UptimeConnectorFeatureId, _types.SecurityConnectorFeatureId],
    validate: {
      secrets: {
        schema: SecretsSchema,
        customValidator: validateConnectorTypeConfig
      },
      params: {
        schema: ParamsSchema
      }
    },
    executor: teamsExecutor
  };
}
function validateConnectorTypeConfig(secretsObject, validatorServices) {
  const {
    configurationUtilities
  } = validatorServices;
  const configuredUrl = secretsObject.webhookUrl;
  try {
    new _url.URL(configuredUrl);
  } catch (err) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.teams.configurationErrorNoHostname', {
      defaultMessage: 'error configuring teams action: unable to parse host name from webhookUrl'
    }));
  }
  try {
    configurationUtilities.ensureUriAllowed(configuredUrl);
  } catch (allowListError) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.teams.configurationError', {
      defaultMessage: 'error configuring teams action: {message}',
      values: {
        message: allowListError.message
      }
    }));
  }
}

// action executor

async function teamsExecutor(execOptions) {
  const {
    actionId,
    secrets,
    params,
    configurationUtilities,
    logger
  } = execOptions;
  const {
    webhookUrl
  } = secrets;
  const {
    message
  } = params;
  const data = {
    text: message
  };
  const axiosInstance = _axios.default.create();
  const result = await (0, _result_type.promiseResult)((0, _axios_utils.request)({
    axios: axiosInstance,
    method: 'post',
    url: webhookUrl,
    logger,
    data,
    configurationUtilities
  }));
  if (result == null) {
    return errorResultUnexpectedNullResponse(actionId);
  }
  if ((0, _result_type.isOk)(result)) {
    const {
      value: {
        status,
        statusText,
        data: responseData,
        headers: responseHeaders
      }
    } = result;

    // Microsoft Teams connectors do not throw 429s. Rather they will return a 200 response
    // with a 429 message in the response body when the rate limit is hit
    // https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using#rate-limiting-for-connectors
    if ((0, _lodash.isString)(responseData) && responseData.includes('ErrorCode:ApplicationThrottled')) {
      return (0, _pipeable.pipe)((0, _http_response_retry_header.getRetryAfterIntervalFromHeaders)(responseHeaders), (0, _Option.map)(retry => retryResultSeconds(actionId, message, retry)), (0, _Option.getOrElse)(() => retryResult(actionId, message)));
    }
    logger.debug(`response from teams action "${actionId}": [HTTP ${status}] ${statusText}`);
    return successResult(actionId, data);
  } else {
    const {
      error
    } = result;
    if (error.response) {
      const {
        status,
        statusText
      } = error.response;
      const serviceMessage = `[${status}] ${statusText}`;
      logger.error(`error on ${actionId} Microsoft Teams event: ${serviceMessage}`);

      // special handling for 5xx
      if (status >= 500) {
        return retryResult(actionId, serviceMessage);
      }
      return errorResultInvalid(actionId, serviceMessage);
    }
    logger.debug(`error on ${actionId} Microsoft Teams action: unexpected error`);
    return errorResultUnexpectedError(actionId);
  }
}
function successResult(actionId, data) {
  return {
    status: 'ok',
    data,
    actionId
  };
}
function errorResultUnexpectedError(actionId) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.teams.unreachableErrorMessage', {
    defaultMessage: 'error posting to Microsoft Teams, unexpected error'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId
  };
}
function errorResultInvalid(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.teams.invalidResponseErrorMessage', {
    defaultMessage: 'error posting to Microsoft Teams, invalid response'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId,
    serviceMessage
  };
}
function errorResultUnexpectedNullResponse(actionId) {
  const message = _i18n.i18n.translate('xpack.stackConnectors.teams.unexpectedNullResponseErrorMessage', {
    defaultMessage: 'unexpected null response from Microsoft Teams'
  });
  return {
    status: 'error',
    actionId,
    message
  };
}
function retryResult(actionId, message) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.teams.errorPostingRetryLaterErrorMessage', {
    defaultMessage: 'error posting a Microsoft Teams message, retry later'
  });
  return {
    status: 'error',
    message: errMessage,
    retry: true,
    actionId
  };
}
function retryResultSeconds(actionId, message, retryAfter) {
  const retryEpoch = Date.now() + retryAfter * 1000;
  const retry = new Date(retryEpoch);
  const retryString = retry.toISOString();
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.teams.errorPostingRetryDateErrorMessage', {
    defaultMessage: 'error posting a Microsoft Teams message, retry at {retryString}',
    values: {
      retryString
    }
  });
  return {
    status: 'error',
    message: errMessage,
    retry,
    actionId,
    serviceMessage: message
  };
}