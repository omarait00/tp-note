"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultTransformManager = void 0;
var _retry = require("../../utils/retry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class DefaultTransformManager {
  constructor(generators, esClient, logger) {
    this.generators = generators;
    this.esClient = esClient;
    this.logger = logger;
  }
  async install(slo) {
    const generator = this.generators[slo.indicator.type];
    if (!generator) {
      this.logger.error(`No transform generator found for ${slo.indicator.type} SLO type`);
      throw new Error(`Unsupported SLI type: ${slo.indicator.type}`);
    }
    const transformParams = generator.getTransformParams(slo);
    try {
      await (0, _retry.retryTransientEsErrors)(() => this.esClient.transform.putTransform(transformParams), {
        logger: this.logger
      });
    } catch (err) {
      this.logger.error(`Cannot create transform for ${slo.indicator.type} SLI type: ${err}`);
      throw err;
    }
    return transformParams.transform_id;
  }
  async start(transformId) {
    try {
      await (0, _retry.retryTransientEsErrors)(() => this.esClient.transform.startTransform({
        transform_id: transformId
      }, {
        ignore: [409]
      }), {
        logger: this.logger
      });
    } catch (err) {
      this.logger.error(`Cannot start transform id ${transformId}: ${err}`);
      throw err;
    }
  }
  async stop(transformId) {
    try {
      await (0, _retry.retryTransientEsErrors)(() => this.esClient.transform.stopTransform({
        transform_id: transformId,
        wait_for_completion: true
      }, {
        ignore: [404]
      }), {
        logger: this.logger
      });
    } catch (err) {
      this.logger.error(`Cannot stop transform id ${transformId}: ${err}`);
      throw err;
    }
  }
  async uninstall(transformId) {
    try {
      await (0, _retry.retryTransientEsErrors)(() => this.esClient.transform.deleteTransform({
        transform_id: transformId,
        force: true
      }, {
        ignore: [404]
      }), {
        logger: this.logger
      });
    } catch (err) {
      this.logger.error(`Cannot delete transform id ${transformId}: ${err}`);
      throw err;
    }
  }
}
exports.DefaultTransformManager = DefaultTransformManager;