"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configSchema = exports.DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = void 0;
var _configSchema = require("@kbn/config-schema");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ruleTypeSchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  timeout: _configSchema.schema.maybe(_configSchema.schema.string({
    validate: _lib.validateDurationSchema
  }))
});
const connectorTypeSchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  max: _configSchema.schema.maybe(_configSchema.schema.number({
    max: 100000
  }))
});
const rulesSchema = _configSchema.schema.object({
  minimumScheduleInterval: _configSchema.schema.object({
    value: _configSchema.schema.string({
      validate: duration => {
        const validationResult = (0, _lib.validateDurationSchema)(duration);
        if (validationResult) {
          return validationResult;
        }
        const parsedDurationMs = (0, _lib.parseDuration)(duration);
        if (parsedDurationMs > ONE_DAY_IN_MS) {
          return 'duration cannot exceed one day';
        }
      },
      defaultValue: '1m'
    }),
    enforce: _configSchema.schema.boolean({
      defaultValue: false
    }) // if enforce is false, only warnings will be shown
  }),

  run: _configSchema.schema.object({
    timeout: _configSchema.schema.maybe(_configSchema.schema.string({
      validate: _lib.validateDurationSchema
    })),
    actions: _configSchema.schema.object({
      max: _configSchema.schema.number({
        defaultValue: 100000,
        max: 100000
      }),
      connectorTypeOverrides: _configSchema.schema.maybe(_configSchema.schema.arrayOf(connectorTypeSchema))
    }),
    alerts: _configSchema.schema.object({
      max: _configSchema.schema.number({
        defaultValue: 1000
      })
    }),
    ruleTypeOverrides: _configSchema.schema.maybe(_configSchema.schema.arrayOf(ruleTypeSchema))
  })
});
const DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = 10;
exports.DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT = DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT;
const configSchema = _configSchema.schema.object({
  healthCheck: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '60m'
    })
  }),
  invalidateApiKeysTask: _configSchema.schema.object({
    interval: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '5m'
    }),
    removalDelay: _configSchema.schema.string({
      validate: _lib.validateDurationSchema,
      defaultValue: '1h'
    })
  }),
  maxEphemeralActionsPerAlert: _configSchema.schema.number({
    defaultValue: DEFAULT_MAX_EPHEMERAL_ACTIONS_PER_ALERT
  }),
  cancelAlertsOnRuleTimeout: _configSchema.schema.boolean({
    defaultValue: true
  }),
  rules: rulesSchema
});
exports.configSchema = configSchema;