"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRules = void 0;
var _rule_converters = require("../../normalization/rule_converters");
var _muting = require("../rule_actions/muting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const patchRules = async ({
  rulesClient,
  existingRule,
  nextParams
}) => {
  if (existingRule == null) {
    return null;
  }
  const patchedRule = (0, _rule_converters.convertPatchAPIToInternalSchema)(nextParams, existingRule);
  const update = await rulesClient.update({
    id: existingRule.id,
    data: patchedRule
  });
  if (nextParams.throttle !== undefined) {
    await (0, _muting.maybeMute)({
      rulesClient,
      muteAll: existingRule.muteAll,
      throttle: nextParams.throttle,
      id: update.id
    });
  }
  if (existingRule.enabled && nextParams.enabled === false) {
    await rulesClient.disable({
      id: existingRule.id
    });
  } else if (!existingRule.enabled && nextParams.enabled === true) {
    await rulesClient.enable({
      id: existingRule.id
    });
  } else {
    // enabled is null or undefined and we do not touch the rule
  }
  if (nextParams.enabled != null) {
    return {
      ...update,
      enabled: nextParams.enabled
    };
  } else {
    return update;
  }
};
exports.patchRules = patchRules;