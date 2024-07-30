"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEventLogWriter = void 0;
var _server = require("../../../../../../../../../../src/core/server");
var _server2 = require("../../../../../../../../event_log/server");
var _rule_monitoring = require("../../../../../../../common/detection_engine/rule_monitoring");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEventLogWriter = eventLogService => {
  const eventLogger = eventLogService.getLogger({
    event: {
      provider: _constants.RULE_EXECUTION_LOG_PROVIDER
    }
  });
  let sequence = 0;
  return {
    logMessage: args => {
      eventLogger.logEvent({
        '@timestamp': nowISO(),
        message: args.message,
        rule: {
          id: args.ruleId,
          uuid: args.ruleUuid,
          name: args.ruleName,
          category: args.ruleType
        },
        event: {
          kind: 'event',
          action: _rule_monitoring.RuleExecutionEventType.message,
          sequence: sequence++,
          severity: (0, _rule_monitoring.logLevelToNumber)(args.logLevel)
        },
        log: {
          level: args.logLevel
        },
        kibana: {
          alert: {
            rule: {
              execution: {
                uuid: args.executionId
              }
            }
          },
          space_ids: [args.spaceId],
          saved_objects: [{
            rel: _server2.SAVED_OBJECT_REL_PRIMARY,
            type: _constants.RULE_SAVED_OBJECT_TYPE,
            id: args.ruleId,
            namespace: spaceIdToNamespace(args.spaceId)
          }]
        }
      });
    },
    logStatusChange: args => {
      const logLevel = (0, _rule_monitoring.logLevelFromExecutionStatus)(args.newStatus);
      eventLogger.logEvent({
        '@timestamp': nowISO(),
        message: args.message,
        rule: {
          id: args.ruleId,
          uuid: args.ruleUuid,
          name: args.ruleName,
          category: args.ruleType
        },
        event: {
          kind: 'event',
          action: _rule_monitoring.RuleExecutionEventType['status-change'],
          sequence: sequence++,
          severity: (0, _rule_monitoring.logLevelToNumber)(logLevel)
        },
        log: {
          level: logLevel
        },
        kibana: {
          alert: {
            rule: {
              execution: {
                uuid: args.executionId,
                status: args.newStatus,
                status_order: (0, _rule_monitoring.ruleExecutionStatusToNumber)(args.newStatus)
              }
            }
          },
          space_ids: [args.spaceId],
          saved_objects: [{
            rel: _server2.SAVED_OBJECT_REL_PRIMARY,
            type: _constants.RULE_SAVED_OBJECT_TYPE,
            id: args.ruleId,
            namespace: spaceIdToNamespace(args.spaceId)
          }]
        }
      });
    },
    logExecutionMetrics: args => {
      const logLevel = _rule_monitoring.LogLevel.debug;
      eventLogger.logEvent({
        '@timestamp': nowISO(),
        rule: {
          id: args.ruleId,
          uuid: args.ruleUuid,
          name: args.ruleName,
          category: args.ruleType
        },
        event: {
          kind: 'metric',
          action: _rule_monitoring.RuleExecutionEventType['execution-metrics'],
          sequence: sequence++,
          severity: (0, _rule_monitoring.logLevelToNumber)(logLevel)
        },
        log: {
          level: logLevel
        },
        kibana: {
          alert: {
            rule: {
              execution: {
                uuid: args.executionId,
                metrics: args.metrics
              }
            }
          },
          space_ids: [args.spaceId],
          saved_objects: [{
            rel: _server2.SAVED_OBJECT_REL_PRIMARY,
            type: _constants.RULE_SAVED_OBJECT_TYPE,
            id: args.ruleId,
            namespace: spaceIdToNamespace(args.spaceId)
          }]
        }
      });
    }
  };
};
exports.createEventLogWriter = createEventLogWriter;
const nowISO = () => new Date().toISOString();
const spaceIdToNamespace = _server.SavedObjectsUtils.namespaceStringToId;