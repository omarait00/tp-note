"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunner = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _lodash = require("lodash");
var _uuid = _interopRequireDefault(require("uuid"));
var _server = require("../../../task_manager/server");
var _server2 = require("../../../event_log/server");
var _execution_handler = require("./execution_handler");
var _alert = require("../alert");
var _lib = require("../lib");
var _types = require("../types");
var _result_type = require("../lib/result_type");
var _alert_task_instance = require("./alert_task_instance");
var _is_alerting_error = require("../lib/is_alerting_error");
var _saved_objects = require("../saved_objects");
var _common = require("../../common");
var _errors = require("../lib/errors");
var _monitoring = require("../monitoring");
var _wrap_scoped_cluster_client = require("../lib/wrap_scoped_cluster_client");
var _rule_run_metrics_store = require("../lib/rule_run_metrics_store");
var _wrap_search_source_client = require("../lib/wrap_search_source_client");
var _alerting_event_logger = require("../lib/alerting_event_logger/alerting_event_logger");
var _rule_loader = require("./rule_loader");
var _log_alerts = require("./log_alerts");
var _create_alert_factory = require("../alert/create_alert_factory");
var _task_runner_timer = require("./task_runner_timer");
var _rule_monitoring_service = require("../monitoring/rule_monitoring_service");
var _last_run_status = require("../lib/last_run_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FALLBACK_RETRY_INTERVAL = '5m';
const CONNECTIVITY_RETRY_INTERVAL = '5m';
class TaskRunner {
  constructor(ruleType, taskInstance, context, inMemoryMetrics) {
    (0, _defineProperty2.default)(this, "context", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "taskInstance", void 0);
    (0, _defineProperty2.default)(this, "ruleConsumer", void 0);
    (0, _defineProperty2.default)(this, "ruleType", void 0);
    (0, _defineProperty2.default)(this, "executionId", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "inMemoryMetrics", void 0);
    (0, _defineProperty2.default)(this, "maxAlerts", void 0);
    (0, _defineProperty2.default)(this, "alerts", void 0);
    (0, _defineProperty2.default)(this, "timer", void 0);
    (0, _defineProperty2.default)(this, "alertingEventLogger", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "searchAbortController", void 0);
    (0, _defineProperty2.default)(this, "cancelled", void 0);
    (0, _defineProperty2.default)(this, "stackTraceLog", void 0);
    (0, _defineProperty2.default)(this, "ruleMonitoring", void 0);
    this.context = context;
    const loggerId = ruleType.id.startsWith('.') ? ruleType.id.substring(1) : ruleType.id;
    this.logger = context.logger.get(loggerId);
    this.usageCounter = context.usageCounter;
    this.ruleType = ruleType;
    this.ruleConsumer = null;
    this.taskInstance = (0, _alert_task_instance.taskInstanceToAlertTaskInstance)(taskInstance);
    this.ruleTypeRegistry = context.ruleTypeRegistry;
    this.searchAbortController = new AbortController();
    this.cancelled = false;
    this.executionId = _uuid.default.v4();
    this.inMemoryMetrics = inMemoryMetrics;
    this.maxAlerts = context.maxAlerts;
    this.alerts = {};
    this.timer = new _task_runner_timer.TaskRunnerTimer({
      logger: this.logger
    });
    this.alertingEventLogger = new _alerting_event_logger.AlertingEventLogger(this.context.eventLogger);
    this.stackTraceLog = null;
    this.ruleMonitoring = new _rule_monitoring_service.RuleMonitoringService();
  }
  async updateRuleSavedObject(ruleId, namespace, attributes) {
    const client = this.context.internalSavedObjectsRepository;
    try {
      await (0, _saved_objects.partiallyUpdateAlert)(client, ruleId, attributes, {
        ignore404: true,
        namespace,
        refresh: false
      });
    } catch (err) {
      this.logger.error(`error updating rule for ${this.ruleType.id}:${ruleId} ${err.message}`);
    }
  }
  shouldLogAndScheduleActionsForAlerts() {
    // if execution hasn't been cancelled, return true
    if (!this.cancelled) {
      return true;
    }

    // if execution has been cancelled, return true if EITHER alerting config or rule type indicate to proceed with scheduling actions
    return !this.context.cancelAlertsOnRuleTimeout || !this.ruleType.cancelAlertsOnRuleTimeout;
  }

  // Usage counter for telemetry
  // This keeps track of how many times action executions were skipped after rule
  // execution completed successfully after the execution timeout
  // This can occur when rule executors do not short circuit execution in response
  // to timeout
  countUsageOfActionExecutionAfterRuleCancellation() {
    if (this.cancelled && this.usageCounter) {
      if (this.context.cancelAlertsOnRuleTimeout && this.ruleType.cancelAlertsOnRuleTimeout) {
        // Increment usage counter for skipped actions
        this.usageCounter.incrementCounter({
          counterName: `alertsSkippedDueToRuleExecutionTimeout_${this.ruleType.id}`,
          incrementBy: 1
        });
      }
    }
  }
  async runRule({
    fakeRequest,
    rulesClient,
    rule,
    apiKey,
    validatedParams: params
  }) {
    if (_elasticApmNode.default.currentTransaction) {
      _elasticApmNode.default.currentTransaction.name = `Execute Alerting Rule: "${rule.name}"`;
      _elasticApmNode.default.currentTransaction.addLabels({
        alerting_rule_consumer: rule.consumer,
        alerting_rule_name: rule.name,
        alerting_rule_tags: rule.tags.join(', '),
        alerting_rule_type_id: rule.alertTypeId,
        alerting_rule_params: JSON.stringify(rule.params)
      });
    }
    const {
      alertTypeId: ruleTypeId,
      consumer,
      schedule,
      throttle = null,
      notifyWhen = null,
      name,
      tags,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      enabled,
      actions
    } = rule;
    const {
      params: {
        alertId: ruleId,
        spaceId
      },
      state: {
        alertInstances: alertRawInstances = {},
        alertTypeState: ruleTypeState = {},
        previousStartedAt
      }
    } = this.taskInstance;
    const ruleRunMetricsStore = new _rule_run_metrics_store.RuleRunMetricsStore();
    const namespace = this.context.spaceIdToNamespace(spaceId);
    const ruleType = this.ruleTypeRegistry.get(ruleTypeId);
    const ruleLabel = `${this.ruleType.id}:${ruleId}: '${name}'`;
    const wrappedClientOptions = {
      rule: {
        name: rule.name,
        alertTypeId: rule.alertTypeId,
        id: rule.id,
        spaceId
      },
      logger: this.logger,
      abortController: this.searchAbortController
    };
    const scopedClusterClient = this.context.elasticsearch.client.asScoped(fakeRequest);
    const wrappedScopedClusterClient = (0, _wrap_scoped_cluster_client.createWrappedScopedClusterClientFactory)({
      ...wrappedClientOptions,
      scopedClusterClient
    });
    const searchSourceClient = await this.context.data.search.searchSource.asScoped(fakeRequest);
    const wrappedSearchSourceClient = (0, _wrap_search_source_client.wrapSearchSourceClient)({
      ...wrappedClientOptions,
      searchSourceClient
    });
    const {
      updatedRuleTypeState,
      hasReachedAlertLimit,
      originalAlerts
    } = await this.timer.runWithTimer(_task_runner_timer.TaskRunnerTimerSpan.RuleTypeRun, async () => {
      var _ruleType$doesSetReco;
      for (const id in alertRawInstances) {
        if (alertRawInstances.hasOwnProperty(id)) {
          this.alerts[id] = new _alert.Alert(id, alertRawInstances[id]);
        }
      }
      const alertsCopy = (0, _lodash.cloneDeep)(this.alerts);
      const alertFactory = (0, _alert.createAlertFactory)({
        alerts: this.alerts,
        logger: this.logger,
        maxAlerts: this.maxAlerts,
        canSetRecoveryContext: (_ruleType$doesSetReco = ruleType.doesSetRecoveryContext) !== null && _ruleType$doesSetReco !== void 0 ? _ruleType$doesSetReco : false
      });
      const checkHasReachedAlertLimit = () => {
        const reachedLimit = alertFactory.hasReachedAlertLimit();
        if (reachedLimit) {
          this.logger.warn(`rule execution generated greater than ${this.maxAlerts} alerts: ${ruleLabel}`);
          ruleRunMetricsStore.setHasReachedAlertLimit(true);
        }
        return reachedLimit;
      };
      let updatedState;
      try {
        const ctx = {
          type: 'alert',
          name: `execute ${rule.alertTypeId}`,
          id: ruleId,
          description: `execute [${rule.alertTypeId}] with name [${name}] in [${namespace !== null && namespace !== void 0 ? namespace : 'default'}] namespace`
        };
        const savedObjectsClient = this.context.savedObjects.getScopedClient(fakeRequest, {
          includedHiddenTypes: ['alert', 'action']
        });
        updatedState = await this.context.executionContext.withContext(ctx, () => this.ruleType.executor({
          executionId: this.executionId,
          services: {
            savedObjectsClient,
            searchSourceClient: wrappedSearchSourceClient.searchSourceClient,
            uiSettingsClient: this.context.uiSettings.asScopedToClient(savedObjectsClient),
            scopedClusterClient: wrappedScopedClusterClient.client(),
            alertFactory: (0, _create_alert_factory.getPublicAlertFactory)(alertFactory),
            shouldWriteAlerts: () => this.shouldLogAndScheduleActionsForAlerts(),
            shouldStopExecution: () => this.cancelled,
            ruleMonitoringService: this.ruleMonitoring.getLastRunMetricsSetters()
          },
          params,
          state: ruleTypeState,
          startedAt: this.taskInstance.startedAt,
          previousStartedAt: previousStartedAt ? new Date(previousStartedAt) : null,
          spaceId,
          namespace,
          rule: {
            id: ruleId,
            name,
            tags,
            consumer,
            producer: ruleType.producer,
            ruleTypeId: rule.alertTypeId,
            ruleTypeName: ruleType.name,
            enabled,
            schedule,
            actions,
            createdBy,
            updatedBy,
            createdAt,
            updatedAt,
            throttle,
            notifyWhen
          },
          logger: this.logger
        }));

        // Rule type execution has successfully completed
        // Check that the rule type either never requested the max alerts limit
        // or requested it and then reported back whether it exceeded the limit
        // If neither of these apply, this check will throw an error
        // These errors should show up during rule type development
        alertFactory.alertLimit.checkLimitUsage();
      } catch (err) {
        // Check if this error is due to reaching the alert limit
        if (!checkHasReachedAlertLimit()) {
          this.alertingEventLogger.setExecutionFailed(`rule execution failure: ${ruleLabel}`, err.message);
          this.stackTraceLog = {
            message: err,
            stackTrace: err.stack
          };
          throw new _lib.ErrorWithReason(_types.RuleExecutionStatusErrorReasons.Execute, err);
        }
      }

      // Check if the rule type has reported that it reached the alert limit
      checkHasReachedAlertLimit();
      this.alertingEventLogger.setExecutionSucceeded(`rule executed: ${ruleLabel}`);
      ruleRunMetricsStore.setSearchMetrics([wrappedScopedClusterClient.getMetrics(), wrappedSearchSourceClient.getMetrics()]);
      return {
        originalAlerts: alertsCopy,
        updatedRuleTypeState: updatedState || undefined,
        hasReachedAlertLimit: alertFactory.hasReachedAlertLimit()
      };
    });
    const {
      activeAlerts,
      recoveredAlerts
    } = await this.timer.runWithTimer(_task_runner_timer.TaskRunnerTimerSpan.ProcessAlerts, async () => {
      var _ruleType$doesSetReco2;
      const {
        newAlerts: processedAlertsNew,
        activeAlerts: processedAlertsActive,
        recoveredAlerts: processedAlertsRecovered
      } = (0, _lib.processAlerts)({
        alerts: this.alerts,
        existingAlerts: originalAlerts,
        hasReachedAlertLimit,
        alertLimit: this.maxAlerts
      });
      (0, _log_alerts.logAlerts)({
        logger: this.logger,
        alertingEventLogger: this.alertingEventLogger,
        newAlerts: processedAlertsNew,
        activeAlerts: processedAlertsActive,
        recoveredAlerts: processedAlertsRecovered,
        ruleLogPrefix: ruleLabel,
        ruleRunMetricsStore,
        canSetRecoveryContext: (_ruleType$doesSetReco2 = ruleType.doesSetRecoveryContext) !== null && _ruleType$doesSetReco2 !== void 0 ? _ruleType$doesSetReco2 : false,
        shouldPersistAlerts: this.shouldLogAndScheduleActionsForAlerts()
      });
      return {
        newAlerts: processedAlertsNew,
        activeAlerts: processedAlertsActive,
        recoveredAlerts: processedAlertsRecovered
      };
    });
    const executionHandler = new _execution_handler.ExecutionHandler({
      rule,
      ruleType: this.ruleType,
      logger: this.logger,
      taskRunnerContext: this.context,
      taskInstance: this.taskInstance,
      ruleRunMetricsStore,
      apiKey,
      ruleConsumer: this.ruleConsumer,
      executionId: this.executionId,
      ruleLabel,
      alertingEventLogger: this.alertingEventLogger,
      actionsClient: await this.context.actionsPlugin.getActionsClientWithRequest(fakeRequest)
    });
    await this.timer.runWithTimer(_task_runner_timer.TaskRunnerTimerSpan.TriggerActions, async () => {
      await rulesClient.clearExpiredSnoozes({
        id: rule.id
      });
      if ((0, _lib.isRuleSnoozed)(rule)) {
        this.logger.debug(`no scheduling of actions for rule ${ruleLabel}: rule is snoozed.`);
      } else if (!this.shouldLogAndScheduleActionsForAlerts()) {
        this.logger.debug(`no scheduling of actions for rule ${ruleLabel}: rule execution has been cancelled.`);
        this.countUsageOfActionExecutionAfterRuleCancellation();
      } else {
        await executionHandler.run(activeAlerts);
        await executionHandler.run(recoveredAlerts, true);
      }
    });
    const alertsToReturn = {};
    for (const id in activeAlerts) {
      if (activeAlerts.hasOwnProperty(id)) {
        alertsToReturn[id] = activeAlerts[id].toRaw();
      }
    }
    return {
      metrics: ruleRunMetricsStore.getMetrics(),
      alertTypeState: updatedRuleTypeState || undefined,
      alertInstances: alertsToReturn
    };
  }

  /**
   * Initialize event logger, load and validate the rule
   */
  async prepareToRun() {
    var _this$ruleType$valida;
    const {
      params: {
        alertId: ruleId,
        spaceId,
        consumer
      }
    } = this.taskInstance;
    if (_elasticApmNode.default.currentTransaction) {
      _elasticApmNode.default.currentTransaction.name = `Execute Alerting Rule`;
      _elasticApmNode.default.currentTransaction.addLabels({
        alerting_rule_id: ruleId
      });
    }

    // Initially use consumer as stored inside the task instance
    // Replace this with consumer as read from the rule saved object after
    // we successfully read the rule SO. This allows us to populate a consumer
    // value for `execute-start` events (which are written before the rule SO is read)
    // and in the event of decryption errors (where we cannot read the rule SO)
    // Because "consumer" is set when a rule is created, this value should be static
    // for the life of a rule but there may be edge cases where migrations cause
    // the consumer values to become out of sync.
    if (consumer) {
      this.ruleConsumer = consumer;
    }
    const namespace = this.context.spaceIdToNamespace(spaceId);
    this.alertingEventLogger.initialize({
      ruleId,
      ruleType: this.ruleType,
      consumer: this.ruleConsumer,
      spaceId,
      executionId: this.executionId,
      taskScheduledAt: this.taskInstance.scheduledAt,
      ...(namespace ? {
        namespace
      } : {})
    });
    this.alertingEventLogger.start();
    return await (0, _rule_loader.loadRule)({
      paramValidator: (_this$ruleType$valida = this.ruleType.validate) === null || _this$ruleType$valida === void 0 ? void 0 : _this$ruleType$valida.params,
      ruleId,
      spaceId,
      context: this.context,
      ruleTypeRegistry: this.ruleTypeRegistry,
      alertingEventLogger: this.alertingEventLogger
    });
  }
  async processRunResults({
    nextRun,
    runDate,
    stateWithMetrics
  }) {
    const {
      params: {
        alertId: ruleId,
        spaceId
      }
    } = this.taskInstance;
    const namespace = this.context.spaceIdToNamespace(spaceId);

    // Getting executionStatus for backwards compatibility
    const {
      status: executionStatus
    } = (0, _result_type.map)(stateWithMetrics, ruleRunStateWithMetrics => (0, _lib.executionStatusFromState)(ruleRunStateWithMetrics, runDate), err => (0, _lib.executionStatusFromError)(err, runDate));

    // New consolidated statuses for lastRun
    const {
      lastRun,
      metrics: executionMetrics
    } = (0, _result_type.map)(stateWithMetrics, ruleRunStateWithMetrics => (0, _last_run_status.lastRunFromState)(ruleRunStateWithMetrics), err => (0, _lib.lastRunFromError)(err));
    if (_elasticApmNode.default.currentTransaction) {
      if (executionStatus.status === 'ok' || executionStatus.status === 'active') {
        _elasticApmNode.default.currentTransaction.setOutcome('success');
      } else if (executionStatus.status === 'error' || executionStatus.status === 'unknown') {
        _elasticApmNode.default.currentTransaction.setOutcome('failure');
      } else if (lastRun.outcome === 'succeeded') {
        _elasticApmNode.default.currentTransaction.setOutcome('success');
      } else if (lastRun.outcome === 'failed') {
        _elasticApmNode.default.currentTransaction.setOutcome('failure');
      }
    }
    this.logger.debug(`deprecated ruleRunStatus for ${this.ruleType.id}:${ruleId}: ${JSON.stringify(executionStatus)}`);
    this.logger.debug(`ruleRunStatus for ${this.ruleType.id}:${ruleId}: ${JSON.stringify(lastRun)}`);
    if (executionMetrics) {
      this.logger.debug(`ruleRunMetrics for ${this.ruleType.id}:${ruleId}: ${JSON.stringify(executionMetrics)}`);
    }

    // set start and duration based on event log
    const {
      start,
      duration
    } = this.alertingEventLogger.getStartAndDuration();
    if (null != start) {
      executionStatus.lastExecutionDate = start;
    }
    if (null != duration) {
      executionStatus.lastDuration = (0, _server2.nanosToMillis)(duration);
    }

    // if executionStatus indicates an error, fill in fields in
    this.ruleMonitoring.addHistory({
      duration: executionStatus.lastDuration,
      hasError: executionStatus.error != null,
      runDate
    });
    if (!this.cancelled) {
      this.inMemoryMetrics.increment(_monitoring.IN_MEMORY_METRICS.RULE_EXECUTIONS);
      if (lastRun.outcome === 'failed') {
        this.inMemoryMetrics.increment(_monitoring.IN_MEMORY_METRICS.RULE_FAILURES);
      } else if (executionStatus.error) {
        this.inMemoryMetrics.increment(_monitoring.IN_MEMORY_METRICS.RULE_FAILURES);
      }
      this.logger.debug(`Updating rule task for ${this.ruleType.id} rule with id ${ruleId} - ${JSON.stringify(executionStatus)} - ${JSON.stringify(lastRun)}`);
      await this.updateRuleSavedObject(ruleId, namespace, {
        executionStatus: (0, _lib.ruleExecutionStatusToRaw)(executionStatus),
        nextRun,
        lastRun: (0, _last_run_status.lastRunToRaw)(lastRun),
        monitoring: this.ruleMonitoring.getMonitoring()
      });
    }
    return {
      executionStatus,
      executionMetrics
    };
  }
  async run() {
    const {
      params: {
        alertId: ruleId,
        spaceId
      },
      startedAt,
      state: originalState,
      schedule: taskSchedule
    } = this.taskInstance;
    const runDate = new Date();
    this.logger.debug(`executing rule ${this.ruleType.id}:${ruleId} at ${runDate.toISOString()}`);
    if (startedAt) {
      // Capture how long it took for the rule to start running after being claimed
      this.timer.setDuration(_task_runner_timer.TaskRunnerTimerSpan.StartTaskRun, startedAt);
    }
    let stateWithMetrics;
    let schedule;
    try {
      const preparedResult = await this.timer.runWithTimer(_task_runner_timer.TaskRunnerTimerSpan.PrepareRule, async () => this.prepareToRun());
      this.ruleMonitoring.setMonitoring(preparedResult.rule.monitoring);
      stateWithMetrics = (0, _result_type.asOk)(await this.runRule(preparedResult));

      // fetch the rule again to ensure we return the correct schedule as it may have
      // changed during the task execution
      schedule = (0, _result_type.asOk)((await preparedResult.rulesClient.get({
        id: ruleId
      })).schedule);
    } catch (err) {
      stateWithMetrics = (0, _result_type.asErr)(err);
      schedule = (0, _result_type.asErr)(err);
    }
    let nextRun = null;
    if ((0, _result_type.isOk)(schedule)) {
      nextRun = (0, _lib.getNextRun)({
        startDate: startedAt,
        interval: schedule.value.interval
      });
    } else if (taskSchedule) {
      nextRun = (0, _lib.getNextRun)({
        startDate: startedAt,
        interval: taskSchedule.interval
      });
    }
    const {
      executionStatus,
      executionMetrics
    } = await this.timer.runWithTimer(_task_runner_timer.TaskRunnerTimerSpan.ProcessRuleRun, async () => this.processRunResults({
      nextRun,
      runDate,
      stateWithMetrics
    }));
    const transformRunStateToTaskState = runStateWithMetrics => {
      return {
        ...(0, _lodash.omit)(runStateWithMetrics, ['metrics']),
        previousStartedAt: startedAt
      };
    };
    if (startedAt) {
      // Capture how long it took for the rule to run after being claimed
      this.timer.setDuration(_task_runner_timer.TaskRunnerTimerSpan.TotalRunDuration, startedAt);
    }
    this.alertingEventLogger.done({
      status: executionStatus,
      metrics: executionMetrics,
      timings: this.timer.toJson()
    });
    return {
      state: (0, _result_type.map)(stateWithMetrics, ruleRunStateWithMetrics => transformRunStateToTaskState(ruleRunStateWithMetrics), err => {
        if ((0, _is_alerting_error.isAlertSavedObjectNotFoundError)(err, ruleId)) {
          const message = `Executing Rule ${spaceId}:${this.ruleType.id}:${ruleId} has resulted in Error: ${(0, _errors.getEsErrorMessage)(err)}`;
          this.logger.debug(message);
        } else {
          const error = this.stackTraceLog ? this.stackTraceLog.message : err;
          const stack = this.stackTraceLog ? this.stackTraceLog.stackTrace : err.stack;
          const message = `Executing Rule ${spaceId}:${this.ruleType.id}:${ruleId} has resulted in Error: ${(0, _errors.getEsErrorMessage)(error)} - ${stack !== null && stack !== void 0 ? stack : ''}`;
          this.logger.error(message, {
            tags: [this.ruleType.id, ruleId, 'rule-run-failed'],
            error: {
              stack_trace: stack
            }
          });
        }
        return originalState;
      }),
      schedule: (0, _result_type.resolveErr)(schedule, error => {
        var _taskSchedule$interva;
        if ((0, _is_alerting_error.isAlertSavedObjectNotFoundError)(error, ruleId)) {
          const spaceMessage = spaceId ? `in the "${spaceId}" space ` : '';
          this.logger.warn(`Unable to execute rule "${ruleId}" ${spaceMessage}because ${error.message} - this rule will not be rescheduled. To restart rule execution, try disabling and re-enabling this rule.`);
          (0, _server.throwUnrecoverableError)(error);
        }
        let retryInterval = (_taskSchedule$interva = taskSchedule === null || taskSchedule === void 0 ? void 0 : taskSchedule.interval) !== null && _taskSchedule$interva !== void 0 ? _taskSchedule$interva : FALLBACK_RETRY_INTERVAL;

        // Set retry interval smaller for ES connectivity errors
        if ((0, _is_alerting_error.isEsUnavailableError)(error, ruleId)) {
          retryInterval = (0, _common.parseDuration)(retryInterval) > (0, _common.parseDuration)(CONNECTIVITY_RETRY_INTERVAL) ? CONNECTIVITY_RETRY_INTERVAL : retryInterval;
        }
        return {
          interval: retryInterval
        };
      }),
      monitoring: this.ruleMonitoring.getMonitoring()
    };
  }
  async cancel() {
    if (this.cancelled) {
      return;
    }
    this.cancelled = true;

    // Write event log entry
    const {
      params: {
        alertId: ruleId,
        spaceId,
        consumer
      },
      schedule: taskSchedule,
      startedAt
    } = this.taskInstance;
    const namespace = this.context.spaceIdToNamespace(spaceId);
    if (consumer && !this.ruleConsumer) {
      this.ruleConsumer = consumer;
    }
    this.logger.debug(`Cancelling rule type ${this.ruleType.id} with id ${ruleId} - execution exceeded rule type timeout of ${this.ruleType.ruleTaskTimeout}`);
    this.logger.debug(`Aborting any in-progress ES searches for rule type ${this.ruleType.id} with id ${ruleId}`);
    this.searchAbortController.abort();
    this.alertingEventLogger.logTimeout();
    this.inMemoryMetrics.increment(_monitoring.IN_MEMORY_METRICS.RULE_TIMEOUTS);
    let nextRun = null;
    if (taskSchedule) {
      nextRun = (0, _lib.getNextRun)({
        startDate: startedAt,
        interval: taskSchedule.interval
      });
    }
    const outcomeMsg = `${this.ruleType.id}:${ruleId}: execution cancelled due to timeout - exceeded rule type timeout of ${this.ruleType.ruleTaskTimeout}`;
    const date = new Date();
    // Update the rule saved object with execution status
    const executionStatus = {
      lastExecutionDate: date,
      status: 'error',
      error: {
        reason: _types.RuleExecutionStatusErrorReasons.Timeout,
        message: outcomeMsg
      }
    };
    this.logger.debug(`Updating rule task for ${this.ruleType.id} rule with id ${ruleId} - execution error due to timeout`);
    await this.updateRuleSavedObject(ruleId, namespace, {
      executionStatus: (0, _lib.ruleExecutionStatusToRaw)(executionStatus),
      lastRun: {
        outcome: 'failed',
        warning: _types.RuleExecutionStatusErrorReasons.Timeout,
        outcomeMsg,
        alertsCount: {}
      },
      monitoring: this.ruleMonitoring.getMonitoring(),
      nextRun: nextRun && new Date(nextRun).getTime() > date.getTime() ? nextRun : null
    });
  }
}
exports.TaskRunner = TaskRunner;