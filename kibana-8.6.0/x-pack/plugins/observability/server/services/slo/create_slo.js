"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateSLO = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _services = require("../../domain/services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class CreateSLO {
  constructor(resourceInstaller, repository, transformManager) {
    this.resourceInstaller = resourceInstaller;
    this.repository = repository;
    this.transformManager = transformManager;
  }
  async execute(params) {
    const slo = this.toSLO(params);
    (0, _services.validateSLO)(slo);
    await this.resourceInstaller.ensureCommonResourcesInstalled();
    await this.repository.save(slo);
    let sloTransformId;
    try {
      sloTransformId = await this.transformManager.install(slo);
    } catch (err) {
      await this.repository.deleteById(slo.id);
      throw err;
    }
    try {
      await this.transformManager.start(sloTransformId);
    } catch (err) {
      await Promise.all([this.transformManager.uninstall(sloTransformId), this.repository.deleteById(slo.id)]);
      throw err;
    }
    return this.toResponse(slo);
  }
  toSLO(params) {
    const now = new Date();
    return {
      ...params,
      id: _uuid.default.v1(),
      revision: 1,
      created_at: now,
      updated_at: now
    };
  }
  toResponse(slo) {
    return {
      id: slo.id
    };
  }
}
exports.CreateSLO = CreateSLO;