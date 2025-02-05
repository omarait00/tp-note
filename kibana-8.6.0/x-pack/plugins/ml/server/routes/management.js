"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.managementRoutes = managementRoutes;
var _error_wrapper = require("../client/error_wrapper");
var _management_schema = require("./schemas/management_schema");
var _job_service = require("../models/job_service");
var _saved_objects = require("../saved_objects");
var _data_frame_analytics = require("../../common/constants/data_frame_analytics");
var _trained_models = require("../../common/constants/trained_models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for management service
 */
function managementRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup Management
   *
   * @api {get} /api/ml/management/list/:listType Management list
   * @apiName ManagementList
   * @apiDescription Returns a list of anomaly detection jobs, data frame analytics jobs or trained models
   *
   * @apiSchema (params) listTypeSchema
   *
   */
  router.get({
    path: '/api/ml/management/list/{listType}',
    validate: {
      params: _management_schema.listTypeSchema
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canCreateDataFrameAnalytics', 'access:ml:canCreateTrainedModels']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    mlSavedObjectService
  }) => {
    try {
      const {
        listType
      } = request.params;
      const {
        jobsSpaces,
        trainedModelsSpaces
      } = (0, _saved_objects.checksFactory)(client, mlSavedObjectService);
      switch (listType) {
        case 'anomaly-detector':
          const {
            jobsSummary
          } = (0, _job_service.jobServiceProvider)(client, mlClient);
          const [jobs, adJobStatus] = await Promise.all([jobsSummary(), jobsSpaces()]);
          const adJobsWithSpaces = jobs.map(job => {
            var _adJobStatus$anomaly;
            return {
              id: job.id,
              description: job.description,
              jobState: job.jobState,
              datafeedState: job.datafeedState,
              spaces: (_adJobStatus$anomaly = adJobStatus['anomaly-detector'][job.id]) !== null && _adJobStatus$anomaly !== void 0 ? _adJobStatus$anomaly : []
            };
          });
          return response.ok({
            body: adJobsWithSpaces
          });
        case 'data-frame-analytics':
          const [{
            data_frame_analytics: dfaJobs
          }, {
            data_frame_analytics: dfaJobsStats
          }, dfaJobStatus] = await Promise.all([mlClient.getDataFrameAnalytics({
            size: 10000
          }), mlClient.getDataFrameAnalyticsStats({
            size: 10000
          }), jobsSpaces()]);
          const dfaStatsMapped = dfaJobsStats.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
          }, {});
          const dfaJobsWithSpaces = dfaJobs.map(j => {
            var _j$description, _Object$keys$, _dfaStatsMapped$id$st, _dfaStatsMapped$id, _dfaJobStatus$dataFr;
            const id = j.id;
            return {
              id,
              description: (_j$description = j.description) !== null && _j$description !== void 0 ? _j$description : '',
              source_index: j.source.index,
              // esclient types are wrong
              dest_index: j.dest.index,
              job_type: (_Object$keys$ = Object.keys(j.analysis)[0]) !== null && _Object$keys$ !== void 0 ? _Object$keys$ : '',
              state: (_dfaStatsMapped$id$st = (_dfaStatsMapped$id = dfaStatsMapped[id]) === null || _dfaStatsMapped$id === void 0 ? void 0 : _dfaStatsMapped$id.state) !== null && _dfaStatsMapped$id$st !== void 0 ? _dfaStatsMapped$id$st : '',
              spaces: (_dfaJobStatus$dataFr = dfaJobStatus['data-frame-analytics'][id]) !== null && _dfaJobStatus$dataFr !== void 0 ? _dfaJobStatus$dataFr : []
            };
          });
          return response.ok({
            body: dfaJobsWithSpaces
          });
        case 'trained-model':
          const [{
            trained_model_configs: models
          }, {
            trained_model_stats: modelsStats
          }, modelSpaces] = await Promise.all([mlClient.getTrainedModels(), mlClient.getTrainedModelsStats(), trainedModelsSpaces()]);
          const modelStatsMapped = modelsStats.reduce((acc, cur) => {
            acc[cur.model_id] = cur;
            return acc;
          }, {});
          const modelsWithSpaces = models.map(m => {
            var _m$description, _modelStatsMapped$id$, _modelStatsMapped$id$2, _modelSpaces$trainedM;
            const id = m.model_id;
            return {
              id,
              description: (_m$description = m.description) !== null && _m$description !== void 0 ? _m$description : '',
              state: (_modelStatsMapped$id$ = (_modelStatsMapped$id$2 = modelStatsMapped[id].deployment_stats) === null || _modelStatsMapped$id$2 === void 0 ? void 0 : _modelStatsMapped$id$2.state) !== null && _modelStatsMapped$id$ !== void 0 ? _modelStatsMapped$id$ : '',
              type: [m.model_type, ...Object.keys(m.inference_config), ...(m.tags.includes(_data_frame_analytics.BUILT_IN_MODEL_TAG) ? [_trained_models.BUILT_IN_MODEL_TYPE] : [])],
              spaces: (_modelSpaces$trainedM = modelSpaces.trainedModels[id]) !== null && _modelSpaces$trainedM !== void 0 ? _modelSpaces$trainedM : []
            };
          });
          return response.ok({
            body: modelsWithSpaces
          });
        default:
          // this should never be hit because of the route's schema checks.
          throw Error('Specified listType not supported');
      }
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}