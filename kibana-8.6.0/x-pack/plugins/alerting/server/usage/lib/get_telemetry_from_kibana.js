"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalCountAggregations = getTotalCountAggregations;
exports.getTotalCountInUse = getTotalCountInUse;
var _group_connectors_by_consumers = require("./group_connectors_by_consumers");
var _group_rules_by_notify_when = require("./group_rules_by_notify_when");
var _group_rules_by_status = require("./group_rules_by_status");
var _alerting_usage_collector = require("../alerting_usage_collector");
var _parse_simple_rule_type_bucket = require("./parse_simple_rule_type_bucket");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getTotalCountAggregations({
  esClient,
  kibanaIndex,
  logger
}) {
  try {
    var _results$hits$total, _aggregations$sum_rul, _aggregations$sum_rul2, _aggregations$sum_rul3, _aggregations$sum_rul4, _aggregations$min_thr, _aggregations$avg_thr, _aggregations$max_thr, _aggregations$min_int, _aggregations$avg_int, _aggregations$max_int, _aggregations$min_thr2, _aggregations$avg_thr2, _aggregations$max_thr2, _aggregations$min_int2, _aggregations$avg_int2, _aggregations$max_int2, _aggregations$min_act, _aggregations$avg_act, _aggregations$max_act;
    const query = {
      index: kibanaIndex,
      size: 0,
      body: {
        query: {
          bool: {
            // Aggregate over all rule saved objects
            filter: [{
              term: {
                type: 'alert'
              }
            }]
          }
        },
        runtime_mappings: {
          rule_action_count: {
            type: 'long',
            script: {
              source: `
                def alert = params._source['alert'];
                if (alert != null) {
                  def actions = alert.actions;
                  if (actions != null) {
                    emit(actions.length);
                  } else {
                    emit(0);
                  }
                }`
            }
          },
          // Convert schedule interval duration string from rule saved object to interval in seconds
          rule_schedule_interval: {
            type: 'long',
            script: {
              source: `
                int parsed = 0;
                if (doc['alert.schedule.interval'].size() > 0) {
                  def interval = doc['alert.schedule.interval'].value;

                  if (interval.length() > 1) {
                      // get last char
                      String timeChar = interval.substring(interval.length() - 1);
                      // remove last char
                      interval = interval.substring(0, interval.length() - 1);

                      if (interval.chars().allMatch(Character::isDigit)) {
                        // using of regex is not allowed in painless language
                        parsed = Integer.parseInt(interval);

                        if (timeChar.equals("s")) {
                          parsed = parsed;
                        } else if (timeChar.equals("m")) {
                          parsed = parsed * 60;
                        } else if (timeChar.equals("h")) {
                          parsed = parsed * 60 * 60;
                        } else if (timeChar.equals("d")) {
                          parsed = parsed * 24 * 60 * 60;
                        }
                        emit(parsed);
                      }
                  }
                }
                emit(parsed);
              `
            }
          },
          // Convert throttle interval duration string from rule saved object to interval in seconds
          rule_throttle_interval: {
            type: 'long',
            script: {
              source: `
                int parsed = 0;
                if (doc['alert.throttle'].size() > 0) {
                def throttle = doc['alert.throttle'].value;

                if (throttle.length() > 1) {
                    // get last char
                    String timeChar = throttle.substring(throttle.length() - 1);
                    // remove last char
                    throttle = throttle.substring(0, throttle.length() - 1);

                    if (throttle.chars().allMatch(Character::isDigit)) {
                      // using of regex is not allowed in painless language
                      parsed = Integer.parseInt(throttle);

                      if (timeChar.equals("s")) {
                        parsed = parsed;
                      } else if (timeChar.equals("m")) {
                        parsed = parsed * 60;
                      } else if (timeChar.equals("h")) {
                        parsed = parsed * 60 * 60;
                      } else if (timeChar.equals("d")) {
                        parsed = parsed * 24 * 60 * 60;
                      }
                      emit(parsed);
                    }
                }
              }
              emit(parsed);
              `
            }
          },
          rule_with_tags: {
            type: 'long',
            script: {
              source: `
               def rule = params._source['alert'];
                if (rule != null && rule.tags != null) {
                  if (rule.tags.size() > 0) {
                    emit(1);
                  } else {
                    emit(0);
                  }
                }`
            }
          },
          rule_snoozed: {
            type: 'long',
            script: {
              source: `
                def rule = params._source['alert'];
                if (rule != null && rule.snoozeSchedule != null) {
                  if (rule.snoozeSchedule.size() > 0) {
                    emit(1);
                  } else {
                    emit(0);
                  }
                }`
            }
          },
          rule_muted: {
            type: 'long',
            script: {
              source: `
                if (doc['alert.muteAll'].value == true) {
                  emit(1);
                } else {
                  emit(0);
                }`
            }
          },
          rule_with_muted_alerts: {
            type: 'long',
            script: {
              source: `
                def rule = params._source['alert'];
                if (rule != null && rule.mutedInstanceIds != null) {
                  if (rule.mutedInstanceIds.size() > 0) {
                    emit(1);
                  } else {
                    emit(0);
                  }
                }`
            }
          }
        },
        aggs: {
          by_rule_type_id: {
            terms: {
              field: 'alert.alertTypeId',
              size: _alerting_usage_collector.NUM_ALERTING_RULE_TYPES
            }
          },
          max_throttle_time: {
            max: {
              field: 'rule_throttle_interval'
            }
          },
          min_throttle_time: {
            min: {
              field: 'rule_throttle_interval'
            }
          },
          avg_throttle_time: {
            avg: {
              field: 'rule_throttle_interval'
            }
          },
          max_interval_time: {
            max: {
              field: 'rule_schedule_interval'
            }
          },
          min_interval_time: {
            min: {
              field: 'rule_schedule_interval'
            }
          },
          avg_interval_time: {
            avg: {
              field: 'rule_schedule_interval'
            }
          },
          max_actions_count: {
            max: {
              field: 'rule_action_count'
            }
          },
          min_actions_count: {
            min: {
              field: 'rule_action_count'
            }
          },
          avg_actions_count: {
            avg: {
              field: 'rule_action_count'
            }
          },
          by_execution_status: {
            terms: {
              field: 'alert.executionStatus.status'
            }
          },
          by_notify_when: {
            terms: {
              field: 'alert.notifyWhen'
            }
          },
          connector_types_by_consumers: {
            terms: {
              field: 'alert.consumer'
            },
            aggs: {
              actions: {
                nested: {
                  path: 'alert.actions'
                },
                aggs: {
                  connector_types: {
                    terms: {
                      field: 'alert.actions.actionTypeId'
                    }
                  }
                }
              }
            }
          },
          sum_rules_with_tags: {
            sum: {
              field: 'rule_with_tags'
            }
          },
          sum_rules_snoozed: {
            sum: {
              field: 'rule_snoozed'
            }
          },
          sum_rules_muted: {
            sum: {
              field: 'rule_muted'
            }
          },
          sum_rules_with_muted_alerts: {
            sum: {
              field: 'rule_with_muted_alerts'
            }
          }
        }
      }
    };
    logger.debug(`query for getTotalCountAggregations - ${JSON.stringify(query)}`);
    const results = await esClient.search(query);
    logger.debug(`results for getTotalCountAggregations query - ${JSON.stringify(results)}`);
    const aggregations = results.aggregations;
    const totalRulesCount = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value;
    const countRulesByExecutionStatus = (0, _group_rules_by_status.groupRulesByStatus)((0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_execution_status.buckets));
    const countRulesByNotifyWhen = (0, _group_rules_by_notify_when.groupRulesByNotifyWhen)((0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_notify_when.buckets));
    const countConnectorTypesByConsumers = (0, _group_connectors_by_consumers.groupConnectorsByConsumers)(aggregations.connector_types_by_consumers.buckets);
    return {
      hasErrors: false,
      count_total: totalRulesCount !== null && totalRulesCount !== void 0 ? totalRulesCount : 0,
      count_by_type: (0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_rule_type_id.buckets),
      count_rules_by_execution_status: countRulesByExecutionStatus,
      count_rules_with_tags: (_aggregations$sum_rul = aggregations.sum_rules_with_tags.value) !== null && _aggregations$sum_rul !== void 0 ? _aggregations$sum_rul : 0,
      count_rules_by_notify_when: countRulesByNotifyWhen,
      count_rules_snoozed: (_aggregations$sum_rul2 = aggregations.sum_rules_snoozed.value) !== null && _aggregations$sum_rul2 !== void 0 ? _aggregations$sum_rul2 : 0,
      count_rules_muted: (_aggregations$sum_rul3 = aggregations.sum_rules_muted.value) !== null && _aggregations$sum_rul3 !== void 0 ? _aggregations$sum_rul3 : 0,
      count_rules_with_muted_alerts: (_aggregations$sum_rul4 = aggregations.sum_rules_with_muted_alerts.value) !== null && _aggregations$sum_rul4 !== void 0 ? _aggregations$sum_rul4 : 0,
      count_connector_types_by_consumers: countConnectorTypesByConsumers,
      throttle_time: {
        min: `${(_aggregations$min_thr = aggregations.min_throttle_time.value) !== null && _aggregations$min_thr !== void 0 ? _aggregations$min_thr : 0}s`,
        avg: `${(_aggregations$avg_thr = aggregations.avg_throttle_time.value) !== null && _aggregations$avg_thr !== void 0 ? _aggregations$avg_thr : 0}s`,
        max: `${(_aggregations$max_thr = aggregations.max_throttle_time.value) !== null && _aggregations$max_thr !== void 0 ? _aggregations$max_thr : 0}s`
      },
      schedule_time: {
        min: `${(_aggregations$min_int = aggregations.min_interval_time.value) !== null && _aggregations$min_int !== void 0 ? _aggregations$min_int : 0}s`,
        avg: `${(_aggregations$avg_int = aggregations.avg_interval_time.value) !== null && _aggregations$avg_int !== void 0 ? _aggregations$avg_int : 0}s`,
        max: `${(_aggregations$max_int = aggregations.max_interval_time.value) !== null && _aggregations$max_int !== void 0 ? _aggregations$max_int : 0}s`
      },
      throttle_time_number_s: {
        min: (_aggregations$min_thr2 = aggregations.min_throttle_time.value) !== null && _aggregations$min_thr2 !== void 0 ? _aggregations$min_thr2 : 0,
        avg: (_aggregations$avg_thr2 = aggregations.avg_throttle_time.value) !== null && _aggregations$avg_thr2 !== void 0 ? _aggregations$avg_thr2 : 0,
        max: (_aggregations$max_thr2 = aggregations.max_throttle_time.value) !== null && _aggregations$max_thr2 !== void 0 ? _aggregations$max_thr2 : 0
      },
      schedule_time_number_s: {
        min: (_aggregations$min_int2 = aggregations.min_interval_time.value) !== null && _aggregations$min_int2 !== void 0 ? _aggregations$min_int2 : 0,
        avg: (_aggregations$avg_int2 = aggregations.avg_interval_time.value) !== null && _aggregations$avg_int2 !== void 0 ? _aggregations$avg_int2 : 0,
        max: (_aggregations$max_int2 = aggregations.max_interval_time.value) !== null && _aggregations$max_int2 !== void 0 ? _aggregations$max_int2 : 0
      },
      connectors_per_alert: {
        min: (_aggregations$min_act = aggregations.min_actions_count.value) !== null && _aggregations$min_act !== void 0 ? _aggregations$min_act : 0,
        avg: (_aggregations$avg_act = aggregations.avg_actions_count.value) !== null && _aggregations$avg_act !== void 0 ? _aggregations$avg_act : 0,
        max: (_aggregations$max_act = aggregations.max_actions_count.value) !== null && _aggregations$max_act !== void 0 ? _aggregations$max_act : 0
      }
    };
  } catch (err) {
    const errorMessage = err && err.message ? err.message : err.toString();
    logger.warn(`Error executing alerting telemetry task: getTotalCountAggregations - ${JSON.stringify(err)}`, {
      tags: ['alerting', 'telemetry-failed'],
      error: {
        stack_trace: err.stack
      }
    });
    return {
      hasErrors: true,
      errorMessage,
      count_total: 0,
      count_by_type: {},
      count_rules_by_execution_status: {
        success: 0,
        error: 0,
        warning: 0
      },
      count_rules_by_notify_when: {
        on_throttle_interval: 0,
        on_active_alert: 0,
        on_action_group_change: 0
      },
      count_rules_with_tags: 0,
      count_rules_snoozed: 0,
      count_rules_muted: 0,
      count_rules_with_muted_alerts: 0,
      count_connector_types_by_consumers: {},
      throttle_time: {
        min: '0s',
        avg: '0s',
        max: '0s'
      },
      schedule_time: {
        min: '0s',
        avg: '0s',
        max: '0s'
      },
      throttle_time_number_s: {
        min: 0,
        avg: 0,
        max: 0
      },
      schedule_time_number_s: {
        min: 0,
        avg: 0,
        max: 0
      },
      connectors_per_alert: {
        min: 0,
        avg: 0,
        max: 0
      }
    };
  }
}
async function getTotalCountInUse({
  esClient,
  kibanaIndex,
  logger
}) {
  try {
    var _results$hits$total2, _aggregations$namespa;
    const query = {
      index: kibanaIndex,
      size: 0,
      body: {
        query: {
          bool: {
            // Aggregate over only enabled rule saved objects
            filter: [{
              term: {
                type: 'alert'
              }
            }, {
              term: {
                'alert.enabled': true
              }
            }]
          }
        },
        aggs: {
          namespaces_count: {
            cardinality: {
              field: 'namespaces'
            }
          },
          by_rule_type_id: {
            terms: {
              field: 'alert.alertTypeId',
              size: _alerting_usage_collector.NUM_ALERTING_RULE_TYPES
            }
          }
        }
      }
    };
    logger.debug(`query for getTotalCountInUse - ${JSON.stringify(query)}`);
    const results = await esClient.search(query);
    logger.debug(`results for getTotalCountInUse query - ${JSON.stringify(results)}`);
    const aggregations = results.aggregations;
    const totalEnabledRulesCount = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total2 = results.hits.total) === null || _results$hits$total2 === void 0 ? void 0 : _results$hits$total2.value;
    return {
      hasErrors: false,
      countTotal: totalEnabledRulesCount !== null && totalEnabledRulesCount !== void 0 ? totalEnabledRulesCount : 0,
      countByType: (0, _parse_simple_rule_type_bucket.parseSimpleRuleTypeBucket)(aggregations.by_rule_type_id.buckets),
      countNamespaces: (_aggregations$namespa = aggregations.namespaces_count.value) !== null && _aggregations$namespa !== void 0 ? _aggregations$namespa : 0
    };
  } catch (err) {
    const errorMessage = err && err.message ? err.message : err.toString();
    logger.warn(`Error executing alerting telemetry task: getTotalCountInUse - ${JSON.stringify(err)}`, {
      tags: ['alerting', 'telemetry-failed'],
      error: {
        stack_trace: err.stack
      }
    });
    return {
      hasErrors: true,
      errorMessage,
      countTotal: 0,
      countByType: {},
      countNamespaces: 0
    };
  }
}