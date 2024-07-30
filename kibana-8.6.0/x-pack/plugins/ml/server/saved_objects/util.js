"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getJobDetailsFromTrainedModel = getJobDetailsFromTrainedModel;
exports.getSavedObjectClientError = getSavedObjectClientError;
exports.savedObjectClientsFactory = savedObjectClientsFactory;
var _server = require("../../../../../src/core/server");
var _saved_objects = require("../../common/types/saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function savedObjectClientsFactory(getSavedObjectsStart) {
  return {
    // create a saved object client scoped to the current request
    // which has access to ml-job objects
    getMlSavedObjectsClient: request => {
      const savedObjectsStart = getSavedObjectsStart();
      if (savedObjectsStart === null) {
        return null;
      }
      return savedObjectsStart.getScopedClient(request, {
        includedHiddenTypes: [_saved_objects.ML_JOB_SAVED_OBJECT_TYPE]
      });
    },
    // create a saved object client which has access to all saved objects
    // no matter the space access of the current user.
    getInternalSavedObjectsClient: () => {
      const savedObjectsStart = getSavedObjectsStart();
      if (savedObjectsStart === null) {
        return null;
      }
      const savedObjectsRepo = savedObjectsStart.createInternalRepository();
      return new _server.SavedObjectsClient(savedObjectsRepo);
    }
  };
}
function getSavedObjectClientError(error) {
  var _error$output, _error$body;
  return error.isBoom && (_error$output = error.output) !== null && _error$output !== void 0 && _error$output.payload ? error.output.payload : (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error;
}
function getJobDetailsFromTrainedModel(model) {
  var _model$metadata;
  // @ts-ignore types are wrong
  if (((_model$metadata = model.metadata) === null || _model$metadata === void 0 ? void 0 : _model$metadata.analytics_config) === undefined) {
    return null;
  }

  // @ts-ignore types are wrong
  const jobId = model.metadata.analytics_config.id;
  // @ts-ignore types are wrong
  const createTime = model.metadata.analytics_config.create_time;
  return {
    job_id: jobId,
    create_time: createTime
  };
}