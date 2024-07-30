"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInputId = generateInputId;
exports.simplifiedPackagePolicytoNewPackagePolicy = simplifiedPackagePolicytoNewPackagePolicy;
var _errors = require("../errors");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function generateInputId(input) {
  return `${input.policy_template ? `${input.policy_template}-` : ''}${input.type}`;
}
function assignVariables(userProvidedVars, varsRecord, ctxMessage = '') {
  Object.entries(userProvidedVars).forEach(([varKey, varValue]) => {
    if (!varsRecord || !varsRecord[varKey]) {
      throw new _errors.PackagePolicyValidationError(`Variable ${ctxMessage}:${varKey} not found`);
    }
    varsRecord[varKey].value = varValue;
  });
}
function simplifiedPackagePolicytoNewPackagePolicy(data, packageInfo, options) {
  const {
    policy_id: policyId,
    namespace,
    name,
    description,
    inputs = {},
    vars: packageLevelVars
  } = data;
  const packagePolicy = (0, _.packageToPackagePolicy)(packageInfo, policyId, namespace, name, description);
  if (packagePolicy.package && options !== null && options !== void 0 && options.experimental_data_stream_features) {
    packagePolicy.package.experimental_data_stream_features = options.experimental_data_stream_features;
  }

  // Build a input and streams Map to easily find package policy stream
  const inputMap = new Map();
  packagePolicy.inputs.forEach(input => {
    const streamMap = new Map();
    input.streams.forEach(stream => {
      streamMap.set(stream.data_stream.dataset, stream);
    });
    inputMap.set(generateInputId(input), {
      input,
      streams: streamMap
    });
  });
  if (packageLevelVars) {
    assignVariables(packageLevelVars, packagePolicy.vars);
  }
  Object.entries(inputs).forEach(([inputId, val]) => {
    var _inputMap$get;
    const {
      enabled,
      streams = {},
      vars: inputLevelVars
    } = val;
    const {
      input: packagePolicyInput,
      streams: streamsMap
    } = (_inputMap$get = inputMap.get(inputId)) !== null && _inputMap$get !== void 0 ? _inputMap$get : {};
    if (!packagePolicyInput || !streamsMap) {
      throw new _errors.PackagePolicyValidationError(`Input not found: ${inputId}`);
    }
    if (enabled === false) {
      packagePolicyInput.enabled = false;
    } else {
      packagePolicyInput.enabled = true;
    }
    if (inputLevelVars) {
      assignVariables(inputLevelVars, packagePolicyInput.vars, `${inputId}`);
    }
    Object.entries(streams).forEach(([streamId, streamVal]) => {
      const {
        enabled: streamEnabled,
        vars: streamsLevelVars
      } = streamVal;
      const packagePolicyStream = streamsMap.get(streamId);
      if (!packagePolicyStream) {
        throw new _errors.PackagePolicyValidationError(`Stream not found ${inputId}: ${streamId}`);
      }
      if (streamEnabled === false) {
        packagePolicyStream.enabled = false;
      } else {
        packagePolicyStream.enabled = true;
      }
      if (streamsLevelVars) {
        assignVariables(streamsLevelVars, packagePolicyStream.vars, `${inputId} ${streamId}`);
      }
    });
  });
  return packagePolicy;
}