"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLogThresholdExecutor = exports.buildFiltersFromCriteria = exports.LogsThresholdFiredActionGroupId = exports.FIRED_ACTIONS = void 0;
exports.executeAlert = executeAlert;
exports.executeRatioAlert = executeRatioAlert;
exports.queryMappings = exports.processUngroupedResults = exports.processUngroupedRatioResults = exports.processGroupByResults = exports.processGroupByRatioResults = exports.getUngroupedESQuery = exports.getPositiveComparators = exports.getNegativeComparators = exports.getGroupedESQuery = void 0;
var _i18n = require("@kbn/i18n");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _common = require("../../../../../spaces/common");
var _log_threshold = require("../../../../common/alerting/logs/log_threshold");
var _runtime_types = require("../../../../common/runtime_types");
var _alert_link = require("../../../../common/formatters/alert_link");
var _get_interval_in_seconds = require("../../../../common/utils/get_interval_in_seconds");
var _utils = require("../common/utils");
var _reason_formatters = require("./reason_formatters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const COMPOSITE_GROUP_SIZE = 2000;
const checkValueAgainstComparatorMap = {
  [_log_threshold.Comparator.GT]: (a, b) => a > b,
  [_log_threshold.Comparator.GT_OR_EQ]: (a, b) => a >= b,
  [_log_threshold.Comparator.LT]: (a, b) => a < b,
  [_log_threshold.Comparator.LT_OR_EQ]: (a, b) => a <= b
};

// The executor execution roughly follows a pattern of:
// ES Query generation -> fetching of results -> processing of results.
// With forks for group_by vs ungrouped, and ratio vs non-ratio.

const createLogThresholdExecutor = libs => libs.logsRules.createLifecycleRuleExecutor(async ({
  services,
  params,
  spaceId,
  startedAt
}) => {
  const {
    alertFactory: {
      alertLimit
    },
    alertWithLifecycle,
    savedObjectsClient,
    scopedClusterClient,
    getAlertStartedDate,
    getAlertUuid
  } = services;
  const {
    basePath
  } = libs;
  const alertFactory = (id, reason, value, threshold, actions) => {
    const alert = alertWithLifecycle({
      id,
      fields: {
        [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: threshold,
        [_ruleDataUtils.ALERT_EVALUATION_VALUE]: value,
        [_ruleDataUtils.ALERT_REASON]: reason
      }
    });
    if (actions && actions.length > 0) {
      var _getAlertStartedDate;
      const indexedStartedAt = (_getAlertStartedDate = getAlertStartedDate(id)) !== null && _getAlertStartedDate !== void 0 ? _getAlertStartedDate : startedAt.toISOString();
      const relativeViewInAppUrl = (0, _alert_link.getLogsAppAlertUrl)(new Date(indexedStartedAt).getTime());
      const viewInAppUrl = (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, relativeViewInAppUrl);
      const sharedContext = {
        timestamp: startedAt.toISOString(),
        viewInAppUrl
      };
      actions.forEach(actionSet => {
        const {
          actionGroup,
          context
        } = actionSet;
        const alertInstanceId = context.group || id;
        const alertUuid = getAlertUuid(alertInstanceId);
        alert.scheduleActions(actionGroup, {
          ...sharedContext,
          ...context,
          alertDetailsUrl: (0, _utils.getAlertDetailsUrl)(libs.basePath, spaceId, alertUuid)
        });
      });
    }
    alert.replaceState({
      alertState: _log_threshold.AlertStates.ALERT
    });
    return alert;
  };
  const [,, {
    logViews
  }] = await libs.getStartServices();
  const {
    indices,
    timestampField,
    runtimeMappings
  } = await logViews.getClient(savedObjectsClient, scopedClusterClient.asCurrentUser).getResolvedLogView('default'); // TODO: move to params

  try {
    const validatedParams = (0, _runtime_types.decodeOrThrow)(_log_threshold.ruleParamsRT)(params);
    if (!(0, _log_threshold.isRatioRuleParams)(validatedParams)) {
      await executeAlert(validatedParams, timestampField, indices, runtimeMappings, scopedClusterClient.asCurrentUser, alertFactory, alertLimit, startedAt.valueOf());
    } else {
      await executeRatioAlert(validatedParams, timestampField, indices, runtimeMappings, scopedClusterClient.asCurrentUser, alertFactory, alertLimit, startedAt.valueOf());
    }
    const {
      getRecoveredAlerts
    } = services.alertFactory.done();
    const recoveredAlerts = getRecoveredAlerts();
    processRecoveredAlerts({
      basePath,
      getAlertStartedDate,
      getAlertUuid,
      recoveredAlerts,
      spaceId,
      startedAt,
      validatedParams
    });
  } catch (e) {
    throw new Error(e);
  }
});
exports.createLogThresholdExecutor = createLogThresholdExecutor;
async function executeAlert(ruleParams, timestampField, indexPattern, runtimeMappings, esClient, alertFactory, alertLimit, executionTimestamp) {
  const query = getESQuery(ruleParams, timestampField, indexPattern, runtimeMappings, executionTimestamp);
  if (!query) {
    throw new Error('ES query could not be built from the provided alert params');
  }
  if ((0, _log_threshold.hasGroupBy)(ruleParams)) {
    processGroupByResults(await getGroupedResults(query, esClient), ruleParams, alertFactory, alertLimit);
  } else {
    processUngroupedResults(await getUngroupedResults(query, esClient), ruleParams, alertFactory, alertLimit);
  }
}
async function executeRatioAlert(ruleParams, timestampField, indexPattern, runtimeMappings, esClient, alertFactory, alertLimit, executionTimestamp) {
  // Ratio alert params are separated out into two standard sets of alert params
  const numeratorParams = {
    ...ruleParams,
    criteria: (0, _log_threshold.getNumerator)(ruleParams.criteria)
  };
  const denominatorParams = {
    ...ruleParams,
    criteria: (0, _log_threshold.getDenominator)(ruleParams.criteria)
  };
  const numeratorQuery = getESQuery(numeratorParams, timestampField, indexPattern, runtimeMappings, executionTimestamp);
  const denominatorQuery = getESQuery(denominatorParams, timestampField, indexPattern, runtimeMappings, executionTimestamp);
  if (!numeratorQuery || !denominatorQuery) {
    throw new Error('ES query could not be built from the provided ratio alert params');
  }
  if ((0, _log_threshold.hasGroupBy)(ruleParams)) {
    const [numeratorGroupedResults, denominatorGroupedResults] = await Promise.all([getGroupedResults(numeratorQuery, esClient), getGroupedResults(denominatorQuery, esClient)]);
    processGroupByRatioResults(numeratorGroupedResults, denominatorGroupedResults, ruleParams, alertFactory, alertLimit);
  } else {
    const [numeratorUngroupedResults, denominatorUngroupedResults] = await Promise.all([getUngroupedResults(numeratorQuery, esClient), getUngroupedResults(denominatorQuery, esClient)]);
    processUngroupedRatioResults(numeratorUngroupedResults, denominatorUngroupedResults, ruleParams, alertFactory, alertLimit);
  }
}
const getESQuery = (alertParams, timestampField, indexPattern, runtimeMappings, executionTimestamp) => {
  return (0, _log_threshold.hasGroupBy)(alertParams) ? getGroupedESQuery(alertParams, timestampField, indexPattern, runtimeMappings, executionTimestamp) : getUngroupedESQuery(alertParams, timestampField, indexPattern, runtimeMappings, executionTimestamp);
};
const processUngroupedResults = (results, params, alertFactory, alertLimit) => {
  const {
    count,
    criteria,
    timeSize,
    timeUnit
  } = params;
  const documentCount = results.hits.total.value;
  const reasonMessage = (0, _reason_formatters.getReasonMessageForUngroupedCountAlert)(documentCount, count.value, count.comparator, timeSize, timeUnit);
  if (checkValueAgainstComparatorMap[count.comparator](documentCount, count.value)) {
    const actions = [{
      actionGroup: FIRED_ACTIONS.id,
      context: {
        matchingDocuments: documentCount,
        conditions: createConditionsMessageForCriteria(criteria),
        group: null,
        isRatio: false,
        reason: reasonMessage
      }
    }];
    alertFactory(_utils.UNGROUPED_FACTORY_KEY, reasonMessage, documentCount, count.value, actions);
    alertLimit.setLimitReached(alertLimit.getValue() <= 1);
  } else {
    alertLimit.setLimitReached(false);
  }
};
exports.processUngroupedResults = processUngroupedResults;
const processUngroupedRatioResults = (numeratorResults, denominatorResults, params, alertFactory, alertLimit) => {
  const {
    count,
    criteria,
    timeSize,
    timeUnit
  } = params;
  const numeratorCount = numeratorResults.hits.total.value;
  const denominatorCount = denominatorResults.hits.total.value;
  const ratio = getRatio(numeratorCount, denominatorCount);
  if (ratio !== undefined && checkValueAgainstComparatorMap[count.comparator](ratio, count.value)) {
    const reasonMessage = (0, _reason_formatters.getReasonMessageForUngroupedRatioAlert)(ratio, count.value, count.comparator, timeSize, timeUnit);
    const actions = [{
      actionGroup: FIRED_ACTIONS.id,
      context: {
        ratio,
        numeratorConditions: createConditionsMessageForCriteria((0, _log_threshold.getNumerator)(criteria)),
        denominatorConditions: createConditionsMessageForCriteria((0, _log_threshold.getDenominator)(criteria)),
        group: null,
        isRatio: true,
        reason: reasonMessage
      }
    }];
    alertFactory(_utils.UNGROUPED_FACTORY_KEY, reasonMessage, ratio, count.value, actions);
    alertLimit.setLimitReached(alertLimit.getValue() <= 1);
  } else {
    alertLimit.setLimitReached(false);
  }
};
exports.processUngroupedRatioResults = processUngroupedRatioResults;
const getRatio = (numerator, denominator) => {
  // We follow the mathematics principle that dividing by 0 isn't possible,
  // and a ratio is therefore undefined (or indeterminate).
  if (numerator === 0 || denominator === 0) return undefined;
  return numerator / denominator;
};
const getReducedGroupByResults = results => {
  const getGroupName = key => Object.values(key).join(', ');
  const reducedGroupByResults = [];
  if ((0, _log_threshold.isOptimizedGroupedSearchQueryResponse)(results)) {
    for (const groupBucket of results) {
      const groupName = getGroupName(groupBucket.key);
      reducedGroupByResults.push({
        name: groupName,
        documentCount: groupBucket.doc_count
      });
    }
  } else {
    for (const groupBucket of results) {
      const groupName = getGroupName(groupBucket.key);
      reducedGroupByResults.push({
        name: groupName,
        documentCount: groupBucket.filtered_results.doc_count
      });
    }
  }
  return reducedGroupByResults;
};
const processGroupByResults = (results, params, alertFactory, alertLimit) => {
  const {
    count,
    criteria,
    timeSize,
    timeUnit
  } = params;
  const groupResults = getReducedGroupByResults(results);
  let remainingAlertCount = alertLimit.getValue();
  for (const group of groupResults) {
    if (remainingAlertCount <= 0) {
      break;
    }
    const documentCount = group.documentCount;
    if (checkValueAgainstComparatorMap[count.comparator](documentCount, count.value)) {
      remainingAlertCount -= 1;
      const reasonMessage = (0, _reason_formatters.getReasonMessageForGroupedCountAlert)(documentCount, count.value, count.comparator, group.name, timeSize, timeUnit);
      const actions = [{
        actionGroup: FIRED_ACTIONS.id,
        context: {
          matchingDocuments: documentCount,
          conditions: createConditionsMessageForCriteria(criteria),
          group: group.name,
          isRatio: false,
          reason: reasonMessage
        }
      }];
      alertFactory(group.name, reasonMessage, documentCount, count.value, actions);
    }
  }
  alertLimit.setLimitReached(remainingAlertCount <= 0);
};
exports.processGroupByResults = processGroupByResults;
const processGroupByRatioResults = (numeratorResults, denominatorResults, params, alertFactory, alertLimit) => {
  const {
    count,
    criteria,
    timeSize,
    timeUnit
  } = params;
  const numeratorGroupResults = getReducedGroupByResults(numeratorResults);
  const denominatorGroupResults = getReducedGroupByResults(denominatorResults);
  let remainingAlertCount = alertLimit.getValue();
  for (const numeratorGroup of numeratorGroupResults) {
    if (remainingAlertCount <= 0) {
      break;
    }
    const numeratorDocumentCount = numeratorGroup.documentCount;
    const denominatorGroup = denominatorGroupResults.find(_group => _group.name === numeratorGroup.name);
    // If there is no matching group, a ratio cannot be determined, and is therefore undefined.
    const ratio = denominatorGroup ? getRatio(numeratorDocumentCount, denominatorGroup.documentCount) : undefined;
    if (ratio !== undefined && checkValueAgainstComparatorMap[count.comparator](ratio, count.value)) {
      remainingAlertCount -= 1;
      const reasonMessage = (0, _reason_formatters.getReasonMessageForGroupedRatioAlert)(ratio, count.value, count.comparator, numeratorGroup.name, timeSize, timeUnit);
      const actions = [{
        actionGroup: FIRED_ACTIONS.id,
        context: {
          ratio,
          numeratorConditions: createConditionsMessageForCriteria((0, _log_threshold.getNumerator)(criteria)),
          denominatorConditions: createConditionsMessageForCriteria((0, _log_threshold.getDenominator)(criteria)),
          group: numeratorGroup.name,
          isRatio: true,
          reason: reasonMessage
        }
      }];
      alertFactory(numeratorGroup.name, reasonMessage, ratio, count.value, actions);
    }
  }
  alertLimit.setLimitReached(remainingAlertCount <= 0);
};
exports.processGroupByRatioResults = processGroupByRatioResults;
const buildFiltersFromCriteria = (params, timestampField, executionTimestamp) => {
  const {
    timeSize,
    timeUnit,
    criteria
  } = params;
  const interval = `${timeSize}${timeUnit}`;
  const intervalAsSeconds = (0, _get_interval_in_seconds.getIntervalInSeconds)(interval);
  const intervalAsMs = intervalAsSeconds * 1000;
  const to = executionTimestamp;
  const from = to - intervalAsMs;
  const positiveComparators = getPositiveComparators();
  const negativeComparators = getNegativeComparators();
  const positiveCriteria = criteria.filter(criterion => positiveComparators.includes(criterion.comparator));
  const negativeCriteria = criteria.filter(criterion => negativeComparators.includes(criterion.comparator));
  // Positive assertions (things that "must" match)
  const mustFilters = buildFiltersForCriteria(positiveCriteria);
  // Negative assertions (things that "must not" match)
  const mustNotFilters = buildFiltersForCriteria(negativeCriteria);
  const rangeFilter = {
    range: {
      [timestampField]: {
        gte: from,
        lte: to,
        format: 'epoch_millis'
      }
    }
  };

  // For group by scenarios we'll pad the time range by 1 x the interval size on the left (lte) and right (gte), this is so
  // a wider net is cast to "capture" the groups. This is to account for scenarios where we want ascertain if
  // there were "no documents" (less than 1 for example). In these cases we may be missing documents to build the groups
  // and match / not match the criteria.
  const groupedRangeFilter = {
    range: {
      [timestampField]: {
        gte: from - intervalAsMs,
        lte: to + intervalAsMs,
        format: 'epoch_millis'
      }
    }
  };
  return {
    rangeFilter,
    groupedRangeFilter,
    mustFilters,
    mustNotFilters
  };
};
exports.buildFiltersFromCriteria = buildFiltersFromCriteria;
const getGroupedESQuery = (params, timestampField, index, runtimeMappings, executionTimestamp) => {
  // IMPORTANT:
  // For the group by scenario we need to account for users utilizing "less than" configurations
  // to attempt to match on "0", e.g. something has stopped reporting. We need to cast a wider net for these
  // configurations to try and capture more documents, so that the filtering doesn't make the group "disappear".
  // Due to this there are two forks in the group by code, one where we can optimize the filtering early, and one where
  // it is an inner aggregation. "Less than" configurations with high cardinality group by fields can cause severe performance
  // problems.

  const {
    groupBy,
    count: {
      comparator,
      value
    }
  } = params;
  if (!groupBy || !groupBy.length) {
    return;
  }
  const {
    rangeFilter,
    groupedRangeFilter,
    mustFilters,
    mustNotFilters
  } = buildFiltersFromCriteria(params, timestampField, executionTimestamp);
  if ((0, _log_threshold.isOptimizableGroupedThreshold)(comparator, value)) {
    const aggregations = {
      groups: {
        composite: {
          size: COMPOSITE_GROUP_SIZE,
          sources: groupBy.map((field, groupIndex) => ({
            [`group-${groupIndex}-${field}`]: {
              terms: {
                field
              }
            }
          }))
        }
      }
    };
    const body = {
      query: {
        bool: {
          filter: [rangeFilter, ...mustFilters],
          ...(mustNotFilters.length > 0 && {
            must_not: mustNotFilters
          })
        }
      },
      aggregations,
      runtime_mappings: runtimeMappings,
      size: 0
    };
    return {
      index,
      allow_no_indices: true,
      ignore_unavailable: true,
      body
    };
  } else {
    const aggregations = {
      groups: {
        composite: {
          size: COMPOSITE_GROUP_SIZE,
          sources: groupBy.map((field, groupIndex) => ({
            [`group-${groupIndex}-${field}`]: {
              terms: {
                field
              }
            }
          }))
        },
        aggregations: {
          filtered_results: {
            filter: {
              bool: {
                // Scope the inner filtering back to the unpadded range
                filter: [rangeFilter, ...mustFilters],
                ...(mustNotFilters.length > 0 && {
                  must_not: mustNotFilters
                })
              }
            }
          }
        }
      }
    };
    const body = {
      query: {
        bool: {
          filter: [groupedRangeFilter]
        }
      },
      aggregations,
      runtime_mappings: runtimeMappings,
      size: 0
    };
    return {
      index,
      allow_no_indices: true,
      ignore_unavailable: true,
      body
    };
  }
};
exports.getGroupedESQuery = getGroupedESQuery;
const getUngroupedESQuery = (params, timestampField, index, runtimeMappings, executionTimestamp) => {
  const {
    rangeFilter,
    mustFilters,
    mustNotFilters
  } = buildFiltersFromCriteria(params, timestampField, executionTimestamp);
  const body = {
    // Ensure we accurately track the hit count for the ungrouped case, otherwise we can only ensure accuracy up to 10,000.
    track_total_hits: true,
    query: {
      bool: {
        filter: [rangeFilter, ...mustFilters],
        ...(mustNotFilters.length > 0 && {
          must_not: mustNotFilters
        })
      }
    },
    runtime_mappings: runtimeMappings,
    size: 0
  };
  return {
    index,
    allow_no_indices: true,
    ignore_unavailable: true,
    body
  };
};
exports.getUngroupedESQuery = getUngroupedESQuery;
const buildFiltersForCriteria = criteria => {
  let filters = [];
  criteria.forEach(criterion => {
    const criterionQuery = buildCriterionQuery(criterion);
    if (criterionQuery) {
      filters = [...filters, criterionQuery];
    }
  });
  return filters;
};
const buildCriterionQuery = criterion => {
  const {
    field,
    value,
    comparator
  } = criterion;
  const queryType = getQueryMappingForComparator(comparator);
  switch (queryType) {
    case 'term':
      return {
        term: {
          [field]: {
            value
          }
        }
      };
    case 'match':
      {
        return {
          match: {
            [field]: value
          }
        };
      }
    case 'match_phrase':
      {
        return {
          match_phrase: {
            [field]: String(value)
          }
        };
      }
    case 'range':
      {
        const comparatorToRangePropertyMapping = {
          [_log_threshold.Comparator.LT]: 'lt',
          [_log_threshold.Comparator.LT_OR_EQ]: 'lte',
          [_log_threshold.Comparator.GT]: 'gt',
          [_log_threshold.Comparator.GT_OR_EQ]: 'gte'
        };
        const rangeProperty = comparatorToRangePropertyMapping[comparator];
        return {
          range: {
            [field]: {
              [rangeProperty]: value
            }
          }
        };
      }
    default:
      {
        return undefined;
      }
  }
};
const getPositiveComparators = () => {
  return [_log_threshold.Comparator.GT, _log_threshold.Comparator.GT_OR_EQ, _log_threshold.Comparator.LT, _log_threshold.Comparator.LT_OR_EQ, _log_threshold.Comparator.EQ, _log_threshold.Comparator.MATCH, _log_threshold.Comparator.MATCH_PHRASE];
};
exports.getPositiveComparators = getPositiveComparators;
const getNegativeComparators = () => {
  return [_log_threshold.Comparator.NOT_EQ, _log_threshold.Comparator.NOT_MATCH, _log_threshold.Comparator.NOT_MATCH_PHRASE];
};
exports.getNegativeComparators = getNegativeComparators;
const queryMappings = {
  [_log_threshold.Comparator.GT]: 'range',
  [_log_threshold.Comparator.GT_OR_EQ]: 'range',
  [_log_threshold.Comparator.LT]: 'range',
  [_log_threshold.Comparator.LT_OR_EQ]: 'range',
  [_log_threshold.Comparator.EQ]: 'term',
  [_log_threshold.Comparator.MATCH]: 'match',
  [_log_threshold.Comparator.MATCH_PHRASE]: 'match_phrase',
  [_log_threshold.Comparator.NOT_EQ]: 'term',
  [_log_threshold.Comparator.NOT_MATCH]: 'match',
  [_log_threshold.Comparator.NOT_MATCH_PHRASE]: 'match_phrase'
};
exports.queryMappings = queryMappings;
const getQueryMappingForComparator = comparator => {
  return queryMappings[comparator];
};
const getUngroupedResults = async (query, esClient) => {
  return (0, _runtime_types.decodeOrThrow)(_log_threshold.UngroupedSearchQueryResponseRT)(await esClient.search(query));
};
const getGroupedResults = async (query, esClient) => {
  let compositeGroupBuckets = [];
  let lastAfterKey;
  while (true) {
    const queryWithAfterKey = {
      ...query
    };
    queryWithAfterKey.body.aggregations.groups.composite.after = lastAfterKey;
    const groupResponse = (0, _runtime_types.decodeOrThrow)(_log_threshold.GroupedSearchQueryResponseRT)(await esClient.search(queryWithAfterKey));
    compositeGroupBuckets = [...compositeGroupBuckets, ...groupResponse.aggregations.groups.buckets];
    lastAfterKey = groupResponse.aggregations.groups.after_key;
    if (groupResponse.aggregations.groups.buckets.length < COMPOSITE_GROUP_SIZE) {
      break;
    }
  }
  return compositeGroupBuckets;
};
const processRecoveredAlerts = ({
  basePath,
  getAlertStartedDate,
  getAlertUuid,
  recoveredAlerts,
  spaceId,
  startedAt,
  validatedParams
}) => {
  for (const alert of recoveredAlerts) {
    var _getAlertStartedDate2;
    const recoveredAlertId = alert.getId();
    const indexedStartedAt = (_getAlertStartedDate2 = getAlertStartedDate(recoveredAlertId)) !== null && _getAlertStartedDate2 !== void 0 ? _getAlertStartedDate2 : startedAt.toISOString();
    const relativeViewInAppUrl = (0, _alert_link.getLogsAppAlertUrl)(new Date(indexedStartedAt).getTime());
    const alertUuid = getAlertUuid(recoveredAlertId);
    const viewInAppUrl = (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, relativeViewInAppUrl);
    const baseContext = {
      alertDetailsUrl: (0, _utils.getAlertDetailsUrl)(basePath, spaceId, alertUuid),
      group: (0, _log_threshold.hasGroupBy)(validatedParams) ? recoveredAlertId : null,
      timestamp: startedAt.toISOString(),
      viewInAppUrl
    };
    if ((0, _log_threshold.isRatioRuleParams)(validatedParams)) {
      const {
        criteria
      } = validatedParams;
      alert.setContext({
        ...baseContext,
        numeratorConditions: createConditionsMessageForCriteria((0, _log_threshold.getNumerator)(criteria)),
        denominatorConditions: createConditionsMessageForCriteria((0, _log_threshold.getDenominator)(criteria)),
        isRatio: true
      });
    } else {
      const {
        criteria
      } = validatedParams;
      alert.setContext({
        ...baseContext,
        conditions: createConditionsMessageForCriteria(criteria),
        isRatio: false
      });
    }
  }
};
const createConditionsMessageForCriteria = criteria => criteria.map(criterion => {
  const {
    field,
    comparator,
    value
  } = criterion;
  return `${field} ${comparator} ${value}`;
}).join(' and ');

// When the Alerting plugin implements support for multiple action groups, add additional
// action groups here to send different messages, e.g. a recovery notification
const LogsThresholdFiredActionGroupId = 'logs.threshold.fired';
exports.LogsThresholdFiredActionGroupId = LogsThresholdFiredActionGroupId;
const FIRED_ACTIONS = {
  id: LogsThresholdFiredActionGroupId,
  name: _i18n.i18n.translate('xpack.infra.logs.alerting.threshold.fired', {
    defaultMessage: 'Fired'
  })
};
exports.FIRED_ACTIONS = FIRED_ACTIONS;