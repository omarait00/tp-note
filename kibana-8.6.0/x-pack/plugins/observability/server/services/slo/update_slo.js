"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdateSLO = void 0;
var _fastDeepEqual = _interopRequireDefault(require("fast-deep-equal"));
var _constants = require("../../assets/constants");
var _rest_specs = require("../../types/rest_specs");
var _services = require("../../domain/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class UpdateSLO {
  constructor(repository, transformManager, esClient) {
    this.repository = repository;
    this.transformManager = transformManager;
    this.esClient = esClient;
  }
  async execute(sloId, params) {
    const originalSlo = await this.repository.findById(sloId);
    const {
      hasBreakingChange,
      updatedSlo
    } = this.updateSLO(originalSlo, params);
    if (hasBreakingChange) {
      await this.deleteObsoleteSLORevisionData(originalSlo);
      await this.repository.save(updatedSlo);
      await this.transformManager.install(updatedSlo);
      await this.transformManager.start((0, _constants.getSLOTransformId)(updatedSlo.id, updatedSlo.revision));
    } else {
      await this.repository.save(updatedSlo);
    }
    return this.toResponse(updatedSlo);
  }
  updateSLO(originalSlo, params) {
    let hasBreakingChange = false;
    const updatedSlo = Object.assign({}, originalSlo, params, {
      updated_at: new Date()
    });
    (0, _services.validateSLO)(updatedSlo);
    if (!(0, _fastDeepEqual.default)(originalSlo.indicator, updatedSlo.indicator)) {
      hasBreakingChange = true;
    }
    if (hasBreakingChange) {
      updatedSlo.revision++;
    }
    return {
      hasBreakingChange,
      updatedSlo
    };
  }
  async deleteObsoleteSLORevisionData(originalSlo) {
    const originalSloTransformId = (0, _constants.getSLOTransformId)(originalSlo.id, originalSlo.revision);
    await this.transformManager.stop(originalSloTransformId);
    await this.transformManager.uninstall(originalSloTransformId);
    await this.deleteRollupData(originalSlo.id, originalSlo.revision);
  }
  async deleteRollupData(sloId, sloRevision) {
    await this.esClient.deleteByQuery({
      index: `${_constants.SLO_INDEX_TEMPLATE_NAME}*`,
      wait_for_completion: false,
      query: {
        bool: {
          filter: [{
            term: {
              'slo.id': sloId
            }
          }, {
            term: {
              'slo.revision': sloRevision
            }
          }]
        }
      }
    });
  }
  toResponse(slo) {
    return _rest_specs.updateSLOResponseSchema.encode({
      id: slo.id,
      name: slo.name,
      description: slo.description,
      indicator: slo.indicator,
      budgeting_method: slo.budgeting_method,
      time_window: slo.time_window,
      objective: slo.objective,
      created_at: slo.created_at,
      updated_at: slo.updated_at
    });
  }
}
exports.UpdateSLO = UpdateSLO;