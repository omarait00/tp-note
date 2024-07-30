"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cleanPreconfiguredOutputs = cleanPreconfiguredOutputs;
exports.createOrUpdatePreconfiguredOutputs = createOrUpdatePreconfiguredOutputs;
exports.ensurePreconfiguredOutputs = ensurePreconfiguredOutputs;
exports.getPreconfiguredOutputFromConfig = getPreconfiguredOutputFromConfig;
var _lodash = require("lodash");
var _jsYaml = require("js-yaml");
var _services = require("../../../common/services");
var _constants = require("../../constants");
var _output = require("../output");
var _agent_policy = require("../agent_policy");
var _app_context = require("../app_context");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getPreconfiguredOutputFromConfig(config) {
  const {
    outputs: outputsOrUndefined
  } = config;
  const outputs = (outputsOrUndefined || []).concat([...(config !== null && config !== void 0 && config.agents.elasticsearch.hosts ? [{
    ..._constants.DEFAULT_OUTPUT,
    id: _constants.DEFAULT_OUTPUT_ID,
    hosts: config === null || config === void 0 ? void 0 : config.agents.elasticsearch.hosts,
    ca_sha256: config === null || config === void 0 ? void 0 : config.agents.elasticsearch.ca_sha256,
    is_preconfigured: true
  }] : [])]);
  return outputs;
}
async function ensurePreconfiguredOutputs(soClient, esClient, outputs) {
  await createOrUpdatePreconfiguredOutputs(soClient, esClient, outputs);
  await cleanPreconfiguredOutputs(soClient, outputs);
}
async function createOrUpdatePreconfiguredOutputs(soClient, esClient, outputs) {
  const logger = _app_context.appContextService.getLogger();
  if (outputs.length === 0) {
    return;
  }
  const existingOutputs = await _output.outputService.bulkGet(soClient, outputs.map(({
    id
  }) => id), {
    ignoreNotFound: true
  });
  await Promise.all(outputs.map(async output => {
    var _outputData$ca_sha, _outputData$ca_truste, _outputData$ssl;
    const existingOutput = existingOutputs.find(o => o.id === output.id);
    const {
      id,
      config,
      ...outputData
    } = output;
    const configYaml = config ? (0, _jsYaml.safeDump)(config) : undefined;
    const data = {
      ...outputData,
      is_preconfigured: true,
      config_yaml: configYaml !== null && configYaml !== void 0 ? configYaml : null,
      // Set value to null to update these fields on update
      ca_sha256: (_outputData$ca_sha = outputData.ca_sha256) !== null && _outputData$ca_sha !== void 0 ? _outputData$ca_sha : null,
      ca_trusted_fingerprint: (_outputData$ca_truste = outputData.ca_trusted_fingerprint) !== null && _outputData$ca_truste !== void 0 ? _outputData$ca_truste : null,
      ssl: (_outputData$ssl = outputData.ssl) !== null && _outputData$ssl !== void 0 ? _outputData$ssl : null
    };
    if (!data.hosts || data.hosts.length === 0) {
      data.hosts = _output.outputService.getDefaultESHosts();
    }
    const isCreate = !existingOutput;
    const isUpdateWithNewData = existingOutput && isPreconfiguredOutputDifferentFromCurrent(existingOutput, data);
    if (isCreate) {
      logger.debug(`Creating output ${output.id}`);
      await _output.outputService.create(soClient, data, {
        id,
        fromPreconfiguration: true
      });
    } else if (isUpdateWithNewData) {
      logger.debug(`Updating output ${output.id}`);
      await _output.outputService.update(soClient, id, data, {
        fromPreconfiguration: true
      });
      // Bump revision of all policies using that output
      if (outputData.is_default || outputData.is_default_monitoring) {
        await _agent_policy.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
      } else {
        await _agent_policy.agentPolicyService.bumpAllAgentPoliciesForOutput(soClient, esClient, id);
      }
    }
  }));
}
async function cleanPreconfiguredOutputs(soClient, outputs) {
  const existingOutputs = await _output.outputService.list(soClient);
  const existingPreconfiguredOutput = existingOutputs.items.filter(o => o.is_preconfigured === true);
  const logger = _app_context.appContextService.getLogger();
  for (const output of existingPreconfiguredOutput) {
    const hasBeenDelete = !outputs.find(({
      id
    }) => output.id === id);
    if (!hasBeenDelete) {
      continue;
    }
    if (output.is_default) {
      logger.info(`Updating default preconfigured output ${output.id} is no longer preconfigured`);
      await _output.outputService.update(soClient, output.id, {
        is_preconfigured: false
      }, {
        fromPreconfiguration: true
      });
    } else if (output.is_default_monitoring) {
      logger.info(`Updating default preconfigured output ${output.id} is no longer preconfigured`);
      await _output.outputService.update(soClient, output.id, {
        is_preconfigured: false
      }, {
        fromPreconfiguration: true
      });
    } else {
      logger.info(`Deleting preconfigured output ${output.id}`);
      await _output.outputService.delete(soClient, output.id, {
        fromPreconfiguration: true
      });
    }
  }
}
function isDifferent(val1, val2) {
  if ((val1 === null || typeof val1 === 'undefined') && (val2 === null || typeof val2 === 'undefined')) {
    return false;
  }
  return !(0, _lodash.isEqual)(val1, val2);
}
function isPreconfiguredOutputDifferentFromCurrent(existingOutput, preconfiguredOutput) {
  var _existingOutput$hosts;
  return !existingOutput.is_preconfigured || isDifferent(existingOutput.is_default, preconfiguredOutput.is_default) || isDifferent(existingOutput.is_default_monitoring, preconfiguredOutput.is_default_monitoring) || isDifferent(existingOutput.name, preconfiguredOutput.name) || isDifferent(existingOutput.type, preconfiguredOutput.type) || preconfiguredOutput.hosts && !(0, _lodash.isEqual)((existingOutput === null || existingOutput === void 0 ? void 0 : existingOutput.type) === 'elasticsearch' ? (_existingOutput$hosts = existingOutput.hosts) === null || _existingOutput$hosts === void 0 ? void 0 : _existingOutput$hosts.map(_services.normalizeHostsForAgents) : existingOutput.hosts, preconfiguredOutput.type === 'elasticsearch' ? preconfiguredOutput.hosts.map(_services.normalizeHostsForAgents) : preconfiguredOutput.hosts) || isDifferent(preconfiguredOutput.ssl, existingOutput.ssl) || isDifferent(existingOutput.ca_sha256, preconfiguredOutput.ca_sha256) || isDifferent(existingOutput.ca_trusted_fingerprint, preconfiguredOutput.ca_trusted_fingerprint) || isDifferent(existingOutput.config_yaml, preconfiguredOutput.config_yaml);
}