"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _url = require("url");
var _httpProxyAgent = _interopRequireDefault(require("http-proxy-agent"));
var _httpsProxyAgent = require("https-proxy-agent");
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _webhook = require("@slack/webhook");
var _pipeable = require("fp-ts/lib/pipeable");
var _Option = require("fp-ts/lib/Option");
var _types = require("../../../../../actions/common/types");
var _mustache_renderer = require("../../../../../actions/server/lib/mustache_renderer");
var _get_custom_agents = require("../../../../../actions/server/lib/get_custom_agents");
var _http_response_retry_header = require("../../lib/http_response_retry_header");
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

// connector type definition

const ConnectorTypeId = '.slack';
// customizing executor is only used for tests
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType({
  executor = slackExecutor
}) {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.slack.title', {
      defaultMessage: 'Slack'
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
    renderParameterTemplates,
    executor
  };
}
function renderParameterTemplates(params, variables) {
  return {
    message: (0, _mustache_renderer.renderMustacheString)(params.message, variables, 'slack')
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
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.slack.configurationErrorNoHostname', {
      defaultMessage: 'error configuring slack action: unable to parse host name from webhookUrl'
    }));
  }
  try {
    configurationUtilities.ensureUriAllowed(configuredUrl);
  } catch (allowListError) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.slack.configurationError', {
      defaultMessage: 'error configuring slack action: {message}',
      values: {
        message: allowListError.message
      }
    }));
  }
}

// action executor

async function slackExecutor(execOptions) {
  const {
    actionId,
    secrets,
    params,
    configurationUtilities,
    logger
  } = execOptions;
  let result;
  const {
    webhookUrl
  } = secrets;
  const {
    message
  } = params;
  const proxySettings = configurationUtilities.getProxySettings();
  const customAgents = (0, _get_custom_agents.getCustomAgents)(configurationUtilities, logger, webhookUrl);
  const agent = webhookUrl.toLowerCase().startsWith('https') ? customAgents.httpsAgent : customAgents.httpAgent;
  if (proxySettings) {
    if (agent instanceof _httpProxyAgent.default || agent instanceof _httpsProxyAgent.HttpsProxyAgent) {
      logger.debug(`IncomingWebhook was called with proxyUrl ${proxySettings.proxyUrl}`);
    }
  }
  try {
    // https://slack.dev/node-slack-sdk/webhook
    // node-slack-sdk use Axios inside :)
    const webhook = new _webhook.IncomingWebhook(webhookUrl, {
      agent
    });
    result = await webhook.send(message);
  } catch (err) {
    if (err.original == null || err.original.response == null) {
      return serviceErrorResult(actionId, err.message);
    }
    const {
      status,
      statusText,
      headers
    } = err.original.response;

    // special handling for 5xx
    if (status >= 500) {
      return retryResult(actionId, err.message);
    }

    // special handling for rate limiting
    if (status === 429) {
      return (0, _pipeable.pipe)((0, _http_response_retry_header.getRetryAfterIntervalFromHeaders)(headers), (0, _Option.map)(retry => retryResultSeconds(actionId, err.message, retry)), (0, _Option.getOrElse)(() => retryResult(actionId, err.message)));
    }
    const errMessage = _i18n.i18n.translate('xpack.stackConnectors.slack.unexpectedHttpResponseErrorMessage', {
      defaultMessage: 'unexpected http response from slack: {httpStatus} {httpStatusText}',
      values: {
        httpStatus: status,
        httpStatusText: statusText
      }
    });
    logger.error(`error on ${actionId} slack action: ${errMessage}`);
    return errorResult(actionId, errMessage);
  }
  if (result == null) {
    const errMessage = _i18n.i18n.translate('xpack.stackConnectors.slack.unexpectedNullResponseErrorMessage', {
      defaultMessage: 'unexpected null response from slack'
    });
    return errorResult(actionId, errMessage);
  }
  if (result.text !== 'ok') {
    return serviceErrorResult(actionId, result.text);
  }
  return successResult(actionId, result);
}
function successResult(actionId, data) {
  return {
    status: 'ok',
    data,
    actionId
  };
}
function errorResult(actionId, message) {
  return {
    status: 'error',
    message,
    actionId
  };
}
function serviceErrorResult(actionId, serviceMessage) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.slack.errorPostingErrorMessage', {
    defaultMessage: 'error posting slack message'
  });
  return {
    status: 'error',
    message: errMessage,
    actionId,
    serviceMessage
  };
}
function retryResult(actionId, message) {
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.slack.errorPostingRetryLaterErrorMessage', {
    defaultMessage: 'error posting a slack message, retry later'
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
  const errMessage = _i18n.i18n.translate('xpack.stackConnectors.slack.errorPostingRetryDateErrorMessage', {
    defaultMessage: 'error posting a slack message, retry at {retryString}',
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