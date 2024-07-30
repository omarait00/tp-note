"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeCspRulesInstancesCallback = exports.onPackagePolicyPostCreateCallback = exports.isCspPackageInstalled = exports.isCspPackage = exports.getBenchmarkInputType = void 0;
var _helpers = require("../../common/utils/helpers");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getBenchmarkTypeFilter = type => `${_constants.CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE}.attributes.metadata.benchmark.id: "${type}"`;
const isEnabledBenchmarkInputType = input => !!input.type && input.enabled;
const getBenchmarkInputType = inputs => {
  const enabledInputs = inputs.filter(isEnabledBenchmarkInputType);

  // Use the only enabled input
  if (enabledInputs.length === 1) {
    return getInputType(enabledInputs[0].type);
  }

  // Use the default benchmark id for multiple/none selected
  return getInputType(_constants.CLOUDBEAT_VANILLA);
};

/**
 * Callback to handle creation of PackagePolicies in Fleet
 */
exports.getBenchmarkInputType = getBenchmarkInputType;
const onPackagePolicyPostCreateCallback = async (logger, packagePolicy, savedObjectsClient) => {
  addDataViewToAllSpaces(savedObjectsClient);
  const benchmarkType = getBenchmarkInputType(packagePolicy.inputs);
  // Create csp-rules from the generic asset
  const existingRuleTemplates = await savedObjectsClient.find({
    type: _constants.CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE,
    perPage: 10000,
    filter: getBenchmarkTypeFilter(benchmarkType)
  });
  if (existingRuleTemplates.total === 0) {
    logger.warn(`expected CSP rule templates to exists for type: ${benchmarkType}`);
    return;
  }
  const cspRules = generateRulesFromTemplates(packagePolicy.id, packagePolicy.policy_id, existingRuleTemplates.saved_objects);
  try {
    await savedObjectsClient.bulkCreate(cspRules);
    logger.info(`Generated CSP rules for package ${packagePolicy.policy_id}`);
  } catch (e) {
    logger.error('failed to generate rules out of template');
    logger.error(e);
  }
};
exports.onPackagePolicyPostCreateCallback = onPackagePolicyPostCreateCallback;
async function addDataViewToAllSpaces(savedObjectsClient) {
  const cspmDataViews = await savedObjectsClient.find({
    type: 'index-pattern',
    fields: ['title'],
    search: _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME + '*',
    searchFields: ['title'],
    perPage: 100
  });
  cspmDataViews.saved_objects.forEach(dataView => {
    savedObjectsClient.updateObjectsSpaces([{
      id: dataView.id,
      type: 'index-pattern'
    }], ['*'], []);
  });
}

/**
 * Callback to handle deletion of PackagePolicies in Fleet
 */
const removeCspRulesInstancesCallback = async (deletedPackagePolicy, soClient, logger) => {
  try {
    const {
      saved_objects: cspRules
    } = await soClient.find({
      type: _constants.CSP_RULE_SAVED_OBJECT_TYPE,
      filter: (0, _helpers.createCspRuleSearchFilterByPackagePolicy)({
        packagePolicyId: deletedPackagePolicy.id,
        policyId: deletedPackagePolicy.policy_id
      }),
      perPage: 10000
    });
    await Promise.all(cspRules.map(rule => soClient.delete(_constants.CSP_RULE_SAVED_OBJECT_TYPE, rule.id)));
  } catch (e) {
    logger.error(`Failed to delete CSP rules after delete package ${deletedPackagePolicy.id}`);
    logger.error(e);
  }
};
exports.removeCspRulesInstancesCallback = removeCspRulesInstancesCallback;
const isCspPackageInstalled = async (soClient, logger) => {
  // TODO: check if CSP package installed via the Fleet API
  try {
    const {
      saved_objects: postDeleteRules
    } = await soClient.find({
      type: _constants.CSP_RULE_SAVED_OBJECT_TYPE
    });
    if (!postDeleteRules.length) {
      return true;
    }
    return false;
  } catch (e) {
    logger.error(e);
    return false;
  }
};
exports.isCspPackageInstalled = isCspPackageInstalled;
const isCspPackage = packageName => packageName === _constants.CLOUD_SECURITY_POSTURE_PACKAGE_NAME;
exports.isCspPackage = isCspPackage;
const generateRulesFromTemplates = (packagePolicyId, policyId, cspRuleTemplates) => cspRuleTemplates.map(template => ({
  type: _constants.CSP_RULE_SAVED_OBJECT_TYPE,
  attributes: {
    ...template.attributes,
    package_policy_id: packagePolicyId,
    policy_id: policyId
  }
}));
const getInputType = inputType => {
  // Get the last part of the input type, input type structure: cloudbeat/<benchmark_id>
  return inputType.split('/')[1];
};