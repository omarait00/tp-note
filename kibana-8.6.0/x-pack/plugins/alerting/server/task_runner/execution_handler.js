"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExecutionHandler = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _server = require("../../../actions/server");
var _server2 = require("../../../task_manager/server");
var _lodash = require("lodash");
var _inject_action_params = require("./inject_action_params");
var _transform_action_params = require("./transform_action_params");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var Reasons;
(function (Reasons) {
  Reasons["MUTED"] = "muted";
  Reasons["THROTTLED"] = "throttled";
  Reasons["ACTION_GROUP_NOT_CHANGED"] = "actionGroupHasNotChanged";
})(Reasons || (Reasons = {}));
class ExecutionHandler {
  constructor({
    rule,
    ruleType,
    logger,
    alertingEventLogger,
    taskRunnerContext,
    taskInstance,
    ruleRunMetricsStore,
    apiKey,
    ruleConsumer,
    executionId,
    ruleLabel,
    actionsClient
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "alertingEventLogger", void 0);
    (0, _defineProperty2.default)(this, "rule", void 0);
    (0, _defineProperty2.default)(this, "ruleType", void 0);
    (0, _defineProperty2.default)(this, "taskRunnerContext", void 0);
    (0, _defineProperty2.default)(this, "taskInstance", void 0);
    (0, _defineProperty2.default)(this, "ruleRunMetricsStore", void 0);
    (0, _defineProperty2.default)(this, "apiKey", void 0);
    (0, _defineProperty2.default)(this, "ruleConsumer", void 0);
    (0, _defineProperty2.default)(this, "executionId", void 0);
    (0, _defineProperty2.default)(this, "ruleLabel", void 0);
    (0, _defineProperty2.default)(this, "ephemeralActionsToSchedule", void 0);
    (0, _defineProperty2.default)(this, "CHUNK_SIZE", 1000);
    (0, _defineProperty2.default)(this, "skippedAlerts", {});
    (0, _defineProperty2.default)(this, "actionsClient", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeActionGroups", void 0);
    (0, _defineProperty2.default)(this, "mutedAlertIdsSet", void 0);
    this.logger = logger;
    this.alertingEventLogger = alertingEventLogger;
    this.rule = rule;
    this.ruleType = ruleType;
    this.taskRunnerContext = taskRunnerContext;
    this.taskInstance = taskInstance;
    this.ruleRunMetricsStore = ruleRunMetricsStore;
    this.apiKey = apiKey;
    this.ruleConsumer = ruleConsumer;
    this.executionId = executionId;
    this.ruleLabel = ruleLabel;
    this.actionsClient = actionsClient;
    this.ephemeralActionsToSchedule = taskRunnerContext.maxEphemeralActionsPerRule;
    this.ruleTypeActionGroups = new Map(ruleType.actionGroups.map(actionGroup => [actionGroup.id, actionGroup.name]));
    this.mutedAlertIdsSet = new Set(rule.mutedInstanceIds);
  }
  async run(alerts, recovered = false) {
    const {
      CHUNK_SIZE,
      logger,
      alertingEventLogger,
      ruleRunMetricsStore,
      taskRunnerContext: {
        actionsConfigMap,
        actionsPlugin
      },
      taskInstance: {
        params: {
          spaceId,
          alertId: ruleId
        }
      }
    } = this;
    const executables = this.generateExecutables({
      alerts,
      recovered
    });
    if (!!executables.length) {
      const logActions = [];
      const bulkActions = [];
      this.ruleRunMetricsStore.incrementNumberOfGeneratedActions(executables.length);
      for (const {
        action,
        alert,
        alertId,
        actionGroup,
        state
      } of executables) {
        const {
          actionTypeId
        } = action;
        if (!recovered) {
          alert.updateLastScheduledActions(action.group);
          alert.unscheduleActions();
        }
        ruleRunMetricsStore.incrementNumberOfGeneratedActionsByConnectorType(actionTypeId);
        if (ruleRunMetricsStore.hasReachedTheExecutableActionsLimit(actionsConfigMap)) {
          ruleRunMetricsStore.setTriggeredActionsStatusByConnectorType({
            actionTypeId,
            status: _common.ActionsCompletion.PARTIAL
          });
          logger.debug(`Rule "${this.rule.id}" skipped scheduling action "${action.id}" because the maximum number of allowed actions has been reached.`);
          break;
        }
        if (ruleRunMetricsStore.hasReachedTheExecutableActionsLimitByConnectorType({
          actionTypeId,
          actionsConfigMap
        })) {
          if (!ruleRunMetricsStore.hasConnectorTypeReachedTheLimit(actionTypeId)) {
            logger.debug(`Rule "${this.rule.id}" skipped scheduling action "${action.id}" because the maximum number of allowed actions for connector type ${actionTypeId} has been reached.`);
          }
          ruleRunMetricsStore.setTriggeredActionsStatusByConnectorType({
            actionTypeId,
            status: _common.ActionsCompletion.PARTIAL
          });
          continue;
        }
        if (!this.isActionExecutable(action)) {
          this.logger.warn(`Rule "${this.taskInstance.params.alertId}" skipped scheduling action "${action.id}" because it is disabled`);
          continue;
        }
        ruleRunMetricsStore.incrementNumberOfTriggeredActions();
        ruleRunMetricsStore.incrementNumberOfTriggeredActionsByConnectorType(actionTypeId);
        const actionToRun = {
          ...action,
          params: (0, _inject_action_params.injectActionParams)({
            ruleId,
            spaceId,
            actionTypeId,
            actionParams: (0, _transform_action_params.transformActionParams)({
              actionsPlugin,
              alertId: ruleId,
              alertType: this.ruleType.id,
              actionTypeId,
              alertName: this.rule.name,
              spaceId,
              tags: this.rule.tags,
              alertInstanceId: alertId,
              alertActionGroup: actionGroup,
              alertActionGroupName: this.ruleTypeActionGroups.get(actionGroup),
              context: alert.getContext(),
              actionId: action.id,
              state,
              kibanaBaseUrl: this.taskRunnerContext.kibanaBaseUrl,
              alertParams: this.rule.params,
              actionParams: action.params,
              ruleUrl: this.buildRuleUrl(spaceId)
            })
          })
        };
        await this.actionRunOrAddToBulk({
          enqueueOptions: this.getEnqueueOptions(actionToRun),
          bulkActions
        });
        logActions.push({
          id: action.id,
          typeId: action.actionTypeId,
          alertId,
          alertGroup: action.group
        });
      }
      if (!!bulkActions.length) {
        for (const c of (0, _lodash.chunk)(bulkActions, CHUNK_SIZE)) {
          await this.actionsClient.bulkEnqueueExecution(c);
        }
      }
      if (!!logActions.length) {
        for (const action of logActions) {
          alertingEventLogger.logAction(action);
        }
      }
    }
  }
  generateExecutables({
    alerts,
    recovered
  }) {
    const executables = [];
    for (const action of this.rule.actions) {
      for (const [alertId, alert] of Object.entries(alerts)) {
        var _alert$getScheduledAc;
        const actionGroup = recovered ? this.ruleType.recoveryActionGroup.id : (_alert$getScheduledAc = alert.getScheduledActionOptions()) === null || _alert$getScheduledAc === void 0 ? void 0 : _alert$getScheduledAc.actionGroup;
        if (!this.ruleTypeActionGroups.has(actionGroup)) {
          this.logger.error(`Invalid action group "${actionGroup}" for rule "${this.ruleType.id}".`);
          continue;
        }
        if (action.group === actionGroup && this.isAlertExecutable({
          alertId,
          alert,
          recovered
        })) {
          var _alert$getScheduledAc2;
          const state = recovered ? {} : (_alert$getScheduledAc2 = alert.getScheduledActionOptions()) === null || _alert$getScheduledAc2 === void 0 ? void 0 : _alert$getScheduledAc2.state;
          executables.push({
            action,
            alert,
            alertId,
            actionGroup,
            state
          });
        }
      }
    }
    return executables;
  }
  buildRuleUrl(spaceId) {
    if (!this.taskRunnerContext.kibanaBaseUrl) {
      return;
    }
    try {
      const ruleUrl = new URL(`${spaceId !== 'default' ? `/s/${spaceId}` : ''}${_ruleDataUtils.triggersActionsRoute}${(0, _ruleDataUtils.getRuleDetailsRoute)(this.rule.id)}`, this.taskRunnerContext.kibanaBaseUrl);
      return ruleUrl.toString();
    } catch (error) {
      this.logger.debug(`Rule "${this.rule.id}" encountered an error while constructing the rule.url variable: ${error.message}`);
      return;
    }
  }
  async actionRunOrAddToBulk({
    enqueueOptions,
    bulkActions
  }) {
    if (this.taskRunnerContext.supportsEphemeralTasks && this.ephemeralActionsToSchedule > 0) {
      this.ephemeralActionsToSchedule--;
      try {
        await this.actionsClient.ephemeralEnqueuedExecution(enqueueOptions);
      } catch (err) {
        if ((0, _server2.isEphemeralTaskRejectedDueToCapacityError)(err)) {
          bulkActions.push(enqueueOptions);
        }
      }
    } else {
      bulkActions.push(enqueueOptions);
    }
  }
  getEnqueueOptions(action) {
    const {
      apiKey,
      ruleConsumer,
      executionId,
      taskInstance: {
        params: {
          spaceId,
          alertId: ruleId
        }
      }
    } = this;
    const namespace = spaceId === 'default' ? {} : {
      namespace: spaceId
    };
    return {
      id: action.id,
      params: action.params,
      spaceId,
      apiKey: apiKey !== null && apiKey !== void 0 ? apiKey : null,
      consumer: ruleConsumer,
      source: (0, _server.asSavedObjectExecutionSource)({
        id: ruleId,
        type: 'alert'
      }),
      executionId,
      relatedSavedObjects: [{
        id: ruleId,
        type: 'alert',
        namespace: namespace.namespace,
        typeId: this.ruleType.id
      }]
    };
  }
  isActionExecutable(action) {
    return this.taskRunnerContext.actionsPlugin.isActionExecutable(action.id, action.actionTypeId, {
      notifyUsage: true
    });
  }
  isAlertExecutable({
    alertId,
    alert,
    recovered
  }) {
    const {
      rule: {
        throttle,
        notifyWhen
      },
      ruleLabel,
      logger,
      mutedAlertIdsSet
    } = this;
    const muted = mutedAlertIdsSet.has(alertId);
    const throttled = alert.isThrottled(throttle !== null && throttle !== void 0 ? throttle : null);
    if (muted) {
      if (!this.skippedAlerts[alertId] || this.skippedAlerts[alertId] && this.skippedAlerts[alertId].reason !== Reasons.MUTED) {
        logger.debug(`skipping scheduling of actions for '${alertId}' in rule ${ruleLabel}: rule is muted`);
      }
      this.skippedAlerts[alertId] = {
        reason: Reasons.MUTED
      };
      return false;
    }
    if (!recovered) {
      if (throttled) {
        if (!this.skippedAlerts[alertId] || this.skippedAlerts[alertId] && this.skippedAlerts[alertId].reason !== Reasons.THROTTLED) {
          logger.debug(`skipping scheduling of actions for '${alertId}' in rule ${ruleLabel}: rule is throttled`);
        }
        this.skippedAlerts[alertId] = {
          reason: Reasons.THROTTLED
        };
        return false;
      }
      if (notifyWhen === 'onActionGroupChange' && !alert.scheduledActionGroupHasChanged()) {
        if (!this.skippedAlerts[alertId] || this.skippedAlerts[alertId] && this.skippedAlerts[alertId].reason !== Reasons.ACTION_GROUP_NOT_CHANGED) {
          logger.debug(`skipping scheduling of actions for '${alertId}' in rule ${ruleLabel}: alert is active but action group has not changed`);
        }
        this.skippedAlerts[alertId] = {
          reason: Reasons.ACTION_GROUP_NOT_CHANGED
        };
        return false;
      }
      return alert.hasScheduledActions();
    } else {
      return true;
    }
  }
}
exports.ExecutionHandler = ExecutionHandler;