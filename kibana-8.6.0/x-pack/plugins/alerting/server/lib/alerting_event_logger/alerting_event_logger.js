"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertingEventLogger = void 0;
exports.createActionExecuteRecord = createActionExecuteRecord;
exports.createAlertRecord = createAlertRecord;
exports.createExecuteStartRecord = createExecuteStartRecord;
exports.createExecuteTimeoutRecord = createExecuteTimeoutRecord;
exports.initializeExecuteRecord = initializeExecuteRecord;
exports.updateEvent = updateEvent;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../event_log/server");
var _plugin = require("../../plugin");
var _create_alert_event_log_record_object = require("../create_alert_event_log_record_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// 1,000,000 nanoseconds in 1 millisecond
const Millis2Nanos = 1000 * 1000;
class AlertingEventLogger {
  // this is the "execute" event that will be updated over the lifecycle of this class

  constructor(eventLogger) {
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "startTime", void 0);
    (0, _defineProperty2.default)(this, "ruleContext", void 0);
    (0, _defineProperty2.default)(this, "event", void 0);
    this.eventLogger = eventLogger;
  }

  // For testing purposes
  getEvent() {
    return this.event;
  }
  initialize(context) {
    if (this.isInitialized) {
      throw new Error('AlertingEventLogger already initialized');
    }
    this.isInitialized = true;
    this.ruleContext = context;
  }
  start() {
    if (!this.isInitialized || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.startTime = new Date();
    const context = {
      ...this.ruleContext,
      taskScheduleDelay: this.startTime.getTime() - this.ruleContext.taskScheduledAt.getTime()
    };

    // Initialize the "execute" event
    this.event = initializeExecuteRecord(context);
    this.eventLogger.startTiming(this.event, this.startTime);

    // Create and log "execute-start" event
    const executeStartEvent = createExecuteStartRecord(context, this.startTime);
    this.eventLogger.logEvent(executeStartEvent);
  }
  getStartAndDuration() {
    return {
      start: this.startTime,
      duration: this.startTime ? (0, _server.millisToNanos)(new Date().getTime() - this.startTime.getTime()) : '0'
    };
  }
  setRuleName(ruleName) {
    if (!this.isInitialized || !this.event || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.ruleContext.ruleName = ruleName;
    updateEvent(this.event, {
      ruleName
    });
  }
  setExecutionSucceeded(message) {
    if (!this.isInitialized || !this.event) {
      throw new Error('AlertingEventLogger not initialized');
    }
    updateEvent(this.event, {
      message,
      outcome: 'success',
      alertingOutcome: 'success'
    });
  }
  setExecutionFailed(message, errorMessage) {
    if (!this.isInitialized || !this.event) {
      throw new Error('AlertingEventLogger not initialized');
    }
    updateEvent(this.event, {
      message,
      outcome: 'failure',
      alertingOutcome: 'failure',
      error: errorMessage
    });
  }
  logTimeout() {
    if (!this.isInitialized || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.eventLogger.logEvent(createExecuteTimeoutRecord(this.ruleContext));
  }
  logAlert(alert) {
    if (!this.isInitialized || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.eventLogger.logEvent(createAlertRecord(this.ruleContext, alert));
  }
  logAction(action) {
    if (!this.isInitialized || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.eventLogger.logEvent(createActionExecuteRecord(this.ruleContext, action));
  }
  done({
    status,
    metrics,
    timings
  }) {
    if (!this.isInitialized || !this.event || !this.ruleContext) {
      throw new Error('AlertingEventLogger not initialized');
    }
    this.eventLogger.stopTiming(this.event);
    if (status) {
      updateEvent(this.event, {
        status: status.status
      });
      if (status.error) {
        var _status$error, _this$event, _this$event$error;
        updateEvent(this.event, {
          outcome: 'failure',
          alertingOutcome: 'failure',
          reason: ((_status$error = status.error) === null || _status$error === void 0 ? void 0 : _status$error.reason) || 'unknown',
          error: ((_this$event = this.event) === null || _this$event === void 0 ? void 0 : (_this$event$error = _this$event.error) === null || _this$event$error === void 0 ? void 0 : _this$event$error.message) || status.error.message,
          ...(this.event.message ? {} : {
            message: `${this.ruleContext.ruleType.id}:${this.ruleContext.ruleId}: execution failed`
          })
        });
      } else {
        if (status.warning) {
          var _status$warning, _status$warning2, _this$event2;
          updateEvent(this.event, {
            alertingOutcome: 'warning',
            reason: ((_status$warning = status.warning) === null || _status$warning === void 0 ? void 0 : _status$warning.reason) || 'unknown',
            message: ((_status$warning2 = status.warning) === null || _status$warning2 === void 0 ? void 0 : _status$warning2.message) || ((_this$event2 = this.event) === null || _this$event2 === void 0 ? void 0 : _this$event2.message)
          });
        }
      }
    }
    if (metrics) {
      updateEvent(this.event, {
        metrics
      });
    }
    if (timings) {
      updateEvent(this.event, {
        timings
      });
    }
    this.eventLogger.logEvent(this.event);
  }
}
exports.AlertingEventLogger = AlertingEventLogger;
function createExecuteStartRecord(context, startTime) {
  const event = initializeExecuteRecord(context);
  return {
    ...event,
    event: {
      ...event.event,
      action: _plugin.EVENT_LOG_ACTIONS.executeStart,
      ...(startTime ? {
        start: startTime.toISOString()
      } : {})
    },
    message: `rule execution start: "${context.ruleId}"`
  };
}
function createAlertRecord(context, alert) {
  return (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
    ruleId: context.ruleId,
    ruleType: context.ruleType,
    consumer: context.consumer,
    namespace: context.namespace,
    spaceId: context.spaceId,
    executionId: context.executionId,
    action: alert.action,
    state: alert.state,
    instanceId: alert.id,
    group: alert.group,
    message: alert.message,
    savedObjects: [{
      id: context.ruleId,
      type: 'alert',
      typeId: context.ruleType.id,
      relation: _server.SAVED_OBJECT_REL_PRIMARY
    }],
    ruleName: context.ruleName,
    flapping: alert.flapping
  });
}
function createActionExecuteRecord(context, action) {
  return (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
    ruleId: context.ruleId,
    ruleType: context.ruleType,
    consumer: context.consumer,
    namespace: context.namespace,
    spaceId: context.spaceId,
    executionId: context.executionId,
    action: _plugin.EVENT_LOG_ACTIONS.executeAction,
    instanceId: action.alertId,
    group: action.alertGroup,
    message: `alert: ${context.ruleType.id}:${context.ruleId}: '${context.ruleName}' instanceId: '${action.alertId}' scheduled actionGroup: '${action.alertGroup}' action: ${action.typeId}:${action.id}`,
    savedObjects: [{
      id: context.ruleId,
      type: 'alert',
      typeId: context.ruleType.id,
      relation: _server.SAVED_OBJECT_REL_PRIMARY
    }, {
      type: 'action',
      id: action.id,
      typeId: action.typeId
    }],
    ruleName: context.ruleName
  });
}
function createExecuteTimeoutRecord(context) {
  var _context$ruleName;
  return (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
    ruleId: context.ruleId,
    ruleType: context.ruleType,
    consumer: context.consumer,
    namespace: context.namespace,
    spaceId: context.spaceId,
    executionId: context.executionId,
    action: _plugin.EVENT_LOG_ACTIONS.executeTimeout,
    message: `rule: ${context.ruleType.id}:${context.ruleId}: '${(_context$ruleName = context.ruleName) !== null && _context$ruleName !== void 0 ? _context$ruleName : ''}' execution cancelled due to timeout - exceeded rule type timeout of ${context.ruleType.ruleTaskTimeout}`,
    savedObjects: [{
      id: context.ruleId,
      type: 'alert',
      typeId: context.ruleType.id,
      relation: _server.SAVED_OBJECT_REL_PRIMARY
    }],
    ruleName: context.ruleName
  });
}
function initializeExecuteRecord(context) {
  return (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
    ruleId: context.ruleId,
    ruleType: context.ruleType,
    consumer: context.consumer,
    namespace: context.namespace,
    spaceId: context.spaceId,
    executionId: context.executionId,
    action: _plugin.EVENT_LOG_ACTIONS.execute,
    task: {
      scheduled: context.taskScheduledAt.toISOString(),
      scheduleDelay: Millis2Nanos * context.taskScheduleDelay
    },
    savedObjects: [{
      id: context.ruleId,
      type: 'alert',
      typeId: context.ruleType.id,
      relation: _server.SAVED_OBJECT_REL_PRIMARY
    }]
  });
}
function updateEvent(event, opts) {
  const {
    message,
    outcome,
    error,
    ruleName,
    status,
    reason,
    metrics,
    timings,
    alertingOutcome
  } = opts;
  if (!event) {
    throw new Error('Cannot update event because it is not initialized.');
  }
  if (message) {
    event.message = message;
  }
  if (outcome) {
    event.event = event.event || {};
    event.event.outcome = outcome;
  }
  if (alertingOutcome) {
    event.kibana = event.kibana || {};
    event.kibana.alerting = event.kibana.alerting || {};
    event.kibana.alerting.outcome = alertingOutcome;
  }
  if (error) {
    event.error = event.error || {};
    event.error.message = error;
  }
  if (ruleName) {
    event.rule = {
      ...event.rule,
      name: ruleName
    };
  }
  if (status) {
    event.kibana = event.kibana || {};
    event.kibana.alerting = event.kibana.alerting || {};
    event.kibana.alerting.status = status;
  }
  if (reason) {
    event.event = event.event || {};
    event.event.reason = reason;
  }
  if (metrics) {
    event.kibana = event.kibana || {};
    event.kibana.alert = event.kibana.alert || {};
    event.kibana.alert.rule = event.kibana.alert.rule || {};
    event.kibana.alert.rule.execution = event.kibana.alert.rule.execution || {};
    event.kibana.alert.rule.execution.metrics = {
      ...event.kibana.alert.rule.execution.metrics,
      number_of_triggered_actions: metrics.numberOfTriggeredActions ? metrics.numberOfTriggeredActions : 0,
      number_of_generated_actions: metrics.numberOfGeneratedActions ? metrics.numberOfGeneratedActions : 0,
      alert_counts: {
        active: metrics.numberOfActiveAlerts ? metrics.numberOfActiveAlerts : 0,
        new: metrics.numberOfNewAlerts ? metrics.numberOfNewAlerts : 0,
        recovered: metrics.numberOfRecoveredAlerts ? metrics.numberOfRecoveredAlerts : 0
      },
      number_of_searches: metrics.numSearches ? metrics.numSearches : 0,
      es_search_duration_ms: metrics.esSearchDurationMs ? metrics.esSearchDurationMs : 0,
      total_search_duration_ms: metrics.totalSearchDurationMs ? metrics.totalSearchDurationMs : 0
    };
  }
  if (timings) {
    event.kibana = event.kibana || {};
    event.kibana.alert = event.kibana.alert || {};
    event.kibana.alert.rule = event.kibana.alert.rule || {};
    event.kibana.alert.rule.execution = event.kibana.alert.rule.execution || {};
    event.kibana.alert.rule.execution.metrics = {
      ...event.kibana.alert.rule.execution.metrics,
      ...timings
    };
  }
}