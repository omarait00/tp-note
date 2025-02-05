"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlClient = getMlClient;
var _util = require("../../saved_objects/util");
var _search = require("./search");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getMlClient(client, mlSavedObjectService) {
  const mlClient = client.asInternalUser.ml;
  async function jobIdsCheck(jobType, p, allowWildcards = false) {
    const jobIds = jobType === 'anomaly-detector' ? getADJobIdsFromRequest(p) : getDFAJobIdsFromRequest(p);
    if (jobIds.length) {
      await checkJobIds(jobType, jobIds, allowWildcards);
    }
  }
  async function checkJobIds(jobType, jobIds, allowWildcards = false) {
    const filteredJobIds = await mlSavedObjectService.filterJobIdsForSpace(jobType, jobIds);
    let missingIds = jobIds.filter(j => filteredJobIds.indexOf(j) === -1);
    if (allowWildcards === true && missingIds.join().match('\\*') !== null) {
      // filter out wildcard ids from the error
      missingIds = missingIds.filter(id => id.match('\\*') === null);
    }
    if (missingIds.length) {
      throw new _errors.MLJobNotFound(`No known job with id '${missingIds.join(',')}'`);
    }
  }
  async function groupIdsCheck(p, allJobs, filteredJobIds) {
    // if job ids have been specified, we need to check in case any of them are actually
    // group ids, which will be unknown to the saved objects.
    // find which ids are not group ids and check them.
    const ids = getADJobIdsFromRequest(p);
    if (ids.length) {
      // find all groups from unfiltered jobs
      const responseGroupIds = [...new Set(allJobs.map(j => {
        var _j$groups;
        return (_j$groups = j.groups) !== null && _j$groups !== void 0 ? _j$groups : [];
      }).flat())];

      // work out which ids requested are actually groups and which are jobs
      const requestedGroupIds = [];
      const requestedJobIds = [];
      ids.forEach(id => {
        if (responseGroupIds.includes(id)) {
          requestedGroupIds.push(id);
        } else {
          requestedJobIds.push(id);
        }
      });

      // find all groups from filtered jobs
      const groupIdsFromFilteredJobs = [...new Set(allJobs.filter(j => filteredJobIds.includes(j.job_id)).map(j => {
        var _j$groups2;
        return (_j$groups2 = j.groups) !== null && _j$groups2 !== void 0 ? _j$groups2 : [];
      }).flat())];
      const groupsIdsThatDidNotMatch = requestedGroupIds.filter(id => groupIdsFromFilteredJobs.includes(id) === false);
      if (groupsIdsThatDidNotMatch.length) {
        // if there are group ids which were requested but didn't
        // exist in filtered jobs, list them in an error
        throw new _errors.MLJobNotFound(`No known job with id '${groupsIdsThatDidNotMatch.join(',')}'`);
      }

      // check the remaining jobs ids
      if (requestedJobIds.length) {
        await checkJobIds('anomaly-detector', requestedJobIds, true);
      }
    }
  }
  async function groupIdsCheckFromJobStats(filteredJobIds, ...p) {
    // similar to groupIdsCheck above, however we need to load the jobs first to get the groups information
    const ids = filterAll(getADJobIdsFromRequest(p));
    if (ids.length) {
      const body = await mlClient.getJobs(...p);
      await groupIdsCheck(p, body.jobs, filteredJobIds);
    }
  }
  async function datafeedIdsCheck(p, allowWildcards = false) {
    const datafeedIds = getDatafeedIdsFromRequest(p);
    if (datafeedIds.length) {
      const filteredDatafeedIds = await mlSavedObjectService.filterDatafeedIdsForSpace(datafeedIds);
      let missingIds = datafeedIds.filter(j => filteredDatafeedIds.indexOf(j) === -1);
      if (allowWildcards === true && missingIds.join().match('\\*') !== null) {
        // filter out wildcard ids from the error
        missingIds = missingIds.filter(id => id.match('\\*') === null);
      }
      if (missingIds.length) {
        throw new _errors.MLJobNotFound(`No known datafeed with id '${missingIds.join(',')}'`);
      }
    }
  }
  async function modelIdsCheck(p, allowWildcards = false) {
    const modelIds = filterAll(getModelIdsFromRequest(p));
    if (modelIds.length) {
      await checkModelIds(modelIds, allowWildcards);
    }
  }
  async function checkModelIds(modelIds, allowWildcards = false) {
    const filteredModelIds = await mlSavedObjectService.filterTrainedModelIdsForSpace(modelIds);
    let missingIds = modelIds.filter(j => filteredModelIds.indexOf(j) === -1);
    if (allowWildcards === true && missingIds.join().match('\\*') !== null) {
      // filter out wildcard ids from the error
      missingIds = missingIds.filter(id => id.match('\\*') === null);
    }
    if (missingIds.length) {
      throw new _errors.MLModelNotFound(`No known model with id '${missingIds.join(',')}'`);
    }
  }

  // @ts-expect-error promise and TransportRequestPromise are incompatible. missing abort
  return {
    async closeJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.closeJob(...p);
    },
    async deleteCalendar(...p) {
      return mlClient.deleteCalendar(...p);
    },
    async deleteCalendarEvent(...p) {
      return mlClient.deleteCalendarEvent(...p);
    },
    async deleteCalendarJob(...p) {
      return mlClient.deleteCalendarJob(...p);
    },
    async deleteDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      const resp = await mlClient.deleteDataFrameAnalytics(...p);
      // don't delete the job saved object as the real job will not be
      // deleted initially and could still fail.
      return resp;
    },
    async deleteDatafeed(...p) {
      await datafeedIdsCheck(p);
      const resp = await mlClient.deleteDatafeed(...p);
      const [datafeedId] = getDatafeedIdsFromRequest(p);
      if (datafeedId !== undefined) {
        await mlSavedObjectService.deleteDatafeed(datafeedId);
      }
      return resp;
    },
    async deleteExpiredData(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteExpiredData(...p);
    },
    async deleteFilter(...p) {
      return mlClient.deleteFilter(...p);
    },
    async deleteForecast(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteForecast(...p);
    },
    async deleteJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      const resp = await mlClient.deleteJob(...p);
      // don't delete the job saved object as the real job will not be
      // deleted initially and could still fail.
      return resp;
    },
    async deleteModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.deleteModelSnapshot(...p);
    },
    async deleteTrainedModel(...p) {
      await modelIdsCheck(p);
      return mlClient.deleteTrainedModel(...p);
    },
    async estimateModelMemory(...p) {
      return mlClient.estimateModelMemory(...p);
    },
    async evaluateDataFrame(...p) {
      return mlClient.evaluateDataFrame(...p);
    },
    async explainDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.explainDataFrameAnalytics(...p);
    },
    async flushJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.flushJob(...p);
    },
    async forecast(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.forecast(...p);
    },
    async getBuckets(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getBuckets(...p);
    },
    async getCalendarEvents(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getCalendarEvents(...p);
    },
    async getCalendars(...p) {
      var _options$meta;
      const [params, options = {}] = p;
      const meta = (_options$meta = options.meta) !== null && _options$meta !== void 0 ? _options$meta : false;
      const response = await mlClient.getCalendars(params, {
        ...options,
        meta: true
      });
      const {
        jobs: allJobs
      } = await mlClient.getJobs();
      const allJobIds = allJobs.map(j => j.job_id);

      // flatten the list of all jobs ids and check which ones are valid
      const calJobIds = [...new Set(response.body.calendars.map(c => c.job_ids).flat())];
      // find groups by getting the cal job ids which aren't real jobs.
      const groups = calJobIds.filter(j => allJobIds.includes(j) === false);

      // get list of calendar jobs which are allowed in this space
      const filteredJobIds = await mlSavedObjectService.filterJobIdsForSpace('anomaly-detector', calJobIds);
      const calendars = response.body.calendars.map(c => ({
        ...c,
        job_ids: c.job_ids.filter(id => filteredJobIds.includes(id) || groups.includes(id)),
        total_job_count: calJobIds.length
      }));
      const enhancedBody = {
        ...response.body,
        calendars
      };
      if (meta) {
        return {
          ...response,
          body: enhancedBody
        };
      } else {
        return enhancedBody;
      }
    },
    async getCategories(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getCategories(...p);
    },
    async getDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p, true);
      try {
        var _options$meta2;
        const [params, options = {}] = p;
        const meta = (_options$meta2 = options.meta) !== null && _options$meta2 !== void 0 ? _options$meta2 : false;
        const response = await mlClient.getDataFrameAnalytics(params, {
          ...options,
          meta: true
        });
        const jobs = await mlSavedObjectService.filterJobsForSpace('data-frame-analytics',
        // @ts-expect-error @elastic-elasticsearch Data frame types incomplete
        response.body.data_frame_analytics, 'id');
        const enhancedBody = {
          ...response.body,
          count: jobs.length,
          data_frame_analytics: jobs
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body;
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error;
      }
    },
    async getDataFrameAnalyticsStats(...p) {
      // this should use DataFrameAnalyticsStats, but needs a refactor to move DataFrameAnalyticsStats to common
      await jobIdsCheck('data-frame-analytics', p, true);
      try {
        var _options$meta3;
        const [params, options = {}] = p;
        const meta = (_options$meta3 = options.meta) !== null && _options$meta3 !== void 0 ? _options$meta3 : false;
        const response = await mlClient.getDataFrameAnalyticsStats(params, {
          ...options,
          meta: true
        });
        const jobs = await mlSavedObjectService.filterJobsForSpace('data-frame-analytics', response.body.data_frame_analytics, 'id');
        const enhancedBody = {
          ...response.body,
          count: jobs.length,
          data_frame_analytics: jobs
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body2;
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body2 = error.body) !== null && _error$body2 !== void 0 ? _error$body2 : error;
      }
    },
    async getDatafeedStats(...p) {
      await datafeedIdsCheck(p, true);
      try {
        var _options$meta4;
        const [params, options = {}] = p;
        const meta = (_options$meta4 = options.meta) !== null && _options$meta4 !== void 0 ? _options$meta4 : false;
        const response = await mlClient.getDatafeedStats(params, {
          ...options,
          meta: true
        });
        const datafeeds = await mlSavedObjectService.filterDatafeedsForSpace('anomaly-detector', response.body.datafeeds, 'datafeed_id');
        const enhancedBody = {
          ...response.body,
          count: datafeeds.length,
          datafeeds
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body3;
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body3 = error.body) !== null && _error$body3 !== void 0 ? _error$body3 : error;
      }
    },
    async getDatafeeds(...p) {
      await datafeedIdsCheck(p, true);
      try {
        var _options$meta5;
        const [params, options = {}] = p;
        const meta = (_options$meta5 = options.meta) !== null && _options$meta5 !== void 0 ? _options$meta5 : false;
        const response = await mlClient.getDatafeeds(params, {
          ...options,
          meta: true
        });
        const datafeeds = await mlSavedObjectService.filterDatafeedsForSpace('anomaly-detector', response.body.datafeeds, 'datafeed_id');
        const enhancedBody = {
          ...response.body,
          count: datafeeds.length,
          datafeeds
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body4;
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body4 = error.body) !== null && _error$body4 !== void 0 ? _error$body4 : error;
      }
    },
    async getFilters(...p) {
      return mlClient.getFilters(...p);
    },
    async getInfluencers(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getInfluencers(...p);
    },
    async getJobStats(...p) {
      try {
        var _options$meta6;
        const [params, options = {}] = p;
        const meta = (_options$meta6 = options.meta) !== null && _options$meta6 !== void 0 ? _options$meta6 : false;
        const response = await mlClient.getJobStats(params, {
          ...options,
          meta: true
        });
        const jobs = await mlSavedObjectService.filterJobsForSpace('anomaly-detector', response.body.jobs, 'job_id');
        await groupIdsCheckFromJobStats(jobs.map(j => j.job_id), ...p);
        const enhancedBody = {
          ...response.body,
          count: jobs.length,
          jobs
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body5;
        if (error instanceof _errors.MLJobNotFound) {
          throw error;
        }
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body5 = error.body) !== null && _error$body5 !== void 0 ? _error$body5 : error;
      }
    },
    async getJobs(...p) {
      try {
        var _options$meta7;
        const [params, options = {}] = p;
        const meta = (_options$meta7 = options.meta) !== null && _options$meta7 !== void 0 ? _options$meta7 : false;
        const response = await mlClient.getJobs(params, {
          ...options,
          meta: true
        });
        const jobs = await mlSavedObjectService.filterJobsForSpace('anomaly-detector', response.body.jobs, 'job_id');
        await groupIdsCheck(p, response.body.jobs, jobs.map(j => j.job_id));
        const enhancedBody = {
          ...response.body,
          count: jobs.length,
          jobs
        };
        if (meta) {
          return {
            ...response,
            body: enhancedBody
          };
        } else {
          return enhancedBody;
        }
      } catch (error) {
        var _error$body6;
        if (error instanceof _errors.MLJobNotFound) {
          throw error;
        }
        if (error.statusCode === 404) {
          throw new _errors.MLJobNotFound(error.body.error.reason);
        }
        throw (_error$body6 = error.body) !== null && _error$body6 !== void 0 ? _error$body6 : error;
      }
    },
    async getModelSnapshots(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getModelSnapshots(...p);
    },
    async getOverallBuckets(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getOverallBuckets(...p);
    },
    async getRecords(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.getRecords(...p);
    },
    async getTrainedModels(...p) {
      await modelIdsCheck(p, true);
      try {
        const body = await mlClient.getTrainedModels(...p);
        const models = await mlSavedObjectService.filterTrainedModelsForSpace(body.trained_model_configs, 'model_id');
        return {
          ...body,
          count: models.length,
          trained_model_configs: models
        };
      } catch (error) {
        var _error$body7;
        if (error.statusCode === 404) {
          throw new _errors.MLModelNotFound(error.body.error.reason);
        }
        throw (_error$body7 = error.body) !== null && _error$body7 !== void 0 ? _error$body7 : error;
      }
    },
    async getTrainedModelsStats(...p) {
      await modelIdsCheck(p, true);
      try {
        const body = await mlClient.getTrainedModelsStats(...p);
        const models = await mlSavedObjectService.filterTrainedModelsForSpace(body.trained_model_stats, 'model_id');
        return {
          ...body,
          count: models.length,
          trained_model_stats: models
        };
      } catch (error) {
        var _error$body8;
        if (error.statusCode === 404) {
          throw new _errors.MLModelNotFound(error.body.error.reason);
        }
        throw (_error$body8 = error.body) !== null && _error$body8 !== void 0 ? _error$body8 : error;
      }
    },
    async startTrainedModelDeployment(...p) {
      await modelIdsCheck(p);
      return mlClient.startTrainedModelDeployment(...p);
    },
    async updateTrainedModelDeployment(...p) {
      await modelIdsCheck(p);
      const {
        model_id: modelId,
        number_of_allocations: numberOfAllocations
      } = p[0];
      return client.asInternalUser.transport.request({
        method: 'POST',
        path: `/_ml/trained_models/${modelId}/deployment/_update`,
        body: {
          number_of_allocations: numberOfAllocations
        }
      });
    },
    async stopTrainedModelDeployment(...p) {
      await modelIdsCheck(p);
      return mlClient.stopTrainedModelDeployment(...p);
    },
    async inferTrainedModel(...p) {
      await modelIdsCheck(p);
      // Temporary workaround for the incorrect inferTrainedModelDeployment function in the esclient
      if (
      // @ts-expect-error TS complains it's always false
      p.length === 0 || p[0] === undefined) {
        // Temporary generic error message. This should never be triggered
        // but is added for type correctness below
        throw new Error('Incorrect arguments supplied');
      }
      // @ts-expect-error body doesn't exist in the type
      const {
        model_id: id,
        body,
        query: querystring
      } = p[0];
      return client.asInternalUser.transport.request({
        method: 'POST',
        path: `/_ml/trained_models/${id}/_infer`,
        body,
        querystring
      }, p[1]);
    },
    async info(...p) {
      return mlClient.info(...p);
    },
    async openJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.openJob(...p);
    },
    async postCalendarEvents(...p) {
      return mlClient.postCalendarEvents(...p);
    },
    async postData(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.postData(...p);
    },
    async previewDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.previewDatafeed(...p);
    },
    async putCalendar(...p) {
      return mlClient.putCalendar(...p);
    },
    async putCalendarJob(...p) {
      return mlClient.putCalendarJob(...p);
    },
    async putDataFrameAnalytics(...p) {
      const resp = await mlClient.putDataFrameAnalytics(...p);
      const [analyticsId] = getDFAJobIdsFromRequest(p);
      if (analyticsId !== undefined) {
        await mlSavedObjectService.createDataFrameAnalyticsJob(analyticsId);
      }
      return resp;
    },
    async putDatafeed(...p) {
      const resp = await mlClient.putDatafeed(...p);
      const [datafeedId] = getDatafeedIdsFromRequest(p);
      const jobId = getJobIdFromBody(p);
      if (datafeedId !== undefined && jobId !== undefined) {
        await mlSavedObjectService.addDatafeed(datafeedId, jobId);
      }
      return resp;
    },
    async putFilter(...p) {
      return mlClient.putFilter(...p);
    },
    async putJob(...p) {
      const resp = await mlClient.putJob(...p);
      const [jobId] = getADJobIdsFromRequest(p);
      if (jobId !== undefined) {
        await mlSavedObjectService.createAnomalyDetectionJob(jobId);
      }
      return resp;
    },
    async putTrainedModel(...p) {
      const resp = await mlClient.putTrainedModel(...p);
      const [modelId] = getModelIdsFromRequest(p);
      if (modelId !== undefined) {
        const model = p[0].body;
        const job = (0, _util.getJobDetailsFromTrainedModel)(model);
        await mlSavedObjectService.createTrainedModel(modelId, job);
      }
      return resp;
    },
    async revertModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.revertModelSnapshot(...p);
    },
    async setUpgradeMode(...p) {
      return mlClient.setUpgradeMode(...p);
    },
    async startDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.startDataFrameAnalytics(...p);
    },
    async startDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.startDatafeed(...p);
    },
    async stopDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.stopDataFrameAnalytics(...p);
    },
    async stopDatafeed(...p) {
      await datafeedIdsCheck(p);
      return mlClient.stopDatafeed(...p);
    },
    async updateDataFrameAnalytics(...p) {
      await jobIdsCheck('data-frame-analytics', p);
      return mlClient.updateDataFrameAnalytics(...p);
    },
    async updateDatafeed(...p) {
      await datafeedIdsCheck(p);

      // Temporary workaround for the incorrect updateDatafeed function in the esclient
      if (
      // @ts-expect-error TS complains it's always false
      p.length === 0 || p[0] === undefined) {
        // Temporary generic error message. This should never be triggered
        // but is added for type correctness below
        throw new Error('Incorrect arguments supplied');
      }
      // @ts-expect-error body doesn't exist in the type
      const {
        datafeed_id: id,
        body
      } = p[0];
      return client.asInternalUser.transport.request({
        method: 'POST',
        path: `/_ml/datafeeds/${id}/_update`,
        body
      }, p[1]);

      // this should be reinstated once https://github.com/elastic/elasticsearch-js/issues/1601
      // is fixed
      // return mlClient.updateDatafeed(...p);
    },

    async updateFilter(...p) {
      return mlClient.updateFilter(...p);
    },
    async updateJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.updateJob(...p);
    },
    async resetJob(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.resetJob(...p);
    },
    async updateModelSnapshot(...p) {
      await jobIdsCheck('anomaly-detector', p);
      return mlClient.updateModelSnapshot(...p);
    },
    async validate(...p) {
      return mlClient.validate(...p);
    },
    async validateDetector(...p) {
      return mlClient.validateDetector(...p);
    },
    async getMemoryStats(...p) {
      return mlClient.getMemoryStats(...p);
    },
    ...(0, _search.searchProvider)(client, mlSavedObjectService)
  };
}
function getDFAJobIdsFromRequest([params]) {
  var _params$id;
  const ids = params === null || params === void 0 ? void 0 : (_params$id = params.id) === null || _params$id === void 0 ? void 0 : _params$id.split(',');
  return ids || [];
}
function getModelIdsFromRequest([params]) {
  const id = params === null || params === void 0 ? void 0 : params.model_id;
  const ids = Array.isArray(id) ? id : id === null || id === void 0 ? void 0 : id.split(',');
  return ids || [];
}
function getADJobIdsFromRequest([params]) {
  const ids = typeof (params === null || params === void 0 ? void 0 : params.job_id) === 'string' ? params === null || params === void 0 ? void 0 : params.job_id.split(',') : params === null || params === void 0 ? void 0 : params.job_id;
  return ids || [];
}
function getDatafeedIdsFromRequest([params]) {
  const ids = typeof (params === null || params === void 0 ? void 0 : params.datafeed_id) === 'string' ? params === null || params === void 0 ? void 0 : params.datafeed_id.split(',') : params === null || params === void 0 ? void 0 : params.datafeed_id;
  return ids || [];
}
function getJobIdFromBody(p) {
  var _params$body;
  const [params] = p;
  return params === null || params === void 0 ? void 0 : (_params$body = params.body) === null || _params$body === void 0 ? void 0 : _params$body.job_id;
}
function filterAll(ids) {
  // if _all has been passed as the only id, remove it and assume it was
  // an empty list, so all items are returned.
  // if _all is one of many ids, the endpoint should look for
  // something called _all, which will subsequently fail.
  return ids.length === 1 && ids[0] === '_all' ? [] : ids;
}