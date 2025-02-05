"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checksFactory = checksFactory;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _util = require("./util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function checksFactory(client, mlSavedObjectService) {
  async function checkStatus() {
    const [jobObjects, allJobObjects, modelObjects, allModelObjects, adJobs, datafeeds, dfaJobs, models] = await Promise.all([mlSavedObjectService.getAllJobObjects(undefined, false), mlSavedObjectService.getAllJobObjectsForAllSpaces(), mlSavedObjectService.getAllTrainedModelObjects(false), mlSavedObjectService.getAllTrainedModelObjectsForAllSpaces(), client.asInternalUser.ml.getJobs(), client.asInternalUser.ml.getDatafeeds(), client.asInternalUser.ml.getDataFrameAnalytics(), client.asInternalUser.ml.getTrainedModels()]);
    const jobSavedObjectsStatus = jobObjects.map(({
      attributes,
      namespaces
    }) => {
      const type = attributes.type;
      const jobId = attributes.job_id;
      const datafeedId = type === 'anomaly-detector' ? attributes.datafeed_id : undefined;
      let jobExists = false;
      let datafeedExists;
      if (type === 'anomaly-detector') {
        jobExists = adJobs.jobs.some(j => j.job_id === jobId);
        datafeedExists = datafeeds.datafeeds.some(d => d.job_id === jobId);
      } else {
        jobExists = dfaJobs.data_frame_analytics.some(j => j.id === jobId);
      }
      return {
        jobId,
        type,
        datafeedId,
        namespaces,
        checks: {
          jobExists,
          datafeedExists
        }
      };
    });
    const dfaJobsCreateTimeMap = dfaJobs.data_frame_analytics.reduce((acc, cur) => {
      acc.set(cur.id, cur.create_time);
      return acc;
    }, new Map());
    const modelJobExits = models.trained_model_configs.reduce((acc, cur) => {
      const job = (0, _util.getJobDetailsFromTrainedModel)(cur);
      if (job === null) {
        return acc;
      }
      const {
        job_id: jobId,
        create_time: createTime
      } = job;
      const exists = createTime === dfaJobsCreateTimeMap.get(jobId);
      if (jobId && createTime) {
        acc.set(cur.model_id, exists);
      }
      return acc;
    }, new Map());
    const modelSavedObjectsStatus = modelObjects.map(({
      attributes: {
        job,
        model_id: modelId
      },
      namespaces
    }) => {
      var _modelJobExits$get;
      const trainedModelExists = models.trained_model_configs.some(m => m.model_id === modelId);
      const dfaJobExists = (_modelJobExits$get = modelJobExits.get(modelId)) !== null && _modelJobExits$get !== void 0 ? _modelJobExits$get : null;
      return {
        modelId,
        namespaces,
        job,
        checks: {
          trainedModelExists,
          dfaJobExists
        }
      };
    });
    const nonSpaceADObjectIds = new Set(allJobObjects.filter(({
      attributes
    }) => attributes.type === 'anomaly-detector').map(({
      attributes
    }) => attributes.job_id));
    const nonSpaceDFAObjectIds = new Set(allJobObjects.filter(({
      attributes
    }) => attributes.type === 'data-frame-analytics').map(({
      attributes
    }) => attributes.job_id));
    const nonSpaceModelObjectIds = new Map(allModelObjects.map(model => [model.attributes.model_id, model]));
    const adObjectIds = new Set(jobSavedObjectsStatus.filter(({
      type
    }) => type === 'anomaly-detector').map(({
      jobId
    }) => jobId));
    const dfaObjectIds = new Set(jobSavedObjectsStatus.filter(({
      type
    }) => type === 'data-frame-analytics').map(({
      jobId
    }) => jobId));
    const modelObjectIds = new Set(modelSavedObjectsStatus.map(({
      modelId
    }) => modelId));
    const anomalyDetectorsStatus = adJobs.jobs.filter(({
      job_id: jobId
    }) => {
      // only list jobs which are in the current space (adObjectIds)
      // or are not in any spaces (nonSpaceADObjectIds)
      return adObjectIds.has(jobId) === true || nonSpaceADObjectIds.has(jobId) === false;
    }).map(({
      job_id: jobId
    }) => {
      var _datafeeds$datafeeds$;
      const datafeedId = (_datafeeds$datafeeds$ = datafeeds.datafeeds.find(df => df.job_id === jobId)) === null || _datafeeds$datafeeds$ === void 0 ? void 0 : _datafeeds$datafeeds$.datafeed_id;
      return {
        jobId,
        datafeedId: datafeedId !== null && datafeedId !== void 0 ? datafeedId : null,
        checks: {
          savedObjectExits: nonSpaceADObjectIds.has(jobId)
        }
      };
    });
    const dataFrameAnalyticsStatus = dfaJobs.data_frame_analytics.filter(({
      id: jobId
    }) => {
      // only list jobs which are in the current space (dfaObjectIds)
      // or are not in any spaces (nonSpaceDFAObjectIds)
      return dfaObjectIds.has(jobId) === true || nonSpaceDFAObjectIds.has(jobId) === false;
    }).map(({
      id: jobId
    }) => {
      return {
        jobId,
        datafeedId: null,
        checks: {
          savedObjectExits: nonSpaceDFAObjectIds.has(jobId)
        }
      };
    });
    const modelsStatus = models.trained_model_configs.filter(({
      model_id: modelId
    }) => {
      // only list jobs which are in the current space (adObjectIds)
      // or are not in any spaces (nonSpaceADObjectIds)
      return modelObjectIds.has(modelId) === true || nonSpaceModelObjectIds.has(modelId) === false;
    }).map(model => {
      const modelId = model.model_id;
      const modelObject = nonSpaceModelObjectIds.get(modelId);
      const savedObjectExits = modelObject !== undefined;
      const job = (0, _util.getJobDetailsFromTrainedModel)(model);
      let dfaJobReferenced = null;
      if (job !== null) {
        var _modelObject$attribut, _modelObject$attribut2;
        dfaJobReferenced = (modelObject === null || modelObject === void 0 ? void 0 : (_modelObject$attribut = modelObject.attributes.job) === null || _modelObject$attribut === void 0 ? void 0 : _modelObject$attribut.job_id) === job.job_id && (modelObject === null || modelObject === void 0 ? void 0 : (_modelObject$attribut2 = modelObject.attributes.job) === null || _modelObject$attribut2 === void 0 ? void 0 : _modelObject$attribut2.create_time) === job.create_time;
      }
      return {
        modelId,
        checks: {
          savedObjectExits,
          dfaJobReferenced
        }
      };
    });
    return {
      savedObjects: {
        'anomaly-detector': jobSavedObjectsStatus.filter(({
          type
        }) => type === 'anomaly-detector'),
        'data-frame-analytics': jobSavedObjectsStatus.filter(({
          type
        }) => type === 'data-frame-analytics'),
        'trained-model': modelSavedObjectsStatus
      },
      jobs: {
        'anomaly-detector': anomalyDetectorsStatus,
        'data-frame-analytics': dataFrameAnalyticsStatus,
        'trained-model': modelsStatus
      }
    };
  }
  async function canDeleteMLSpaceAwareItems(request, mlSavedObjectType, ids, spacesEnabled, resolveMlCapabilities) {
    if (['anomaly-detector', 'data-frame-analytics', 'trained-model'].includes(mlSavedObjectType) === false) {
      throw _boom.default.badRequest('Saved object type must be "anomaly-detector", "data-frame-analytics" or "trained-model');
    }
    const mlCapabilities = await resolveMlCapabilities(request);
    if (mlCapabilities === null) {
      throw _boom.default.internal('mlCapabilities is not defined');
    }
    if (mlSavedObjectType === 'anomaly-detector' && mlCapabilities.canDeleteJob === false || mlSavedObjectType === 'data-frame-analytics' && mlCapabilities.canDeleteDataFrameAnalytics === false) {
      // user does not have access to delete jobs.
      return ids.reduce((results, id) => {
        results[id] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }, {});
    } else if (mlSavedObjectType === 'trained-model' && mlCapabilities.canDeleteTrainedModels === false) {
      // user does not have access to delete trained models.
      return ids.reduce((results, id) => {
        results[id] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }, {});
    }
    if (spacesEnabled === false) {
      // spaces are disabled, delete only no untagging
      return ids.reduce((results, id) => {
        results[id] = {
          canDelete: true,
          canRemoveFromSpace: false
        };
        return results;
      }, {});
    }
    const canCreateGlobalMlSavedObjects = await mlSavedObjectService.canCreateGlobalMlSavedObjects(mlSavedObjectType, request);
    const savedObjects = mlSavedObjectType === 'trained-model' ? await Promise.all(ids.map(id => mlSavedObjectService.getTrainedModelObject(id))) : await Promise.all(ids.map(id => mlSavedObjectService.getJobObject(mlSavedObjectType, id)));
    return ids.reduce((results, id) => {
      const savedObject = mlSavedObjectType === 'trained-model' ? savedObjects.find(j => (j === null || j === void 0 ? void 0 : j.attributes.model_id) === id) : savedObjects.find(j => (j === null || j === void 0 ? void 0 : j.attributes.job_id) === id);
      if (savedObject === undefined || savedObject.namespaces === undefined) {
        // job saved object not found
        results[id] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }
      const {
        namespaces
      } = savedObject;
      const isGlobalSavedObject = namespaces.includes('*');

      // job is in * space, user can see all spaces - delete and no option to untag
      if (canCreateGlobalMlSavedObjects && isGlobalSavedObject) {
        results[id] = {
          canDelete: true,
          canRemoveFromSpace: false
        };
        return results;
      }

      // job is in * space, user cannot see all spaces - no untagging, no deleting
      if (isGlobalSavedObject) {
        results[id] = {
          canDelete: false,
          canRemoveFromSpace: false
        };
        return results;
      }

      // jobs with are in individual spaces can only be untagged
      // from current space if the job is in more than 1 space
      const canRemoveFromSpace = namespaces.length > 1;

      // job is in individual spaces, user cannot see all of them - untag only, no delete
      if (namespaces.includes('?')) {
        results[id] = {
          canDelete: false,
          canRemoveFromSpace
        };
        return results;
      }

      // job is individual spaces, user can see all of them - delete and option to untag
      results[id] = {
        canDelete: true,
        canRemoveFromSpace
      };
      return results;
    }, {});
  }
  async function jobsSpaces() {
    const savedObjects = (await checkStatus()).savedObjects;
    return Object.entries(savedObjects).filter(([type]) => type === 'anomaly-detector' || type === 'data-frame-analytics').map(([, status]) => status).flat().filter(s => s.checks.jobExists).reduce((acc, cur) => {
      const type = cur.type;
      if (acc[type] === undefined) {
        acc[type] = {};
      }
      acc[type][cur.jobId] = cur.namespaces;
      return acc;
    }, {});
  }
  async function trainedModelsSpaces() {
    const savedObjects = (await checkStatus()).savedObjects;
    return savedObjects['trained-model'].filter(s => s.checks.trainedModelExists).reduce((acc, cur) => {
      acc.trainedModels[cur.modelId] = cur.namespaces;
      return acc;
    }, {
      trainedModels: {}
    });
  }
  return {
    checkStatus,
    canDeleteMLSpaceAwareItems,
    jobsSpaces,
    trainedModelsSpaces
  };
}