"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roundScore = exports.getStatsFromFindingsEvaluationsAggs = exports.getStats = exports.getEvaluationsQuery = exports.findingsEvaluationAggsQuery = exports.calculatePostureScore = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * @param value value is [0, 1] range
 */
const roundScore = value => Number((value * 100).toFixed(1));
exports.roundScore = roundScore;
const calculatePostureScore = (passed, failed) => roundScore(passed / (passed + failed));
exports.calculatePostureScore = calculatePostureScore;
const findingsEvaluationAggsQuery = {
  failed_findings: {
    filter: {
      term: {
        'result.evaluation': 'failed'
      }
    }
  },
  passed_findings: {
    filter: {
      term: {
        'result.evaluation': 'passed'
      }
    }
  }
};
exports.findingsEvaluationAggsQuery = findingsEvaluationAggsQuery;
const uniqueResourcesCountQuery = {
  resources_evaluated: {
    cardinality: {
      field: 'resource.id'
    }
  }
};
const getEvaluationsQuery = (query, pitId) => ({
  query,
  size: 0,
  aggs: {
    ...findingsEvaluationAggsQuery,
    ...uniqueResourcesCountQuery
  },
  pit: {
    id: pitId
  }
});
exports.getEvaluationsQuery = getEvaluationsQuery;
const getStatsFromFindingsEvaluationsAggs = findingsEvaluationsAggs => {
  var _findingsEvaluationsA;
  const resourcesEvaluated = (_findingsEvaluationsA = findingsEvaluationsAggs.resources_evaluated) === null || _findingsEvaluationsA === void 0 ? void 0 : _findingsEvaluationsA.value;
  const failedFindings = findingsEvaluationsAggs.failed_findings.doc_count || 0;
  const passedFindings = findingsEvaluationsAggs.passed_findings.doc_count || 0;
  const totalFindings = failedFindings + passedFindings;
  if (!totalFindings) throw new Error("couldn't calculate posture score");
  const postureScore = calculatePostureScore(passedFindings, failedFindings);
  return {
    totalFailed: failedFindings,
    totalPassed: passedFindings,
    totalFindings,
    postureScore,
    ...(resourcesEvaluated && {
      resourcesEvaluated
    })
  };
};
exports.getStatsFromFindingsEvaluationsAggs = getStatsFromFindingsEvaluationsAggs;
const getStats = async (esClient, query, pitId) => {
  const evaluationsQueryResult = await esClient.search(getEvaluationsQuery(query, pitId));
  const findingsEvaluations = evaluationsQueryResult.aggregations;
  if (!findingsEvaluations) throw new Error('missing findings evaluations');
  return getStatsFromFindingsEvaluationsAggs(findingsEvaluations);
};
exports.getStats = getStats;