"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeleteSLO = void 0;
var _constants = require("../../assets/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DeleteSLO {
  constructor(repository, transformManager, esClient) {
    this.repository = repository;
    this.transformManager = transformManager;
    this.esClient = esClient;
  }
  async execute(sloId) {
    const slo = await this.repository.findById(sloId);
    const sloTransformId = (0, _constants.getSLOTransformId)(slo.id, slo.revision);
    await this.transformManager.stop(sloTransformId);
    await this.transformManager.uninstall(sloTransformId);
    await this.deleteRollupData(slo.id);
    await this.repository.deleteById(slo.id);
  }
  async deleteRollupData(sloId) {
    await this.esClient.deleteByQuery({
      index: `${_constants.SLO_INDEX_TEMPLATE_NAME}*`,
      wait_for_completion: false,
      query: {
        match: {
          'slo.id': sloId
        }
      }
    });
  }
}
exports.DeleteSLO = DeleteSLO;