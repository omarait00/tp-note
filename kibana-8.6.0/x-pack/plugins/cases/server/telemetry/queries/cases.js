"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLatestCasesDates = exports.getCasesTelemetryData = void 0;
var _constants = require("../../../common/constants");
var _constants2 = require("../constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLatestCasesDates = async ({
  savedObjectsClient
}) => {
  var _savedObjects$0$saved, _savedObjects$0$saved2, _savedObjects$0$saved3, _savedObjects$1$saved, _savedObjects$1$saved2, _savedObjects$1$saved3, _savedObjects$2$saved, _savedObjects$2$saved2, _savedObjects$2$saved3;
  const find = async sortField => savedObjectsClient.find({
    page: 1,
    perPage: 1,
    sortField,
    sortOrder: 'desc',
    type: _constants.CASE_SAVED_OBJECT
  });
  const savedObjects = await Promise.all([find('created_at'), find('updated_at'), find('closed_at')]);
  return {
    createdAt: (_savedObjects$0$saved = savedObjects === null || savedObjects === void 0 ? void 0 : (_savedObjects$0$saved2 = savedObjects[0].saved_objects) === null || _savedObjects$0$saved2 === void 0 ? void 0 : (_savedObjects$0$saved3 = _savedObjects$0$saved2[0].attributes) === null || _savedObjects$0$saved3 === void 0 ? void 0 : _savedObjects$0$saved3.created_at) !== null && _savedObjects$0$saved !== void 0 ? _savedObjects$0$saved : null,
    updatedAt: (_savedObjects$1$saved = savedObjects === null || savedObjects === void 0 ? void 0 : (_savedObjects$1$saved2 = savedObjects[1].saved_objects) === null || _savedObjects$1$saved2 === void 0 ? void 0 : (_savedObjects$1$saved3 = _savedObjects$1$saved2[0].attributes) === null || _savedObjects$1$saved3 === void 0 ? void 0 : _savedObjects$1$saved3.updated_at) !== null && _savedObjects$1$saved !== void 0 ? _savedObjects$1$saved : null,
    closedAt: (_savedObjects$2$saved = savedObjects === null || savedObjects === void 0 ? void 0 : (_savedObjects$2$saved2 = savedObjects[2].saved_objects) === null || _savedObjects$2$saved2 === void 0 ? void 0 : (_savedObjects$2$saved3 = _savedObjects$2$saved2[0].attributes) === null || _savedObjects$2$saved3 === void 0 ? void 0 : _savedObjects$2$saved3.closed_at) !== null && _savedObjects$2$saved !== void 0 ? _savedObjects$2$saved : null
  };
};
exports.getLatestCasesDates = getLatestCasesDates;
const getCasesTelemetryData = async ({
  savedObjectsClient,
  logger
}) => {
  var _casesRes$aggregation, _casesRes$aggregation2, _casesRes$aggregation3, _commentsRes$aggregat, _commentsRes$aggregat2, _commentsRes$aggregat3, _casesRes$aggregation4, _casesRes$aggregation5, _casesRes$aggregation6, _totalAlertsRes$aggre, _totalAlertsRes$aggre2, _totalAlertsRes$aggre3, _totalAlertsRes$aggre4, _totalAlertsRes$aggre5, _totalConnectorsRes$a, _totalConnectorsRes$a2, _totalConnectorsRes$a3, _totalConnectorsRes$a4, _totalConnectorsRes$a5, _casesRes$aggregation7, _casesRes$aggregation8, _casesRes$aggregation9, _casesRes$aggregation10, _casesRes$aggregation11, _casesRes$aggregation12;
  const byOwnerAggregationQuery = _constants2.OWNERS.reduce((aggQuery, owner) => ({
    ...aggQuery,
    [owner]: {
      filter: {
        term: {
          [`${_constants.CASE_SAVED_OBJECT}.attributes.owner`]: owner
        }
      },
      aggs: {
        ...(0, _utils.getCountsAggregationQuery)(_constants.CASE_SAVED_OBJECT),
        ...getAssigneesAggregations()
      }
    }
  }), {});
  const casesRes = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    type: _constants.CASE_SAVED_OBJECT,
    aggs: {
      ...byOwnerAggregationQuery,
      ...(0, _utils.getCountsAggregationQuery)(_constants.CASE_SAVED_OBJECT),
      ...getAssigneesAggregations(),
      totalsByOwner: {
        terms: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.owner`
        }
      },
      syncAlerts: {
        terms: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.settings.syncAlerts`
        }
      },
      status: {
        terms: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.status`
        }
      },
      users: {
        cardinality: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.created_by.username`
        }
      },
      tags: {
        cardinality: {
          field: `${_constants.CASE_SAVED_OBJECT}.attributes.tags`
        }
      }
    }
  });
  const commentsRes = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    type: _constants.CASE_COMMENT_SAVED_OBJECT,
    aggs: {
      participants: {
        cardinality: {
          field: `${_constants.CASE_COMMENT_SAVED_OBJECT}.attributes.created_by.username`
        }
      }
    }
  });
  const totalAlertsRes = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    type: _constants.CASE_COMMENT_SAVED_OBJECT,
    filter: (0, _utils.getOnlyAlertsCommentsFilter)(),
    aggs: {
      ...(0, _utils.getReferencesAggregationQuery)({
        savedObjectType: _constants.CASE_COMMENT_SAVED_OBJECT,
        referenceType: 'cases',
        agg: 'cardinality'
      })
    }
  });
  const totalConnectorsRes = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    type: _constants.CASE_USER_ACTION_SAVED_OBJECT,
    filter: (0, _utils.getOnlyConnectorsFilter)(),
    aggs: {
      ...(0, _utils.getReferencesAggregationQuery)({
        savedObjectType: _constants.CASE_USER_ACTION_SAVED_OBJECT,
        referenceType: 'cases',
        agg: 'cardinality'
      })
    }
  });
  const latestDates = await getLatestCasesDates({
    savedObjectsClient,
    logger
  });
  const aggregationsBuckets = (0, _utils.getAggregationsBuckets)({
    aggs: casesRes.aggregations,
    keys: ['counts', 'syncAlerts', 'status', 'users', 'totalAssignees']
  });
  return {
    all: {
      total: casesRes.total,
      ...(0, _utils.getCountsFromBuckets)(aggregationsBuckets.counts),
      status: {
        open: (0, _utils.findValueInBuckets)(aggregationsBuckets.status, 'open'),
        inProgress: (0, _utils.findValueInBuckets)(aggregationsBuckets.status, 'in-progress'),
        closed: (0, _utils.findValueInBuckets)(aggregationsBuckets.status, 'closed')
      },
      syncAlertsOn: (0, _utils.findValueInBuckets)(aggregationsBuckets.syncAlerts, 1),
      syncAlertsOff: (0, _utils.findValueInBuckets)(aggregationsBuckets.syncAlerts, 0),
      totalUsers: (_casesRes$aggregation = (_casesRes$aggregation2 = casesRes.aggregations) === null || _casesRes$aggregation2 === void 0 ? void 0 : (_casesRes$aggregation3 = _casesRes$aggregation2.users) === null || _casesRes$aggregation3 === void 0 ? void 0 : _casesRes$aggregation3.value) !== null && _casesRes$aggregation !== void 0 ? _casesRes$aggregation : 0,
      totalParticipants: (_commentsRes$aggregat = (_commentsRes$aggregat2 = commentsRes.aggregations) === null || _commentsRes$aggregat2 === void 0 ? void 0 : (_commentsRes$aggregat3 = _commentsRes$aggregat2.participants) === null || _commentsRes$aggregat3 === void 0 ? void 0 : _commentsRes$aggregat3.value) !== null && _commentsRes$aggregat !== void 0 ? _commentsRes$aggregat : 0,
      totalTags: (_casesRes$aggregation4 = (_casesRes$aggregation5 = casesRes.aggregations) === null || _casesRes$aggregation5 === void 0 ? void 0 : (_casesRes$aggregation6 = _casesRes$aggregation5.tags) === null || _casesRes$aggregation6 === void 0 ? void 0 : _casesRes$aggregation6.value) !== null && _casesRes$aggregation4 !== void 0 ? _casesRes$aggregation4 : 0,
      totalWithAlerts: (_totalAlertsRes$aggre = (_totalAlertsRes$aggre2 = totalAlertsRes.aggregations) === null || _totalAlertsRes$aggre2 === void 0 ? void 0 : (_totalAlertsRes$aggre3 = _totalAlertsRes$aggre2.references) === null || _totalAlertsRes$aggre3 === void 0 ? void 0 : (_totalAlertsRes$aggre4 = _totalAlertsRes$aggre3.referenceType) === null || _totalAlertsRes$aggre4 === void 0 ? void 0 : (_totalAlertsRes$aggre5 = _totalAlertsRes$aggre4.referenceAgg) === null || _totalAlertsRes$aggre5 === void 0 ? void 0 : _totalAlertsRes$aggre5.value) !== null && _totalAlertsRes$aggre !== void 0 ? _totalAlertsRes$aggre : 0,
      totalWithConnectors: (_totalConnectorsRes$a = (_totalConnectorsRes$a2 = totalConnectorsRes.aggregations) === null || _totalConnectorsRes$a2 === void 0 ? void 0 : (_totalConnectorsRes$a3 = _totalConnectorsRes$a2.references) === null || _totalConnectorsRes$a3 === void 0 ? void 0 : (_totalConnectorsRes$a4 = _totalConnectorsRes$a3.referenceType) === null || _totalConnectorsRes$a4 === void 0 ? void 0 : (_totalConnectorsRes$a5 = _totalConnectorsRes$a4.referenceAgg) === null || _totalConnectorsRes$a5 === void 0 ? void 0 : _totalConnectorsRes$a5.value) !== null && _totalConnectorsRes$a !== void 0 ? _totalConnectorsRes$a : 0,
      latestDates,
      assignees: {
        total: (_casesRes$aggregation7 = (_casesRes$aggregation8 = casesRes.aggregations) === null || _casesRes$aggregation8 === void 0 ? void 0 : _casesRes$aggregation8.totalAssignees.value) !== null && _casesRes$aggregation7 !== void 0 ? _casesRes$aggregation7 : 0,
        totalWithZero: (_casesRes$aggregation9 = (_casesRes$aggregation10 = casesRes.aggregations) === null || _casesRes$aggregation10 === void 0 ? void 0 : _casesRes$aggregation10.assigneeFilters.buckets.zero.doc_count) !== null && _casesRes$aggregation9 !== void 0 ? _casesRes$aggregation9 : 0,
        totalWithAtLeastOne: (_casesRes$aggregation11 = (_casesRes$aggregation12 = casesRes.aggregations) === null || _casesRes$aggregation12 === void 0 ? void 0 : _casesRes$aggregation12.assigneeFilters.buckets.atLeastOne.doc_count) !== null && _casesRes$aggregation11 !== void 0 ? _casesRes$aggregation11 : 0
      }
    },
    sec: (0, _utils.getSolutionValues)(casesRes.aggregations, 'securitySolution'),
    obs: (0, _utils.getSolutionValues)(casesRes.aggregations, 'observability'),
    main: (0, _utils.getSolutionValues)(casesRes.aggregations, 'cases')
  };
};
exports.getCasesTelemetryData = getCasesTelemetryData;
const getAssigneesAggregations = () => ({
  totalAssignees: {
    value_count: {
      field: `${_constants.CASE_SAVED_OBJECT}.attributes.assignees.uid`
    }
  },
  assigneeFilters: {
    filters: {
      filters: {
        zero: {
          bool: {
            must_not: {
              exists: {
                field: `${_constants.CASE_SAVED_OBJECT}.attributes.assignees.uid`
              }
            }
          }
        },
        atLeastOne: {
          bool: {
            filter: {
              exists: {
                field: `${_constants.CASE_SAVED_OBJECT}.attributes.assignees.uid`
              }
            }
          }
        }
      }
    }
  }
});