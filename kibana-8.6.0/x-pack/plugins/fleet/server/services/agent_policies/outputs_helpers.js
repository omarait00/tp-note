"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDataOutputForAgentPolicy = getDataOutputForAgentPolicy;
exports.validateOutputForPolicy = validateOutputForPolicy;
var _constants = require("../../../common/constants");
var _ = require("..");
var _output = require("../output");
var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the data output for a given agent policy
 * @param soClient
 * @param agentPolicy
 * @returns
 */
async function getDataOutputForAgentPolicy(soClient, agentPolicy) {
  const dataOutputId = agentPolicy.data_output_id || (await _output.outputService.getDefaultDataOutputId(soClient));
  if (!dataOutputId) {
    throw new Error('No default data output found.');
  }
  return _output.outputService.get(soClient, dataOutputId);
}

/**
 * Validate outputs are valid for a policy using the current kibana licence or throw.
 * @param data
 * @returns
 */
async function validateOutputForPolicy(soClient, newData, existingData = {}, isPolicyUsingAPM = false) {
  if (newData.data_output_id === existingData.data_output_id && newData.monitoring_output_id === existingData.monitoring_output_id) {
    return;
  }
  const data = {
    ...existingData,
    ...newData
  };
  if (isPolicyUsingAPM) {
    const dataOutput = await getDataOutputForAgentPolicy(soClient, data);
    if (dataOutput.type === _constants.outputType.Logstash) {
      throw new _errors.OutputInvalidError('Logstash output is not usable with policy using the APM integration.');
    }
  }
  if (!data.data_output_id && !data.monitoring_output_id) {
    return;
  }

  // Do not validate licence output for managed and preconfigured policy
  if (data.is_managed && data.is_preconfigured) {
    return;
  }
  const hasLicence = _.appContextService.getSecurityLicense().hasAtLeast(_constants.LICENCE_FOR_PER_POLICY_OUTPUT);
  if (!hasLicence) {
    throw new _errors.OutputLicenceError(`Invalid licence to set per policy output, you need ${_constants.LICENCE_FOR_PER_POLICY_OUTPUT} licence`);
  }
}