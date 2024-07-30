"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebhookMethods = exports.ConnectorTypeId = void 0;
exports.executor = executor;
exports.getConnectorType = getConnectorType;
var _i18n = require("@kbn/i18n");
var _lodash = require("lodash");
var _axios = _interopRequireDefault(require("axios"));
var _configSchema = require("@kbn/config-schema");
var _pipeable = require("fp-ts/lib/pipeable");
var _Option = require("fp-ts/lib/Option");
var _axios_utils = require("../../../../../actions/server/lib/axios_utils");
var _types = require("../../../../../actions/common/types");
var _mustache_renderer = require("../../../../../actions/server/lib/mustache_renderer");
var _http_response_retry_header = require("../../lib/http_response_retry_header");
var _nullable = require("../../lib/nullable");
var _result_type = require("../../lib/result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// config definition
let WebhookMethods;
exports.WebhookMethods = WebhookMethods;
(function (WebhookMethods) {
  WebhookMethods["POST"] = "post";
  WebhookMethods["PUT"] = "put";
})(WebhookMethods || (exports.WebhookMethods = WebhookMethods = {}));
const HeadersSchema = _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string());
const configSchemaProps = {
  url: _configSchema.schema.string(),
  method: _configSchema.schema.oneOf([_configSchema.schema.literal(WebhookMethods.POST), _configSchema.schema.literal(WebhookMethods.PUT)], {
    defaultValue: WebhookMethods.POST
  }),
  headers: (0, _nullable.nullableType)(HeadersSchema),
  hasAuth: _configSchema.schema.boolean({
    defaultValue: true
  })
};
const ConfigSchema = _configSchema.schema.object(configSchemaProps);
const secretSchemaProps = {
  user: _configSchema.schema.nullable(_configSchema.schema.string()),
  password: _configSchema.schema.nullable(_configSchema.schema.string())
};
const SecretsSchema = _configSchema.schema.object(secretSchemaProps, {
  validate: secrets => {
    // user and password must be set together (or not at all)
    if (!secrets.password && !secrets.user) return;
    if (secrets.password && secrets.user) return;
    return _i18n.i18n.translate('xpack.stackConnectors.webhook.invalidUsernamePassword', {
      defaultMessage: 'both user and password must be specified'
    });
  }
});

// params definition

const ParamsSchema = _configSchema.schema.object({
  body: _configSchema.schema.maybe(_configSchema.schema.string())
});
const ConnectorTypeId = '.webhook';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.webhook.title', {
      defaultMessage: 'Webhook'
    }),
    supportedFeatureIds: [_types.AlertingConnectorFeatureId, _types.UptimeConnectorFeatureId, _types.SecurityConnectorFeatureId],
    validate: {
      config: {
        schema: ConfigSchema,
        customValidator: validateConnectorTypeConfig
      },
      secrets: {
        schema: SecretsSchema
      },
      params: {
        schema: ParamsSchema
      }
    },
    renderParameterTemplates,
    executor
  };
}
function renderParameterTemplates(params, variables) {
  if (!params.body) return params;
  return {
    body: (0, _mustache_renderer.renderMustacheString)(params.body, variables, 'json')
  };
}
function validateConnectorTypeConfig(configObject, validatorServices) {
  const {
    configurationUtilities
  } = validatorServices;
  const configuredUrl = configObject.url;
  try {
    new URL(configuredUrl);
  } catch (err) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.webhook.configurationErrorNoHostname', {
      defaultMessage: 'error configuring webhook action: unable to parse url: {err}',
      values: {
        err
      }
    }));
  }
  try {
    configurationUtilities.ensureUriAllowed(configuredUrl);
  } catch (allowListError) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.webhook.configurationError', {
      defaultMessage: 'error configuring webhook action: {message}',
      values: {
        message: allowListError.message
      }
    }));
  }
}

// action executor
async function executor(execOptions) {
  const {
    actionId,
    config,
    params,
    configurationUtilities,
    logger
  } = execOptions;
  const {
    method,
    url,
    headers = {},
    hasAuth
  } = config;
  const {
    body: data
  } = params;
  const secrets = execOptions.secrets;
  const basicAuth = hasAuth && (0, _lodash.isString)(secrets.user) && (0, _lodash.isString)(secrets.password) ? {
    auth: {
      username: secrets.user,
      password: secrets.password
    }
  } : {};
  const axiosInstance = _axios.default.create();
  const result = await (0, _result_type.promiseResult)((0, _axios_utils.request)({
    axios: axiosInstance,
    method,
    url,
    logger,
    ...basicAuth,
    headers: headers ? headers : {},
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
        statusText
      }
    } = result;
    logger.debug(`response from webhook action "${actionId}": [HTTP ${status}] ${statusText}`);
    return successResult(actionId, data);
  } else {
    const {
      error
    } = result;
    if (error.response) {
      const {
        status,
        statusText,
        headers: responseHeaders,
        data: {
          message: responseMessage
        }
      } = error.response;
      const responseMessageAsSuffix = responseMessage ? `: ${responseMessage}` : '';
      const message = `[${status}] ${statusText}${responseMessageAsSuffix}`;
      logger.error(`error on ${actionId} webhook event: ${message}`);
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // special handling for 5xx
      if (status >= 500) {
        return retryResult(actionId, message);
      }

      // special handling for rate limiting
      if (status === 429) {
        return (0, _pipeable.pipe)((0, _http_response_retry_header.getRetryAfterIntervalFromHeaders)(responseHeaders), (0, _Option.map)(retry => retryResultSeconds(actionId, message, retry)), (0, _Option.getOrElse)(() => retryResult(actionId, message)));
      }
      return errorResultInvalid(actionId, message);
    } else if (error.code) {
      const message = `[${error.code}] ${error.message}`;
      logger.error(`error on ${actionId} webhook event: ${message}`);
      return errorResultRequestFailed(actionId, message);
    } else if (error.isAxiosError) {
      const message = `${error.message}`;
      logger.error(`error on ${actionId} webhook event: ${message}`);
      return errorResultRequestFailed(actionId, message);
    }
    logger.error(`error on ${actionId} webhook action: unexpected error`);
    return errorResultUnexpectedError(actionId);
  }
}

// Action Executor Result w/ internationalisation
function successResult(actionId, data) {
  return {
    status: 'ok',
    data,
    actionId
  };
}
function errorResultInvalid(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.webhook.invalidResponseErrorMessage', {
    defaultMessage: 'error calling webhook, invalid response'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId,
    serviceMessage
  };
}
function errorResultRequestFailed(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.webhook.requestFailedErrorMessage', {
    defaultMessage: 'error calling webhook, request failed'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId,
    serviceMessage
  };
}
function errorResultUnexpectedError(actionId) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.webhook.unreachableErrorMessage', {
    defaultMessage: 'error calling webhook, unexpected error'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId
  };
}
function errorResultUnexpectedNullResponse(actionId) {
  const message = _i18n.i18n.translate('xpack.stackConnectors.webhook.unexpectedNullResponseErrorMessage', {
    defaultMessage: 'unexpected null response from webhook'
  });
  return {
    status: 'error',
    actionId,
    message
  };
}
function retryResult(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.webhook.invalidResponseRetryLaterErrorMessage', {
    defaultMessage: 'error calling webhook, retry later'
  });
  return {
    status: 'error',
    message: errMessage,
    retry: true,
    actionId,
    serviceMessage
  };
}
function retryResultSeconds(actionId, serviceMessage, retryAfter) {
  const retryEpoch = Date.now() + retryAfter * 1000;
  const retry = new Date(retryEpoch);
  const retryString = retry.toISOString();
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.webhook.invalidResponseRetryDateErrorMessage', {
    defaultMessage: 'error calling webhook, retry at {retryString}',
    values: {
      retryString
    }
  });
  return {
    status: 'error',
    message: errMessage,
    retry,
    actionId,
    serviceMessage
  };
}