"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRulesToInstall = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getRulesToInstall = (latestPrebuiltRules, installedRules) => {
  return Array.from(latestPrebuiltRules.values()).filter(rule => !installedRules.has(rule.rule_id));
};
exports.getRulesToInstall = getRulesToInstall;