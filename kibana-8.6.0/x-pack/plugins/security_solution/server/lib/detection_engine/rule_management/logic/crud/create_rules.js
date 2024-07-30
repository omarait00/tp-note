"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRules = void 0;
var _constants = require("../../../../../../common/constants");
var _rule_converters = require("../../normalization/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRules = async ({
  rulesClient,
  params,
  id,
  immutable = false,
  defaultEnabled = true
}) => {
  const internalRule = (0, _rule_converters.convertCreateAPIToInternalSchema)(params, immutable, defaultEnabled);
  const rule = await rulesClient.create({
    options: {
      id
    },
    data: internalRule
  });

  // Mute the rule if it is first created with the explicit no actions
  if (params.throttle === _constants.NOTIFICATION_THROTTLE_NO_ACTIONS) {
    await rulesClient.muteAll({
      id: rule.id
    });
  }
  return rule;
};
exports.createRules = createRules;