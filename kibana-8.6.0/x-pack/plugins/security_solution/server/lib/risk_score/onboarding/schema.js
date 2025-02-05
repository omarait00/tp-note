"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onboardingRiskScoreSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _search_strategy = require("../../../../common/search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const onboardingRiskScoreSchema = {
  body: _configSchema.schema.object({
    riskScoreEntity: _configSchema.schema.oneOf([_configSchema.schema.literal(_search_strategy.RiskScoreEntity.host), _configSchema.schema.literal(_search_strategy.RiskScoreEntity.user)])
  })
};
exports.onboardingRiskScoreSchema = onboardingRiskScoreSchema;