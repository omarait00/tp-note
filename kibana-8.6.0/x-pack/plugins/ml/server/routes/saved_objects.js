"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsRoutes = savedObjectsRoutes;
var _error_wrapper = require("../client/error_wrapper");
var _saved_objects = require("../saved_objects");
var _saved_objects2 = require("./schemas/saved_objects");
var _spaces_utils = require("../lib/spaces_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for job saved object management
 */
function savedObjectsRoutes({
  router,
  routeGuard
}, {
  getSpaces,
  resolveMlCapabilities
}) {
  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/status Get job and trained model saved object status
   * @apiName SavedObjectsStatus
   * @apiDescription Lists all jobs, trained models and saved objects to view the relationship status between them
   *
   */
  router.get({
    path: '/api/ml/saved_objects/status',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        checkStatus
      } = (0, _saved_objects.checksFactory)(client, mlSavedObjectService);
      const status = await checkStatus();
      return response.ok({
        body: status
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/sync Sync job and trained models saved objects
   * @apiName SyncMLSavedObjects
   * @apiDescription Synchronizes saved objects for jobs and trained models. Saved objects will be created for items which are missing them,
   *                 and saved objects will be deleted for items which no longer exist.
   *                 Updates missing datafeed IDs in saved objects for datafeeds which exist, and
   *                 removes datafeed IDs for datafeeds which no longer exist.
   *
   */
  router.get({
    path: '/api/ml/saved_objects/sync',
    validate: {
      query: _saved_objects2.syncJobObjects
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics', 'access:ml:canCreateTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        simulate
      } = request.query;
      const {
        syncSavedObjects
      } = (0, _saved_objects.syncSavedObjectsFactory)(client, mlSavedObjectService);
      const savedObjects = await syncSavedObjects(simulate);
      return response.ok({
        body: savedObjects
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/initialize Create saved objects for all job and trained models
   * @apiName InitializeMLSavedObjects
   * @apiDescription Create saved objects for jobs and trained models which are missing them.
   *
   */
  router.get({
    path: '/api/ml/saved_objects/initialize',
    validate: {
      query: _saved_objects2.syncJobObjects
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics', 'access:ml:canCreateTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        simulate
      } = request.query;
      const {
        initSavedObjects
      } = (0, _saved_objects.syncSavedObjectsFactory)(client, mlSavedObjectService);
      const savedObjects = await initSavedObjects(simulate);
      return response.ok({
        body: savedObjects
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/sync_needed Check whether job and trained model saved objects need synchronizing
   * @apiName SyncCheck
   * @apiDescription Check whether job and trained model saved objects need synchronizing.
   *
   */
  router.post({
    path: '/api/ml/saved_objects/sync_check',
    validate: {
      body: _saved_objects2.syncCheckSchema
    },
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics', 'access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        mlSavedObjectType
      } = request.body;
      const {
        isSyncNeeded
      } = (0, _saved_objects.syncSavedObjectsFactory)(client, mlSavedObjectService);
      const result = await isSyncNeeded(mlSavedObjectType);
      return response.ok({
        body: {
          result
        }
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {post} /api/ml/saved_objects/update_jobs_spaces Update what spaces jobs are assigned to
   * @apiName UpdateJobsSpaces
   * @apiDescription Update a list of jobs to add and/or remove them from given spaces.
   *
   * @apiSchema (body) updateJobsSpaces
   */
  router.post({
    path: '/api/ml/saved_objects/update_jobs_spaces',
    validate: {
      body: _saved_objects2.updateJobsSpaces
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        jobType,
        jobIds,
        spacesToAdd,
        spacesToRemove
      } = request.body;
      const body = await mlSavedObjectService.updateJobsSpaces(jobType, jobIds, spacesToAdd, spacesToRemove);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {post} /api/ml/saved_objects/update_trained_models_spaces Update what spaces trained models are assigned to
   * @apiName UpdateTrainedModelsSpaces
   * @apiDescription Update a list of trained models to add and/or remove them from given spaces.
   *
   * @apiSchema (body) updateTrainedModelsSpaces
   */
  router.post({
    path: '/api/ml/saved_objects/update_trained_models_spaces',
    validate: {
      body: _saved_objects2.updateTrainedModelsSpaces
    },
    options: {
      tags: ['access:ml:canCreateTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        modelIds,
        spacesToAdd,
        spacesToRemove
      } = request.body;
      const body = await mlSavedObjectService.updateTrainedModelsSpaces(modelIds, spacesToAdd, spacesToRemove);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {post} /api/ml/saved_objects/remove_item_from_current_space Remove jobs or trained models from the current space
   * @apiName RemoveMLSpaceAwareItemsFromCurrentSpace
   * @apiDescription Remove a list of jobs or trained models from the current space.
   *
   * @apiSchema (body) itemsAndCurrentSpace
   */
  router.post({
    path: '/api/ml/saved_objects/remove_item_from_current_space',
    validate: {
      body: _saved_objects2.itemsAndCurrentSpace
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        mlSavedObjectType,
        ids
      } = request.body;
      const {
        getCurrentSpaceId
      } = (0, _spaces_utils.spacesUtilsProvider)(getSpaces, request);
      const currentSpaceId = await getCurrentSpaceId();
      if (currentSpaceId === null) {
        return response.ok({
          body: ids.map(id => ({
            [id]: {
              success: false,
              error: 'Cannot remove current space. Spaces plugin is disabled.'
            }
          }))
        });
      }
      if (mlSavedObjectType === 'trained-model') {
        const body = await mlSavedObjectService.updateTrainedModelsSpaces(ids, [],
        // spacesToAdd
        [currentSpaceId] // spacesToRemove
        );

        return response.ok({
          body
        });
      }
      const body = await mlSavedObjectService.updateJobsSpaces(mlSavedObjectType, ids, [],
      // spacesToAdd
      [currentSpaceId] // spacesToRemove
      );

      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/jobs_spaces Get all jobs and their spaces
   * @apiName JobsSpaces
   * @apiDescription List all jobs and their spaces.
   *
   */
  router.get({
    path: '/api/ml/saved_objects/jobs_spaces',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    response,
    mlSavedObjectService,
    client
  }) => {
    try {
      const {
        jobsSpaces
      } = (0, _saved_objects.checksFactory)(client, mlSavedObjectService);
      const jobsStatus = await jobsSpaces();
      return response.ok({
        body: jobsStatus
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {get} /api/ml/saved_objects/trained_models_spaces Get all trained models and their spaces
   * @apiName TrainedModelsSpaces
   * @apiDescription List all trained models and their spaces.
   *
   */
  router.get({
    path: '/api/ml/saved_objects/trained_models_spaces',
    validate: false,
    options: {
      tags: ['access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    response,
    mlSavedObjectService,
    client
  }) => {
    try {
      const {
        trainedModelsSpaces
      } = (0, _saved_objects.checksFactory)(client, mlSavedObjectService);
      const modelStatus = await trainedModelsSpaces();
      return response.ok({
        body: modelStatus
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup MLSavedObjects
   *
   * @api {post} /api/ml/saved_objects/can_delete_ml_space_aware_item Check whether user can delete a job or trained model
   * @apiName CanDeleteMLSpaceAwareItems
   * @apiDescription Check the user's ability to delete jobs or trained models. Returns whether they are able
   *                 to fully delete the job or trained model and whether they are able to remove it from
   *                 the current space.
   *                 Note, this is only for enabling UI controls. A user calling endpoints
   *                 directly will still be able to delete or remove the job or trained model from a space.
   *
   * @apiSchema (params) itemTypeSchema
   * @apiSchema (body) canDeleteMLSpaceAwareItemsSchema
   * @apiSuccessExample {json} Error-Response:
   * {
   *   "my_job": {
   *     "canDelete": false,
   *     "canRemoveFromSpace": true
   *   }
   * }
   *
   */
  router.post({
    path: '/api/ml/saved_objects/can_delete_ml_space_aware_item/{jobType}',
    validate: {
      params: _saved_objects2.itemTypeSchema,
      body: _saved_objects2.canDeleteMLSpaceAwareItemsSchema
    },
    options: {
      tags: ['access:ml:canGetJobs', 'access:ml:canGetDataFrameAnalytics', 'access:ml:canGetTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    request,
    response,
    mlSavedObjectService,
    client
  }) => {
    try {
      const {
        jobType
      } = request.params;
      const {
        ids
      } = request.body;
      const {
        canDeleteMLSpaceAwareItems
      } = (0, _saved_objects.checksFactory)(client, mlSavedObjectService);
      const body = await canDeleteMLSpaceAwareItems(request, jobType, ids, getSpaces !== undefined, resolveMlCapabilities);
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}