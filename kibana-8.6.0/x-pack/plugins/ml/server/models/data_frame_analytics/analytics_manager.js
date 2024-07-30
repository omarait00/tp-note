"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnalyticsManager = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _data_frame_analytics = require("../../../common/constants/data_frame_analytics");
var _analytics_utils = require("../../../common/util/analytics_utils");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AnalyticsManager {
  constructor(_mlClient, _client) {
    (0, _defineProperty2.default)(this, "_trainedModels", []);
    (0, _defineProperty2.default)(this, "_jobs", []);
    this._mlClient = _mlClient;
    this._client = _client;
  }
  async initData() {
    const [models, jobs] = await Promise.all([this._mlClient.getTrainedModels(), this._mlClient.getDataFrameAnalytics({
      size: 1000
    })]);
    this._trainedModels = models.trained_model_configs;
    this._jobs = jobs.data_frame_analytics;
  }
  isDuplicateElement(analyticsId, elements) {
    let isDuplicate = false;
    elements.forEach(elem => {
      if ((0, _types.isAnalyticsMapNodeElement)(elem) && elem.data.label === analyticsId && elem.data.type === _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  }
  async getIndexData(index) {
    const indexData = await this._client.asInternalUser.indices.get({
      index
    });
    return indexData;
  }
  async getTransformData(transformId) {
    const transform = await this._client.asInternalUser.transform.getTransform({
      transform_id: transformId
    });
    const transformData = transform === null || transform === void 0 ? void 0 : transform.transforms[0];
    return transformData;
  }
  findJobModel(analyticsId, analyticsCreateTime) {
    return this._trainedModels.find(model => {
      var _model$metadata, _model$metadata$analy, _model$metadata2;
      return (
        // @ts-expect-error @elastic-elasticsearch Data frame types incomplete
        ((_model$metadata = model.metadata) === null || _model$metadata === void 0 ? void 0 : (_model$metadata$analy = _model$metadata.analytics_config) === null || _model$metadata$analy === void 0 ? void 0 : _model$metadata$analy.id) === analyticsId &&
        // @ts-expect-error @elastic-elasticsearch Data frame types incomplete
        ((_model$metadata2 = model.metadata) === null || _model$metadata2 === void 0 ? void 0 : _model$metadata2.analytics_config.create_time) === analyticsCreateTime
      );
    });
  }
  findJob(id) {
    const job = this._jobs.find(js => js.id === id);
    if (job === undefined) {
      throw Error(`No known job with id '${id}'`);
    }
    return job;
  }
  findTrainedModel(id) {
    const trainedModel = this._trainedModels.find(js => js.model_id === id);
    if (trainedModel === undefined) {
      throw Error(`No known trained model with id '${id}'`);
    }
    return trainedModel;
  }
  async getNextLink({
    id,
    type
  }) {
    try {
      if (type === _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX) {
        var _indexData$id, _indexData$id$mapping;
        // fetch index data
        const indexData = await this.getIndexData(id);
        let isWildcardIndexPattern = false;
        if (id.includes('*')) {
          isWildcardIndexPattern = true;
        }
        const meta = (_indexData$id = indexData[id]) === null || _indexData$id === void 0 ? void 0 : (_indexData$id$mapping = _indexData$id.mappings) === null || _indexData$id$mapping === void 0 ? void 0 : _indexData$id$mapping._meta;
        return {
          isWildcardIndexPattern,
          isIndexPattern: true,
          indexData,
          meta
        };
      } else if (type.includes(_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS)) {
        // fetch job associated with this index
        const jobData = this.findJob(id);
        return {
          jobData,
          isJob: true
        };
      } else if (type === _data_frame_analytics.JOB_MAP_NODE_TYPES.TRANSFORM) {
        // fetch transform so we can get original index pattern
        const transformData = await this.getTransformData(id);
        return {
          transformData,
          isTransform: true
        };
      }
    } catch (error) {
      throw _boom.default.badData(error.message ? error.message : error);
    }
  }
  getAnalyticsModelElements(analyticsId, analyticsCreateTime) {
    // Get trained model for analytics job and create model node
    const analyticsModel = this.findJobModel(analyticsId, analyticsCreateTime);
    let modelElement;
    let edgeElement;
    if (analyticsModel !== undefined) {
      const modelId = `${analyticsModel.model_id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL}`;
      modelElement = {
        data: {
          id: modelId,
          label: analyticsModel.model_id,
          type: _data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL
        }
      };
      // Create edge for job and corresponding model
      edgeElement = {
        data: {
          id: `${analyticsId}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}~${modelId}`,
          source: `${analyticsId}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`,
          target: modelId
        }
      };
    }
    return {
      modelElement,
      modelDetails: analyticsModel,
      edgeElement
    };
  }
  getIndexPatternElements(indexData, previousNodeId) {
    const result = {
      elements: [],
      details: {}
    };
    Object.keys(indexData).forEach(indexId => {
      // Create index node
      const nodeId = `${indexId}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX}`;
      result.elements.push({
        data: {
          id: nodeId,
          label: indexId,
          type: _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX
        }
      });
      result.details[nodeId] = indexData[indexId];

      // create edge node
      result.elements.push({
        data: {
          id: `${previousNodeId}~${nodeId}`,
          source: nodeId,
          target: previousNodeId
        }
      });
    });
    return result;
  }

  /**
   * Prepares the initial elements for incoming modelId
   * @param modelId
   */
  async getInitialElementsModelRoot(modelId) {
    var _data, _data$metadata, _data$metadata$analyt;
    const resultElements = [];
    const modelElements = [];
    const details = {};
    let data;
    // fetch model data and create model elements
    data = this.findTrainedModel(modelId);
    const modelNodeId = `${data.model_id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL}`;
    // @ts-expect-error @elastic-elasticsearch Data frame types incomplete
    const sourceJobId = (_data = data) === null || _data === void 0 ? void 0 : (_data$metadata = _data.metadata) === null || _data$metadata === void 0 ? void 0 : (_data$metadata$analyt = _data$metadata.analytics_config) === null || _data$metadata$analyt === void 0 ? void 0 : _data$metadata$analyt.id;
    let nextLinkId;
    let nextType;
    let previousNodeId;
    modelElements.push({
      data: {
        id: modelNodeId,
        label: data.model_id,
        type: _data_frame_analytics.JOB_MAP_NODE_TYPES.TRAINED_MODEL,
        isRoot: true
      }
    });
    details[modelNodeId] = data;
    // fetch source job data and create elements
    if (sourceJobId !== undefined) {
      try {
        var _data2, _data2$source, _data3;
        data = this.findJob(sourceJobId);
        nextLinkId = (_data2 = data) === null || _data2 === void 0 ? void 0 : (_data2$source = _data2.source) === null || _data2$source === void 0 ? void 0 : _data2$source.index[0];
        nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX;
        previousNodeId = `${data.id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
        resultElements.push({
          data: {
            id: previousNodeId,
            label: data.id,
            type: _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS,
            analysisType: (0, _analytics_utils.getAnalysisType)((_data3 = data) === null || _data3 === void 0 ? void 0 : _data3.analysis)
          }
        });
        // Create edge between job and model
        modelElements.push({
          data: {
            id: `${previousNodeId}~${modelNodeId}`,
            source: previousNodeId,
            target: modelNodeId
          }
        });
        details[previousNodeId] = data;
      } catch (error) {
        // fail silently if job doesn't exist
        if (error.statusCode !== 404) {
          var _error$body;
          throw (_error$body = error.body) !== null && _error$body !== void 0 ? _error$body : error;
        }
      }
    }
    return {
      data,
      details,
      resultElements,
      modelElements,
      nextLinkId,
      nextType,
      previousNodeId
    };
  }

  /**
   * Prepares the initial elements for incoming jobId
   * @param jobId
   */
  async getInitialElementsJobRoot(jobId, jobCreateTime) {
    var _data$source;
    const resultElements = [];
    const modelElements = [];
    const details = {};
    const data = this.findJob(jobId);
    const nextLinkId = data === null || data === void 0 ? void 0 : (_data$source = data.source) === null || _data$source === void 0 ? void 0 : _data$source.index[0];
    const nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX;
    const previousNodeId = `${data.id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
    resultElements.push({
      data: {
        id: previousNodeId,
        label: data.id,
        type: _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS,
        analysisType: (0, _analytics_utils.getAnalysisType)(data === null || data === void 0 ? void 0 : data.analysis),
        isRoot: true
      }
    });
    details[previousNodeId] = data;
    const {
      modelElement,
      modelDetails,
      edgeElement
    } = this.getAnalyticsModelElements(jobId, jobCreateTime);
    if ((0, _types.isAnalyticsMapNodeElement)(modelElement)) {
      modelElements.push(modelElement);
      details[modelElement.data.id] = modelDetails;
    }
    if ((0, _types.isAnalyticsMapEdgeElement)(edgeElement)) {
      modelElements.push(edgeElement);
    }
    return {
      data,
      details,
      resultElements,
      modelElements,
      nextLinkId,
      nextType,
      previousNodeId
    };
  }

  /**
   * Works backward from jobId or modelId to return related jobs, indices, models, and transforms
   * @param jobId (optional)
   * @param modelId (optional)
   */
  async getAnalyticsMap({
    analyticsId,
    modelId
  }) {
    const result = {
      elements: [],
      details: {},
      error: null
    };
    const modelElements = [];
    const indexPatternElements = [];
    try {
      await this.initData();
      // Create first node for incoming analyticsId or modelId
      let initialData = {};
      const job = analyticsId === undefined ? undefined : this.findJob(analyticsId);
      if (analyticsId !== undefined && job !== undefined) {
        const jobCreateTime = job.create_time;
        initialData = await this.getInitialElementsJobRoot(analyticsId, jobCreateTime);
      } else if (modelId !== undefined) {
        initialData = await this.getInitialElementsModelRoot(modelId);
      }
      const {
        resultElements,
        details: initialDetails,
        modelElements: initialModelElements
      } = initialData;
      result.elements.push(...resultElements);
      result.details = initialDetails;
      modelElements.push(...initialModelElements);
      if ((0, _types.isCompleteInitialReturnType)(initialData)) {
        let {
          data,
          nextLinkId,
          nextType,
          previousNodeId
        } = initialData;
        let complete = false;
        let link;
        let count = 0;
        let rootTransform;
        let rootIndexPattern;
        let modelElement;
        let modelDetails;
        let edgeElement;

        // Add a safeguard against infinite loops.
        while (complete === false) {
          count++;
          if (count >= 100) {
            break;
          }
          try {
            link = await this.getNextLink({
              id: nextLinkId,
              type: nextType
            });
          } catch (error) {
            result.error = error.message || 'Something went wrong';
            break;
          }
          // If it's index pattern, check meta data to see what to fetch next
          if ((0, _types.isIndexPatternLinkReturnType)(link) && link.isIndexPattern === true) {
            var _link$meta, _link$meta2, _link$meta3;
            if (link.isWildcardIndexPattern === true) {
              // Create index nodes for each of the indices included in the index pattern then break
              const {
                details,
                elements
              } = this.getIndexPatternElements(link.indexData, previousNodeId);
              indexPatternElements.push(...elements);
              result.details = {
                ...result.details,
                ...details
              };
              complete = true;
            } else {
              const nodeId = `${nextLinkId}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX}`;
              result.elements.unshift({
                data: {
                  id: nodeId,
                  label: nextLinkId,
                  type: _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX
                }
              });
              result.details[nodeId] = link.indexData;
            }

            // Check meta data
            if (link.isWildcardIndexPattern === false && (link.meta === undefined || (_link$meta = link.meta) !== null && _link$meta !== void 0 && _link$meta.created_by.includes(_data_frame_analytics.INDEX_CREATED_BY.FILE_DATA_VISUALIZER))) {
              rootIndexPattern = nextLinkId;
              complete = true;
              break;
            }
            if (((_link$meta2 = link.meta) === null || _link$meta2 === void 0 ? void 0 : _link$meta2.created_by) === _data_frame_analytics.INDEX_CREATED_BY.DATA_FRAME_ANALYTICS) {
              nextLinkId = link.meta.analytics;
              nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS;
            }
            if (((_link$meta3 = link.meta) === null || _link$meta3 === void 0 ? void 0 : _link$meta3.created_by) === _data_frame_analytics.JOB_MAP_NODE_TYPES.TRANSFORM) {
              var _link$meta$_transform;
              nextLinkId = (_link$meta$_transform = link.meta._transform) === null || _link$meta$_transform === void 0 ? void 0 : _link$meta$_transform.transform;
              nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.TRANSFORM;
            }
          } else if ((0, _types.isJobDataLinkReturnType)(link) && link.isJob === true) {
            var _data4, _data5, _data5$source;
            data = link.jobData;
            const nodeId = `${data.id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
            previousNodeId = nodeId;
            result.elements.unshift({
              data: {
                id: nodeId,
                label: data.id,
                type: _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS,
                analysisType: (0, _analytics_utils.getAnalysisType)((_data4 = data) === null || _data4 === void 0 ? void 0 : _data4.analysis)
              }
            });
            result.details[nodeId] = data;
            nextLinkId = (_data5 = data) === null || _data5 === void 0 ? void 0 : (_data5$source = _data5.source) === null || _data5$source === void 0 ? void 0 : _data5$source.index[0];
            nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX;

            // Get trained model for analytics job and create model node
            ({
              modelElement,
              modelDetails,
              edgeElement
            } = this.getAnalyticsModelElements(data.id, data.create_time));
            if ((0, _types.isAnalyticsMapNodeElement)(modelElement)) {
              modelElements.push(modelElement);
              result.details[modelElement.data.id] = modelDetails;
            }
            if ((0, _types.isAnalyticsMapEdgeElement)(edgeElement)) {
              modelElements.push(edgeElement);
            }
          } else if ((0, _types.isTransformLinkReturnType)(link) && link.isTransform === true) {
            var _data6, _data6$source;
            data = link.transformData;
            const nodeId = `${data.id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.TRANSFORM}`;
            previousNodeId = nodeId;
            rootTransform = data.dest.index;
            result.elements.unshift({
              data: {
                id: nodeId,
                label: data.id,
                type: _data_frame_analytics.JOB_MAP_NODE_TYPES.TRANSFORM
              }
            });
            result.details[nodeId] = data;
            nextLinkId = (_data6 = data) === null || _data6 === void 0 ? void 0 : (_data6$source = _data6.source) === null || _data6$source === void 0 ? void 0 : _data6$source.index[0];
            nextType = _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX;
          }
        } // end while

        // create edge elements
        const elemLength = result.elements.length - 1;
        for (let i = 0; i < elemLength; i++) {
          var _currentElem$data, _nextElem$data;
          const currentElem = result.elements[i];
          const nextElem = result.elements[i + 1];
          if (currentElem !== undefined && nextElem !== undefined && (currentElem === null || currentElem === void 0 ? void 0 : (_currentElem$data = currentElem.data) === null || _currentElem$data === void 0 ? void 0 : _currentElem$data.id.includes('*')) === false && (nextElem === null || nextElem === void 0 ? void 0 : (_nextElem$data = nextElem.data) === null || _nextElem$data === void 0 ? void 0 : _nextElem$data.id.includes('*')) === false) {
            result.elements.push({
              data: {
                id: `${currentElem.data.id}~${nextElem.data.id}`,
                source: currentElem.data.id,
                target: nextElem.data.id
              }
            });
          }
        }

        // fetch all jobs associated with root transform if defined, otherwise check root index
        if (rootTransform !== undefined || rootIndexPattern !== undefined) {
          const jobs = this._jobs;
          const comparator = rootTransform !== undefined ? rootTransform : rootIndexPattern;
          for (let i = 0; i < jobs.length; i++) {
            var _jobs$i, _jobs$i$source;
            if (((_jobs$i = jobs[i]) === null || _jobs$i === void 0 ? void 0 : (_jobs$i$source = _jobs$i.source) === null || _jobs$i$source === void 0 ? void 0 : _jobs$i$source.index[0]) === comparator && this.isDuplicateElement(jobs[i].id, result.elements) === false) {
              var _jobs$i2;
              const nodeId = `${jobs[i].id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
              result.elements.push({
                data: {
                  id: nodeId,
                  label: jobs[i].id,
                  type: _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS,
                  analysisType: (0, _analytics_utils.getAnalysisType)((_jobs$i2 = jobs[i]) === null || _jobs$i2 === void 0 ? void 0 : _jobs$i2.analysis)
                }
              });
              result.details[nodeId] = jobs[i];
              const source = `${comparator}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX}`;
              result.elements.push({
                data: {
                  id: `${source}~${nodeId}`,
                  source,
                  target: nodeId
                }
              });
              // Get trained model for analytics job and create model node
              ({
                modelElement,
                modelDetails,
                edgeElement
              } = this.getAnalyticsModelElements(jobs[i].id, jobs[i].create_time));
              if ((0, _types.isAnalyticsMapNodeElement)(modelElement)) {
                modelElements.push(modelElement);
                result.details[modelElement.data.id] = modelDetails;
              }
              if ((0, _types.isAnalyticsMapEdgeElement)(edgeElement)) {
                modelElements.push(edgeElement);
              }
            }
          }
        }
      }
      // Include model and index pattern nodes in result elements now that all other nodes have been created
      result.elements.push(...modelElements, ...indexPatternElements);
      return result;
    } catch (error) {
      result.error = error.message || 'An error occurred fetching map';
      return result;
    }
  }
  async extendAnalyticsMapForAnalyticsJob({
    analyticsId,
    index
  }) {
    const result = {
      elements: [],
      details: {},
      error: null
    };
    try {
      await this.initData();
      const jobs = this._jobs;
      let rootIndex;
      let rootIndexNodeId;
      if (analyticsId !== undefined) {
        var _jobData$dest, _jobData$dest2, _jobData$dest3;
        const jobData = this.findJob(analyticsId);
        const currentJobNodeId = `${jobData.id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
        rootIndex = Array.isArray(jobData === null || jobData === void 0 ? void 0 : (_jobData$dest = jobData.dest) === null || _jobData$dest === void 0 ? void 0 : _jobData$dest.index) ? jobData === null || jobData === void 0 ? void 0 : (_jobData$dest2 = jobData.dest) === null || _jobData$dest2 === void 0 ? void 0 : _jobData$dest2.index[0] : jobData === null || jobData === void 0 ? void 0 : (_jobData$dest3 = jobData.dest) === null || _jobData$dest3 === void 0 ? void 0 : _jobData$dest3.index;
        rootIndexNodeId = `${rootIndex}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX}`;

        // Fetch trained model for incoming job id and add node and edge
        const {
          modelElement,
          modelDetails,
          edgeElement
        } = this.getAnalyticsModelElements(analyticsId, jobData.create_time);
        if ((0, _types.isAnalyticsMapNodeElement)(modelElement)) {
          result.elements.push(modelElement);
          result.details[modelElement.data.id] = modelDetails;
        }
        if ((0, _types.isAnalyticsMapEdgeElement)(edgeElement)) {
          result.elements.push(edgeElement);
        }

        // If rootIndex node has not been created, create it
        const rootIndexDetails = await this.getIndexData(rootIndex);
        result.elements.push({
          data: {
            id: rootIndexNodeId,
            label: rootIndex,
            type: _data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX
          }
        });
        result.details[rootIndexNodeId] = rootIndexDetails;

        // Connect incoming job to rootIndex
        result.elements.push({
          data: {
            id: `${currentJobNodeId}~${rootIndexNodeId}`,
            source: currentJobNodeId,
            target: rootIndexNodeId
          }
        });
      } else {
        rootIndex = index;
        rootIndexNodeId = `${rootIndex}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.INDEX}`;
      }
      for (let i = 0; i < jobs.length; i++) {
        var _jobs$i3, _jobs$i3$source;
        if (((_jobs$i3 = jobs[i]) === null || _jobs$i3 === void 0 ? void 0 : (_jobs$i3$source = _jobs$i3.source) === null || _jobs$i3$source === void 0 ? void 0 : _jobs$i3$source.index[0]) === rootIndex && this.isDuplicateElement(jobs[i].id, result.elements) === false) {
          var _jobs$i4;
          // Create node for associated job
          const nodeId = `${jobs[i].id}-${_data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS}`;
          result.elements.push({
            data: {
              id: nodeId,
              label: jobs[i].id,
              type: _data_frame_analytics.JOB_MAP_NODE_TYPES.ANALYTICS,
              analysisType: (0, _analytics_utils.getAnalysisType)((_jobs$i4 = jobs[i]) === null || _jobs$i4 === void 0 ? void 0 : _jobs$i4.analysis)
            }
          });
          result.details[nodeId] = jobs[i];
          result.elements.push({
            data: {
              id: `${rootIndexNodeId}~${nodeId}`,
              source: rootIndexNodeId,
              target: nodeId
            }
          });
        }
      }
    } catch (error) {
      result.error = error.message || 'An error occurred fetching map';
      return result;
    }
    return result;
  }
}
exports.AnalyticsManager = AnalyticsManager;