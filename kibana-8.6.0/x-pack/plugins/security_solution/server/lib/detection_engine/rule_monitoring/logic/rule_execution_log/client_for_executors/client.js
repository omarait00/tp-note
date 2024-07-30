"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientForExecutors = void 0;
var _lodash = require("lodash");
var _rule_monitoring = require("../../../../../../../common/detection_engine/rule_monitoring");
var _utility_types = require("../../../../../../../common/utility_types");
var _with_security_span = require("../../../../../../utils/with_security_span");
var _normalization = require("../utils/normalization");
var _correlation_ids = require("./correlation_ids");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createClientForExecutors = (settings, soClient, eventLog, logger, context) => {
  const baseCorrelationIds = (0, _correlation_ids.getCorrelationIds)(context);
  const baseLogSuffix = baseCorrelationIds.getLogSuffix();
  const baseLogMeta = baseCorrelationIds.getLogMeta();
  const {
    executionId,
    ruleId,
    ruleUuid,
    ruleName,
    ruleType,
    spaceId
  } = context;
  const client = {
    get context() {
      return context;
    },
    trace(...messages) {
      writeMessage(messages, _rule_monitoring.LogLevel.trace);
    },
    debug(...messages) {
      writeMessage(messages, _rule_monitoring.LogLevel.debug);
    },
    info(...messages) {
      writeMessage(messages, _rule_monitoring.LogLevel.info);
    },
    warn(...messages) {
      writeMessage(messages, _rule_monitoring.LogLevel.warn);
    },
    error(...messages) {
      writeMessage(messages, _rule_monitoring.LogLevel.error);
    },
    async logStatusChange(args) {
      await (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForExecutors.logStatusChange', async () => {
        const correlationIds = baseCorrelationIds.withStatus(args.newStatus);
        const logMeta = correlationIds.getLogMeta();
        try {
          const normalizedArgs = normalizeStatusChangeArgs(args);
          await Promise.all([writeStatusChangeToConsole(normalizedArgs, logMeta), writeStatusChangeToSavedObjects(normalizedArgs), writeStatusChangeToEventLog(normalizedArgs)]);
        } catch (e) {
          const logMessage = `Error changing rule status to "${args.newStatus}"`;
          writeExceptionToConsole(e, logMessage, logMeta);
        }
      });
    }
  };
  const writeMessage = (messages, logLevel) => {
    const message = messages.join(' ');
    writeMessageToConsole(message, logLevel, baseLogMeta);
    writeMessageToEventLog(message, logLevel);
  };
  const writeMessageToConsole = (message, logLevel, logMeta) => {
    switch (logLevel) {
      case _rule_monitoring.LogLevel.trace:
        logger.trace(`${message} ${baseLogSuffix}`, logMeta);
        break;
      case _rule_monitoring.LogLevel.debug:
        logger.debug(`${message} ${baseLogSuffix}`, logMeta);
        break;
      case _rule_monitoring.LogLevel.info:
        logger.info(`${message} ${baseLogSuffix}`, logMeta);
        break;
      case _rule_monitoring.LogLevel.warn:
        logger.warn(`${message} ${baseLogSuffix}`, logMeta);
        break;
      case _rule_monitoring.LogLevel.error:
        logger.error(`${message} ${baseLogSuffix}`, logMeta);
        break;
      default:
        (0, _utility_types.assertUnreachable)(logLevel);
    }
  };
  const writeMessageToEventLog = (message, logLevel) => {
    const {
      isEnabled,
      minLevel
    } = settings.extendedLogging;
    if (!isEnabled || minLevel === _rule_monitoring.LogLevelSetting.off) {
      return;
    }
    if ((0, _rule_monitoring.logLevelToNumber)(logLevel) < (0, _rule_monitoring.logLevelToNumber)(minLevel)) {
      return;
    }
    eventLog.logMessage({
      ruleId,
      ruleUuid,
      ruleName,
      ruleType,
      spaceId,
      executionId,
      message,
      logLevel
    });
  };
  const writeExceptionToConsole = (e, message, logMeta) => {
    var _e$stack;
    const logReason = e instanceof Error ? (_e$stack = e.stack) !== null && _e$stack !== void 0 ? _e$stack : e.message : String(e);
    writeMessageToConsole(`${message}. Reason: ${logReason}`, _rule_monitoring.LogLevel.error, logMeta);
  };
  const writeStatusChangeToConsole = (args, logMeta) => {
    const messageParts = [`Changing rule status to "${args.newStatus}"`, args.message];
    const logMessage = messageParts.filter(Boolean).join('. ');
    const logLevel = (0, _rule_monitoring.logLevelFromExecutionStatus)(args.newStatus);
    writeMessageToConsole(logMessage, logLevel, logMeta);
  };

  // TODO: Add executionId to new status SO?
  const writeStatusChangeToSavedObjects = async args => {
    const {
      newStatus,
      message,
      metrics
    } = args;
    await soClient.createOrUpdate(ruleId, {
      last_execution: {
        date: nowISO(),
        status: newStatus,
        status_order: (0, _rule_monitoring.ruleExecutionStatusToNumber)(newStatus),
        message,
        metrics: metrics !== null && metrics !== void 0 ? metrics : {}
      }
    });
  };
  const writeStatusChangeToEventLog = args => {
    const {
      newStatus,
      message,
      metrics
    } = args;
    if (metrics) {
      eventLog.logExecutionMetrics({
        ruleId,
        ruleUuid,
        ruleName,
        ruleType,
        spaceId,
        executionId,
        metrics
      });
    }
    eventLog.logStatusChange({
      ruleId,
      ruleUuid,
      ruleName,
      ruleType,
      spaceId,
      executionId,
      newStatus,
      message
    });
  };
  return client;
};
exports.createClientForExecutors = createClientForExecutors;
const nowISO = () => new Date().toISOString();
const normalizeStatusChangeArgs = args => {
  var _truncateValue;
  const {
    newStatus,
    message,
    metrics
  } = args;
  return {
    newStatus,
    message: (_truncateValue = (0, _normalization.truncateValue)(message)) !== null && _truncateValue !== void 0 ? _truncateValue : '',
    metrics: metrics ? {
      total_search_duration_ms: normalizeDurations(metrics.searchDurations),
      total_indexing_duration_ms: normalizeDurations(metrics.indexingDurations),
      total_enrichment_duration_ms: normalizeDurations(metrics.enrichmentDurations),
      execution_gap_duration_s: normalizeGap(metrics.executionGap)
    } : undefined
  };
};
const normalizeDurations = durations => {
  if (durations == null) {
    return undefined;
  }
  const sumAsFloat = (0, _lodash.sum)(durations.map(Number));
  return Math.round(sumAsFloat);
};
const normalizeGap = duration => {
  return duration ? Math.round(duration.asSeconds()) : undefined;
};