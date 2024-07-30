"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = void 0;
var _path = _interopRequireDefault(require("path"));
var _configSchema = require("@kbn/config-schema");
var _experimental_features = require("../common/experimental_features");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const allowedExperimentalValues = (0, _experimental_features.getExperimentalAllowedValues)();
const DEFAULT_BUNDLED_PACKAGE_LOCATION = _path.default.join(__dirname, '../target/bundled_packages');
const DEFAULT_GPG_KEY_PATH = _path.default.join(__dirname, '../target/keys/GPG-KEY-elasticsearch');
const config = {
  exposeToBrowser: {
    epm: true,
    agents: {
      enabled: true
    },
    enableExperimental: true
  },
  deprecations: ({
    renameFromRoot,
    unused,
    unusedFromRoot
  }) => [
  // Unused settings before Fleet server exists
  unused('agents.kibana', {
    level: 'critical'
  }), unused('agents.maxConcurrentConnections', {
    level: 'critical'
  }), unused('agents.agentPolicyRolloutRateLimitIntervalMs', {
    level: 'critical'
  }), unused('agents.agentPolicyRolloutRateLimitRequestPerInterval', {
    level: 'critical'
  }), unused('agents.pollingRequestTimeout', {
    level: 'critical'
  }), unused('agents.tlsCheckDisabled', {
    level: 'critical'
  }), unused('agents.fleetServerEnabled', {
    level: 'critical'
  }),
  // Deprecate default policy flags
  (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack, _fullConfig$xpack$fle;
    if (((fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack = fullConfig.xpack) === null || _fullConfig$xpack === void 0 ? void 0 : (_fullConfig$xpack$fle = _fullConfig$xpack.fleet) === null || _fullConfig$xpack$fle === void 0 ? void 0 : _fullConfig$xpack$fle.agentPolicies) || []).find(policy => policy.is_default)) {
      addDeprecation({
        configPath: 'xpack.fleet.agentPolicies.is_default',
        message: `Config key [xpack.fleet.agentPolicies.is_default] is deprecated.`,
        correctiveActions: {
          manualSteps: [`Create a dedicated policy instead through the UI or API.`]
        },
        level: 'warning'
      });
    }
    return fullConfig;
  }, (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack2, _fullConfig$xpack2$fl;
    if (((fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack2 = fullConfig.xpack) === null || _fullConfig$xpack2 === void 0 ? void 0 : (_fullConfig$xpack2$fl = _fullConfig$xpack2.fleet) === null || _fullConfig$xpack2$fl === void 0 ? void 0 : _fullConfig$xpack2$fl.agentPolicies) || []).find(policy => policy.is_default_fleet_server)) {
      addDeprecation({
        configPath: 'xpack.fleet.agentPolicies.is_default_fleet_server',
        message: `Config key [xpack.fleet.agentPolicies.is_default_fleet_server] is deprecated.`,
        correctiveActions: {
          manualSteps: [`Create a dedicated fleet server policy instead through the UI or API.`]
        },
        level: 'warning'
      });
    }
    return fullConfig;
  },
  // Renaming elasticsearch.host => elasticsearch.hosts
  (fullConfig, fromPath, addDeprecation) => {
    var _fullConfig$xpack3, _fullConfig$xpack3$fl, _fullConfig$xpack3$fl2, _fullConfig$xpack3$fl3;
    const oldValue = fullConfig === null || fullConfig === void 0 ? void 0 : (_fullConfig$xpack3 = fullConfig.xpack) === null || _fullConfig$xpack3 === void 0 ? void 0 : (_fullConfig$xpack3$fl = _fullConfig$xpack3.fleet) === null || _fullConfig$xpack3$fl === void 0 ? void 0 : (_fullConfig$xpack3$fl2 = _fullConfig$xpack3$fl.agents) === null || _fullConfig$xpack3$fl2 === void 0 ? void 0 : (_fullConfig$xpack3$fl3 = _fullConfig$xpack3$fl2.elasticsearch) === null || _fullConfig$xpack3$fl3 === void 0 ? void 0 : _fullConfig$xpack3$fl3.host;
    if (oldValue) {
      delete fullConfig.xpack.fleet.agents.elasticsearch.host;
      fullConfig.xpack.fleet.agents.elasticsearch.hosts = [oldValue];
      addDeprecation({
        configPath: 'xpack.fleet.agents.elasticsearch.host',
        message: `Config key [xpack.fleet.agents.elasticsearch.host] is deprecated and replaced by [xpack.fleet.agents.elasticsearch.hosts]`,
        correctiveActions: {
          manualSteps: [`Use [xpack.fleet.agents.elasticsearch.hosts] with an array of host instead.`]
        },
        level: 'critical'
      });
    }
    return fullConfig;
  }],
  schema: _configSchema.schema.object({
    registryUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    registryProxyUrl: _configSchema.schema.maybe(_configSchema.schema.uri({
      scheme: ['http', 'https']
    })),
    agents: _configSchema.schema.object({
      enabled: _configSchema.schema.boolean({
        defaultValue: true
      }),
      elasticsearch: _configSchema.schema.object({
        hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: ['http', 'https']
        }))),
        ca_sha256: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      fleet_server: _configSchema.schema.maybe(_configSchema.schema.object({
        hosts: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.uri({
          scheme: ['http', 'https']
        })))
      }))
    }),
    packages: _types.PreconfiguredPackagesSchema,
    agentPolicies: _types.PreconfiguredAgentPoliciesSchema,
    outputs: _types.PreconfiguredOutputsSchema,
    fleetServerHosts: _types.PreconfiguredFleetServerHostsSchema,
    agentIdVerificationEnabled: _configSchema.schema.boolean({
      defaultValue: true
    }),
    developer: _configSchema.schema.object({
      disableRegistryVersionCheck: _configSchema.schema.boolean({
        defaultValue: false
      }),
      allowAgentUpgradeSourceUri: _configSchema.schema.boolean({
        defaultValue: false
      }),
      bundledPackageLocation: _configSchema.schema.string({
        defaultValue: DEFAULT_BUNDLED_PACKAGE_LOCATION
      })
    }),
    packageVerification: _configSchema.schema.object({
      gpgKeyPath: _configSchema.schema.string({
        defaultValue: DEFAULT_GPG_KEY_PATH
      })
    }),
    /**
     * For internal use. A list of string values (comma delimited) that will enable experimental
     * type of functionality that is not yet released.
     *
     * @example
     * xpack.fleet.enableExperimental:
     *   - feature1
     *   - feature2
     */
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
  })
};
exports.config = config;