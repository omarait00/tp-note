"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createConfig = exports.configSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _experimental_features = require("../common/experimental_features");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allowedExperimentalValues = (0, _experimental_features.getExperimentalAllowedValues)();
const configSchema = _configSchema.schema.object({
  enableGeoTrackingThresholdAlert: _configSchema.schema.maybe(_configSchema.schema.boolean({
    defaultValue: false
  })),
  enableExperimental: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
    defaultValue: () => [],
    validate(list) {
      for (const key of list) {
        if (!(0, _experimental_features.isValidExperimentalValue)(key)) {
          return `[${key}] is not allowed. Allowed values are: ${allowedExperimentalValues.join(', ')}`;
        }
      }
    }
  })
});
exports.configSchema = configSchema;
const createConfig = context => {
  const pluginConfig = context.config.get();
  const experimentalFeatures = (0, _experimental_features.parseExperimentalConfigValue)(pluginConfig.enableExperimental);
  return {
    ...pluginConfig,
    experimentalFeatures
  };
};
exports.createConfig = createConfig;