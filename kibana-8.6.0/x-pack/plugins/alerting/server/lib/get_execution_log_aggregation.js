"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_EXECUTION_LOG_RESULT = void 0;
exports.formatExecutionKPIResult = formatExecutionKPIResult;
exports.formatExecutionLogResult = formatExecutionLogResult;
exports.formatSortForBucketSort = formatSortForBucketSort;
exports.formatSortForTermSort = formatSortForTermSort;
exports.getExecutionKPIAggregation = void 0;
exports.getExecutionLogAggregation = getExecutionLogAggregation;
exports.getNumExecutions = getNumExecutions;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _lodash = require("lodash");
var _esQuery = require("@kbn/es-query");
var _ = require(".");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DEFAULT_MAX_BUCKETS_LIMIT = 1000; // do not retrieve more than this number of executions
const DEFAULT_MAX_KPI_BUCKETS_LIMIT = 10000;
const RULE_ID_FIELD = 'rule.id';
const SPACE_ID_FIELD = 'kibana.space_ids';
const RULE_NAME_FIELD = 'rule.name';
const PROVIDER_FIELD = 'event.provider';
const START_FIELD = 'event.start';
const ACTION_FIELD = 'event.action';
const ALERTING_OUTCOME_FIELD = 'kibana.alerting.outcome';
const OUTCOME_FIELD = 'event.outcome';
const DURATION_FIELD = 'event.duration';
const MESSAGE_FIELD = 'message';
const VERSION_FIELD = 'kibana.version';
const ERROR_MESSAGE_FIELD = 'error.message';
const SCHEDULE_DELAY_FIELD = 'kibana.task.schedule_delay';
const ES_SEARCH_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.es_search_duration_ms';
const TOTAL_SEARCH_DURATION_FIELD = 'kibana.alert.rule.execution.metrics.total_search_duration_ms';
const NUMBER_OF_TRIGGERED_ACTIONS_FIELD = 'kibana.alert.rule.execution.metrics.number_of_triggered_actions';
const NUMBER_OF_GENERATED_ACTIONS_FIELD = 'kibana.alert.rule.execution.metrics.number_of_generated_actions';
const NUMBER_OF_ACTIVE_ALERTS_FIELD = 'kibana.alert.rule.execution.metrics.alert_counts.active';
const NUMBER_OF_NEW_ALERTS_FIELD = 'kibana.alert.rule.execution.metrics.alert_counts.new';
const NUMBER_OF_RECOVERED_ALERTS_FIELD = 'kibana.alert.rule.execution.metrics.alert_counts.recovered';
const EXECUTION_UUID_FIELD = 'kibana.alert.rule.execution.uuid';
const Millis2Nanos = 1000 * 1000;
const EMPTY_EXECUTION_LOG_RESULT = {
  total: 0,
  data: []
};
exports.EMPTY_EXECUTION_LOG_RESULT = EMPTY_EXECUTION_LOG_RESULT;
const ExecutionLogSortFields = {
  timestamp: 'ruleExecution>executeStartTime',
  execution_duration: 'ruleExecution>executionDuration',
  total_search_duration: 'ruleExecution>totalSearchDuration',
  es_search_duration: 'ruleExecution>esSearchDuration',
  schedule_delay: 'ruleExecution>scheduleDelay',
  num_triggered_actions: 'ruleExecution>numTriggeredActions',
  num_generated_actions: 'ruleExecution>numGeneratedActions',
  num_active_alerts: 'ruleExecution>numActiveAlerts',
  num_recovered_alerts: 'ruleExecution>numRecoveredAlerts',
  num_new_alerts: 'ruleExecution>numNewAlerts'
};
const getExecutionKPIAggregation = filter => {
  const dslFilterQuery = buildDslFilterQuery(filter);
  return {
    excludeExecuteStart: {
      filter: {
        bool: {
          must_not: [{
            term: {
              'event.action': 'execute-start'
            }
          }]
        }
      },
      aggs: {
        executionUuid: {
          // Bucket by execution UUID
          terms: {
            field: EXECUTION_UUID_FIELD,
            size: DEFAULT_MAX_KPI_BUCKETS_LIMIT,
            order: formatSortForTermSort([{
              timestamp: {
                order: 'desc'
              }
            }])
          },
          aggs: {
            executionUuidSorted: {
              bucket_sort: {
                from: 0,
                size: DEFAULT_MAX_KPI_BUCKETS_LIMIT,
                gap_policy: 'insert_zeros'
              }
            },
            actionExecution: {
              filter: {
                bool: {
                  must: [getProviderAndActionFilter('actions', 'execute')]
                }
              },
              aggs: {
                actionOutcomes: {
                  terms: {
                    field: OUTCOME_FIELD,
                    size: 2
                  }
                }
              }
            },
            ruleExecution: {
              filter: {
                bool: {
                  ...(dslFilterQuery ? {
                    filter: dslFilterQuery
                  } : {}),
                  must: [getProviderAndActionFilter('alerting', 'execute')]
                }
              },
              aggs: {
                executeStartTime: {
                  min: {
                    field: START_FIELD
                  }
                },
                numTriggeredActions: {
                  sum: {
                    field: 'kibana.alert.rule.execution.metrics.number_of_triggered_actions',
                    missing: 0
                  }
                },
                numGeneratedActions: {
                  sum: {
                    field: 'kibana.alert.rule.execution.metrics.number_of_generated_actions',
                    missing: 0
                  }
                },
                numActiveAlerts: {
                  sum: {
                    field: 'kibana.alert.rule.execution.metrics.alert_counts.active',
                    missing: 0
                  }
                },
                numRecoveredAlerts: {
                  sum: {
                    field: 'kibana.alert.rule.execution.metrics.alert_counts.recovered',
                    missing: 0
                  }
                },
                numNewAlerts: {
                  sum: {
                    field: 'kibana.alert.rule.execution.metrics.alert_counts.new',
                    missing: 0
                  }
                },
                ruleExecutionOutcomes: {
                  multi_terms: {
                    size: 3,
                    terms: [{
                      field: ALERTING_OUTCOME_FIELD,
                      missing: ''
                    }, {
                      field: OUTCOME_FIELD
                    }]
                  }
                }
              }
            },
            minExecutionUuidBucket: {
              bucket_selector: {
                buckets_path: {
                  count: 'ruleExecution._count'
                },
                script: {
                  source: 'params.count > 0'
                }
              }
            }
          }
        }
      }
    }
  };
};
exports.getExecutionKPIAggregation = getExecutionKPIAggregation;
function getExecutionLogAggregation({
  filter,
  page,
  perPage,
  sort
}) {
  // Check if valid sort fields
  const sortFields = (0, _lodash.flatMap)(sort, s => Object.keys(s));
  for (const field of sortFields) {
    if (!Object.keys(ExecutionLogSortFields).includes(field)) {
      throw _boom.default.badRequest(`Invalid sort field "${field}" - must be one of [${Object.keys(ExecutionLogSortFields).join(',')}]`);
    }
  }

  // Check if valid page value
  if (page <= 0) {
    throw _boom.default.badRequest(`Invalid page field "${page}" - must be greater than 0`);
  }

  // Check if valid page value
  if (perPage <= 0) {
    throw _boom.default.badRequest(`Invalid perPage field "${perPage}" - must be greater than 0`);
  }
  const dslFilterQuery = buildDslFilterQuery(filter);
  return {
    excludeExecuteStart: {
      filter: {
        bool: {
          must_not: [{
            term: {
              [ACTION_FIELD]: 'execute-start'
            }
          }]
        }
      },
      aggs: {
        // Get total number of executions
        executionUuidCardinality: {
          filter: {
            bool: {
              ...(dslFilterQuery ? {
                filter: dslFilterQuery
              } : {}),
              must: [getProviderAndActionFilter('alerting', 'execute')]
            }
          },
          aggs: {
            executionUuidCardinality: {
              cardinality: {
                field: EXECUTION_UUID_FIELD
              }
            }
          }
        },
        executionUuid: {
          // Bucket by execution UUID
          terms: {
            field: EXECUTION_UUID_FIELD,
            size: DEFAULT_MAX_BUCKETS_LIMIT,
            order: formatSortForTermSort(sort)
          },
          aggs: {
            // Bucket sort to allow paging through executions
            executionUuidSorted: {
              bucket_sort: {
                sort: formatSortForBucketSort(sort),
                from: (page - 1) * perPage,
                size: perPage,
                gap_policy: 'insert_zeros'
              }
            },
            // Filter by action execute doc and get information from this event
            actionExecution: {
              filter: getProviderAndActionFilter('actions', 'execute'),
              aggs: {
                actionOutcomes: {
                  terms: {
                    field: OUTCOME_FIELD,
                    size: 2
                  }
                }
              }
            },
            // Filter by rule execute doc and get information from this event
            ruleExecution: {
              filter: {
                bool: {
                  ...(dslFilterQuery ? {
                    filter: dslFilterQuery
                  } : {}),
                  must: [getProviderAndActionFilter('alerting', 'execute')]
                }
              },
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
                totalSearchDuration: {
                  max: {
                    field: TOTAL_SEARCH_DURATION_FIELD
                  }
                },
                esSearchDuration: {
                  max: {
                    field: ES_SEARCH_DURATION_FIELD
                  }
                },
                numTriggeredActions: {
                  max: {
                    field: NUMBER_OF_TRIGGERED_ACTIONS_FIELD
                  }
                },
                numGeneratedActions: {
                  max: {
                    field: NUMBER_OF_GENERATED_ACTIONS_FIELD
                  }
                },
                numActiveAlerts: {
                  max: {
                    field: NUMBER_OF_ACTIVE_ALERTS_FIELD
                  }
                },
                numRecoveredAlerts: {
                  max: {
                    field: NUMBER_OF_RECOVERED_ALERTS_FIELD
                  }
                },
                numNewAlerts: {
                  max: {
                    field: NUMBER_OF_NEW_ALERTS_FIELD
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
                      includes: [OUTCOME_FIELD, MESSAGE_FIELD, ERROR_MESSAGE_FIELD, VERSION_FIELD, RULE_ID_FIELD, SPACE_ID_FIELD, RULE_NAME_FIELD, ALERTING_OUTCOME_FIELD]
                    }
                  }
                }
              }
            },
            // If there was a timeout, this filter will return non-zero doc count
            timeoutMessage: {
              filter: getProviderAndActionFilter('alerting', 'execute-timeout')
            },
            // Filter out execution UUID buckets where ruleExecution doc count is 0
            minExecutionUuidBucket: {
              bucket_selector: {
                buckets_path: {
                  count: 'ruleExecution._count'
                },
                script: {
                  source: 'params.count > 0'
                }
              }
            }
          }
        }
      }
    }
  };
}
function buildDslFilterQuery(filter) {
  try {
    const filterKueryNode = typeof filter === 'string' ? (0, _esQuery.fromKueryExpression)(filter) : filter;
    return filterKueryNode ? (0, _esQuery.toElasticsearchQuery)(filterKueryNode) : undefined;
  } catch (err) {
    throw _boom.default.badRequest(`Invalid kuery syntax for filter ${filter}`);
  }
}
function getProviderAndActionFilter(provider, action) {
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
}
function formatExecutionLogAggBucket(bucket) {
  var _bucket$ruleExecution, _bucket$ruleExecution2, _bucket$ruleExecution3, _bucket$ruleExecution4, _bucket$timeoutMessag, _bucket$timeoutMessag2, _bucket$actionExecuti, _bucket$actionExecuti2, _bucket$actionExecuti3, _actionExecutionOutco, _actionExecutionOutco2, _actionExecutionOutco3, _actionExecutionOutco4, _bucket$ruleExecution5, _bucket$ruleExecution6, _bucket$ruleExecution7, _bucket$ruleExecution8, _bucket$ruleExecution9, _outcomeAndMessage$ki, _outcomeAndMessage$ki2, _outcomeAndMessage$ki3, _outcomeAndMessage$me, _outcomeAndMessage$er, _outcomeAndMessage$er2, _outcomeAndMessage$ki4, _outcomeAndMessage$ki5, _outcomeAndMessage$ru, _outcomeAndMessage$ru2, _outcomeAndMessage$ki6, _outcomeAndMessage$ki7, _outcomeAndMessage$ru3, _outcomeAndMessage$ru4, _bucket$key, _bucket$ruleExecution10, _bucket$ruleExecution11, _bucket$ruleExecution12, _bucket$ruleExecution13, _bucket$ruleExecution14, _bucket$ruleExecution15, _bucket$ruleExecution16, _bucket$ruleExecution17, _bucket$ruleExecution18, _bucket$ruleExecution19, _bucket$ruleExecution20, _bucket$ruleExecution21, _bucket$ruleExecution22, _bucket$ruleExecution23, _bucket$ruleExecution24, _bucket$ruleExecution25, _bucket$ruleExecution26, _bucket$ruleExecution27, _bucket$ruleExecution28, _bucket$ruleExecution29, _bucket$ruleExecution30, _bucket$ruleExecution31, _bucket$ruleExecution32;
  const durationUs = bucket !== null && bucket !== void 0 && (_bucket$ruleExecution = bucket.ruleExecution) !== null && _bucket$ruleExecution !== void 0 && (_bucket$ruleExecution2 = _bucket$ruleExecution.executionDuration) !== null && _bucket$ruleExecution2 !== void 0 && _bucket$ruleExecution2.value ? bucket.ruleExecution.executionDuration.value : 0;
  const scheduleDelayUs = bucket !== null && bucket !== void 0 && (_bucket$ruleExecution3 = bucket.ruleExecution) !== null && _bucket$ruleExecution3 !== void 0 && (_bucket$ruleExecution4 = _bucket$ruleExecution3.scheduleDelay) !== null && _bucket$ruleExecution4 !== void 0 && _bucket$ruleExecution4.value ? bucket.ruleExecution.scheduleDelay.value : 0;
  const timedOut = ((_bucket$timeoutMessag = bucket === null || bucket === void 0 ? void 0 : (_bucket$timeoutMessag2 = bucket.timeoutMessage) === null || _bucket$timeoutMessag2 === void 0 ? void 0 : _bucket$timeoutMessag2.doc_count) !== null && _bucket$timeoutMessag !== void 0 ? _bucket$timeoutMessag : 0) > 0;
  const actionExecutionOutcomes = (_bucket$actionExecuti = bucket === null || bucket === void 0 ? void 0 : (_bucket$actionExecuti2 = bucket.actionExecution) === null || _bucket$actionExecuti2 === void 0 ? void 0 : (_bucket$actionExecuti3 = _bucket$actionExecuti2.actionOutcomes) === null || _bucket$actionExecuti3 === void 0 ? void 0 : _bucket$actionExecuti3.buckets) !== null && _bucket$actionExecuti !== void 0 ? _bucket$actionExecuti : [];
  const actionExecutionSuccess = (_actionExecutionOutco = (_actionExecutionOutco2 = actionExecutionOutcomes.find(subBucket => (subBucket === null || subBucket === void 0 ? void 0 : subBucket.key) === 'success')) === null || _actionExecutionOutco2 === void 0 ? void 0 : _actionExecutionOutco2.doc_count) !== null && _actionExecutionOutco !== void 0 ? _actionExecutionOutco : 0;
  const actionExecutionError = (_actionExecutionOutco3 = (_actionExecutionOutco4 = actionExecutionOutcomes.find(subBucket => (subBucket === null || subBucket === void 0 ? void 0 : subBucket.key) === 'failure')) === null || _actionExecutionOutco4 === void 0 ? void 0 : _actionExecutionOutco4.doc_count) !== null && _actionExecutionOutco3 !== void 0 ? _actionExecutionOutco3 : 0;
  const outcomeAndMessage = (_bucket$ruleExecution5 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution6 = bucket.ruleExecution) === null || _bucket$ruleExecution6 === void 0 ? void 0 : (_bucket$ruleExecution7 = _bucket$ruleExecution6.outcomeAndMessage) === null || _bucket$ruleExecution7 === void 0 ? void 0 : (_bucket$ruleExecution8 = _bucket$ruleExecution7.hits) === null || _bucket$ruleExecution8 === void 0 ? void 0 : (_bucket$ruleExecution9 = _bucket$ruleExecution8.hits[0]) === null || _bucket$ruleExecution9 === void 0 ? void 0 : _bucket$ruleExecution9._source) !== null && _bucket$ruleExecution5 !== void 0 ? _bucket$ruleExecution5 : {};
  let status = (_outcomeAndMessage$ki = (_outcomeAndMessage$ki2 = outcomeAndMessage.kibana) === null || _outcomeAndMessage$ki2 === void 0 ? void 0 : (_outcomeAndMessage$ki3 = _outcomeAndMessage$ki2.alerting) === null || _outcomeAndMessage$ki3 === void 0 ? void 0 : _outcomeAndMessage$ki3.outcome) !== null && _outcomeAndMessage$ki !== void 0 ? _outcomeAndMessage$ki : '';
  if ((0, _lodash.isEmpty)(status)) {
    var _outcomeAndMessage$ev, _outcomeAndMessage$ev2;
    status = (_outcomeAndMessage$ev = (_outcomeAndMessage$ev2 = outcomeAndMessage.event) === null || _outcomeAndMessage$ev2 === void 0 ? void 0 : _outcomeAndMessage$ev2.outcome) !== null && _outcomeAndMessage$ev !== void 0 ? _outcomeAndMessage$ev : '';
  }
  const outcomeMessage = (_outcomeAndMessage$me = outcomeAndMessage.message) !== null && _outcomeAndMessage$me !== void 0 ? _outcomeAndMessage$me : '';
  const outcomeErrorMessage = (_outcomeAndMessage$er = (_outcomeAndMessage$er2 = outcomeAndMessage.error) === null || _outcomeAndMessage$er2 === void 0 ? void 0 : _outcomeAndMessage$er2.message) !== null && _outcomeAndMessage$er !== void 0 ? _outcomeAndMessage$er : '';
  const message = status === 'failure' ? `${outcomeMessage} - ${outcomeErrorMessage}` : outcomeMessage;
  const version = (_outcomeAndMessage$ki4 = (_outcomeAndMessage$ki5 = outcomeAndMessage.kibana) === null || _outcomeAndMessage$ki5 === void 0 ? void 0 : _outcomeAndMessage$ki5.version) !== null && _outcomeAndMessage$ki4 !== void 0 ? _outcomeAndMessage$ki4 : '';
  const ruleId = outcomeAndMessage ? (_outcomeAndMessage$ru = outcomeAndMessage === null || outcomeAndMessage === void 0 ? void 0 : (_outcomeAndMessage$ru2 = outcomeAndMessage.rule) === null || _outcomeAndMessage$ru2 === void 0 ? void 0 : _outcomeAndMessage$ru2.id) !== null && _outcomeAndMessage$ru !== void 0 ? _outcomeAndMessage$ru : '' : '';
  const spaceIds = outcomeAndMessage ? (_outcomeAndMessage$ki6 = outcomeAndMessage === null || outcomeAndMessage === void 0 ? void 0 : (_outcomeAndMessage$ki7 = outcomeAndMessage.kibana) === null || _outcomeAndMessage$ki7 === void 0 ? void 0 : _outcomeAndMessage$ki7.space_ids) !== null && _outcomeAndMessage$ki6 !== void 0 ? _outcomeAndMessage$ki6 : [] : [];
  const ruleName = outcomeAndMessage ? (_outcomeAndMessage$ru3 = (_outcomeAndMessage$ru4 = outcomeAndMessage.rule) === null || _outcomeAndMessage$ru4 === void 0 ? void 0 : _outcomeAndMessage$ru4.name) !== null && _outcomeAndMessage$ru3 !== void 0 ? _outcomeAndMessage$ru3 : '' : '';
  return {
    id: (_bucket$key = bucket === null || bucket === void 0 ? void 0 : bucket.key) !== null && _bucket$key !== void 0 ? _bucket$key : '',
    timestamp: (_bucket$ruleExecution10 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution11 = bucket.ruleExecution) === null || _bucket$ruleExecution11 === void 0 ? void 0 : _bucket$ruleExecution11.executeStartTime.value_as_string) !== null && _bucket$ruleExecution10 !== void 0 ? _bucket$ruleExecution10 : '',
    duration_ms: durationUs / Millis2Nanos,
    status,
    message,
    version,
    num_active_alerts: (_bucket$ruleExecution12 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution13 = bucket.ruleExecution) === null || _bucket$ruleExecution13 === void 0 ? void 0 : (_bucket$ruleExecution14 = _bucket$ruleExecution13.numActiveAlerts) === null || _bucket$ruleExecution14 === void 0 ? void 0 : _bucket$ruleExecution14.value) !== null && _bucket$ruleExecution12 !== void 0 ? _bucket$ruleExecution12 : 0,
    num_new_alerts: (_bucket$ruleExecution15 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution16 = bucket.ruleExecution) === null || _bucket$ruleExecution16 === void 0 ? void 0 : (_bucket$ruleExecution17 = _bucket$ruleExecution16.numNewAlerts) === null || _bucket$ruleExecution17 === void 0 ? void 0 : _bucket$ruleExecution17.value) !== null && _bucket$ruleExecution15 !== void 0 ? _bucket$ruleExecution15 : 0,
    num_recovered_alerts: (_bucket$ruleExecution18 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution19 = bucket.ruleExecution) === null || _bucket$ruleExecution19 === void 0 ? void 0 : (_bucket$ruleExecution20 = _bucket$ruleExecution19.numRecoveredAlerts) === null || _bucket$ruleExecution20 === void 0 ? void 0 : _bucket$ruleExecution20.value) !== null && _bucket$ruleExecution18 !== void 0 ? _bucket$ruleExecution18 : 0,
    num_triggered_actions: (_bucket$ruleExecution21 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution22 = bucket.ruleExecution) === null || _bucket$ruleExecution22 === void 0 ? void 0 : (_bucket$ruleExecution23 = _bucket$ruleExecution22.numTriggeredActions) === null || _bucket$ruleExecution23 === void 0 ? void 0 : _bucket$ruleExecution23.value) !== null && _bucket$ruleExecution21 !== void 0 ? _bucket$ruleExecution21 : 0,
    num_generated_actions: (_bucket$ruleExecution24 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution25 = bucket.ruleExecution) === null || _bucket$ruleExecution25 === void 0 ? void 0 : (_bucket$ruleExecution26 = _bucket$ruleExecution25.numGeneratedActions) === null || _bucket$ruleExecution26 === void 0 ? void 0 : _bucket$ruleExecution26.value) !== null && _bucket$ruleExecution24 !== void 0 ? _bucket$ruleExecution24 : 0,
    num_succeeded_actions: actionExecutionSuccess,
    num_errored_actions: actionExecutionError,
    total_search_duration_ms: (_bucket$ruleExecution27 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution28 = bucket.ruleExecution) === null || _bucket$ruleExecution28 === void 0 ? void 0 : (_bucket$ruleExecution29 = _bucket$ruleExecution28.totalSearchDuration) === null || _bucket$ruleExecution29 === void 0 ? void 0 : _bucket$ruleExecution29.value) !== null && _bucket$ruleExecution27 !== void 0 ? _bucket$ruleExecution27 : 0,
    es_search_duration_ms: (_bucket$ruleExecution30 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution31 = bucket.ruleExecution) === null || _bucket$ruleExecution31 === void 0 ? void 0 : (_bucket$ruleExecution32 = _bucket$ruleExecution31.esSearchDuration) === null || _bucket$ruleExecution32 === void 0 ? void 0 : _bucket$ruleExecution32.value) !== null && _bucket$ruleExecution30 !== void 0 ? _bucket$ruleExecution30 : 0,
    schedule_delay_ms: scheduleDelayUs / Millis2Nanos,
    timed_out: timedOut,
    rule_id: ruleId,
    space_ids: spaceIds,
    rule_name: ruleName
  };
}
function formatExecutionKPIAggBuckets(buckets) {
  const objToReturn = {
    success: 0,
    unknown: 0,
    failure: 0,
    warning: 0,
    activeAlerts: 0,
    newAlerts: 0,
    recoveredAlerts: 0,
    erroredActions: 0,
    triggeredActions: 0
  };
  buckets.forEach(bucket => {
    var _bucket$ruleExecution33, _bucket$ruleExecution34, _bucket$ruleExecution35, _bucket$actionExecuti4, _bucket$actionExecuti5, _bucket$actionExecuti6, _bucket$ruleExecution36, _bucket$ruleExecution37, _bucket$ruleExecution38, _bucket$ruleExecution39, _bucket$ruleExecution40, _bucket$ruleExecution41, _bucket$ruleExecution42, _bucket$ruleExecution43, _actionExecutionOutco5, _actionExecutionOutco6, _bucket$ruleExecution44, _bucket$ruleExecution45;
    const ruleExecutionOutcomes = (_bucket$ruleExecution33 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution34 = bucket.ruleExecution) === null || _bucket$ruleExecution34 === void 0 ? void 0 : (_bucket$ruleExecution35 = _bucket$ruleExecution34.ruleExecutionOutcomes) === null || _bucket$ruleExecution35 === void 0 ? void 0 : _bucket$ruleExecution35.buckets) !== null && _bucket$ruleExecution33 !== void 0 ? _bucket$ruleExecution33 : [];
    const actionExecutionOutcomes = (_bucket$actionExecuti4 = bucket === null || bucket === void 0 ? void 0 : (_bucket$actionExecuti5 = bucket.actionExecution) === null || _bucket$actionExecuti5 === void 0 ? void 0 : (_bucket$actionExecuti6 = _bucket$actionExecuti5.actionOutcomes) === null || _bucket$actionExecuti6 === void 0 ? void 0 : _bucket$actionExecuti6.buckets) !== null && _bucket$actionExecuti4 !== void 0 ? _bucket$actionExecuti4 : [];
    const ruleExecutionCount = (_bucket$ruleExecution36 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution37 = bucket.ruleExecution) === null || _bucket$ruleExecution37 === void 0 ? void 0 : _bucket$ruleExecution37.doc_count) !== null && _bucket$ruleExecution36 !== void 0 ? _bucket$ruleExecution36 : 0;
    const outcomes = {
      successRuleExecution: 0,
      failureRuleExecution: 0,
      warningRuleExecution: 0
    };
    ruleExecutionOutcomes.reduce((acc, subBucket) => {
      const key = subBucket.key[0] ? subBucket.key[0] : subBucket.key[1];
      if (key === 'success') {
        var _subBucket$doc_count;
        acc.successRuleExecution = (_subBucket$doc_count = subBucket.doc_count) !== null && _subBucket$doc_count !== void 0 ? _subBucket$doc_count : 0;
      } else if (key === 'failure') {
        var _subBucket$doc_count2;
        acc.failureRuleExecution = (_subBucket$doc_count2 = subBucket.doc_count) !== null && _subBucket$doc_count2 !== void 0 ? _subBucket$doc_count2 : 0;
      } else if (key === 'warning') {
        var _subBucket$doc_count3;
        acc.warningRuleExecution = (_subBucket$doc_count3 = subBucket.doc_count) !== null && _subBucket$doc_count3 !== void 0 ? _subBucket$doc_count3 : 0;
      }
      return acc;
    }, outcomes);
    objToReturn.success += outcomes.successRuleExecution;
    objToReturn.unknown += ruleExecutionCount - (outcomes.successRuleExecution + outcomes.failureRuleExecution + outcomes.warningRuleExecution);
    objToReturn.failure += outcomes.failureRuleExecution;
    objToReturn.warning += outcomes.warningRuleExecution;
    objToReturn.activeAlerts += (_bucket$ruleExecution38 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution39 = bucket.ruleExecution) === null || _bucket$ruleExecution39 === void 0 ? void 0 : _bucket$ruleExecution39.numActiveAlerts.value) !== null && _bucket$ruleExecution38 !== void 0 ? _bucket$ruleExecution38 : 0;
    objToReturn.newAlerts += (_bucket$ruleExecution40 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution41 = bucket.ruleExecution) === null || _bucket$ruleExecution41 === void 0 ? void 0 : _bucket$ruleExecution41.numNewAlerts.value) !== null && _bucket$ruleExecution40 !== void 0 ? _bucket$ruleExecution40 : 0;
    objToReturn.recoveredAlerts += (_bucket$ruleExecution42 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution43 = bucket.ruleExecution) === null || _bucket$ruleExecution43 === void 0 ? void 0 : _bucket$ruleExecution43.numRecoveredAlerts.value) !== null && _bucket$ruleExecution42 !== void 0 ? _bucket$ruleExecution42 : 0;
    objToReturn.erroredActions += (_actionExecutionOutco5 = (_actionExecutionOutco6 = actionExecutionOutcomes.find(subBucket => (subBucket === null || subBucket === void 0 ? void 0 : subBucket.key) === 'failure')) === null || _actionExecutionOutco6 === void 0 ? void 0 : _actionExecutionOutco6.doc_count) !== null && _actionExecutionOutco5 !== void 0 ? _actionExecutionOutco5 : 0;
    objToReturn.triggeredActions += (_bucket$ruleExecution44 = bucket === null || bucket === void 0 ? void 0 : (_bucket$ruleExecution45 = bucket.ruleExecution) === null || _bucket$ruleExecution45 === void 0 ? void 0 : _bucket$ruleExecution45.numTriggeredActions.value) !== null && _bucket$ruleExecution44 !== void 0 ? _bucket$ruleExecution44 : 0;
  });
  return objToReturn;
}
function formatExecutionKPIResult(results) {
  const {
    aggregations
  } = results;
  if (!aggregations || !aggregations.excludeExecuteStart) {
    return _common.EMPTY_EXECUTION_KPI_RESULT;
  }
  const aggs = aggregations.excludeExecuteStart;
  const buckets = aggs.executionUuid.buckets;
  return formatExecutionKPIAggBuckets(buckets);
}
function formatExecutionLogResult(results) {
  const {
    aggregations
  } = results;
  if (!aggregations || !aggregations.excludeExecuteStart) {
    return EMPTY_EXECUTION_LOG_RESULT;
  }
  const aggs = aggregations.excludeExecuteStart;
  const total = aggs.executionUuidCardinality.executionUuidCardinality.value;
  const buckets = aggs.executionUuid.buckets;
  return {
    total,
    data: buckets.map(bucket => formatExecutionLogAggBucket(bucket))
  };
}
function getNumExecutions(dateStart, dateEnd, ruleSchedule) {
  const durationInMillis = dateEnd.getTime() - dateStart.getTime();
  const scheduleMillis = (0, _.parseDuration)(ruleSchedule);
  const numExecutions = Math.ceil(durationInMillis / scheduleMillis);
  return Math.min(numExecutions < 0 ? 0 : numExecutions, DEFAULT_MAX_BUCKETS_LIMIT);
}
function formatSortForBucketSort(sort) {
  return sort.map(s => Object.keys(s).reduce((acc, curr) => ({
    ...acc,
    [ExecutionLogSortFields[curr]]: (0, _lodash.get)(s, curr)
  }), {}));
}
function formatSortForTermSort(sort) {
  return sort.map(s => Object.keys(s).reduce((acc, curr) => ({
    ...acc,
    [ExecutionLogSortFields[curr]]: (0, _lodash.get)(s, `${curr}.order`)
  }), {}));
}