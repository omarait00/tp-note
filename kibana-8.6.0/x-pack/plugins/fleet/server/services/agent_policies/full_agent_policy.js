"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullAgentPolicy = getFullAgentPolicy;
exports.transformOutputToFullPolicyOutput = transformOutputToFullPolicyOutput;
var _jsYaml = require("js-yaml");
var _agent_policy = require("../agent_policy");
var _output = require("../output");
var _constants = require("../../../common/constants");
var _constants2 = require("../../constants");
var _source_uri_utils = require("../../routes/agent/source_uri_utils");
var _packages = require("../epm/packages");
var _registry = require("../epm/registry");
var _fleet_server_host = require("../fleet_server_host");
var _app_context = require("../app_context");
var _monitoring_permissions = require("./monitoring_permissions");
var _ = require(".");
var _package_policies_to_agent_permissions = require("./package_policies_to_agent_permissions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getFullAgentPolicy(soClient, id, options) {
  var _options$standalone, _agentPolicy$monitori, _agentPolicy$monitori2, _agentPolicy$monitori3, _agentPolicy$monitori4;
  let agentPolicy;
  const standalone = (_options$standalone = options === null || options === void 0 ? void 0 : options.standalone) !== null && _options$standalone !== void 0 ? _options$standalone : false;
  try {
    agentPolicy = await _agent_policy.agentPolicyService.get(soClient, id);
  } catch (err) {
    if (!err.isBoom || err.output.statusCode !== 404) {
      throw err;
    }
  }
  if (!agentPolicy) {
    return null;
  }
  const defaultDataOutputId = await _output.outputService.getDefaultDataOutputId(soClient);
  if (!defaultDataOutputId) {
    throw new Error('Default output is not setup');
  }
  const dataOutputId = agentPolicy.data_output_id || defaultDataOutputId;
  const monitoringOutputId = agentPolicy.monitoring_output_id || (await _output.outputService.getDefaultMonitoringOutputId(soClient)) || dataOutputId;
  const outputs = await Promise.all(Array.from(new Set([dataOutputId, monitoringOutputId])).map(outputId => _output.outputService.get(soClient, outputId)));
  const dataOutput = outputs.find(output => output.id === dataOutputId);
  if (!dataOutput) {
    throw new Error(`Data output not found ${dataOutputId}`);
  }
  const monitoringOutput = outputs.find(output => output.id === monitoringOutputId);
  if (!monitoringOutput) {
    throw new Error(`Monitoring output not found ${monitoringOutputId}`);
  }
  const sourceUri = await (0, _source_uri_utils.getSourceUriForAgentPolicy)(soClient, agentPolicy);

  // Build up an in-memory object for looking up Package Info, so we don't have
  // call `getPackageInfo` for every single policy, which incurs performance costs
  const packageInfoCache = new Map();
  for (const policy of agentPolicy.package_policies) {
    if (!policy.package || packageInfoCache.has((0, _registry.pkgToPkgKey)(policy.package))) {
      continue;
    }

    // Prime the cache w/ just the package key - we'll fetch all the package
    // info concurrently below
    packageInfoCache.set((0, _registry.pkgToPkgKey)(policy.package), {});
  }

  // Fetch all package info concurrently
  await Promise.all(Array.from(packageInfoCache.keys()).map(async pkgKey => {
    const {
      pkgName,
      pkgVersion
    } = (0, _registry.splitPkgKey)(pkgKey);
    const packageInfo = await (0, _packages.getPackageInfo)({
      savedObjectsClient: soClient,
      pkgName,
      pkgVersion
    });
    packageInfoCache.set(pkgKey, packageInfo);
  }));
  const fullAgentPolicy = {
    id: agentPolicy.id,
    outputs: {
      ...outputs.reduce((acc, output) => {
        acc[getOutputIdForAgentPolicy(output)] = transformOutputToFullPolicyOutput(output, standalone);
        return acc;
      }, {})
    },
    inputs: await (0, _.storedPackagePoliciesToAgentInputs)(agentPolicy.package_policies, packageInfoCache, getOutputIdForAgentPolicy(dataOutput)),
    revision: agentPolicy.revision,
    agent: {
      download: {
        sourceURI: sourceUri
      },
      monitoring: agentPolicy.monitoring_enabled && agentPolicy.monitoring_enabled.length > 0 ? {
        namespace: agentPolicy.namespace,
        use_output: getOutputIdForAgentPolicy(monitoringOutput),
        enabled: true,
        logs: agentPolicy.monitoring_enabled.includes(_constants.dataTypes.Logs),
        metrics: agentPolicy.monitoring_enabled.includes(_constants.dataTypes.Metrics)
      } : {
        enabled: false,
        logs: false,
        metrics: false
      }
    }
  };
  const dataPermissions = (await (0, _package_policies_to_agent_permissions.storedPackagePoliciesToAgentPermissions)(packageInfoCache, agentPolicy.package_policies)) || {};
  dataPermissions._elastic_agent_checks = {
    cluster: _package_policies_to_agent_permissions.DEFAULT_CLUSTER_PERMISSIONS
  };
  const monitoringPermissions = await (0, _monitoring_permissions.getMonitoringPermissions)(soClient, {
    logs: (_agentPolicy$monitori = (_agentPolicy$monitori2 = agentPolicy.monitoring_enabled) === null || _agentPolicy$monitori2 === void 0 ? void 0 : _agentPolicy$monitori2.includes(_constants.dataTypes.Logs)) !== null && _agentPolicy$monitori !== void 0 ? _agentPolicy$monitori : false,
    metrics: (_agentPolicy$monitori3 = (_agentPolicy$monitori4 = agentPolicy.monitoring_enabled) === null || _agentPolicy$monitori4 === void 0 ? void 0 : _agentPolicy$monitori4.includes(_constants.dataTypes.Metrics)) !== null && _agentPolicy$monitori3 !== void 0 ? _agentPolicy$monitori3 : false
  }, agentPolicy.namespace);
  monitoringPermissions._elastic_agent_checks = {
    cluster: _package_policies_to_agent_permissions.DEFAULT_CLUSTER_PERMISSIONS
  };

  // Only add permissions if output.type is "elasticsearch"
  fullAgentPolicy.output_permissions = Object.keys(fullAgentPolicy.outputs).reduce((outputPermissions, outputId) => {
    const output = fullAgentPolicy.outputs[outputId];
    if (output && output.type === _constants.outputType.Elasticsearch) {
      const permissions = {};
      if (outputId === getOutputIdForAgentPolicy(monitoringOutput)) {
        Object.assign(permissions, monitoringPermissions);
      }
      if (outputId === getOutputIdForAgentPolicy(dataOutput)) {
        Object.assign(permissions, dataPermissions);
      }
      outputPermissions[outputId] = permissions;
    }
    return outputPermissions;
  }, {});

  // only add fleet server hosts if not in standalone
  if (!standalone) {
    const fleetServerHost = await (0, _fleet_server_host.getFleetServerHostsForAgentPolicy)(soClient, agentPolicy).catch(err => {
      var _appContextService$ge, _agentPolicy;
      (_appContextService$ge = _app_context.appContextService.getLogger()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.warn(`Unable to get fleet server hosts for policy ${(_agentPolicy = agentPolicy) === null || _agentPolicy === void 0 ? void 0 : _agentPolicy.id}: ${err.message}`);
      return;
    });
    if (fleetServerHost) {
      fullAgentPolicy.fleet = {
        hosts: fleetServerHost.host_urls
      };
    }
  }
  return fullAgentPolicy;
}
function transformOutputToFullPolicyOutput(output, standalone = false) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const {
    config_yaml,
    type,
    hosts,
    ca_sha256,
    ca_trusted_fingerprint,
    ssl
  } = output;
  const configJs = config_yaml ? (0, _jsYaml.safeLoad)(config_yaml) : {};
  const newOutput = {
    ...configJs,
    type,
    hosts,
    ...(ca_sha256 ? {
      ca_sha256
    } : {}),
    ...(ssl ? {
      ssl
    } : {}),
    ...(ca_trusted_fingerprint ? {
      'ssl.ca_trusted_fingerprint': ca_trusted_fingerprint
    } : {})
  };
  if (output.type === _constants.outputType.Elasticsearch && standalone) {
    newOutput.username = '${ES_USERNAME}';
    newOutput.password = '${ES_PASSWORD}';
  }
  return newOutput;
}

/**
 * Get id used in full agent policy (sent to the agents)
 * we use "default" for the default policy to avoid breaking changes
 */
function getOutputIdForAgentPolicy(output) {
  if (output.is_default) {
    return _constants2.DEFAULT_OUTPUT.name;
  }
  return output.id;
}