"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestPrebuiltRules = exports.getFilesystemRules = void 0;
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _prebuilt_rules = require("../../../../../common/detection_engine/prebuilt_rules");
var _with_security_span = require("../../../../utils/with_security_span");
var _prepackaged_rules = require("../content/prepackaged_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: convert rules files to TS and add explicit type definitions

const getLatestPrebuiltRules = async (client, prebuiltRulesFromFileSystem, prebuiltRulesFromSavedObjects) => (0, _with_security_span.withSecuritySpan)('getLatestPrebuiltRules', async () => {
  // build a map of the most recent version of each rule
  const prebuilt = prebuiltRulesFromFileSystem ? getFilesystemRules() : [];
  const ruleMap = new Map(prebuilt.map(r => [r.rule_id, r]));

  // check the rules installed via fleet and create/update if the version is newer
  if (prebuiltRulesFromSavedObjects) {
    const fleetRules = await getFleetRules(client);
    fleetRules.forEach(fleetRule => {
      const fsRule = ruleMap.get(fleetRule.rule_id);
      if (fsRule == null || fsRule.version < fleetRule.version) {
        // add the new or updated rules to the map
        ruleMap.set(fleetRule.rule_id, fleetRule);
      }
    });
  }
  return ruleMap;
});

/**
 * Retrieve and validate prebuilt rules from "file system" (content/prepackaged_rules).
 */
exports.getLatestPrebuiltRules = getLatestPrebuiltRules;
const getFilesystemRules = (
// @ts-expect-error mock data is too loosely typed
rules = _prepackaged_rules.rawRules) => {
  return validateFilesystemRules(rules);
};

/**
 * Validate the rules from the file system and throw any errors indicating to the developer
 * that they are adding incorrect schema rules. Also this will auto-flush in all the default
 * aspects such as default interval of 5 minutes, default arrays, etc...
 */
exports.getFilesystemRules = getFilesystemRules;
const validateFilesystemRules = rules => {
  return rules.map(rule => {
    const decoded = _prebuilt_rules.PrebuiltRuleToInstall.decode(rule);
    const checked = (0, _securitysolutionIoTsUtils.exactCheck)(rule, decoded);
    const onLeft = errors => {
      const ruleName = rule.name ? rule.name : '(rule name unknown)';
      const ruleId = rule.rule_id ? rule.rule_id : '(rule rule_id unknown)';
      throw new _securitysolutionEsUtils.BadRequestError(`name: "${ruleName}", rule_id: "${ruleId}" within the folder content/prepackaged_rules ` + `is not a valid detection engine rule. Expect the system ` + `to not work with pre-packaged rules until this rule is fixed ` + `or the file is removed. Error is: ${(0, _securitysolutionIoTsUtils.formatErrors)(errors).join()}, Full rule contents are:\n${JSON.stringify(rule, null, 2)}`);
    };
    const onRight = schema => {
      return schema;
    };
    return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
  });
};

/**
 * Retrieve and validate prebuilt rules that were installed from Fleet as saved objects.
 */
const getFleetRules = async client => {
  const fleetResponse = await client.all();
  const fleetRules = fleetResponse.map(so => so.attributes);
  return validateFleetRules(fleetRules);
};

/**
 * Validate the rules from Saved Objects created by Fleet.
 */
const validateFleetRules = rules => {
  return rules.map(rule => {
    const decoded = _prebuilt_rules.PrebuiltRuleToInstall.decode(rule);
    const checked = (0, _securitysolutionIoTsUtils.exactCheck)(rule, decoded);
    const onLeft = errors => {
      const ruleName = rule.name ? rule.name : '(rule name unknown)';
      const ruleId = rule.rule_id ? rule.rule_id : '(rule rule_id unknown)';
      throw new _securitysolutionEsUtils.BadRequestError(`name: "${ruleName}", rule_id: "${ruleId}" within the security-rule saved object ` + `is not a valid detection engine rule. Expect the system ` + `to not work with pre-packaged rules until this rule is fixed ` + `or the file is removed. Error is: ${(0, _securitysolutionIoTsUtils.formatErrors)(errors).join()}, Full rule contents are:\n${JSON.stringify(rule, null, 2)}`);
    };
    const onRight = schema => {
      return schema;
    };
    return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
  });
};