"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapRuleExecutionStatusToPlatformStatus = exports.mapPlatformStatusToRuleExecutionStatus = exports.getProviderAndActionFilter = exports.getExecutionEventAggregation = exports.formatSortForTermsSort = exports.formatSortForBucketSort = exports.formatExecutionEventResponse = exports.formatAggExecutionEventFromBucket = void 0;
var _lodash = require("lodash");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _rule_monitoring = require("../../../../../../../../common/detection_engine/rule_monitoring");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Base ECS fields
const ACTION_FIELD = 'event.action';
const DURATION_FIELD = 'event.duration';
const ERROR_MESSAGE_FIELD = 'error.message';
const MESSAGE_FIELD = 'message';
const PROVIDER_FIELD = 'event.provider';
const OUTCOME_FIELD = 'event.outcome';
const START_FIELD = 'event.start';
const TIMESTAMP_FIELD = '@timestamp';
// Platform fields
const SCHEDULE_DELAY_FIELD = 'kibana.task.schedule_delay';
const ES_SEARCH_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.es_search_duration_ms';
const TOTAL_ACTIONS_TRIGGERED_FIELD = 'kibana.alert.rule.execution.metrics.number_of_triggered_actions';
// TODO: To be added in https://github.com/elastic/kibana/pull/126210
// const TOTAL_ALERTS_CREATED: 'kibana.alert.rule.execution.metrics.total_alerts_created',
// const TOTAL_ALERTS_DETECTED: 'kibana.alert.rule.execution.metrics.total_alerts_detected',
// Security fields
const GAP_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.execution_gap_duration_s';
const INDEXING_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.total_indexing_duration_ms';
const SEARCH_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.total_search_duration_ms';
const STATUS_FIELD = 'kibana.alert.rule.execution.status';
const ONE_MILLISECOND_AS_NANOSECONDS = 1_000_000;
const SORT_FIELD_TO_AGG_MAPPING = {
  timestamp: 'ruleExecution>executeStartTime',
  duration_ms: 'ruleExecution>executionDuration',
  indexing_duration_ms: 'securityMetrics>indexDuration',
  search_duration_ms: 'securityMetrics>searchDuration',
  gap_duration_s: 'securityMetrics>gapDuration',
  schedule_delay_ms: 'ruleExecution>scheduleDelay',
  num_triggered_actions: 'ruleExecution>numTriggeredActions'
  // TODO: To be added in https://github.com/elastic/kibana/pull/126210
  // total_alerts_created: 'securityMetrics>totalAlertsDetected',
  // total_alerts_detected: 'securityMetrics>totalAlertsCreated',
};

/**
 * Returns `aggs` to be supplied to aggregateEventsBySavedObjectIds
 * @param maxExecutions upper bounds of execution events to return (to narrow below max terms agg limit)
 * @param page current page to retrieve, starting at 0
 * @param perPage number of execution events to display per page
 * @param sort field to sort on
 */
const getExecutionEventAggregation = ({
  maxExecutions,
  page,
  perPage,
  sort
}) => {
  // Last stop validation for any other consumers so there's a friendly message instead of failed ES Query
  if (maxExecutions > _securitysolutionRules.MAX_EXECUTION_EVENTS_DISPLAYED) {
    throw new _securitysolutionEsUtils.BadRequestError(`Invalid maxExecutions requested "${maxExecutions}" - must be less than ${_securitysolutionRules.MAX_EXECUTION_EVENTS_DISPLAYED}`);
  }
  if (page <= 0) {
    throw new _securitysolutionEsUtils.BadRequestError(`Invalid page field "${page}" - must be greater than 0`);
  }
  if (perPage <= 0) {
    throw new _securitysolutionEsUtils.BadRequestError(`Invalid perPage field "${perPage}" - must be greater than 0`);
  }
  const sortFields = (0, _lodash.flatMap)(sort, s => Object.keys(s));
  for (const field of sortFields) {
    if (!Object.keys(SORT_FIELD_TO_AGG_MAPPING).includes(field)) {
      throw new _securitysolutionEsUtils.BadRequestError(`Invalid sort field "${field}" - must be one of [${Object.keys(SORT_FIELD_TO_AGG_MAPPING).join(',')}]`);
    }
  }
  return {
    // Total unique executions for given root filters
    totalExecutions: {
      cardinality: {
        field: _types.EXECUTION_UUID_FIELD
      }
    },
    executionUuid: {
      // Bucket by execution UUID
      terms: {
        field: _types.EXECUTION_UUID_FIELD,
        size: maxExecutions,
        order: formatSortForTermsSort(sort)
      },
      aggs: {
        // Bucket sort for paging
        executionUuidSorted: {
          bucket_sort: {
            sort: formatSortForBucketSort(sort),
            from: (page - 1) * perPage,
            size: perPage,
            // Must override gap_policy to not miss fields/docs, for details see: https://github.com/elastic/kibana/pull/127339/files#r825240516
            gap_policy: 'insert_zeros'
          }
        },
        // Filter by action execute doc to retrieve action outcomes (successful/failed)
        actionExecution: {
          filter: getProviderAndActionFilter('actions', 'execute'),
          aggs: {
            actionOutcomes: {
              terms: {
                field: OUTCOME_FIELD,
                // Size is 2 here as outcomes we're collating are `success` & `failed`
                size: 2
              }
            }
          }
        },
        // Filter by alerting execute doc to retrieve platform metrics
        ruleExecution: {
          filter: getProviderAndActionFilter('alerting', 'execute'),
          aggs: {
            executeStartTime: {
              min: {
                field: START_FIELD
              }
            },
            scheduleDelay: {
              max: {
                field: SCHEDULE_DELAY_FIELD
              }
            },
            esSearchDuration: {
              max: {
                field: ES_SEARCH_DURATION_FIELD
              }
            },
            numTriggeredActions: {
              max: {
                field: TOTAL_ACTIONS_TRIGGERED_FIELD
              }
            },
            executionDuration: {
              max: {
                field: DURATION_FIELD
              }
            },
            outcomeAndMessage: {
              top_hits: {
                size: 1,
                _source: {
                  includes: [ERROR_MESSAGE_FIELD, OUTCOME_FIELD, MESSAGE_FIELD]
                }
              }
            }
          }
        },
        // Filter by securitySolution status-change doc to retrieve security metrics
        securityMetrics: {
          filter: getProviderAndActionFilter('securitySolution.ruleExecution', 'execution-metrics'),
          aggs: {
            gapDuration: {
              min: {
                field: GAP_DURATION_FIELD,
                missing: 0 // Necessary for sorting since field isn't written if no gap
              }
            },

            indexDuration: {
              min: {
                field: INDEXING_DURATION_FIELD
              }
            },
            searchDuration: {
              min: {
                field: SEARCH_DURATION_FIELD
              }
            }
          }
        },
        // Filter by securitySolution ruleExecution doc to retrieve status and message
        securityStatus: {
          filter: getProviderAndActionFilter('securitySolution.ruleExecution', 'status-change'),
          aggs: {
            status: {
              top_hits: {
                sort: {
                  [TIMESTAMP_FIELD]: {
                    order: 'desc'
                  }
                },
                size: 1,
                _source: {
                  includes: STATUS_FIELD
                }
              }
            },
            message: {
              top_hits: {
                size: 1,
                sort: {
                  [TIMESTAMP_FIELD]: {
                    order: 'desc'
                  }
                },
                _source: {
                  includes: MESSAGE_FIELD
                }
              }
            }
          }
        },
        // If there was a timeout, this filter will return non-zero doc count
        timeoutMessage: {
          filter: getProviderAndActionFilter('alerting', 'execute-timeout')
        }
      }
    }
  };
};

/**
 * Returns bool filter for matching a specific provider AND action combination
 * @param provider provider to match
 * @param action action to match
 */
exports.getExecutionEventAggregation = getExecutionEventAggregation;
const getProviderAndActionFilter = (provider, action) => {
  return {
    bool: {
      must: [{
        match: {
          [ACTION_FIELD]: action
        }
      }, {
        match: {
          [PROVIDER_FIELD]: provider
        }
      }]
    }
  };
};

/**
 * Formats aggregate execution event from bucket response
 * @param bucket
 */
exports.getProviderAndActionFilter = getProviderAndActionFilter;
const formatAggExecutionEventFromBucket = bucket => {
  var _bucket$ruleExecution, _bucket$ruleExecution2, _bucket$ruleExecution3, _bucket$ruleExecution4, _bucket$ruleExecution5, _bucket$ruleExecution6, _bucket$timeoutMessag, _bucket$timeoutMessag2, _bucket$actionExecuti, _bucket$actionExecuti2, _bucket$actionExecuti3, _actionOutcomes$find$, _actionOutcomes$find, _actionOutcomes$find$2, _actionOutcomes$find2, _bucket$key, _bucket$ruleExecution7, _bucket$ruleExecution8, _bucket$ruleExecution9, _bucket$ruleExecution10, _bucket$ruleExecution11, _bucket$ruleExecution12, _bucket$ruleExecution13, _bucket$ruleExecution14, _bucket$ruleExecution15, _bucket$ruleExecution16, _bucket$ruleExecution17, _bucket$ruleExecution18, _bucket$ruleExecution19, _bucket$alertCounts$b, _bucket$alertCounts, _bucket$alertCounts$b2, _bucket$alertCounts$b3, _bucket$alertCounts$b4, _bucket$alertCounts2, _bucket$alertCounts2$, _bucket$alertCounts2$2, _bucket$alertCounts$b5, _bucket$alertCounts3, _bucket$alertCounts3$, _bucket$alertCounts3$2, _bucket$ruleExecution20, _bucket$ruleExecution21, _bucket$ruleExecution22, _bucket$ruleExecution23, _bucket$ruleExecution24, _bucket$ruleExecution25, _bucket$ruleExecution26, _bucket$ruleExecution27, _bucket$ruleExecution28, _bucket$securityMetri, _bucket$securityMetri2, _bucket$securityMetri3, _bucket$securityMetri4, _bucket$securityMetri5, _bucket$securityMetri6, _bucket$securityMetri7, _bucket$securityMetri8, _bucket$securityMetri9, _bucket$securityStatu, _bucket$securityStatu2, _bucket$securityStatu3, _bucket$securityStatu4, _bucket$securityStatu5, _bucket$securityStatu6, _bucket$securityStatu7, _bucket$securityStatu8, _bucket$securityStatu9, _bucket$securityStatu10, _bucket$ruleExecution29, _bucket$ruleExecution30, _bucket$ruleExecution31, _bucket$ruleExecution32, _bucket$ruleExecution33, _bucket$ruleExecution34, _bucket$securityStatu11, _bucket$securityStatu12, _bucket$securityStatu13, _bucket$securityStatu14, _bucket$securityStatu15, _bucket$securityStatu16, _bucket$ruleExecution35, _bucket$ruleExecution36, _bucket$ruleExecution37, _bucket$ruleExecution38, _bucket$ruleExecution39, _bucket$ruleExecution40;
  const durationUs = (_bucket$ruleExecution = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution2 = bucket.ruleExecution) === null || _bucket$ruleExecution2 === void 0 ? void 0 : (_bucket$ruleExecution3 = _bucket$ruleExecution2.executionDuration) === null || _bucket$ruleExecution3 === void 0 ? void 0 : _bucket$ruleExecution3.value) !== null && _bucket$ruleExecution !== void 0 ? _bucket$ruleExecution : 0;
  const scheduleDelayUs = (_bucket$ruleExecution4 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution5 = bucket.ruleExecution) === null || _bucket$ruleExecution5 === void 0 ? void 0 : (_bucket$ruleExecution6 = _bucket$ruleExecution5.scheduleDelay) === null || _bucket$ruleExecution6 === void 0 ? void 0 : _bucket$ruleExecution6.value) !== null && _bucket$ruleExecution4 !== void 0 ? _bucket$ruleExecution4 : 0;
  const timedOut = ((_bucket$timeoutMessag = bucket === null || bucket === void 0 ? void 0 : (_bucket$timeoutMessag2 = bucket.timeoutMessage) === null || _bucket$timeoutMessag2 === void 0 ? void 0 : _bucket$timeoutMessag2.doc_count) !== null && _bucket$timeoutMessag !== void 0 ? _bucket$timeoutMessag : 0) > 0;
  const actionOutcomes = (_bucket$actionExecuti = bucket === null || bucket === void 0 ? void 0 : (_bucket$actionExecuti2 = bucket.actionExecution) === null || _bucket$actionExecuti2 === void 0 ? void 0 : (_bucket$actionExecuti3 = _bucket$actionExecuti2.actionOutcomes) === null || _bucket$actionExecuti3 === void 0 ? void 0 : _bucket$actionExecuti3.buckets) !== null && _bucket$actionExecuti !== void 0 ? _bucket$actionExecuti : [];
  const actionExecutionSuccess = (_actionOutcomes$find$ = (_actionOutcomes$find = actionOutcomes.find(b => (b === null || b === void 0 ? void 0 : b.key) === 'success')) === null || _actionOutcomes$find === void 0 ? void 0 : _actionOutcomes$find.doc_count) !== null && _actionOutcomes$find$ !== void 0 ? _actionOutcomes$find$ : 0;
  const actionExecutionError = (_actionOutcomes$find$2 = (_actionOutcomes$find2 = actionOutcomes.find(b => (b === null || b === void 0 ? void 0 : b.key) === 'failure')) === null || _actionOutcomes$find2 === void 0 ? void 0 : _actionOutcomes$find2.doc_count) !== null && _actionOutcomes$find$2 !== void 0 ? _actionOutcomes$find$2 : 0;
  return {
    execution_uuid: (_bucket$key = bucket === null || bucket === void 0 ? void 0 : bucket.key) !== null && _bucket$key !== void 0 ? _bucket$key : '',
    timestamp: (_bucket$ruleExecution7 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution8 = bucket.ruleExecution) === null || _bucket$ruleExecution8 === void 0 ? void 0 : _bucket$ruleExecution8.executeStartTime.value_as_string) !== null && _bucket$ruleExecution7 !== void 0 ? _bucket$ruleExecution7 : '',
    duration_ms: durationUs / ONE_MILLISECOND_AS_NANOSECONDS,
    status: bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution9 = bucket.ruleExecution) === null || _bucket$ruleExecution9 === void 0 ? void 0 : (_bucket$ruleExecution10 = _bucket$ruleExecution9.outcomeAndMessage) === null || _bucket$ruleExecution10 === void 0 ? void 0 : (_bucket$ruleExecution11 = _bucket$ruleExecution10.hits) === null || _bucket$ruleExecution11 === void 0 ? void 0 : (_bucket$ruleExecution12 = _bucket$ruleExecution11.hits[0]) === null || _bucket$ruleExecution12 === void 0 ? void 0 : (_bucket$ruleExecution13 = _bucket$ruleExecution12._source) === null || _bucket$ruleExecution13 === void 0 ? void 0 : (_bucket$ruleExecution14 = _bucket$ruleExecution13.event) === null || _bucket$ruleExecution14 === void 0 ? void 0 : _bucket$ruleExecution14.outcome,
    message: bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution15 = bucket.ruleExecution) === null || _bucket$ruleExecution15 === void 0 ? void 0 : (_bucket$ruleExecution16 = _bucket$ruleExecution15.outcomeAndMessage) === null || _bucket$ruleExecution16 === void 0 ? void 0 : (_bucket$ruleExecution17 = _bucket$ruleExecution16.hits) === null || _bucket$ruleExecution17 === void 0 ? void 0 : (_bucket$ruleExecution18 = _bucket$ruleExecution17.hits[0]) === null || _bucket$ruleExecution18 === void 0 ? void 0 : (_bucket$ruleExecution19 = _bucket$ruleExecution18._source) === null || _bucket$ruleExecution19 === void 0 ? void 0 : _bucket$ruleExecution19.message,
    num_active_alerts: (_bucket$alertCounts$b = bucket === null || bucket === void 0 ? void 0 : (_bucket$alertCounts = bucket.alertCounts) === null || _bucket$alertCounts === void 0 ? void 0 : (_bucket$alertCounts$b2 = _bucket$alertCounts.buckets) === null || _bucket$alertCounts$b2 === void 0 ? void 0 : (_bucket$alertCounts$b3 = _bucket$alertCounts$b2.activeAlerts) === null || _bucket$alertCounts$b3 === void 0 ? void 0 : _bucket$alertCounts$b3.doc_count) !== null && _bucket$alertCounts$b !== void 0 ? _bucket$alertCounts$b : 0,
    num_new_alerts: (_bucket$alertCounts$b4 = bucket === null || bucket === void 0 ? void 0 : (_bucket$alertCounts2 = bucket.alertCounts) === null || _bucket$alertCounts2 === void 0 ? void 0 : (_bucket$alertCounts2$ = _bucket$alertCounts2.buckets) === null || _bucket$alertCounts2$ === void 0 ? void 0 : (_bucket$alertCounts2$2 = _bucket$alertCounts2$.newAlerts) === null || _bucket$alertCounts2$2 === void 0 ? void 0 : _bucket$alertCounts2$2.doc_count) !== null && _bucket$alertCounts$b4 !== void 0 ? _bucket$alertCounts$b4 : 0,
    num_recovered_alerts: (_bucket$alertCounts$b5 = bucket === null || bucket === void 0 ? void 0 : (_bucket$alertCounts3 = bucket.alertCounts) === null || _bucket$alertCounts3 === void 0 ? void 0 : (_bucket$alertCounts3$ = _bucket$alertCounts3.buckets) === null || _bucket$alertCounts3$ === void 0 ? void 0 : (_bucket$alertCounts3$2 = _bucket$alertCounts3$.recoveredAlerts) === null || _bucket$alertCounts3$2 === void 0 ? void 0 : _bucket$alertCounts3$2.doc_count) !== null && _bucket$alertCounts$b5 !== void 0 ? _bucket$alertCounts$b5 : 0,
    num_triggered_actions: (_bucket$ruleExecution20 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution21 = bucket.ruleExecution) === null || _bucket$ruleExecution21 === void 0 ? void 0 : (_bucket$ruleExecution22 = _bucket$ruleExecution21.numTriggeredActions) === null || _bucket$ruleExecution22 === void 0 ? void 0 : _bucket$ruleExecution22.value) !== null && _bucket$ruleExecution20 !== void 0 ? _bucket$ruleExecution20 : 0,
    num_succeeded_actions: actionExecutionSuccess,
    num_errored_actions: actionExecutionError,
    total_search_duration_ms: (_bucket$ruleExecution23 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution24 = bucket.ruleExecution) === null || _bucket$ruleExecution24 === void 0 ? void 0 : (_bucket$ruleExecution25 = _bucket$ruleExecution24.totalSearchDuration) === null || _bucket$ruleExecution25 === void 0 ? void 0 : _bucket$ruleExecution25.value) !== null && _bucket$ruleExecution23 !== void 0 ? _bucket$ruleExecution23 : 0,
    es_search_duration_ms: (_bucket$ruleExecution26 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution27 = bucket.ruleExecution) === null || _bucket$ruleExecution27 === void 0 ? void 0 : (_bucket$ruleExecution28 = _bucket$ruleExecution27.esSearchDuration) === null || _bucket$ruleExecution28 === void 0 ? void 0 : _bucket$ruleExecution28.value) !== null && _bucket$ruleExecution26 !== void 0 ? _bucket$ruleExecution26 : 0,
    schedule_delay_ms: scheduleDelayUs / ONE_MILLISECOND_AS_NANOSECONDS,
    timed_out: timedOut,
    // security fields
    indexing_duration_ms: (_bucket$securityMetri = bucket === null || bucket === void 0 ? void 0 : (_bucket$securityMetri2 = bucket.securityMetrics) === null || _bucket$securityMetri2 === void 0 ? void 0 : (_bucket$securityMetri3 = _bucket$securityMetri2.indexDuration) === null || _bucket$securityMetri3 === void 0 ? void 0 : _bucket$securityMetri3.value) !== null && _bucket$securityMetri !== void 0 ? _bucket$securityMetri : 0,
    search_duration_ms: (_bucket$securityMetri4 = bucket === null || bucket === void 0 ? void 0 : (_bucket$securityMetri5 = bucket.securityMetrics) === null || _bucket$securityMetri5 === void 0 ? void 0 : (_bucket$securityMetri6 = _bucket$securityMetri5.searchDuration) === null || _bucket$securityMetri6 === void 0 ? void 0 : _bucket$securityMetri6.value) !== null && _bucket$securityMetri4 !== void 0 ? _bucket$securityMetri4 : 0,
    gap_duration_s: (_bucket$securityMetri7 = bucket === null || bucket === void 0 ? void 0 : (_bucket$securityMetri8 = bucket.securityMetrics) === null || _bucket$securityMetri8 === void 0 ? void 0 : (_bucket$securityMetri9 = _bucket$securityMetri8.gapDuration) === null || _bucket$securityMetri9 === void 0 ? void 0 : _bucket$securityMetri9.value) !== null && _bucket$securityMetri7 !== void 0 ? _bucket$securityMetri7 : 0,
    // If security_status isn't available, use platform status from `event.outcome`, but translate to RuleExecutionStatus
    security_status: (_bucket$securityStatu = bucket === null || bucket === void 0 ? void 0 : (_bucket$securityStatu2 = bucket.securityStatus) === null || _bucket$securityStatu2 === void 0 ? void 0 : (_bucket$securityStatu3 = _bucket$securityStatu2.status) === null || _bucket$securityStatu3 === void 0 ? void 0 : (_bucket$securityStatu4 = _bucket$securityStatu3.hits) === null || _bucket$securityStatu4 === void 0 ? void 0 : (_bucket$securityStatu5 = _bucket$securityStatu4.hits[0]) === null || _bucket$securityStatu5 === void 0 ? void 0 : (_bucket$securityStatu6 = _bucket$securityStatu5._source) === null || _bucket$securityStatu6 === void 0 ? void 0 : (_bucket$securityStatu7 = _bucket$securityStatu6.kibana) === null || _bucket$securityStatu7 === void 0 ? void 0 : (_bucket$securityStatu8 = _bucket$securityStatu7.alert) === null || _bucket$securityStatu8 === void 0 ? void 0 : (_bucket$securityStatu9 = _bucket$securityStatu8.rule) === null || _bucket$securityStatu9 === void 0 ? void 0 : (_bucket$securityStatu10 = _bucket$securityStatu9.execution) === null || _bucket$securityStatu10 === void 0 ? void 0 : _bucket$securityStatu10.status) !== null && _bucket$securityStatu !== void 0 ? _bucket$securityStatu : mapPlatformStatusToRuleExecutionStatus(bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution29 = bucket.ruleExecution) === null || _bucket$ruleExecution29 === void 0 ? void 0 : (_bucket$ruleExecution30 = _bucket$ruleExecution29.outcomeAndMessage) === null || _bucket$ruleExecution30 === void 0 ? void 0 : (_bucket$ruleExecution31 = _bucket$ruleExecution30.hits) === null || _bucket$ruleExecution31 === void 0 ? void 0 : (_bucket$ruleExecution32 = _bucket$ruleExecution31.hits[0]) === null || _bucket$ruleExecution32 === void 0 ? void 0 : (_bucket$ruleExecution33 = _bucket$ruleExecution32._source) === null || _bucket$ruleExecution33 === void 0 ? void 0 : (_bucket$ruleExecution34 = _bucket$ruleExecution33.event) === null || _bucket$ruleExecution34 === void 0 ? void 0 : _bucket$ruleExecution34.outcome),
    // If security_message isn't available, use `error.message` instead for platform errors since it is more descriptive than `message`
    security_message: (_bucket$securityStatu11 = bucket === null || bucket === void 0 ? void 0 : (_bucket$securityStatu12 = bucket.securityStatus) === null || _bucket$securityStatu12 === void 0 ? void 0 : (_bucket$securityStatu13 = _bucket$securityStatu12.message) === null || _bucket$securityStatu13 === void 0 ? void 0 : (_bucket$securityStatu14 = _bucket$securityStatu13.hits) === null || _bucket$securityStatu14 === void 0 ? void 0 : (_bucket$securityStatu15 = _bucket$securityStatu14.hits[0]) === null || _bucket$securityStatu15 === void 0 ? void 0 : (_bucket$securityStatu16 = _bucket$securityStatu15._source) === null || _bucket$securityStatu16 === void 0 ? void 0 : _bucket$securityStatu16.message) !== null && _bucket$securityStatu11 !== void 0 ? _bucket$securityStatu11 : bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution35 = bucket.ruleExecution) === null || _bucket$ruleExecution35 === void 0 ? void 0 : (_bucket$ruleExecution36 = _bucket$ruleExecution35.outcomeAndMessage) === null || _bucket$ruleExecution36 === void 0 ? void 0 : (_bucket$ruleExecution37 = _bucket$ruleExecution36.hits) === null || _bucket$ruleExecution37 === void 0 ? void 0 : (_bucket$ruleExecution38 = _bucket$ruleExecution37.hits[0]) === null || _bucket$ruleExecution38 === void 0 ? void 0 : (_bucket$ruleExecution39 = _bucket$ruleExecution38._source) === null || _bucket$ruleExecution39 === void 0 ? void 0 : (_bucket$ruleExecution40 = _bucket$ruleExecution39.error) === null || _bucket$ruleExecution40 === void 0 ? void 0 : _bucket$ruleExecution40.message
  };
};

/**
 * Formats getAggregateExecutionEvents response from Elasticsearch response
 * @param results Elasticsearch response
 * @param totalExecutions total number of executions to override from initial statusFilter query
 */
exports.formatAggExecutionEventFromBucket = formatAggExecutionEventFromBucket;
const formatExecutionEventResponse = (results, totalExecutions) => {
  const {
    aggregations
  } = results;
  if (!aggregations) {
    return {
      total: 0,
      events: []
    };
  }
  const total = aggregations.totalExecutions.value;
  const buckets = aggregations.executionUuid.buckets;
  return {
    total: totalExecutions ? totalExecutions : total,
    events: buckets.map(b => formatAggExecutionEventFromBucket(b))
  };
};

/**
 * Formats sort field into bucket_sort agg format
 * @param sort
 */
exports.formatExecutionEventResponse = formatExecutionEventResponse;
const formatSortForBucketSort = sort => {
  return sort.map(s => Object.keys(s).reduce((acc, curr) => ({
    ...acc,
    [SORT_FIELD_TO_AGG_MAPPING[curr]]: (0, _lodash.get)(s, curr)
  }), {}));
};

/**
 * Formats sort field into terms agg format
 * @param sort
 */
exports.formatSortForBucketSort = formatSortForBucketSort;
const formatSortForTermsSort = sort => {
  return sort.map(s => Object.keys(s).reduce((acc, curr) => ({
    ...acc,
    [SORT_FIELD_TO_AGG_MAPPING[curr]]: (0, _lodash.get)(s, `${curr}.order`)
  }), {}));
};

/**
 * Maps a RuleExecutionStatus[] to string[] of associated platform statuses. Useful for querying specific platform
 * events based on security status values
 * @param ruleStatuses RuleExecutionStatus[]
 */
exports.formatSortForTermsSort = formatSortForTermsSort;
const mapRuleExecutionStatusToPlatformStatus = ruleStatuses => {
  return (0, _lodash.flatMap)(ruleStatuses, rs => {
    switch (rs) {
      case _rule_monitoring.RuleExecutionStatus.failed:
        return 'failure';
      case _rule_monitoring.RuleExecutionStatus.succeeded:
        return 'success';
      default:
        return [];
    }
  });
};

/**
 * Maps a platform status string to RuleExecutionStatus
 * @param platformStatus string, i.e. `failure` or `success`
 */
exports.mapRuleExecutionStatusToPlatformStatus = mapRuleExecutionStatusToPlatformStatus;
const mapPlatformStatusToRuleExecutionStatus = platformStatus => {
  switch (platformStatus) {
    case 'failure':
      return _rule_monitoring.RuleExecutionStatus.failed;
    case 'success':
      return _rule_monitoring.RuleExecutionStatus.succeeded;
    default:
      return undefined;
  }
};
exports.mapPlatformStatusToRuleExecutionStatus = mapPlatformStatusToRuleExecutionStatus;