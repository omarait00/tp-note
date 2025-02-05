"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.executor = executor;
exports.getConnectorType = getConnectorType;
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _types = require("../../../../../actions/common/types");
var _post_xmatters = require("./post_xmatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchemaProps = {
  configUrl: _configSchema.schema.nullable(_configSchema.schema.string()),
  usesBasic: _configSchema.schema.boolean({
    defaultValue: true
  })
};
const ConfigSchema = _configSchema.schema.object(configSchemaProps);
const secretSchemaProps = {
  user: _configSchema.schema.nullable(_configSchema.schema.string()),
  password: _configSchema.schema.nullable(_configSchema.schema.string()),
  secretsUrl: _configSchema.schema.nullable(_configSchema.schema.string())
};
const SecretsSchema = _configSchema.schema.object(secretSchemaProps);

// params definition

const ParamsSchema = _configSchema.schema.object({
  alertActionGroupName: _configSchema.schema.maybe(_configSchema.schema.string()),
  signalId: _configSchema.schema.maybe(_configSchema.schema.string()),
  ruleName: _configSchema.schema.maybe(_configSchema.schema.string()),
  date: _configSchema.schema.maybe(_configSchema.schema.string()),
  severity: _configSchema.schema.string(),
  spaceId: _configSchema.schema.maybe(_configSchema.schema.string()),
  tags: _configSchema.schema.maybe(_configSchema.schema.string())
});
const ConnectorTypeId = '.xmatters';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.xmatters.title', {
      defaultMessage: 'xMatters'
    }),
    supportedFeatureIds: [_types.AlertingConnectorFeatureId],
    validate: {
      config: {
        schema: ConfigSchema,
        customValidator: validateConnectorTypeConfig
      },
      secrets: {
        schema: SecretsSchema,
        customValidator: validateConnectorTypeSecrets
      },
      params: {
        schema: ParamsSchema
      },
      connector: validateConnector
    },
    executor
  };
}
function validateConnectorTypeConfig(configObject, validatorServices) {
  const {
    configurationUtilities
  } = validatorServices;
  const configuredUrl = configObject.configUrl;
  const usesBasic = configObject.usesBasic;
  if (!usesBasic) return;
  try {
    if (configuredUrl) {
      new URL(configuredUrl);
    }
  } catch (err) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.configurationErrorNoHostname', {
      defaultMessage: 'Error configuring xMatters action: unable to parse url: {err}',
      values: {
        err
      }
    }));
  }
  try {
    if (configuredUrl) {
      configurationUtilities.ensureUriAllowed(configuredUrl);
    }
  } catch (allowListError) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.configurationError', {
      defaultMessage: 'Error configuring xMatters action: {message}',
      values: {
        message: allowListError.message
      }
    }));
  }
}
function validateConnector(config, secrets) {
  const {
    user,
    password,
    secretsUrl
  } = secrets;
  const {
    usesBasic,
    configUrl
  } = config;
  if (usesBasic) {
    if (secretsUrl) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.shouldNotHaveSecretsUrl', {
        defaultMessage: 'secretsUrl should not be provided when usesBasic is true'
      });
    }
    if (user == null) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.missingUser', {
        defaultMessage: 'Provide valid Username'
      });
    }
    if (password == null) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.missingPassword', {
        defaultMessage: 'Provide valid Password'
      });
    }
    if (configUrl == null) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.missingConfigUrl', {
        defaultMessage: 'Provide valid configUrl'
      });
    }
  } else {
    if (user || password) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.shouldNotHaveUsernamePassword', {
        defaultMessage: 'Username and password should not be provided when usesBasic is false'
      });
    }
    if (configUrl) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.shouldNotHaveConfigUrl', {
        defaultMessage: 'configUrl should not be provided when usesBasic is false'
      });
    }
    if (secretsUrl == null) {
      return _i18n.i18n.translate('xpack.stackConnectors.xmatters.missingSecretsUrl', {
        defaultMessage: 'Provide valid secretsUrl with API Key'
      });
    }
  }
  return null;
}
function validateConnectorTypeSecrets(secretsObject, validatorServices) {
  const {
    configurationUtilities
  } = validatorServices;
  if (!secretsObject.secretsUrl && !secretsObject.user && !secretsObject.password) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.noSecretsProvided', {
      defaultMessage: 'Provide either secretsUrl link or user/password to authenticate'
    }));
  }

  // Check for secrets URL first
  if (secretsObject.secretsUrl) {
    // Neither user/password should be defined if secretsUrl is specified
    if (secretsObject.user || secretsObject.password) {
      throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.noUserPassWhenSecretsUrl', {
        defaultMessage: 'Cannot use user/password for URL authentication. Provide valid secretsUrl or use Basic Authentication.'
      }));
    }

    // Test that URL is valid
    try {
      if (secretsObject.secretsUrl) {
        new URL(secretsObject.secretsUrl);
      }
    } catch (err) {
      throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.invalidUrlError', {
        defaultMessage: 'Invalid secretsUrl: {err}',
        values: {
          err
        }
      }));
    }

    // Test that hostname is allowed
    try {
      if (secretsObject.secretsUrl) {
        configurationUtilities.ensureUriAllowed(secretsObject.secretsUrl);
      }
    } catch (allowListError) {
      throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.hostnameNotAllowed', {
        defaultMessage: '{message}',
        values: {
          message: allowListError.message
        }
      }));
    }
  } else {
    // Username and password must both be set
    if (!secretsObject.user || !secretsObject.password) {
      throw new Error(_i18n.i18n.translate('xpack.stackConnectors.xmatters.invalidUsernamePassword', {
        defaultMessage: 'Both user and password must be specified.'
      }));
    }
  }
}

// action executor
async function executor(execOptions) {
  const {
    actionId,
    configurationUtilities,
    config,
    params,
    logger
  } = execOptions;
  const {
    configUrl,
    usesBasic
  } = config;
  const data = getPayloadForRequest(params);
  const secrets = execOptions.secrets;
  const basicAuth = usesBasic && (0, _lodash.isString)(secrets.user) && (0, _lodash.isString)(secrets.password) ? {
    auth: {
      username: secrets.user,
      password: secrets.password
    }
  } : undefined;
  const url = usesBasic ? configUrl : secrets.secretsUrl;
  let result;
  try {
    if (!url) {
      throw new Error('Error: no url provided');
    }
    result = await (0, _post_xmatters.postXmatters)({
      url,
      data,
      basicAuth
    }, logger, configurationUtilities);
  } catch (err) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.xmatters.postingErrorMessage', {
      defaultMessage: 'Error triggering xMatters workflow'
    });
    logger.warn(`Error thrown triggering xMatters workflow: ${err.message}`);
    return {
      status: 'error',
      actionId,
      message,
      serviceMessage: err.message
    };
  }
  if (result == null) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.xmatters.unexpectedNullResponseErrorMessage', {
      defaultMessage: 'unexpected null response from xmatters'
    });
    return {
      status: 'error',
      actionId,
      message
    };
  }
  if (result.status >= 200 && result.status < 300) {
    const {
      status,
      statusText
    } = result;
    logger.debug(`Response from xMatters action "${actionId}": [HTTP ${status}] ${statusText}`);
    return successResult(actionId, data);
  }
  if (result.status === 429 || result.status >= 500) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.xmatters.postingRetryErrorMessage', {
      defaultMessage: 'Error triggering xMatters flow: http status {status}, retry later',
      values: {
        status: result.status
      }
    });
    return {
      status: 'error',
      actionId,
      message,
      retry: true
    };
  }
  const message = _i18n.i18n.translate('xpack.stackConnectors.xmatters.unexpectedStatusErrorMessage', {
    defaultMessage: 'Error triggering xMatters flow: unexpected status {status}',
    values: {
      status: result.status
    }
  });
  return {
    status: 'error',
    actionId,
    message
  };
}

// Action Executor Result w/ internationalisation
function successResult(actionId, data) {
  return {
    status: 'ok',
    data,
    actionId
  };
}
function getPayloadForRequest(params) {
  // xMatters will assume the request is a test when the signalId and alertActionGroupName are not defined
  const data = {
    alertActionGroupName: params.alertActionGroupName,
    signalId: params.signalId,
    ruleName: params.ruleName,
    date: params.date,
    severity: params.severity || 'High',
    spaceId: params.spaceId,
    tags: params.tags
  };
  return data;
}