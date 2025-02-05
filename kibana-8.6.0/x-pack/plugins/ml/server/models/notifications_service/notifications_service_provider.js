"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotificationsService = void 0;
var _index_patterns = require("../../../common/constants/index_patterns");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_NOTIFICATIONS_SIZE = 10000;
class NotificationsService {
  constructor(scopedClusterClient, mlSavedObjectService) {
    this.scopedClusterClient = scopedClusterClient;
    this.mlSavedObjectService = mlSavedObjectService;
  }
  getDefaultCountResponse() {
    return {
      error: 0,
      warning: 0,
      info: 0
    };
  }

  /**
   * Provides entity IDs per type for the current space.
   * @private
   */
  async _getEntityIdsPerType() {
    const [adJobIds, dfaJobIds, modelIds] = await Promise.all([this.mlSavedObjectService.getAnomalyDetectionJobIds(), this.mlSavedObjectService.getDataFrameAnalyticsJobIds(), this.mlSavedObjectService.getTrainedModelsIds()]);
    return [{
      type: 'anomaly_detector',
      ids: adJobIds
    }, {
      type: 'data_frame_analytics',
      ids: dfaJobIds
    }, {
      type: 'inference',
      ids: modelIds
    }, {
      type: 'system'
    }].filter(v => v.ids === undefined || v.ids.length > 0);
  }

  /**
   * Searches notifications based on the criteria.
   *
   * {@link ML_NOTIFICATION_INDEX_PATTERN} uses job_id field for all types of entities,
   * e.g. anomaly_detector, data_frame_analytics jobs and inference models, hence
   * to make sure the results are space aware, we have to perform separate requests
   * for each type of entities.
   *
   */
  async searchMessages(params) {
    const entityIdsPerType = await this._getEntityIdsPerType();
    const results = await Promise.all(entityIdsPerType.map(async v => {
      const responseBody = await this.scopedClusterClient.asInternalUser.search({
        index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
        ignore_unavailable: true,
        from: 0,
        size: MAX_NOTIFICATIONS_SIZE,
        body: {
          sort: [{
            [params.sortField]: {
              order: params.sortDirection
            }
          }],
          query: {
            bool: {
              ...(params.queryString ? {
                must: [{
                  query_string: {
                    query: params.queryString,
                    default_field: 'message'
                  }
                }]
              } : {}),
              filter: [...(v.ids ? [{
                terms: {
                  job_id: v.ids
                }
              }] : []), {
                term: {
                  job_type: {
                    value: v.type
                  }
                }
              }, ...(params.earliest || params.latest ? [{
                range: {
                  timestamp: {
                    ...(params.earliest ? {
                      gt: params.earliest
                    } : {}),
                    ...(params.latest ? {
                      lte: params.latest
                    } : {})
                  }
                }
              }] : [])]
            }
          }
        }
      }, {
        maxRetries: 0
      });
      return {
        total: responseBody.hits.total.value,
        results: responseBody.hits.hits.map(result => {
          return {
            ...result._source,
            id: result._id
          };
        })
      };
    }));
    const response = results.reduce((acc, curr) => {
      acc.total += curr.total;
      acc.results = acc.results.concat(curr.results);
      return acc;
    }, {
      total: 0,
      results: []
    });
    function getSortCallback(sortField, sortDirection) {
      if (sortField === 'timestamp') {
        if (sortDirection === 'asc') {
          return (a, b) => a.timestamp - b.timestamp;
        } else {
          return (a, b) => b.timestamp - a.timestamp;
        }
      } else {
        if (sortDirection === 'asc') {
          return (a, b) => {
            var _a$sortField;
            return ((_a$sortField = a[sortField]) !== null && _a$sortField !== void 0 ? _a$sortField : '').localeCompare(b[sortField]);
          };
        } else {
          return (a, b) => {
            var _b$sortField;
            return ((_b$sortField = b[sortField]) !== null && _b$sortField !== void 0 ? _b$sortField : '').localeCompare(a[sortField]);
          };
        }
      }
    }
    response.results = response.results.sort(getSortCallback(params.sortField, params.sortDirection));
    return response;
  }

  /**
   * Provides a number of messages by level.
   */
  async countMessages(params) {
    const entityIdsPerType = await this._getEntityIdsPerType();
    const res = await Promise.all(entityIdsPerType.map(async v => {
      const responseBody = await this.scopedClusterClient.asInternalUser.search({
        size: 0,
        index: _index_patterns.ML_NOTIFICATION_INDEX_PATTERN,
        body: {
          query: {
            bool: {
              filter: [...(v.ids ? [{
                terms: {
                  job_id: v.ids
                }
              }] : []), {
                term: {
                  job_type: {
                    value: v.type
                  }
                }
              }, {
                range: {
                  timestamp: {
                    gt: params.lastCheckedAt
                  }
                }
              }]
            }
          },
          aggs: {
            by_level: {
              terms: {
                field: 'level'
              }
            }
          }
        }
      });
      if (!responseBody.aggregations) {
        return this.getDefaultCountResponse();
      }
      const byLevel = responseBody.aggregations.by_level;
      return Array.isArray(byLevel.buckets) ? byLevel.buckets.reduce((acc, curr) => {
        acc[curr.key] = curr.doc_count;
        return acc;
      }, {}) : {};
    }));
    return res.reduce((acc, curr) => {
      for (const levelKey in curr) {
        if (curr.hasOwnProperty(levelKey)) {
          acc[levelKey] += curr[levelKey];
        }
      }
      return acc;
    }, this.getDefaultCountResponse());
  }
}
exports.NotificationsService = NotificationsService;