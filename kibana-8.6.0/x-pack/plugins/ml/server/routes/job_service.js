"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobServiceRoutes = jobServiceRoutes;
var _configSchema = require("@kbn/config-schema");
var _error_wrapper = require("../client/error_wrapper");
var _job_service_schema = require("./schemas/job_service_schema");
var _anomaly_detectors_schema = require("./schemas/anomaly_detectors_schema");
var _job_service = require("../models/job_service");
var _new_job = require("../models/job_service/new_job");
var _request_authorization = require("../lib/request_authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Routes for job service
 */
function jobServiceRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/force_start_datafeeds Start datafeeds
   * @apiName ForceStartDatafeeds
   * @apiDescription Starts one or more datafeeds
   *
   * @apiSchema (body) forceStartDatafeedSchema
   */
  router.post({
    path: '/api/ml/jobs/force_start_datafeeds',
    validate: {
      body: _job_service_schema.forceStartDatafeedSchema
    },
    options: {
      tags: ['access:ml:canStartStopDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        forceStartDatafeeds
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        datafeedIds,
        start,
        end
      } = request.body;
      const resp = await forceStartDatafeeds(datafeedIds, start, end);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/stop_datafeeds Stop datafeeds
   * @apiName StopDatafeeds
   * @apiDescription Stops one or more datafeeds
   *
   * @apiSchema (body) datafeedIdsSchema
   */
  router.post({
    path: '/api/ml/jobs/stop_datafeeds',
    validate: {
      body: _job_service_schema.datafeedIdsSchema
    },
    options: {
      tags: ['access:ml:canStartStopDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        stopDatafeeds
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        datafeedIds
      } = request.body;
      const resp = await stopDatafeeds(datafeedIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/delete_jobs Delete jobs
   * @apiName DeleteJobs
   * @apiDescription Deletes an existing anomaly detection job
   *
   * @apiSchema (body) jobIdsSchema
   */
  router.post({
    path: '/api/ml/jobs/delete_jobs',
    validate: {
      body: _job_service_schema.jobIdsSchema
    },
    options: {
      tags: ['access:ml:canDeleteJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        deleteJobs
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobIds
      } = request.body;
      const resp = await deleteJobs(jobIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/close_jobs Close jobs
   * @apiName CloseJobs
   * @apiDescription Closes one or more anomaly detection jobs
   *
   * @apiSchema (body) jobIdsSchema
   */
  router.post({
    path: '/api/ml/jobs/close_jobs',
    validate: {
      body: _job_service_schema.jobIdsSchema
    },
    options: {
      tags: ['access:ml:canCloseJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        closeJobs
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobIds
      } = request.body;
      const resp = await closeJobs(jobIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/reset_jobs Reset multiple jobs
   * @apiName ResetJobs
   * @apiDescription Resets one or more anomaly detection jobs
   *
   * @apiSchema (body) jobIdsSchema
   */
  router.post({
    path: '/api/ml/jobs/reset_jobs',
    validate: {
      body: _job_service_schema.jobIdsSchema
    },
    options: {
      tags: ['access:ml:canResetJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        resetJobs
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobIds
      } = request.body;
      const resp = await resetJobs(jobIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/force_stop_and_close_job Force stop and close job
   * @apiName ForceStopAndCloseJob
   * @apiDescription Force stops the datafeed and then force closes the anomaly detection job specified by job ID
   *
   * @apiSchema (body) jobIdSchema
   */
  router.post({
    path: '/api/ml/jobs/force_stop_and_close_job',
    validate: {
      body: _anomaly_detectors_schema.jobIdSchema
    },
    options: {
      tags: ['access:ml:canCloseJob', 'access:ml:canStartStopDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        forceStopAndCloseJob
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobId
      } = request.body;
      const resp = await forceStopAndCloseJob(jobId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/jobs_summary Jobs summary
   * @apiName JobsSummary
   * @apiDescription Returns a list of anomaly detection jobs, with summary level information for every job.
   *  For any supplied job IDs, full job information will be returned, which include the analysis configuration,
   *  job stats, datafeed stats, and calendars.
   *
   * @apiSchema (body) optionalJobIdsSchema
   *
   * @apiSuccess {Array} jobsList list of jobs. For any supplied job IDs, the job object will contain a fullJob property
   *    which includes the full configuration and stats for the job.
   */
  router.post({
    path: '/api/ml/jobs/jobs_summary',
    validate: {
      body: _job_service_schema.optionalJobIdsSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    context
  }) => {
    try {
      const alerting = await context.alerting;
      const {
        jobsSummary
      } = (0, _job_service.jobServiceProvider)(client, mlClient, alerting === null || alerting === void 0 ? void 0 : alerting.getRulesClient());
      const {
        jobIds
      } = request.body;
      const resp = await jobsSummary(jobIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/jobs_with_geo Jobs summary
   * @apiName JobsSummary
   * @apiDescription Returns a list of anomaly detection jobs with analysis config with fields supported by maps.
   *
   * @apiSuccess {Array} jobIds list of job ids.
   */
  router.get({
    path: '/api/ml/jobs/jobs_with_geo',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    response,
    context
  }) => {
    try {
      const alerting = await context.alerting;
      const {
        getJobIdsWithGeo
      } = (0, _job_service.jobServiceProvider)(client, mlClient, alerting === null || alerting === void 0 ? void 0 : alerting.getRulesClient());
      const resp = await getJobIdsWithGeo();
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/jobs_with_time_range Jobs with time range
   * @apiName JobsWithTimeRange
   * @apiDescription Creates a list of jobs with data about the job's time range
   *
   * @apiSchema (body) jobsWithTimerangeSchema
   */
  router.post({
    path: '/api/ml/jobs/jobs_with_time_range',
    validate: {
      body: _job_service_schema.jobsWithTimerangeSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    response
  }) => {
    try {
      const {
        jobsWithTimerange
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await jobsWithTimerange();
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/job_for_cloning Get job for cloning
   * @apiName GetJobForCloning
   * @apiDescription Get the job configuration with auto generated fields excluded for cloning
   *
   * @apiSchema (body) jobIdSchema
   */
  router.post({
    path: '/api/ml/jobs/job_for_cloning',
    validate: {
      body: _anomaly_detectors_schema.jobIdSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        getJobForCloning
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobId
      } = request.body;
      const resp = await getJobForCloning(jobId);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/jobs Create jobs list
   * @apiName CreateFullJobsList
   * @apiDescription Creates a list of jobs
   *
   * @apiSchema (body) optionalJobIdsSchema
   */
  router.post({
    path: '/api/ml/jobs/jobs',
    validate: {
      body: _job_service_schema.optionalJobIdsSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    context
  }) => {
    try {
      const alerting = await context.alerting;
      const {
        createFullJobsList
      } = (0, _job_service.jobServiceProvider)(client, mlClient, alerting === null || alerting === void 0 ? void 0 : alerting.getRulesClient());
      const {
        jobIds
      } = request.body;
      const resp = await createFullJobsList(jobIds);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {get} /api/ml/jobs/groups Get job groups
   * @apiName GetAllGroups
   * @apiDescription Returns array of group objects with job ids listed for each group
   */
  router.get({
    path: '/api/ml/jobs/groups',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    response
  }) => {
    try {
      const {
        getAllGroups
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await getAllGroups();
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/update_groups Update job groups
   * @apiName UpdateGroups
   * @apiDescription Updates 'groups' property of an anomaly detection job
   *
   * @apiSchema (body) updateGroupsSchema
   */
  router.post({
    path: '/api/ml/jobs/update_groups',
    validate: {
      body: _job_service_schema.updateGroupsSchema
    },
    options: {
      tags: ['access:ml:canUpdateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        updateGroups
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobs
      } = request.body;
      const resp = await updateGroups(jobs);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {get} /api/ml/jobs/blocking_jobs_tasks Get blocking job tasks
   * @apiName BlockingJobTasks
   * @apiDescription Gets the ids of deleting, resetting or reverting anomaly detection jobs
   */
  router.get({
    path: '/api/ml/jobs/blocking_jobs_tasks',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    response
  }) => {
    try {
      const {
        blockingJobTasks
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await blockingJobTasks();
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/jobs_exist Check whether jobs exists in current or any space
   * @apiName JobsExist
   * @apiDescription Checks if each of the jobs in the specified list of IDs exist.
   *                 If allSpaces is true, the check will look across all spaces.
   *
   * @apiSchema (body) jobsExistSchema
   */
  router.post({
    path: '/api/ml/jobs/jobs_exist',
    validate: {
      body: _job_service_schema.jobsExistSchema
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        jobsExist
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobIds,
        allSpaces
      } = request.body;
      const resp = await jobsExist(jobIds, allSpaces);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {get} /api/ml/jobs/new_job_caps/:indexPattern Get new job capabilities
   * @apiName NewJobCaps
   * @apiDescription Retrieve the capabilities of fields for indices
   */
  router.get({
    path: '/api/ml/jobs/new_job_caps/{indexPattern}',
    validate: {
      params: _configSchema.schema.object({
        indexPattern: _configSchema.schema.string()
      }),
      query: _configSchema.schema.maybe(_configSchema.schema.object({
        rollup: _configSchema.schema.maybe(_configSchema.schema.string())
      }))
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response,
    getDataViewsService
  }) => {
    try {
      var _request$query;
      const {
        indexPattern
      } = request.params;
      const isRollup = ((_request$query = request.query) === null || _request$query === void 0 ? void 0 : _request$query.rollup) === 'true';
      const {
        newJobCaps
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const dataViewsService = await getDataViewsService();
      const resp = await newJobCaps(indexPattern, isRollup, dataViewsService);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/new_job_line_chart Get job line chart data
   * @apiName NewJobLineChart
   * @apiDescription Returns line chart data for anomaly detection job
   *
   * @apiSchema (body) chartSchema
   */
  router.post({
    path: '/api/ml/jobs/new_job_line_chart',
    validate: {
      body: _configSchema.schema.object(_job_service_schema.basicChartSchema)
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        indexPatternTitle,
        timeField,
        start,
        end,
        intervalMs,
        query,
        aggFieldNamePairs,
        splitFieldName,
        splitFieldValue,
        runtimeMappings,
        indicesOptions
      } = request.body;
      const {
        newJobLineChart
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await newJobLineChart(indexPatternTitle, timeField, start, end, intervalMs, query, aggFieldNamePairs, splitFieldName, splitFieldValue, runtimeMappings, indicesOptions);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/new_job_population_chart Get population job chart data
   * @apiName NewJobPopulationChart
   * @apiDescription Returns population job chart data
   *
   * @apiSchema (body) chartSchema
   */
  router.post({
    path: '/api/ml/jobs/new_job_population_chart',
    validate: {
      body: _configSchema.schema.object(_job_service_schema.populationChartSchema)
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        indexPatternTitle,
        timeField,
        start,
        end,
        intervalMs,
        query,
        aggFieldNamePairs,
        splitFieldName,
        runtimeMappings,
        indicesOptions
      } = request.body;
      const {
        newJobPopulationChart
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await newJobPopulationChart(indexPatternTitle, timeField, start, end, intervalMs, query, aggFieldNamePairs, splitFieldName, runtimeMappings, indicesOptions);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {get} /api/ml/jobs/all_jobs_and_group_ids Get all job and group IDs
   * @apiName GetAllJobAndGroupIds
   * @apiDescription Returns a list of all job IDs and all group IDs
   */
  router.get({
    path: '/api/ml/jobs/all_jobs_and_group_ids',
    validate: false,
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    response
  }) => {
    try {
      const {
        getAllJobAndGroupIds
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const resp = await getAllJobAndGroupIds();
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/look_back_progress Get lookback progress
   * @apiName GetLookBackProgress
   * @apiDescription Returns current progress of anomaly detection job
   *
   * @apiSchema (body) lookBackProgressSchema
   */
  router.post({
    path: '/api/ml/jobs/look_back_progress',
    validate: {
      body: _configSchema.schema.object(_job_service_schema.lookBackProgressSchema)
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        getLookBackProgress
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobId,
        start,
        end
      } = request.body;
      const resp = await getLookBackProgress(jobId, start, end);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/categorization_field_examples Get categorization field examples
   * @apiName ValidateCategoryExamples
   * @apiDescription Validates category examples
   *
   * @apiSchema (body) categorizationFieldExamplesSchema
   */
  router.post({
    path: '/api/ml/jobs/categorization_field_examples',
    validate: {
      body: _configSchema.schema.object(_job_service_schema.categorizationFieldExamplesSchema)
    },
    options: {
      tags: ['access:ml:canCreateJob']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        validateCategoryExamples
      } = (0, _new_job.categorizationExamplesProvider)(client);
      const {
        indexPatternTitle,
        timeField,
        query,
        size,
        field,
        start,
        end,
        analyzer,
        runtimeMappings,
        indicesOptions
      } = request.body;
      const resp = await validateCategoryExamples(indexPatternTitle, query, size, field, timeField, start, end, analyzer, runtimeMappings, indicesOptions);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/top_categories Get top categories
   * @apiName TopCategories
   * @apiDescription Returns list of top categories
   *
   * @apiSchema (body) topCategoriesSchema
   */
  router.post({
    path: '/api/ml/jobs/top_categories',
    validate: {
      body: _configSchema.schema.object(_job_service_schema.topCategoriesSchema)
    },
    options: {
      tags: ['access:ml:canGetJobs']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        topCategories
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobId,
        count
      } = request.body;
      const resp = await topCategories(jobId, count);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/datafeed_preview Get datafeed preview
   * @apiName DatafeedPreview
   * @apiDescription Returns a preview of the datafeed search
   *
   * @apiSchema (body) datafeedPreviewSchema
   */
  router.post({
    path: '/api/ml/jobs/datafeed_preview',
    validate: {
      body: _job_service_schema.datafeedPreviewSchema
    },
    options: {
      tags: ['access:ml:canPreviewDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        datafeedId,
        job,
        datafeed
      } = request.body;
      const payload = datafeedId !== undefined ? {
        datafeed_id: datafeedId
      } : {
        body: {
          job_config: job,
          datafeed_config: datafeed
        }
      };
      const body = await mlClient.previewDatafeed(payload, {
        ...(0, _request_authorization.getAuthorizationHeader)(request),
        maxRetries: 0
      });
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/revert_model_snapshot Revert model snapshot
   * @apiName RevertModelSnapshot
   * @apiDescription Reverts a job to a specified snapshot. Also allows the job to replayed to a specified date and to auto create calendars to skip analysis of specified date ranges
   *
   * @apiSchema (body) revertModelSnapshotSchema
   */
  router.post({
    path: '/api/ml/jobs/revert_model_snapshot',
    validate: {
      body: _job_service_schema.revertModelSnapshotSchema
    },
    options: {
      tags: ['access:ml:canCreateJob', 'access:ml:canStartStopDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const {
        revertModelSnapshot
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const {
        jobId,
        snapshotId,
        replay,
        end,
        deleteInterveningResults,
        calendarEvents
      } = request.body;
      const resp = await revertModelSnapshot(jobId, snapshotId, replay, end, deleteInterveningResults, calendarEvents);
      return response.ok({
        body: resp
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));

  /**
   * @apiGroup JobService
   *
   * @api {post} /api/ml/jobs/bulk_create Bulk create jobs and datafeeds
   * @apiName BulkCreateJobs
   * @apiDescription Bulk create jobs and datafeeds.
   *
   * @apiSchema (body) bulkCreateSchema
   */
  router.post({
    path: '/api/ml/jobs/bulk_create',
    validate: {
      body: _job_service_schema.bulkCreateSchema
    },
    options: {
      tags: ['access:ml:canPreviewDatafeed']
    }
  }, routeGuard.fullLicenseAPIGuard(async ({
    client,
    mlClient,
    request,
    response
  }) => {
    try {
      const bulkJobs = request.body;
      const {
        bulkCreate
      } = (0, _job_service.jobServiceProvider)(client, mlClient);
      const jobs = Array.isArray(bulkJobs) ? bulkJobs : [bulkJobs];
      const body = await bulkCreate(jobs, (0, _request_authorization.getAuthorizationHeader)(request));
      return response.ok({
        body
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}