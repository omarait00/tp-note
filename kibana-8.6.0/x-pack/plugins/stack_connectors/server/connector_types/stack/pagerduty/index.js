"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorTypeId = void 0;
exports.getConnectorType = getConnectorType;
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _moment = _interopRequireDefault(require("moment"));
var _types = require("../../../../../actions/common/types");
var _post_pagerduty = require("./post_pagerduty");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// uses the PagerDuty Events API v2
// https://v2.developer.pagerduty.com/docs/events-api-v2
const PAGER_DUTY_API_URL = 'https://events.pagerduty.com/v2/enqueue';
const configSchemaProps = {
  apiUrl: _configSchema.schema.nullable(_configSchema.schema.string())
};
const ConfigSchema = _configSchema.schema.object(configSchemaProps);
// secrets definition

const SecretsSchema = _configSchema.schema.object({
  routingKey: _configSchema.schema.string()
});

// params definition

const EVENT_ACTION_TRIGGER = 'trigger';
const EVENT_ACTION_RESOLVE = 'resolve';
const EVENT_ACTION_ACKNOWLEDGE = 'acknowledge';
const EVENT_ACTIONS_WITH_REQUIRED_DEDUPKEY = new Set([EVENT_ACTION_RESOLVE, EVENT_ACTION_ACKNOWLEDGE]);
const EventActionSchema = _configSchema.schema.oneOf([_configSchema.schema.literal(EVENT_ACTION_TRIGGER), _configSchema.schema.literal(EVENT_ACTION_RESOLVE), _configSchema.schema.literal(EVENT_ACTION_ACKNOWLEDGE)]);
const PayloadSeveritySchema = _configSchema.schema.oneOf([_configSchema.schema.literal('critical'), _configSchema.schema.literal('error'), _configSchema.schema.literal('warning'), _configSchema.schema.literal('info')]);
const ParamsSchema = _configSchema.schema.object({
  eventAction: _configSchema.schema.maybe(EventActionSchema),
  dedupKey: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 255
  })),
  summary: _configSchema.schema.maybe(_configSchema.schema.string({
    maxLength: 1024
  })),
  source: _configSchema.schema.maybe(_configSchema.schema.string()),
  severity: _configSchema.schema.maybe(PayloadSeveritySchema),
  timestamp: _configSchema.schema.maybe(_configSchema.schema.string()),
  component: _configSchema.schema.maybe(_configSchema.schema.string()),
  group: _configSchema.schema.maybe(_configSchema.schema.string()),
  class: _configSchema.schema.maybe(_configSchema.schema.string())
}, {
  validate: validateParams
});
function validateTimestamp(timestamp) {
  if (timestamp) {
    return timestamp.trim().length > 0 ? timestamp.trim() : null;
  }
  return null;
}
function validateParams(paramsObject) {
  const {
    timestamp,
    eventAction,
    dedupKey
  } = paramsObject;
  const validatedTimestamp = validateTimestamp(timestamp);
  if (validatedTimestamp != null) {
    try {
      const date = (0, _moment.default)(validatedTimestamp);
      if (!date.isValid()) {
        return _i18n.i18n.translate('xpack.stackConnectors.pagerduty.invalidTimestampErrorMessage', {
          defaultMessage: `error parsing timestamp "{timestamp}"`,
          values: {
            timestamp
          }
        });
      }
    } catch (err) {
      return _i18n.i18n.translate('xpack.stackConnectors.pagerduty.timestampParsingFailedErrorMessage', {
        defaultMessage: `error parsing timestamp "{timestamp}": {message}`,
        values: {
          timestamp,
          message: err.message
        }
      });
    }
  }
  if (eventAction && EVENT_ACTIONS_WITH_REQUIRED_DEDUPKEY.has(eventAction) && !dedupKey) {
    return _i18n.i18n.translate('xpack.stackConnectors.pagerduty.missingDedupkeyErrorMessage', {
      defaultMessage: `DedupKey is required when eventAction is "{eventAction}"`,
      values: {
        eventAction
      }
    });
  }
}
const ConnectorTypeId = '.pagerduty';
// connector type definition
exports.ConnectorTypeId = ConnectorTypeId;
function getConnectorType() {
  return {
    id: ConnectorTypeId,
    minimumLicenseRequired: 'gold',
    name: _i18n.i18n.translate('xpack.stackConnectors.pagerduty.title', {
      defaultMessage: 'PagerDuty'
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
    executor
  };
}
function validateConnectorTypeConfig(configObject, validatorServices) {
  const {
    configurationUtilities
  } = validatorServices;
  try {
    configurationUtilities.ensureUriAllowed(getPagerDutyApiUrl(configObject));
  } catch (allowListError) {
    throw new Error(_i18n.i18n.translate('xpack.stackConnectors.pagerduty.configurationError', {
      defaultMessage: 'error configuring pagerduty action: {message}',
      values: {
        message: allowListError.message
      }
    }));
  }
}
function getPagerDutyApiUrl(config) {
  return config.apiUrl || PAGER_DUTY_API_URL;
}

// action executor

async function executor(execOptions) {
  const {
    actionId,
    config,
    secrets,
    params,
    services,
    configurationUtilities,
    logger
  } = execOptions;
  const apiUrl = getPagerDutyApiUrl(config);
  const headers = {
    'Content-Type': 'application/json',
    'X-Routing-Key': secrets.routingKey
  };
  const data = getBodyForEventAction(actionId, params);
  let response;
  try {
    response = await (0, _post_pagerduty.postPagerduty)({
      apiUrl,
      data,
      headers,
      services
    }, logger, configurationUtilities);
  } catch (err) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.pagerduty.postingErrorMessage', {
      defaultMessage: 'error posting pagerduty event'
    });
    logger.warn(`error thrown posting pagerduty event: ${err.message}`);
    return {
      status: 'error',
      actionId,
      message,
      serviceMessage: err.message
    };
  }
  if (response == null) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.pagerduty.unexpectedNullResponseErrorMessage', {
      defaultMessage: 'unexpected null response from pagerduty'
    });
    return {
      status: 'error',
      actionId,
      message
    };
  }
  logger.debug(`response posting pagerduty event: ${response.status}`);
  if (response.status === 202) {
    return {
      status: 'ok',
      actionId,
      data: response.data
    };
  }
  if (response.status === 429 || response.status >= 500) {
    const message = _i18n.i18n.translate('xpack.stackConnectors.pagerduty.postingRetryErrorMessage', {
      defaultMessage: 'error posting pagerduty event: http status {status}, retry later',
      values: {
        status: response.status
      }
    });
    return {
      status: 'error',
      actionId,
      message,
      retry: true
    };
  }
  const message = _i18n.i18n.translate('xpack.stackConnectors.pagerduty.postingUnexpectedErrorMessage', {
    defaultMessage: 'error posting pagerduty event: unexpected status {status}',
    values: {
      status: response.status
    }
  });
  return {
    status: 'error',
    actionId,
    message
  };
}

// utilities

const AcknowledgeOrResolve = new Set([EVENT_ACTION_ACKNOWLEDGE, EVENT_ACTION_RESOLVE]);
function getBodyForEventAction(actionId, params) {
  var _params$eventAction;
  const eventAction = (_params$eventAction = params.eventAction) !== null && _params$eventAction !== void 0 ? _params$eventAction : EVENT_ACTION_TRIGGER;
  const data = {
    event_action: eventAction
  };
  if (params.dedupKey) {
    data.dedup_key = params.dedupKey;
  }

  // for acknowledge / resolve, just send the dedup key
  if (AcknowledgeOrResolve.has(eventAction)) {
    return data;
  }
  const validatedTimestamp = validateTimestamp(params.timestamp);
  data.payload = {
    summary: params.summary || 'No summary provided.',
    source: params.source || `Kibana Action ${actionId}`,
    severity: params.severity || 'info',
    ...(validatedTimestamp ? {
      timestamp: (0, _moment.default)(validatedTimestamp).toISOString()
    } : {}),
    ...(0, _lodash.omitBy)((0, _lodash.pick)(params, ['component', 'group', 'class']), _lodash.isUndefined)
  };
  return data;
}