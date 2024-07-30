"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRules = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteRules = async ({
  ruleId,
  rulesClient,
  ruleExecutionLog
}) => {
  await rulesClient.delete({
    id: ruleId
  });
  await ruleExecutionLog.clearExecutionSummary(ruleId);
};
exports.deleteRules = deleteRules;