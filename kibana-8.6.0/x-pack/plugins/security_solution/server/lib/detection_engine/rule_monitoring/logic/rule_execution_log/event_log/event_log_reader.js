"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEventLogReader = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _utility_types = require("../../../../../../../common/utility_types");
var _invariant = require("../../../../../../../common/utils/invariant");
var _with_security_span = require("../../../../../../utils/with_security_span");
var _rule_monitoring = require("../../../../../../../common/detection_engine/rule_monitoring");
var _constants = require("./constants");
var _get_execution_event_aggregation = require("./get_execution_event_aggregation");
var _types = require("./get_execution_event_aggregation/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEventLogReader = eventLog => {
  return {
    async getExecutionEvents(args) {
      const {
        ruleId,
        eventTypes,
        logLevels,
        sortOrder,
        page,
        perPage
      } = args;
      const soType = _constants.RULE_SAVED_OBJECT_TYPE;
      const soIds = [ruleId];

      // TODO: include Framework events
      const kqlFilter = kqlAnd([`event.provider:${_constants.RULE_EXECUTION_LOG_PROVIDER}`, eventTypes.length > 0 ? `event.action:(${kqlOr(eventTypes)})` : '', logLevels.length > 0 ? `log.level:(${kqlOr(logLevels)})` : '']);
      const findResult = await (0, _with_security_span.withSecuritySpan)('findEventsBySavedObjectIds', () => {
        return eventLog.findEventsBySavedObjectIds(soType, soIds, {
          filter: kqlFilter,
          sort: [{
            sort_field: '@timestamp',
            sort_order: sortOrder
          }, {
            sort_field: 'event.sequence',
            sort_order: sortOrder
          }],
          page,
          per_page: perPage
        });
      });
      return {
        events: findResult.data.map(event => normalizeEvent(event)),
        pagination: {
          page: findResult.page,
          per_page: findResult.per_page,
          total: findResult.total
        }
      };
    },
    async getExecutionResults(args) {
      const {
        ruleId,
        start,
        end,
        statusFilters,
        page,
        perPage,
        sortField,
        sortOrder
      } = args;
      const soType = _constants.RULE_SAVED_OBJECT_TYPE;
      const soIds = [ruleId];

      // Current workaround to support root level filters without missing fields in the aggregate event
      // or including events from statuses that aren't selected
      // TODO: See: https://github.com/elastic/kibana/pull/127339/files#r825240516
      // First fetch execution uuid's by status filter if provided
      let statusIds = [];
      let totalExecutions;
      // If 0 or 3 statuses are selected we can search for all statuses and don't need this pre-filter by ID
      if (statusFilters.length > 0 && statusFilters.length < 3) {
        var _statusResults$aggreg, _filteredExecutionUUI, _filteredExecutionUUI2, _statusResults$aggreg2;
        const outcomes = (0, _get_execution_event_aggregation.mapRuleExecutionStatusToPlatformStatus)(statusFilters);
        const outcomeFilter = outcomes.length ? `OR event.outcome:(${outcomes.join(' OR ')})` : '';
        const statusResults = await eventLog.aggregateEventsBySavedObjectIds(soType, soIds, {
          start,
          end,
          // Also query for `event.outcome` to catch executions that only contain platform events
          filter: `kibana.alert.rule.execution.status:(${statusFilters.join(' OR ')}) ${outcomeFilter}`,
          aggs: {
            totalExecutions: {
              cardinality: {
                field: _types.EXECUTION_UUID_FIELD
              }
            },
            filteredExecutionUUIDs: {
              terms: {
                field: _types.EXECUTION_UUID_FIELD,
                order: {
                  executeStartTime: 'desc'
                },
                size: _securitysolutionRules.MAX_EXECUTION_EVENTS_DISPLAYED
              },
              aggs: {
                executeStartTime: {
                  min: {
                    field: '@timestamp'
                  }
                }
              }
            }
          }
        });
        const filteredExecutionUUIDs = (_statusResults$aggreg = statusResults.aggregations) === null || _statusResults$aggreg === void 0 ? void 0 : _statusResults$aggreg.filteredExecutionUUIDs;
        statusIds = (_filteredExecutionUUI = filteredExecutionUUIDs === null || filteredExecutionUUIDs === void 0 ? void 0 : (_filteredExecutionUUI2 = filteredExecutionUUIDs.buckets) === null || _filteredExecutionUUI2 === void 0 ? void 0 : _filteredExecutionUUI2.map(b => b.key)) !== null && _filteredExecutionUUI !== void 0 ? _filteredExecutionUUI : [];
        totalExecutions = ((_statusResults$aggreg2 = statusResults.aggregations) === null || _statusResults$aggreg2 === void 0 ? void 0 : _statusResults$aggreg2.totalExecutions).value;
        // Early return if no results based on status filter
        if (statusIds.length === 0) {
          return {
            total: 0,
            events: []
          };
        }
      }

      // Now query for aggregate events, and pass any ID's as filters as determined from the above status/queryText results
      const idsFilter = statusIds.length ? `kibana.alert.rule.execution.uuid:(${statusIds.join(' OR ')})` : '';
      const results = await eventLog.aggregateEventsBySavedObjectIds(soType, soIds, {
        start,
        end,
        filter: idsFilter,
        aggs: (0, _get_execution_event_aggregation.getExecutionEventAggregation)({
          maxExecutions: _securitysolutionRules.MAX_EXECUTION_EVENTS_DISPLAYED,
          page,
          perPage,
          sort: [{
            [sortField]: {
              order: sortOrder
            }
          }]
        })
      });
      return (0, _get_execution_event_aggregation.formatExecutionEventResponse)(results, totalExecutions);
    }
  };
};
exports.createEventLogReader = createEventLogReader;
const kqlAnd = items => {
  return items.filter(Boolean).map(String).join(' and ');
};
const kqlOr = items => {
  return items.filter(Boolean).map(String).join(' or ');
};
const normalizeEvent = rawEvent => {
  (0, _invariant.invariant)(rawEvent, 'Event not found');
  const timestamp = normalizeEventTimestamp(rawEvent);
  const sequence = normalizeEventSequence(rawEvent);
  const level = normalizeLogLevel(rawEvent);
  const type = normalizeEventType(rawEvent);
  const message = normalizeEventMessage(rawEvent, type);
  return {
    timestamp,
    sequence,
    level,
    type,
    message
  };
};
const normalizeEventTimestamp = event => {
  (0, _invariant.invariant)(event['@timestamp'], 'Required "@timestamp" field is not found');
  return event['@timestamp'];
};
const normalizeEventSequence = event => {
  var _event$event;
  const value = (_event$event = event.event) === null || _event$event === void 0 ? void 0 : _event$event.sequence;
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return Number(value);
  }
  return 0;
};
const normalizeLogLevel = event => {
  var _event$log, _logLevelFromString;
  const value = (_event$log = event.log) === null || _event$log === void 0 ? void 0 : _event$log.level;
  if (!value) {
    return _rule_monitoring.LogLevel.debug;
  }
  return (_logLevelFromString = (0, _rule_monitoring.logLevelFromString)(value)) !== null && _logLevelFromString !== void 0 ? _logLevelFromString : _rule_monitoring.LogLevel.trace;
};
const normalizeEventType = event => {
  var _event$event2, _ruleExecutionEventTy;
  const value = (_event$event2 = event.event) === null || _event$event2 === void 0 ? void 0 : _event$event2.action;
  (0, _invariant.invariant)(value, 'Required "event.action" field is not found');
  return (_ruleExecutionEventTy = (0, _rule_monitoring.ruleExecutionEventTypeFromString)(value)) !== null && _ruleExecutionEventTy !== void 0 ? _ruleExecutionEventTy : _rule_monitoring.RuleExecutionEventType.message;
};
const normalizeEventMessage = (event, type) => {
  if (type === _rule_monitoring.RuleExecutionEventType.message) {
    return event.message || '';
  }
  if (type === _rule_monitoring.RuleExecutionEventType['status-change']) {
    var _event$kibana, _event$kibana$alert, _event$kibana$alert$r, _event$kibana$alert$r2, _event$kibana2, _event$kibana2$alert, _event$kibana2$alert$, _event$kibana2$alert$2;
    (0, _invariant.invariant)((_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : (_event$kibana$alert = _event$kibana.alert) === null || _event$kibana$alert === void 0 ? void 0 : (_event$kibana$alert$r = _event$kibana$alert.rule) === null || _event$kibana$alert$r === void 0 ? void 0 : (_event$kibana$alert$r2 = _event$kibana$alert$r.execution) === null || _event$kibana$alert$r2 === void 0 ? void 0 : _event$kibana$alert$r2.status, 'Required "kibana.alert.rule.execution.status" field is not found');
    const status = (_event$kibana2 = event.kibana) === null || _event$kibana2 === void 0 ? void 0 : (_event$kibana2$alert = _event$kibana2.alert) === null || _event$kibana2$alert === void 0 ? void 0 : (_event$kibana2$alert$ = _event$kibana2$alert.rule) === null || _event$kibana2$alert$ === void 0 ? void 0 : (_event$kibana2$alert$2 = _event$kibana2$alert$.execution) === null || _event$kibana2$alert$2 === void 0 ? void 0 : _event$kibana2$alert$2.status;
    const message = event.message || '';
    return `Rule changed status to "${status}". ${message}`;
  }
  if (type === _rule_monitoring.RuleExecutionEventType['execution-metrics']) {
    return '';
  }
  (0, _utility_types.assertUnreachable)(type);
  return '';
};