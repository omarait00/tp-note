"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobError = createJobError;
exports.createTrainedModelError = createTrainedModelError;
exports.mlSavedObjectServiceFactory = mlSavedObjectServiceFactory;
var _re = _interopRequireDefault(require("re2"));
var _saved_objects = require("../../common/types/saved_objects");
var _ml_client = require("../lib/ml_client");
var _util = require("./util");
var _authorization = require("./authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function mlSavedObjectServiceFactory(savedObjectsClient, internalSavedObjectsClient, spacesEnabled, authorization, client, isMlReady) {
  async function _getJobObjects(jobType, jobId, datafeedId, currentSpaceOnly = true) {
    await isMlReady();
    const filterObject = {};
    if (jobType !== undefined) {
      filterObject.type = jobType;
    }
    if (jobId !== undefined) {
      filterObject.job_id = jobId;
    } else if (datafeedId !== undefined) {
      filterObject.datafeed_id = datafeedId;
    }
    const {
      filter,
      searchFields
    } = createSavedObjectFilter(filterObject, _saved_objects.ML_JOB_SAVED_OBJECT_TYPE);
    const options = {
      type: _saved_objects.ML_JOB_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false || currentSpaceOnly === true ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    const jobs = await savedObjectsClient.find(options);
    return jobs.saved_objects;
  }
  async function _createJob(jobType, jobId, datafeedId) {
    await isMlReady();
    const job = {
      job_id: jobId,
      datafeed_id: datafeedId !== null && datafeedId !== void 0 ? datafeedId : null,
      type: jobType
    };
    const id = _jobSavedObjectId(job);
    try {
      const [existingJobObject] = await getAllJobObjectsForAllSpaces(jobType, jobId);
      if (existingJobObject !== undefined) {
        var _existingJobObject$na;
        // a saved object for this job already exists, this may be left over from a previously deleted job
        if ((_existingJobObject$na = existingJobObject.namespaces) !== null && _existingJobObject$na !== void 0 && _existingJobObject$na.length) {
          // use a force delete just in case the saved object exists only in another space.
          await _forceDeleteJob(jobType, jobId, existingJobObject.namespaces[0]);
        } else {
          // the saved object has no spaces, this is unexpected, attempt a normal delete
          await savedObjectsClient.delete(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, id, {
            force: true
          });
        }
      }
    } catch (error) {
      // the saved object may exist if a previous job with the same ID has been deleted.
      // if not, this error will be throw which we ignore.
    }
    await savedObjectsClient.create(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, job, {
      id
    });
  }
  async function _bulkCreateJobs(jobs) {
    await isMlReady();
    return await savedObjectsClient.bulkCreate(jobs.map(j => ({
      type: _saved_objects.ML_JOB_SAVED_OBJECT_TYPE,
      id: _jobSavedObjectId(j.job),
      attributes: j.job,
      initialNamespaces: j.namespaces
    })));
  }
  function _jobSavedObjectId(job) {
    return `${job.type}-${job.job_id}`;
  }
  async function _deleteJob(jobType, jobId) {
    const jobs = await _getJobObjects(jobType, jobId);
    const job = jobs[0];
    if (job === undefined) {
      throw new _ml_client.MLJobNotFound('job not found');
    }
    await savedObjectsClient.delete(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, job.id, {
      force: true
    });
  }
  async function _forceDeleteJob(jobType, jobId, namespace) {
    const id = _jobSavedObjectId({
      job_id: jobId,
      datafeed_id: null,
      type: jobType
    });

    // * space cannot be used in a delete call, so use undefined which
    // is the same as specifying the default space
    await internalSavedObjectsClient.delete(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, id, {
      namespace: namespace === '*' ? undefined : namespace,
      force: true
    });
  }
  async function createAnomalyDetectionJob(jobId, datafeedId) {
    await _createJob('anomaly-detector', jobId, datafeedId);
  }
  async function deleteAnomalyDetectionJob(jobId) {
    await _deleteJob('anomaly-detector', jobId);
  }
  async function forceDeleteAnomalyDetectionJob(jobId, namespace) {
    await _forceDeleteJob('anomaly-detector', jobId, namespace);
  }
  async function createDataFrameAnalyticsJob(jobId) {
    await _createJob('data-frame-analytics', jobId);
  }
  async function deleteDataFrameAnalyticsJob(jobId) {
    await _deleteJob('data-frame-analytics', jobId);
  }
  async function forceDeleteDataFrameAnalyticsJob(jobId, namespace) {
    await _forceDeleteJob('data-frame-analytics', jobId, namespace);
  }
  async function bulkCreateJobs(jobs) {
    return await _bulkCreateJobs(jobs);
  }
  async function getAllJobObjects(jobType, currentSpaceOnly = true) {
    return await _getJobObjects(jobType, undefined, undefined, currentSpaceOnly);
  }
  async function getJobObject(jobType, jobId, currentSpaceOnly = true) {
    const [jobObject] = await _getJobObjects(jobType, jobId, undefined, currentSpaceOnly);
    return jobObject;
  }
  async function getAllJobObjectsForAllSpaces(jobType, jobId) {
    await isMlReady();
    const filterObject = {};
    if (jobType !== undefined) {
      filterObject.type = jobType;
    }
    if (jobId !== undefined) {
      filterObject.job_id = jobId;
    }
    const {
      filter,
      searchFields
    } = createSavedObjectFilter(filterObject, _saved_objects.ML_JOB_SAVED_OBJECT_TYPE);
    const options = {
      type: _saved_objects.ML_JOB_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    return (await internalSavedObjectsClient.find(options)).saved_objects;
  }
  async function addDatafeed(datafeedId, jobId) {
    const jobs = await _getJobObjects('anomaly-detector', jobId);
    const job = jobs[0];
    if (job === undefined) {
      throw new _ml_client.MLJobNotFound(`'${datafeedId}' not found`);
    }
    const jobObject = job.attributes;
    jobObject.datafeed_id = datafeedId;
    await savedObjectsClient.update(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, job.id, jobObject);
  }
  async function deleteDatafeed(datafeedId) {
    const jobs = await _getJobObjects('anomaly-detector', undefined, datafeedId);
    const job = jobs[0];
    if (job === undefined) {
      throw new _ml_client.MLJobNotFound(`'${datafeedId}' not found`);
    }
    const jobObject = job.attributes;
    jobObject.datafeed_id = null;
    await savedObjectsClient.update(_saved_objects.ML_JOB_SAVED_OBJECT_TYPE, job.id, jobObject);
  }
  async function _getIds(jobType, idType) {
    const jobs = await _getJobObjects(jobType);
    return jobs.map(o => o.attributes[idType]);
  }
  async function _filterJobObjectsForSpace(jobType, list, field, key) {
    if (list.length === 0) {
      return [];
    }
    const jobIds = await _getIds(jobType, key);
    return list.filter(j => jobIds.includes(j[field]));
  }
  async function filterJobsForSpace(jobType, list, field) {
    return _filterJobObjectsForSpace(jobType, list, field, 'job_id');
  }
  async function filterDatafeedsForSpace(jobType, list, field) {
    return _filterJobObjectsForSpace(jobType, list, field, 'datafeed_id');
  }
  async function _filterJobObjectIdsForSpace(jobType, ids, key, allowWildcards = false) {
    if (ids.length === 0) {
      return [];
    }
    const jobIds = await _getIds(jobType, key);
    // check to see if any of the ids supplied contain a wildcard
    if (allowWildcards === false || ids.join().match('\\*') === null) {
      // wildcards are not allowed or no wildcards could be found
      return ids.filter(id => jobIds.includes(id));
    }

    // if any of the ids contain a wildcard, check each one.
    return ids.filter(id => {
      if (id.match('\\*') === null) {
        return jobIds.includes(id);
      }
      const regex = new _re.default(id.replace('*', '.*'));
      return jobIds.some(jId => typeof jId === 'string' && regex.exec(jId));
    });
  }
  async function filterJobIdsForSpace(jobType, ids, allowWildcards = false) {
    return _filterJobObjectIdsForSpace(jobType, ids, 'job_id', allowWildcards);
  }
  async function filterDatafeedIdsForSpace(ids, allowWildcards = false) {
    return _filterJobObjectIdsForSpace('anomaly-detector', ids, 'datafeed_id', allowWildcards);
  }
  async function updateJobsSpaces(jobType, jobIds, spacesToAdd, spacesToRemove) {
    const type = jobType;
    if (jobIds.length === 0 || spacesToAdd.length === 0 && spacesToRemove.length === 0) {
      return {};
    }
    const results = {};
    const jobs = await _getJobObjects(jobType);
    const jobObjectIdMap = new Map();
    const jobObjectsToUpdate = [];
    for (const jobId of jobIds) {
      const job = jobs.find(j => j.attributes.job_id === jobId);
      if (job === undefined) {
        results[jobId] = {
          success: false,
          type,
          error: createJobError(jobId, 'job_id')
        };
      } else {
        jobObjectIdMap.set(job.id, jobId);
        jobObjectsToUpdate.push({
          type: _saved_objects.ML_JOB_SAVED_OBJECT_TYPE,
          id: job.id
        });
      }
    }
    try {
      const updateResult = await savedObjectsClient.updateObjectsSpaces(jobObjectsToUpdate, spacesToAdd, spacesToRemove);
      updateResult.objects.forEach(({
        id: objectId,
        error
      }) => {
        const jobId = jobObjectIdMap.get(objectId);
        if (error) {
          results[jobId] = {
            success: false,
            type,
            error: (0, _util.getSavedObjectClientError)(error)
          };
        } else {
          results[jobId] = {
            success: true,
            type
          };
        }
      });
    } catch (error) {
      // If the entire operation failed, return success: false for each job
      const clientError = (0, _util.getSavedObjectClientError)(error);
      jobObjectsToUpdate.forEach(({
        id: objectId
      }) => {
        const jobId = jobObjectIdMap.get(objectId);
        results[jobId] = {
          success: false,
          type,
          error: clientError
        };
      });
    }
    return {
      ...results
    };
  }
  async function canCreateGlobalMlSavedObjects(mlSavedObjectType, request) {
    if (authorization === undefined) {
      return true;
    }
    const {
      authorizationCheck
    } = (0, _authorization.authorizationProvider)(authorization);
    const {
      canCreateJobsGlobally,
      canCreateTrainedModelsGlobally
    } = await authorizationCheck(request);
    return mlSavedObjectType === 'trained-model' ? canCreateTrainedModelsGlobally : canCreateJobsGlobally;
  }
  async function getTrainedModelObject(modelId, currentSpaceOnly = true) {
    const [modelObject] = await _getTrainedModelObjects(modelId, currentSpaceOnly);
    return modelObject;
  }
  async function createTrainedModel(modelId, job) {
    await _createTrainedModel(modelId, job);
  }
  async function bulkCreateTrainedModel(models, namespaceFallback) {
    return await _bulkCreateTrainedModel(models, namespaceFallback);
  }
  async function deleteTrainedModel(modelId) {
    await _deleteTrainedModel(modelId);
  }
  async function forceDeleteTrainedModel(modelId, namespace) {
    await _forceDeleteTrainedModel(modelId, namespace);
  }
  async function getAllTrainedModelObjects(currentSpaceOnly = true) {
    return await _getTrainedModelObjects(undefined, currentSpaceOnly);
  }
  async function _getTrainedModelObjects(modelId, currentSpaceOnly = true) {
    await isMlReady();
    const filterObject = {};
    if (modelId !== undefined) {
      filterObject.model_id = modelId;
    }
    const {
      filter,
      searchFields
    } = createSavedObjectFilter(filterObject, _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE);
    const options = {
      type: _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false || currentSpaceOnly === true ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    const models = await savedObjectsClient.find(options);
    return models.saved_objects;
  }
  async function _createTrainedModel(modelId, job) {
    await isMlReady();
    const modelObject = {
      model_id: modelId,
      job
    };
    try {
      const [existingModelObject] = await getAllTrainedModelObjectsForAllSpaces([modelId]);
      if (existingModelObject !== undefined) {
        var _existingModelObject$;
        // a saved object for this job already exists, this may be left over from a previously deleted job
        if ((_existingModelObject$ = existingModelObject.namespaces) !== null && _existingModelObject$ !== void 0 && _existingModelObject$.length) {
          // use a force delete just in case the saved object exists only in another space.
          await _forceDeleteTrainedModel(modelId, existingModelObject.namespaces[0]);
        } else {
          // the saved object has no spaces, this is unexpected, attempt a normal delete
          await savedObjectsClient.delete(_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE, modelId, {
            force: true
          });
        }
      }
    } catch (error) {
      // the saved object may exist if a previous job with the same ID has been deleted.
      // if not, this error will be throw which we ignore.
    }
    let initialNamespaces;
    // if a job exists for this model, ensure the initial namespaces for the model
    // are the same as the job
    if (job !== null) {
      var _existingJobObject$na2;
      const [existingJobObject] = await getAllJobObjectsForAllSpaces('data-frame-analytics', job.job_id);
      initialNamespaces = (_existingJobObject$na2 = existingJobObject === null || existingJobObject === void 0 ? void 0 : existingJobObject.namespaces) !== null && _existingJobObject$na2 !== void 0 ? _existingJobObject$na2 : undefined;
    }
    await savedObjectsClient.create(_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE, modelObject, {
      id: modelId,
      ...(initialNamespaces ? {
        initialNamespaces
      } : {})
    });
  }
  async function _bulkCreateTrainedModel(models, namespaceFallback) {
    await isMlReady();
    const namespacesPerJob = (await getAllJobObjectsForAllSpaces()).reduce((acc, cur) => {
      acc[cur.attributes.job_id] = cur.namespaces;
      return acc;
    }, {});
    return await savedObjectsClient.bulkCreate(models.map(m => {
      var _initialNamespaces;
      let initialNamespaces = m.job && namespacesPerJob[m.job.job_id];
      if (!((_initialNamespaces = initialNamespaces) !== null && _initialNamespaces !== void 0 && _initialNamespaces.length) && namespaceFallback) {
        // use the namespace fallback if it is defined and no namespaces can
        // be found for a related job.
        // otherwise initialNamespaces will be undefined and the SO client will
        // use the current space.
        initialNamespaces = [namespaceFallback];
      }
      return {
        type: _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE,
        id: m.model_id,
        attributes: m,
        ...(initialNamespaces ? {
          initialNamespaces
        } : {})
      };
    }));
  }
  async function getAllTrainedModelObjectsForAllSpaces(modelIds) {
    await isMlReady();
    const searchFields = ['model_id'];
    let filter = '';
    if (modelIds !== undefined && modelIds.length) {
      filter = modelIds.map(m => `${_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE}.attributes.model_id: "${m}"`).join(' OR ');
    }
    const options = {
      type: _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE,
      perPage: 10000,
      ...(spacesEnabled === false ? {} : {
        namespaces: ['*']
      }),
      searchFields,
      filter
    };
    return (await internalSavedObjectsClient.find(options)).saved_objects;
  }
  async function _deleteTrainedModel(modelId) {
    const [model] = await _getTrainedModelObjects(modelId);
    if (model === undefined) {
      throw new _ml_client.MLModelNotFound('trained model not found');
    }
    await savedObjectsClient.delete(_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE, model.id, {
      force: true
    });
  }
  async function _forceDeleteTrainedModel(modelId, namespace) {
    // * space cannot be used in a delete call, so use undefined which
    // is the same as specifying the default space
    await internalSavedObjectsClient.delete(_saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE, modelId, {
      namespace: namespace === '*' ? undefined : namespace,
      force: true
    });
  }
  async function filterTrainedModelsForSpace(list, field) {
    return _filterModelObjectsForSpace(list, field, 'model_id');
  }
  async function filterTrainedModelIdsForSpace(ids, allowWildcards = false) {
    return _filterModelObjectIdsForSpace(ids, 'model_id', allowWildcards);
  }
  async function _filterModelObjectIdsForSpace(ids, key, allowWildcards = false) {
    if (ids.length === 0) {
      return [];
    }
    const modelIds = await _getModelIds(key);
    // check to see if any of the ids supplied contain a wildcard
    if (allowWildcards === false || ids.join().match('\\*') === null) {
      // wildcards are not allowed or no wildcards could be found
      return ids.filter(id => modelIds.includes(id));
    }

    // if any of the ids contain a wildcard, check each one.
    return ids.filter(id => {
      if (id.match('\\*') === null) {
        return modelIds.includes(id);
      }
      const regex = new _re.default(id.replace('*', '.*'));
      return modelIds.some(jId => typeof jId === 'string' && regex.exec(jId));
    });
  }
  async function _filterModelObjectsForSpace(list, field, key) {
    if (list.length === 0) {
      return [];
    }
    const modelIds = await _getModelIds(key);
    return list.filter(j => modelIds.includes(j[field]));
  }
  async function _getModelIds(idType) {
    const models = await _getTrainedModelObjects();
    return models.map(o => o.attributes[idType]);
  }
  async function getAnomalyDetectionJobIds() {
    return _getIds('anomaly-detector', 'job_id');
  }
  async function getDataFrameAnalyticsJobIds() {
    return _getIds('data-frame-analytics', 'job_id');
  }
  async function getTrainedModelsIds() {
    return _getModelIds('model_id');
  }
  async function findTrainedModelsObjectForJobs(jobIds, currentSpaceOnly = true) {
    await isMlReady();
    const {
      data_frame_analytics: jobs
    } = await client.asInternalUser.ml.getDataFrameAnalytics({
      id: jobIds.join(',')
    });
    const searches = jobs.map(job => {
      const createTime = job.create_time;
      const filterObject = {
        'job.job_id': job.id,
        'job.create_time': createTime
      };
      const {
        filter,
        searchFields
      } = createSavedObjectFilter(filterObject, _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE);
      const options = {
        type: _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE,
        perPage: 10000,
        ...(spacesEnabled === false || currentSpaceOnly === true ? {} : {
          namespaces: ['*']
        }),
        searchFields,
        filter
      };
      return savedObjectsClient.find(options);
    });
    const finedResult = await Promise.all(searches);
    return finedResult.reduce((acc, cur) => {
      const savedObject = cur.saved_objects[0];
      if (savedObject) {
        const jobId = savedObject.attributes.job.job_id;
        acc[jobId] = savedObject;
      }
      return acc;
    }, {});
  }
  async function updateTrainedModelsSpaces(modelIds, spacesToAdd, spacesToRemove) {
    const type = 'trained-model';
    if (modelIds.length === 0 || spacesToAdd.length === 0 && spacesToRemove.length === 0) {
      return {};
    }
    const results = {};
    const models = await _getTrainedModelObjects();
    const trainedModelObjectIdMap = new Map();
    const objectsToUpdate = [];
    for (const modelId of modelIds) {
      const model = models.find(({
        attributes
      }) => attributes.model_id === modelId);
      if (model === undefined) {
        results[modelId] = {
          success: false,
          type,
          error: createTrainedModelError(modelId)
        };
      } else {
        trainedModelObjectIdMap.set(model.id, model.attributes.model_id);
        objectsToUpdate.push({
          type: _saved_objects.ML_TRAINED_MODEL_SAVED_OBJECT_TYPE,
          id: model.id
        });
      }
    }
    try {
      const updateResult = await savedObjectsClient.updateObjectsSpaces(objectsToUpdate, spacesToAdd, spacesToRemove);
      updateResult.objects.forEach(({
        id: objectId,
        error
      }) => {
        const model = trainedModelObjectIdMap.get(objectId);
        if (error) {
          results[model] = {
            success: false,
            type,
            error: (0, _util.getSavedObjectClientError)(error)
          };
        } else {
          results[model] = {
            success: true,
            type
          };
        }
      });
    } catch (error) {
      // If the entire operation failed, return success: false for each job
      const clientError = (0, _util.getSavedObjectClientError)(error);
      objectsToUpdate.forEach(({
        id: objectId
      }) => {
        const modelId = trainedModelObjectIdMap.get(objectId);
        results[modelId] = {
          success: false,
          type,
          error: clientError
        };
      });
    }
    return results;
  }
  return {
    getAnomalyDetectionJobIds,
    getDataFrameAnalyticsJobIds,
    getTrainedModelsIds,
    getAllJobObjects,
    getJobObject,
    createAnomalyDetectionJob,
    createDataFrameAnalyticsJob,
    deleteAnomalyDetectionJob,
    forceDeleteAnomalyDetectionJob,
    deleteDataFrameAnalyticsJob,
    forceDeleteDataFrameAnalyticsJob,
    addDatafeed,
    deleteDatafeed,
    filterJobsForSpace,
    filterJobIdsForSpace,
    filterDatafeedsForSpace,
    filterDatafeedIdsForSpace,
    updateJobsSpaces,
    bulkCreateJobs,
    getAllJobObjectsForAllSpaces,
    canCreateGlobalMlSavedObjects,
    getTrainedModelObject,
    createTrainedModel,
    bulkCreateTrainedModel,
    deleteTrainedModel,
    forceDeleteTrainedModel,
    updateTrainedModelsSpaces,
    getAllTrainedModelObjects,
    getAllTrainedModelObjectsForAllSpaces,
    filterTrainedModelsForSpace,
    filterTrainedModelIdsForSpace,
    findTrainedModelsObjectForJobs
  };
}
function createJobError(id, key) {
  let reason = `'${id}' not found`;
  if (key === 'job_id') {
    reason = `No known job with id '${id}'`;
  } else if (key === 'datafeed_id') {
    reason = `No known datafeed with id '${id}'`;
  }
  return reason;
}
function createTrainedModelError(id) {
  return `No known trained model with id '${id}'`;
}
function createSavedObjectFilter(filterObject, savedObjectType) {
  const searchFields = [];
  const filter = Object.entries(filterObject).map(([k, v]) => {
    searchFields.push(k);
    return `${savedObjectType}.attributes.${k}: "${v}"`;
  }).join(' AND ');
  return {
    filter,
    searchFields
  };
}