"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventLogByTypeAndStatus = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _get_event_log_agg_by_statuses = require("./utils/get_event_log_agg_by_statuses");
var _transform_event_log_type_status = require("./utils/transform_event_log_type_status");
var _get_initial_usage = require("../detections/rules/get_initial_usage");
var _get_search_for_all_rules = require("./utils/get_search_for_all_rules");
var _get_search_for_elastic_rules = require("./utils/get_search_for_elastic_rules");
var _get_search_for_custom_rules = require("./utils/get_search_for_custom_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Gets the event logs by their rule type and rule status. Returns the structure
 * transformed. If it malfunctions or times out then it will not malfunction other
 * parts of telemetry.
 * NOTE: This takes in "ruleResults" to filter against elastic rules and custom rules.
 * If the event log recorded information about which rules were elastic vs. custom this
 * would not need to be passed down.
 * @param esClient the elastic client which should be a system based client
 * @param eventLogIndex the index of the event log such as ".kibana-event-log-8.2.0"
 * @param logger The kibana logger
 * @param ruleResults The elastic and custom rules to filter against each.
 * @returns The event log transformed
 */
const getEventLogByTypeAndStatus = async ({
  esClient,
  eventLogIndex,
  logger,
  ruleResults
}) => {
  try {
    const typeAndStatus = await _getEventLogByTypeAndStatus({
      esClient,
      eventLogIndex,
      logger,
      ruleResults
    });
    return typeAndStatus;
  } catch (error) {
    logger.debug(`Error trying to get event log by type and status. Error message is: "${error.message}". Error is: "${error}". Returning empty initialized object.`);
    return (0, _get_initial_usage.getInitialEventLogUsage)();
  }
};

/**
 * Non-try-catch version. Gets the event logs by their rule type and rule status. Returns the structure
 * transformed.
 * NOTE: This takes in "ruleResults" to filter against elastic rules and custom rules.
 * If the event log recorded information about which rules were elastic vs. custom this
 * would not need to be passed down.
 * @param esClient the elastic client which should be a system based client
 * @param eventLogIndex the index of the event log such as ".kibana-event-log-8.2.0"
 * @param logger The kibana logger
 * @param ruleResults The elastic and custom rules to filter against each.
 * @returns The event log transformed
 */
exports.getEventLogByTypeAndStatus = getEventLogByTypeAndStatus;
const _getEventLogByTypeAndStatus = async ({
  esClient,
  eventLogIndex,
  logger,
  ruleResults
}) => {
  const aggs = (0, _get_event_log_agg_by_statuses.getEventLogAggByStatuses)({
    ruleStatuses: ['succeeded', 'failed', 'partial failure'],
    ruleTypes: [_securitysolutionRules.EQL_RULE_TYPE_ID, _securitysolutionRules.INDICATOR_RULE_TYPE_ID, _securitysolutionRules.ML_RULE_TYPE_ID, _securitysolutionRules.QUERY_RULE_TYPE_ID, _securitysolutionRules.THRESHOLD_RULE_TYPE_ID, _securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID, _securitysolutionRules.NEW_TERMS_RULE_TYPE_ID]
  });
  const elasticRuleIds = ruleResults.filter(ruleResult => ruleResult.attributes.params.immutable).map(ruleResult => ruleResult.id);
  const queryForTotal = (0, _get_search_for_all_rules.getSearchForAllRules)({
    eventLogIndex,
    aggs
  });
  const queryForElasticRules = (0, _get_search_for_elastic_rules.getSearchForElasticRules)({
    eventLogIndex,
    aggs,
    elasticRuleIds
  });
  const queryForCustomRules = (0, _get_search_for_custom_rules.getSearchForCustomRules)({
    eventLogIndex,
    aggs,
    elasticRuleIds
  });
  logger.debug(`Getting event logs by type and status with query for total: ${JSON.stringify(queryForTotal)}, elastic_rules: ${JSON.stringify(queryForElasticRules)} custom_rules: ${JSON.stringify(queryForCustomRules)}`);
  const [totalRules, elasticRules, customRules] = await Promise.all([esClient.search(queryForTotal), esClient.search(queryForElasticRules), esClient.search(queryForCustomRules)]);
  logger.debug(`Raw search results of event logs by type and status for total: ${JSON.stringify(totalRules)} elastic_rules: ${JSON.stringify(elasticRules)}, custom_rules: ${JSON.stringify(customRules)}`);
  const totalRulesTransformed = (0, _transform_event_log_type_status.transformEventLogTypeStatus)({
    aggs: totalRules.aggregations,
    logger
  });
  const elasticRulesTransformed = (0, _transform_event_log_type_status.transformEventLogTypeStatus)({
    aggs: elasticRules.aggregations,
    logger
  });
  const customRulesTransformed = (0, _transform_event_log_type_status.transformEventLogTypeStatus)({
    aggs: customRules.aggregations,
    logger
  });
  const logStatusMetric = {
    all_rules: totalRulesTransformed,
    elastic_rules: elasticRulesTransformed,
    custom_rules: customRulesTransformed
  };
  logger.debug(`Metrics transformed for event logs of type and status are: ${JSON.stringify(logStatusMetric)}`);
  return logStatusMetric;
};