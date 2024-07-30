"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTelemetryDataEmptyState = exports.getSolutionValues = exports.getReferencesAggregationQuery = exports.getOnlyConnectorsFilter = exports.getOnlyAlertsCommentsFilter = exports.getMaxBucketOnCaseAggregationQuery = exports.getCountsFromBuckets = exports.getCountsAndMaxData = exports.getCountsAggregationQuery = exports.getConnectorsCardinalityAggregationQuery = exports.getBucketFromAggregation = exports.getAggregationsBuckets = exports.findValueInBuckets = void 0;
var _lodash = require("lodash");
var _constants = require("../../../common/constants");
var _utils = require("../../client/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCountsAggregationQuery = savedObjectType => ({
  counts: {
    date_range: {
      field: `${savedObjectType}.attributes.created_at`,
      format: 'dd/MM/YYYY',
      ranges: [{
        from: 'now-1d',
        to: 'now'
      }, {
        from: 'now-1w',
        to: 'now'
      }, {
        from: 'now-1M',
        to: 'now'
      }]
    }
  }
});
exports.getCountsAggregationQuery = getCountsAggregationQuery;
const getMaxBucketOnCaseAggregationQuery = savedObjectType => ({
  references: {
    nested: {
      path: `${savedObjectType}.references`
    },
    aggregations: {
      cases: {
        filter: {
          term: {
            [`${savedObjectType}.references.type`]: _constants.CASE_SAVED_OBJECT
          }
        },
        aggregations: {
          ids: {
            terms: {
              field: `${savedObjectType}.references.id`
            }
          },
          max: {
            max_bucket: {
              buckets_path: 'ids._count'
            }
          }
        }
      }
    }
  }
});
exports.getMaxBucketOnCaseAggregationQuery = getMaxBucketOnCaseAggregationQuery;
const getReferencesAggregationQuery = ({
  savedObjectType,
  referenceType,
  agg = 'terms'
}) => ({
  references: {
    nested: {
      path: `${savedObjectType}.references`
    },
    aggregations: {
      referenceType: {
        filter: {
          term: {
            [`${savedObjectType}.references.type`]: referenceType
          }
        },
        aggregations: {
          referenceAgg: {
            [agg]: {
              field: `${savedObjectType}.references.id`
            }
          }
        }
      }
    }
  }
});
exports.getReferencesAggregationQuery = getReferencesAggregationQuery;
const getConnectorsCardinalityAggregationQuery = () => getReferencesAggregationQuery({
  savedObjectType: _constants.CASE_USER_ACTION_SAVED_OBJECT,
  referenceType: 'action',
  agg: 'cardinality'
});
exports.getConnectorsCardinalityAggregationQuery = getConnectorsCardinalityAggregationQuery;
const getCountsFromBuckets = buckets => {
  var _buckets$2$doc_count, _buckets$, _buckets$1$doc_count, _buckets$2, _buckets$0$doc_count, _buckets$3;
  return {
    daily: (_buckets$2$doc_count = buckets === null || buckets === void 0 ? void 0 : (_buckets$ = buckets[2]) === null || _buckets$ === void 0 ? void 0 : _buckets$.doc_count) !== null && _buckets$2$doc_count !== void 0 ? _buckets$2$doc_count : 0,
    weekly: (_buckets$1$doc_count = buckets === null || buckets === void 0 ? void 0 : (_buckets$2 = buckets[1]) === null || _buckets$2 === void 0 ? void 0 : _buckets$2.doc_count) !== null && _buckets$1$doc_count !== void 0 ? _buckets$1$doc_count : 0,
    monthly: (_buckets$0$doc_count = buckets === null || buckets === void 0 ? void 0 : (_buckets$3 = buckets[0]) === null || _buckets$3 === void 0 ? void 0 : _buckets$3.doc_count) !== null && _buckets$0$doc_count !== void 0 ? _buckets$0$doc_count : 0
  };
};
exports.getCountsFromBuckets = getCountsFromBuckets;
const getCountsAndMaxData = async ({
  savedObjectsClient,
  savedObjectType,
  filter
}) => {
  var _res$aggregations$cou, _res$aggregations, _res$aggregations$cou2, _res$aggregations$ref, _res$aggregations2, _res$aggregations2$re, _res$aggregations2$re2, _res$aggregations2$re3;
  const res = await savedObjectsClient.find({
    page: 0,
    perPage: 0,
    filter,
    type: savedObjectType,
    aggs: {
      ...getCountsAggregationQuery(savedObjectType),
      ...getMaxBucketOnCaseAggregationQuery(savedObjectType)
    }
  });
  const countsBuckets = (_res$aggregations$cou = (_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : (_res$aggregations$cou2 = _res$aggregations.counts) === null || _res$aggregations$cou2 === void 0 ? void 0 : _res$aggregations$cou2.buckets) !== null && _res$aggregations$cou !== void 0 ? _res$aggregations$cou : [];
  const maxOnACase = (_res$aggregations$ref = (_res$aggregations2 = res.aggregations) === null || _res$aggregations2 === void 0 ? void 0 : (_res$aggregations2$re = _res$aggregations2.references) === null || _res$aggregations2$re === void 0 ? void 0 : (_res$aggregations2$re2 = _res$aggregations2$re.cases) === null || _res$aggregations2$re2 === void 0 ? void 0 : (_res$aggregations2$re3 = _res$aggregations2$re2.max) === null || _res$aggregations2$re3 === void 0 ? void 0 : _res$aggregations2$re3.value) !== null && _res$aggregations$ref !== void 0 ? _res$aggregations$ref : 0;
  return {
    all: {
      total: res.total,
      ...getCountsFromBuckets(countsBuckets),
      maxOnACase
    }
  };
};
exports.getCountsAndMaxData = getCountsAndMaxData;
const getBucketFromAggregation = ({
  aggs,
  key
}) => {
  var _get;
  return (_get = (0, _lodash.get)(aggs, `${key}.buckets`)) !== null && _get !== void 0 ? _get : [];
};
exports.getBucketFromAggregation = getBucketFromAggregation;
const getSolutionValues = (aggregations, owner) => {
  var _aggregations$owner$t, _aggregations$owner$a, _aggregations$owner$a2;
  const aggregationsBuckets = getAggregationsBuckets({
    aggs: aggregations,
    keys: ['totalsByOwner', 'securitySolution.counts', 'observability.counts', 'cases.counts']
  });
  return {
    total: findValueInBuckets(aggregationsBuckets.totalsByOwner, owner),
    ...getCountsFromBuckets(aggregationsBuckets[`${owner}.counts`]),
    assignees: {
      total: (_aggregations$owner$t = aggregations === null || aggregations === void 0 ? void 0 : aggregations[owner].totalAssignees.value) !== null && _aggregations$owner$t !== void 0 ? _aggregations$owner$t : 0,
      totalWithZero: (_aggregations$owner$a = aggregations === null || aggregations === void 0 ? void 0 : aggregations[owner].assigneeFilters.buckets.zero.doc_count) !== null && _aggregations$owner$a !== void 0 ? _aggregations$owner$a : 0,
      totalWithAtLeastOne: (_aggregations$owner$a2 = aggregations === null || aggregations === void 0 ? void 0 : aggregations[owner].assigneeFilters.buckets.atLeastOne.doc_count) !== null && _aggregations$owner$a2 !== void 0 ? _aggregations$owner$a2 : 0
    }
  };
};
exports.getSolutionValues = getSolutionValues;
const findValueInBuckets = (buckets, value) => {
  var _buckets$find$doc_cou, _buckets$find;
  return (_buckets$find$doc_cou = (_buckets$find = buckets.find(({
    key
  }) => key === value)) === null || _buckets$find === void 0 ? void 0 : _buckets$find.doc_count) !== null && _buckets$find$doc_cou !== void 0 ? _buckets$find$doc_cou : 0;
};
exports.findValueInBuckets = findValueInBuckets;
const getAggregationsBuckets = ({
  aggs,
  keys
}) => keys.reduce((acc, key) => ({
  ...acc,
  [key]: getBucketFromAggregation({
    aggs,
    key
  })
}), {});
exports.getAggregationsBuckets = getAggregationsBuckets;
const getOnlyAlertsCommentsFilter = () => (0, _utils.buildFilter)({
  filters: ['alert'],
  field: 'type',
  operator: 'or',
  type: _constants.CASE_COMMENT_SAVED_OBJECT
});
exports.getOnlyAlertsCommentsFilter = getOnlyAlertsCommentsFilter;
const getOnlyConnectorsFilter = () => (0, _utils.buildFilter)({
  filters: ['connector'],
  field: 'type',
  operator: 'or',
  type: _constants.CASE_USER_ACTION_SAVED_OBJECT
});
exports.getOnlyConnectorsFilter = getOnlyConnectorsFilter;
const getTelemetryDataEmptyState = () => ({
  cases: {
    all: {
      assignees: {
        total: 0,
        totalWithZero: 0,
        totalWithAtLeastOne: 0
      },
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      status: {
        open: 0,
        inProgress: 0,
        closed: 0
      },
      syncAlertsOn: 0,
      syncAlertsOff: 0,
      totalUsers: 0,
      totalParticipants: 0,
      totalTags: 0,
      totalWithAlerts: 0,
      totalWithConnectors: 0,
      latestDates: {
        createdAt: null,
        updatedAt: null,
        closedAt: null
      }
    },
    sec: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      assignees: {
        total: 0,
        totalWithAtLeastOne: 0,
        totalWithZero: 0
      }
    },
    obs: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      assignees: {
        total: 0,
        totalWithAtLeastOne: 0,
        totalWithZero: 0
      }
    },
    main: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      assignees: {
        total: 0,
        totalWithAtLeastOne: 0,
        totalWithZero: 0
      }
    }
  },
  userActions: {
    all: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      maxOnACase: 0
    }
  },
  comments: {
    all: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      maxOnACase: 0
    }
  },
  alerts: {
    all: {
      total: 0,
      monthly: 0,
      weekly: 0,
      daily: 0,
      maxOnACase: 0
    }
  },
  connectors: {
    all: {
      all: {
        totalAttached: 0
      },
      itsm: {
        totalAttached: 0
      },
      sir: {
        totalAttached: 0
      },
      jira: {
        totalAttached: 0
      },
      resilient: {
        totalAttached: 0
      },
      swimlane: {
        totalAttached: 0
      },
      maxAttachedToACase: 0
    }
  },
  pushes: {
    all: {
      total: 0,
      maxOnACase: 0
    }
  },
  configuration: {
    all: {
      closure: {
        manually: 0,
        automatic: 0
      }
    }
  }
});
exports.getTelemetryDataEmptyState = getTelemetryDataEmptyState;