"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrainedModelsProvider = getTrainedModelsProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getTrainedModelsProvider(getGuards) {
  return {
    trainedModelsProvider(request, savedObjectsClient) {
      return {
        async getTrainedModels(params) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetTrainedModels']).ok(async ({
            mlClient
          }) => {
            return mlClient.getTrainedModels(params);
          });
        },
        async getTrainedModelsStats(params) {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetTrainedModels']).ok(async ({
            mlClient
          }) => {
            return mlClient.getTrainedModelsStats(params);
          });
        }
      };
    }
  };
}