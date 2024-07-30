"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetSLO = void 0;
var _rest_specs = require("../../types/rest_specs");
var _services = require("../../domain/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class GetSLO {
  constructor(repository, sliClient) {
    this.repository = repository;
    this.sliClient = sliClient;
  }
  async execute(sloId) {
    const slo = await this.repository.findById(sloId);
    const sliData = await this.sliClient.fetchCurrentSLIData(slo);
    const sliValue = (0, _services.computeSLI)(sliData);
    const errorBudget = (0, _services.computeErrorBudget)(slo, sliData);
    return this.toResponse(slo, sliValue, errorBudget);
  }
  toResponse(slo, sliValue, errorBudget) {
    return _rest_specs.getSLOResponseSchema.encode({
      id: slo.id,
      name: slo.name,
      description: slo.description,
      indicator: slo.indicator,
      time_window: slo.time_window,
      budgeting_method: slo.budgeting_method,
      objective: slo.objective,
      summary: {
        sli_value: sliValue,
        error_budget: {
          ...errorBudget
        }
      },
      revision: slo.revision,
      created_at: slo.created_at,
      updated_at: slo.updated_at
    });
  }
}
exports.GetSLO = GetSLO;