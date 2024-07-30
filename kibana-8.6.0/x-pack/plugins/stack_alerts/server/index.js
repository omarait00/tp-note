"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "INDEX_THRESHOLD_ID", {
  enumerable: true,
  get: function () {
    return _rule_type.ID;
  }
});
exports.plugin = exports.configSchema = exports.config = void 0;
var _lodash = require("lodash");
var _configSchema = require("@kbn/config-schema");
var _plugin = require("./plugin");
var _rule_type = require("./rule_types/index_threshold/rule_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const configSchema = _configSchema.schema.object({});
exports.configSchema = configSchema;
const config = {
  exposeToBrowser: {},
  schema: configSchema,
  deprecations: () => [(settings, fromPath, addDeprecation) => {
    const stackAlerts = (0, _lodash.get)(settings, fromPath);
    if ((stackAlerts === null || stackAlerts === void 0 ? void 0 : stackAlerts.enabled) === false || (stackAlerts === null || stackAlerts === void 0 ? void 0 : stackAlerts.enabled) === true) {
      addDeprecation({
        level: 'critical',
        configPath: 'xpack.stack_alerts.enabled',
        message: `"xpack.stack_alerts.enabled" is deprecated. The ability to disable this plugin will be removed in 8.0.0.`,
        correctiveActions: {
          manualSteps: [`Remove "xpack.stack_alerts.enabled" from your kibana configs.`]
        }
      });
    }
  }]
};
exports.config = config;
const plugin = ctx => new _plugin.AlertingBuiltinsPlugin(ctx);
exports.plugin = plugin;