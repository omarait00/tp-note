"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfigSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RulesSchema = _configSchema.schema.object({
  allow: _configSchema.schema.boolean(),
  host: _configSchema.schema.maybe(_configSchema.schema.string()),
  protocol: _configSchema.schema.maybe(_configSchema.schema.string({
    validate(value) {
      if (!/:$/.test(value)) {
        return 'must end in colon';
      }
    }
  }))
});
const ConfigSchema = _configSchema.schema.object({
  networkPolicy: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    rules: _configSchema.schema.arrayOf(RulesSchema, {
      defaultValue: [{
        host: undefined,
        allow: true,
        protocol: 'http:'
      }, {
        host: undefined,
        allow: true,
        protocol: 'https:'
      }, {
        host: undefined,
        allow: true,
        protocol: 'ws:'
      }, {
        host: undefined,
        allow: true,
        protocol: 'wss:'
      }, {
        host: undefined,
        allow: true,
        protocol: 'data:'
      }, {
        host: undefined,
        allow: false,
        protocol: undefined
      } // Default action is to deny!
      ]
    })
  }),

  browser: _configSchema.schema.object({
    autoDownload: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.boolean({
      defaultValue: false
    }), _configSchema.schema.boolean({
      defaultValue: true
    })),
    chromium: _configSchema.schema.object({
      inspect: _configSchema.schema.conditional(_configSchema.schema.contextRef('dist'), true, _configSchema.schema.boolean({
        defaultValue: false
      }), _configSchema.schema.maybe(_configSchema.schema.never())),
      disableSandbox: _configSchema.schema.maybe(_configSchema.schema.boolean()),
      // default value is dynamic in createConfig
      proxy: _configSchema.schema.object({
        enabled: _configSchema.schema.boolean({
          defaultValue: false
        }),
        server: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.uri({
          scheme: ['http', 'https']
        }), _configSchema.schema.maybe(_configSchema.schema.never())),
        bypass: _configSchema.schema.conditional(_configSchema.schema.siblingRef('enabled'), true, _configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.maybe(_configSchema.schema.never()))
      })
    })
  }),
  capture: _configSchema.schema.object({
    timeouts: _configSchema.schema.object({
      openUrl: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
        defaultValue: _moment.default.duration({
          minutes: 1
        })
      }),
      waitForElements: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
        defaultValue: _moment.default.duration({
          minutes: 1
        })
      }),
      renderComplete: _configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()], {
        defaultValue: _moment.default.duration({
          minutes: 2
        })
      })
    }),
    zoom: _configSchema.schema.number({
      defaultValue: 2
    }),
    loadDelay: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.duration()])) // deprecated, unused
  }),

  poolSize: _configSchema.schema.number({
    defaultValue: 1,
    min: 1
  })
});
exports.ConfigSchema = ConfigSchema;