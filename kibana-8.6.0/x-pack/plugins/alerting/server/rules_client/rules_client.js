"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RulesClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _semver = _interopRequireDefault(require("semver"));
var _pMap = _interopRequireDefault(require("p-map"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _lodash = require("lodash");
var _i18n = require("@kbn/i18n");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _esQuery = require("@kbn/es-query");
var _server = require("../../../../../src/core/server");
var _server2 = require("../../../task_manager/server");
var _server3 = require("../../../event_log/server");
var _types = require("../types");
var _lib = require("../lib");
var _alert_task_instance = require("../task_runner/alert_task_instance");
var _authorization = require("../authorization");
var _iso_or_relative_date = require("../lib/iso_or_relative_date");
var _alert_summary_from_event_log = require("../lib/alert_summary_from_event_log");
var _parse_duration = require("../../common/parse_duration");
var _retry_if_conflicts = require("../lib/retry_if_conflicts");
var _saved_objects = require("../saved_objects");
var _bulk_mark_api_keys_for_invalidation = require("../invalidate_pending_api_keys/bulk_mark_api_keys_for_invalidation");
var _audit_events = require("./audit_events");
var _lib2 = require("./lib");
var _rule_execution_status = require("../lib/rule_execution_status");
var _alert = require("../alert");
var _plugin = require("../plugin");
var _create_alert_event_log_record_object = require("../lib/create_alert_event_log_record_object");
var _mapped_params_utils = require("./lib/mapped_params_utils");
var _get_execution_log_aggregation = require("../lib/get_execution_log_aggregation");
var _validate_snooze_date = require("../lib/validate_snooze_date");
var _rule_muted = require("../lib/errors/rule_muted");
var _format_execution_log_errors = require("../lib/format_execution_log_errors");
var _is_rule_snoozed = require("../lib/is_rule_snoozed");
var _utils = require("../saved_objects/migrations/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// NOTE: Changing this prefix will require a migration to update the prefix in all existing `rule` saved objects
const extractedSavedObjectParamReferenceNamePrefix = 'param:';

// NOTE: Changing this prefix will require a migration to update the prefix in all existing `rule` saved objects
const preconfiguredConnectorActionRefPrefix = 'preconfigured:';
const MAX_RULES_NUMBER_FOR_BULK_OPERATION = 10000;
const API_KEY_GENERATE_CONCURRENCY = 50;
const RULE_TYPE_CHECKS_CONCURRENCY = 50;
const actionErrorLogDefaultFilter = 'event.provider:actions AND ((event.action:execute AND (event.outcome:failure OR kibana.alerting.status:warning)) OR (event.action:execute-timeout))';
const alertingAuthorizationFilterOpts = {
  type: _authorization.AlertingAuthorizationFilterType.KQL,
  fieldNames: {
    ruleTypeId: 'alert.attributes.alertTypeId',
    consumer: 'alert.attributes.consumer'
  }
};
class RulesClient {
  constructor({
    ruleTypeRegistry,
    minimumScheduleInterval,
    unsecuredSavedObjectsClient,
    authorization,
    taskManager,
    logger,
    spaceId,
    namespace,
    getUserName,
    createAPIKey,
    encryptedSavedObjectsClient,
    getActionsClient,
    actionsAuthorization,
    getEventLogClient,
    kibanaVersion,
    auditLogger,
    eventLogger
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "getUserName", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "namespace", void 0);
    (0, _defineProperty2.default)(this, "taskManager", void 0);
    (0, _defineProperty2.default)(this, "unsecuredSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "ruleTypeRegistry", void 0);
    (0, _defineProperty2.default)(this, "minimumScheduleInterval", void 0);
    (0, _defineProperty2.default)(this, "minimumScheduleIntervalInMs", void 0);
    (0, _defineProperty2.default)(this, "createAPIKey", void 0);
    (0, _defineProperty2.default)(this, "getActionsClient", void 0);
    (0, _defineProperty2.default)(this, "actionsAuthorization", void 0);
    (0, _defineProperty2.default)(this, "getEventLogClient", void 0);
    (0, _defineProperty2.default)(this, "encryptedSavedObjectsClient", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    (0, _defineProperty2.default)(this, "eventLogger", void 0);
    (0, _defineProperty2.default)(this, "fieldsToExcludeFromPublicApi", ['monitoring', 'mapped_params', 'snoozeSchedule', 'activeSnoozes']);
    (0, _defineProperty2.default)(this, "getAuthorizationFilter", async ({
      action
    }) => {
      try {
        const authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Rule, alertingAuthorizationFilterOpts);
        return authorizationTuple.filter;
      } catch (error) {
        var _this$auditLogger;
        (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log((0, _audit_events.ruleAuditEvent)({
          action: _audit_events.RuleAuditAction[action],
          error
        }));
        throw error;
      }
    });
    (0, _defineProperty2.default)(this, "getAndValidateCommonBulkOptions", options => {
      const filter = options.filter;
      const ids = options.ids;
      if (!ids && !filter) {
        throw _boom.default.badRequest("Either 'ids' or 'filter' property in method's arguments should be provided");
      }
      if ((ids === null || ids === void 0 ? void 0 : ids.length) === 0) {
        throw _boom.default.badRequest("'ids' property should not be an empty array");
      }
      if (ids && filter) {
        throw _boom.default.badRequest("Both 'filter' and 'ids' are supplied. Define either 'ids' or 'filter' properties in method's arguments");
      }
      return {
        ids,
        filter
      };
    });
    (0, _defineProperty2.default)(this, "checkAuthorizationAndGetTotal", async ({
      filter,
      action
    }) => {
      const actionToConstantsMapping = {
        DELETE: {
          WriteOperation: _authorization.WriteOperations.BulkDelete,
          RuleAuditAction: _audit_events.RuleAuditAction.DELETE
        },
        ENABLE: {
          WriteOperation: _authorization.WriteOperations.BulkEnable,
          RuleAuditAction: _audit_events.RuleAuditAction.ENABLE
        }
      };
      const {
        aggregations,
        total
      } = await this.unsecuredSavedObjectsClient.find({
        filter,
        page: 1,
        perPage: 0,
        type: 'alert',
        aggs: {
          alertTypeId: {
            multi_terms: {
              terms: [{
                field: 'alert.attributes.alertTypeId'
              }, {
                field: 'alert.attributes.consumer'
              }]
            }
          }
        }
      });
      if (total > MAX_RULES_NUMBER_FOR_BULK_OPERATION) {
        throw _boom.default.badRequest(`More than ${MAX_RULES_NUMBER_FOR_BULK_OPERATION} rules matched for bulk ${action.toLocaleLowerCase()}`);
      }
      const buckets = aggregations === null || aggregations === void 0 ? void 0 : aggregations.alertTypeId.buckets;
      if (buckets === undefined || (buckets === null || buckets === void 0 ? void 0 : buckets.length) === 0) {
        throw _boom.default.badRequest(`No rules found for bulk ${action.toLocaleLowerCase()}`);
      }
      await (0, _pMap.default)(buckets, async ({
        key: [ruleType, consumer, actions]
      }) => {
        this.ruleTypeRegistry.ensureRuleTypeEnabled(ruleType);
        try {
          await this.authorization.ensureAuthorized({
            ruleTypeId: ruleType,
            consumer,
            operation: actionToConstantsMapping[action].WriteOperation,
            entity: _authorization.AlertingAuthorizationEntity.Rule
          });
        } catch (error) {
          var _this$auditLogger2;
          (_this$auditLogger2 = this.auditLogger) === null || _this$auditLogger2 === void 0 ? void 0 : _this$auditLogger2.log((0, _audit_events.ruleAuditEvent)({
            action: actionToConstantsMapping[action].RuleAuditAction,
            error
          }));
          throw error;
        }
      }, {
        concurrency: RULE_TYPE_CHECKS_CONCURRENCY
      });
      return {
        total
      };
    });
    (0, _defineProperty2.default)(this, "bulkDeleteRules", async options => {
      const {
        ids,
        filter
      } = this.getAndValidateCommonBulkOptions(options);
      const kueryNodeFilter = ids ? (0, _lib.convertRuleIdsToKueryNode)(ids) : (0, _lib2.buildKueryNodeFilter)(filter);
      const authorizationFilter = await this.getAuthorizationFilter({
        action: 'DELETE'
      });
      const kueryNodeFilterWithAuth = authorizationFilter && kueryNodeFilter ? _esQuery.nodeBuilder.and([kueryNodeFilter, authorizationFilter]) : kueryNodeFilter;
      const {
        total
      } = await this.checkAuthorizationAndGetTotal({
        filter: kueryNodeFilterWithAuth,
        action: 'DELETE'
      });
      const {
        apiKeysToInvalidate,
        errors,
        taskIdsToDelete
      } = await (0, _lib2.retryIfBulkDeleteConflicts)(this.logger, filterKueryNode => this.bulkDeleteWithOCC({
        filter: filterKueryNode
      }), kueryNodeFilterWithAuth);
      const taskIdsFailedToBeDeleted = [];
      const taskIdsSuccessfullyDeleted = [];
      if (taskIdsToDelete.length > 0) {
        try {
          const resultFromDeletingTasks = await this.taskManager.bulkRemoveIfExist(taskIdsToDelete);
          resultFromDeletingTasks === null || resultFromDeletingTasks === void 0 ? void 0 : resultFromDeletingTasks.statuses.forEach(status => {
            if (status.success) {
              taskIdsSuccessfullyDeleted.push(status.id);
            } else {
              taskIdsFailedToBeDeleted.push(status.id);
            }
          });
          if (taskIdsSuccessfullyDeleted.length) {
            this.logger.debug(`Successfully deleted schedules for underlying tasks: ${taskIdsSuccessfullyDeleted.join(', ')}`);
          }
          if (taskIdsFailedToBeDeleted.length) {
            this.logger.error(`Failure to delete schedules for underlying tasks: ${taskIdsFailedToBeDeleted.join(', ')}`);
          }
        } catch (error) {
          this.logger.error(`Failure to delete schedules for underlying tasks: ${taskIdsToDelete.join(', ')}. TaskManager bulkRemoveIfExist failed with Error: ${error.message}`);
        }
      }
      await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
        apiKeys: apiKeysToInvalidate
      }, this.logger, this.unsecuredSavedObjectsClient);
      return {
        errors,
        total,
        taskIdsFailedToBeDeleted
      };
    });
    (0, _defineProperty2.default)(this, "bulkDeleteWithOCC", async ({
      filter
    }) => {
      const rulesFinder = await this.encryptedSavedObjectsClient.createPointInTimeFinderDecryptedAsInternalUser({
        filter,
        type: 'alert',
        perPage: 100,
        ...(this.namespace ? {
          namespaces: [this.namespace]
        } : undefined)
      });
      const rules = [];
      const apiKeysToInvalidate = [];
      const taskIdsToDelete = [];
      const errors = [];
      const apiKeyToRuleIdMapping = {};
      const taskIdToRuleIdMapping = {};
      const ruleNameToRuleIdMapping = {};
      for await (const response of rulesFinder.find()) {
        for (const rule of response.saved_objects) {
          var _this$auditLogger3;
          if (rule.attributes.apiKey) {
            apiKeyToRuleIdMapping[rule.id] = rule.attributes.apiKey;
          }
          if (rule.attributes.name) {
            ruleNameToRuleIdMapping[rule.id] = rule.attributes.name;
          }
          if (rule.attributes.scheduledTaskId) {
            taskIdToRuleIdMapping[rule.id] = rule.attributes.scheduledTaskId;
          }
          rules.push(rule);
          (_this$auditLogger3 = this.auditLogger) === null || _this$auditLogger3 === void 0 ? void 0 : _this$auditLogger3.log((0, _audit_events.ruleAuditEvent)({
            action: _audit_events.RuleAuditAction.DELETE,
            outcome: 'unknown',
            savedObject: {
              type: 'alert',
              id: rule.id
            }
          }));
        }
      }
      const result = await this.unsecuredSavedObjectsClient.bulkDelete(rules);
      result.statuses.forEach(status => {
        if (status.error === undefined) {
          if (apiKeyToRuleIdMapping[status.id]) {
            apiKeysToInvalidate.push(apiKeyToRuleIdMapping[status.id]);
          }
          if (taskIdToRuleIdMapping[status.id]) {
            taskIdsToDelete.push(taskIdToRuleIdMapping[status.id]);
          }
        } else {
          var _status$error$message, _ruleNameToRuleIdMapp;
          errors.push({
            message: (_status$error$message = status.error.message) !== null && _status$error$message !== void 0 ? _status$error$message : 'n/a',
            status: status.error.statusCode,
            rule: {
              id: status.id,
              name: (_ruleNameToRuleIdMapp = ruleNameToRuleIdMapping[status.id]) !== null && _ruleNameToRuleIdMapp !== void 0 ? _ruleNameToRuleIdMapp : 'n/a'
            }
          });
        }
      });
      return {
        apiKeysToInvalidate,
        errors,
        taskIdsToDelete
      };
    });
    (0, _defineProperty2.default)(this, "getShouldScheduleTask", async scheduledTaskId => {
      if (!scheduledTaskId) return true;
      try {
        // make sure scheduledTaskId exist
        await this.taskManager.get(scheduledTaskId);
        return false;
      } catch (err) {
        return true;
      }
    });
    (0, _defineProperty2.default)(this, "bulkEnableRules", async options => {
      const {
        ids,
        filter
      } = this.getAndValidateCommonBulkOptions(options);
      const kueryNodeFilter = ids ? (0, _lib.convertRuleIdsToKueryNode)(ids) : (0, _lib2.buildKueryNodeFilter)(filter);
      const authorizationFilter = await this.getAuthorizationFilter({
        action: 'ENABLE'
      });
      const kueryNodeFilterWithAuth = authorizationFilter && kueryNodeFilter ? _esQuery.nodeBuilder.and([kueryNodeFilter, authorizationFilter]) : kueryNodeFilter;
      const {
        total
      } = await this.checkAuthorizationAndGetTotal({
        filter: kueryNodeFilterWithAuth,
        action: 'ENABLE'
      });
      const {
        errors,
        taskIdsToEnable
      } = await (0, _lib2.retryIfBulkEnableConflicts)(this.logger, filterKueryNode => this.bulkEnableRulesWithOCC({
        filter: filterKueryNode
      }), kueryNodeFilterWithAuth);
      const taskIdsFailedToBeEnabled = [];
      if (taskIdsToEnable.length > 0) {
        try {
          var _resultFromEnablingTa;
          const resultFromEnablingTasks = await this.taskManager.bulkEnable(taskIdsToEnable);
          resultFromEnablingTasks === null || resultFromEnablingTasks === void 0 ? void 0 : (_resultFromEnablingTa = resultFromEnablingTasks.errors) === null || _resultFromEnablingTa === void 0 ? void 0 : _resultFromEnablingTa.forEach(error => {
            taskIdsFailedToBeEnabled.push(error.task.id);
          });
          this.logger.debug(`Successfully enabled schedules for underlying tasks: ${taskIdsToEnable.filter(id => !taskIdsFailedToBeEnabled.includes(id)).join(', ')}`);
        } catch (error) {
          taskIdsFailedToBeEnabled.push(...taskIdsToEnable);
          this.logger.error(`Failure to enable schedules for underlying tasks: ${taskIdsToEnable.join(', ')}. TaskManager bulkEnable failed with Error: ${error.message}`);
        }
      }
      return {
        errors,
        total,
        taskIdsFailedToBeEnabled
      };
    });
    (0, _defineProperty2.default)(this, "bulkEnableRulesWithOCC", async ({
      filter
    }) => {
      const rulesFinder = await this.encryptedSavedObjectsClient.createPointInTimeFinderDecryptedAsInternalUser({
        filter,
        type: 'alert',
        perPage: 100,
        ...(this.namespace ? {
          namespaces: [this.namespace]
        } : undefined)
      });
      const rulesToEnable = [];
      const taskIdsToEnable = [];
      const errors = [];
      const taskIdToRuleIdMapping = {};
      const ruleNameToRuleIdMapping = {};
      for await (const response of rulesFinder.find()) {
        await (0, _pMap.default)(response.saved_objects, async rule => {
          try {
            var _this$auditLogger4;
            if (rule.attributes.actions.length) {
              try {
                await this.actionsAuthorization.ensureAuthorized('execute');
              } catch (error) {
                throw Error(`Rule not authorized for bulk enable - ${error.message}`);
              }
            }
            if (rule.attributes.enabled === true) return;
            if (rule.attributes.name) {
              ruleNameToRuleIdMapping[rule.id] = rule.attributes.name;
            }
            if (rule.attributes.scheduledTaskId) {
              taskIdToRuleIdMapping[rule.id] = rule.attributes.scheduledTaskId;
            }
            const username = await this.getUserName();
            const updatedAttributes = this.updateMeta({
              ...rule.attributes,
              ...(!rule.attributes.apiKey && (await this.createNewAPIKeySet({
                attributes: rule.attributes,
                username
              }))),
              enabled: true,
              updatedBy: username,
              updatedAt: new Date().toISOString(),
              executionStatus: {
                status: 'pending',
                lastDuration: 0,
                lastExecutionDate: new Date().toISOString(),
                error: null,
                warning: null
              }
            });
            const shouldScheduleTask = await this.getShouldScheduleTask(rule.attributes.scheduledTaskId);
            let scheduledTaskId;
            if (shouldScheduleTask) {
              const scheduledTask = await this.scheduleTask({
                id: rule.id,
                consumer: rule.attributes.consumer,
                ruleTypeId: rule.attributes.alertTypeId,
                schedule: rule.attributes.schedule,
                throwOnConflict: false
              });
              scheduledTaskId = scheduledTask.id;
            }
            rulesToEnable.push({
              ...rule,
              attributes: {
                ...updatedAttributes,
                ...(scheduledTaskId ? {
                  scheduledTaskId
                } : undefined)
              }
            });
            (_this$auditLogger4 = this.auditLogger) === null || _this$auditLogger4 === void 0 ? void 0 : _this$auditLogger4.log((0, _audit_events.ruleAuditEvent)({
              action: _audit_events.RuleAuditAction.ENABLE,
              outcome: 'unknown',
              savedObject: {
                type: 'alert',
                id: rule.id
              }
            }));
          } catch (error) {
            var _rule$attributes, _this$auditLogger5;
            errors.push({
              message: error.message,
              rule: {
                id: rule.id,
                name: (_rule$attributes = rule.attributes) === null || _rule$attributes === void 0 ? void 0 : _rule$attributes.name
              }
            });
            (_this$auditLogger5 = this.auditLogger) === null || _this$auditLogger5 === void 0 ? void 0 : _this$auditLogger5.log((0, _audit_events.ruleAuditEvent)({
              action: _audit_events.RuleAuditAction.ENABLE,
              error
            }));
          }
        });
      }
      const result = await this.unsecuredSavedObjectsClient.bulkCreate(rulesToEnable, {
        overwrite: true
      });
      result.saved_objects.forEach(rule => {
        if (rule.error === undefined) {
          if (taskIdToRuleIdMapping[rule.id]) {
            taskIdsToEnable.push(taskIdToRuleIdMapping[rule.id]);
          }
        } else {
          var _rule$error$message, _ruleNameToRuleIdMapp2;
          errors.push({
            message: (_rule$error$message = rule.error.message) !== null && _rule$error$message !== void 0 ? _rule$error$message : 'n/a',
            status: rule.error.statusCode,
            rule: {
              id: rule.id,
              name: (_ruleNameToRuleIdMapp2 = ruleNameToRuleIdMapping[rule.id]) !== null && _ruleNameToRuleIdMapp2 !== void 0 ? _ruleNameToRuleIdMapp2 : 'n/a'
            }
          });
        }
      });
      return {
        errors,
        taskIdsToEnable
      };
    });
    this.logger = logger;
    this.getUserName = getUserName;
    this.spaceId = spaceId;
    this.namespace = namespace;
    this.taskManager = taskManager;
    this.ruleTypeRegistry = ruleTypeRegistry;
    this.minimumScheduleInterval = minimumScheduleInterval;
    this.minimumScheduleIntervalInMs = (0, _parse_duration.parseDuration)(minimumScheduleInterval.value);
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.authorization = authorization;
    this.createAPIKey = createAPIKey;
    this.encryptedSavedObjectsClient = encryptedSavedObjectsClient;
    this.getActionsClient = getActionsClient;
    this.actionsAuthorization = actionsAuthorization;
    this.getEventLogClient = getEventLogClient;
    this.kibanaVersion = kibanaVersion;
    this.auditLogger = auditLogger;
    this.eventLogger = eventLogger;
  }
  async clone(id, {
    newId
  }) {
    var _this$auditLogger7;
    let ruleSavedObject;
    try {
      ruleSavedObject = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`update(): Failed to load API key to invalidate on alert ${id}: ${e.message}`);
      // Still attempt to load the object using SOC
      ruleSavedObject = await this.unsecuredSavedObjectsClient.get('alert', id);
    }

    /*
     * As the time of the creation of this PR, security solution already have a clone/duplicate API
     * with some specific business logic so to avoid weird bugs, I prefer to exclude them from this
     * functionality until we resolve our difference
     */
    if ((0, _utils.isDetectionEngineAADRuleType)(ruleSavedObject) || ruleSavedObject.attributes.consumer === _ruleDataUtils.AlertConsumers.SIEM) {
      throw _boom.default.badRequest('The clone functionality is not enable for rule who belongs to security solution');
    }
    const ruleName = ruleSavedObject.attributes.name.indexOf('[Clone]') > 0 ? ruleSavedObject.attributes.name : `${ruleSavedObject.attributes.name} [Clone]`;
    const ruleId = newId !== null && newId !== void 0 ? newId : _server.SavedObjectsUtils.generateId();
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: ruleSavedObject.attributes.alertTypeId,
        consumer: ruleSavedObject.attributes.consumer,
        operation: _authorization.WriteOperations.Create,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger6;
      (_this$auditLogger6 = this.auditLogger) === null || _this$auditLogger6 === void 0 ? void 0 : _this$auditLogger6.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.CREATE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    this.ruleTypeRegistry.ensureRuleTypeEnabled(ruleSavedObject.attributes.alertTypeId);
    // Throws an error if alert type isn't registered
    const ruleType = this.ruleTypeRegistry.get(ruleSavedObject.attributes.alertTypeId);
    const username = await this.getUserName();
    const createTime = Date.now();
    const lastRunTimestamp = new Date();
    const legacyId = _semver.default.lt(this.kibanaVersion, '8.0.0') ? id : null;
    let createdAPIKey = null;
    try {
      createdAPIKey = ruleSavedObject.attributes.enabled ? await this.createAPIKey(this.generateAPIKeyName(ruleType.id, ruleName)) : null;
    } catch (error) {
      throw _boom.default.badRequest(`Error creating rule: could not create API key - ${error.message}`);
    }
    const rawRule = {
      ...ruleSavedObject.attributes,
      name: ruleName,
      ...this.apiKeyAsAlertAttributes(createdAPIKey, username),
      legacyId,
      createdBy: username,
      updatedBy: username,
      createdAt: new Date(createTime).toISOString(),
      updatedAt: new Date(createTime).toISOString(),
      snoozeSchedule: [],
      muteAll: false,
      mutedInstanceIds: [],
      executionStatus: (0, _rule_execution_status.getRuleExecutionStatusPending)(lastRunTimestamp.toISOString()),
      monitoring: (0, _lib.getDefaultMonitoring)(lastRunTimestamp.toISOString()),
      scheduledTaskId: null
    };
    (_this$auditLogger7 = this.auditLogger) === null || _this$auditLogger7 === void 0 ? void 0 : _this$auditLogger7.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.CREATE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    return await this.createRuleSavedObject({
      intervalInMs: (0, _parse_duration.parseDuration)(rawRule.schedule.interval),
      rawRule,
      references: ruleSavedObject.references,
      ruleId
    });
  }
  async create({
    data,
    options
  }) {
    var _ruleType$validate, _data$notifyWhen, _data$throttle, _data$throttle2;
    const id = (options === null || options === void 0 ? void 0 : options.id) || _server.SavedObjectsUtils.generateId();
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: data.alertTypeId,
        consumer: data.consumer,
        operation: _authorization.WriteOperations.Create,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger8;
      (_this$auditLogger8 = this.auditLogger) === null || _this$auditLogger8 === void 0 ? void 0 : _this$auditLogger8.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.CREATE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    this.ruleTypeRegistry.ensureRuleTypeEnabled(data.alertTypeId);

    // Throws an error if alert type isn't registered
    const ruleType = this.ruleTypeRegistry.get(data.alertTypeId);
    const validatedAlertTypeParams = (0, _lib.validateRuleTypeParams)(data.params, (_ruleType$validate = ruleType.validate) === null || _ruleType$validate === void 0 ? void 0 : _ruleType$validate.params);
    const username = await this.getUserName();
    let createdAPIKey = null;
    try {
      createdAPIKey = data.enabled ? await this.createAPIKey(this.generateAPIKeyName(ruleType.id, data.name)) : null;
    } catch (error) {
      throw _boom.default.badRequest(`Error creating rule: could not create API key - ${error.message}`);
    }
    await this.validateActions(ruleType, data);

    // Throw error if schedule interval is less than the minimum and we are enforcing it
    const intervalInMs = (0, _parse_duration.parseDuration)(data.schedule.interval);
    if (intervalInMs < this.minimumScheduleIntervalInMs && this.minimumScheduleInterval.enforce) {
      throw _boom.default.badRequest(`Error creating rule: the interval is less than the allowed minimum interval of ${this.minimumScheduleInterval.value}`);
    }

    // Extract saved object references for this rule
    const {
      references,
      params: updatedParams,
      actions
    } = await this.extractReferences(ruleType, data.actions, validatedAlertTypeParams);
    const createTime = Date.now();
    const lastRunTimestamp = new Date();
    const legacyId = _semver.default.lt(this.kibanaVersion, '8.0.0') ? id : null;
    const notifyWhen = (0, _lib.getRuleNotifyWhenType)((_data$notifyWhen = data.notifyWhen) !== null && _data$notifyWhen !== void 0 ? _data$notifyWhen : null, (_data$throttle = data.throttle) !== null && _data$throttle !== void 0 ? _data$throttle : null);
    const throttle = (_data$throttle2 = data.throttle) !== null && _data$throttle2 !== void 0 ? _data$throttle2 : null;
    const rawRule = {
      ...data,
      ...this.apiKeyAsAlertAttributes(createdAPIKey, username),
      legacyId,
      actions,
      createdBy: username,
      updatedBy: username,
      createdAt: new Date(createTime).toISOString(),
      updatedAt: new Date(createTime).toISOString(),
      snoozeSchedule: [],
      params: updatedParams,
      muteAll: false,
      mutedInstanceIds: [],
      notifyWhen,
      throttle,
      executionStatus: (0, _rule_execution_status.getRuleExecutionStatusPending)(lastRunTimestamp.toISOString()),
      monitoring: (0, _lib.getDefaultMonitoring)(lastRunTimestamp.toISOString())
    };
    const mappedParams = (0, _mapped_params_utils.getMappedParams)(updatedParams);
    if (Object.keys(mappedParams).length) {
      rawRule.mapped_params = mappedParams;
    }
    return await this.createRuleSavedObject({
      intervalInMs,
      rawRule,
      references,
      ruleId: id,
      options
    });
  }
  async createRuleSavedObject({
    intervalInMs,
    rawRule,
    references,
    ruleId,
    options
  }) {
    var _this$auditLogger9;
    (_this$auditLogger9 = this.auditLogger) === null || _this$auditLogger9 === void 0 ? void 0 : _this$auditLogger9.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.CREATE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id: ruleId
      }
    }));
    let createdAlert;
    try {
      createdAlert = await this.unsecuredSavedObjectsClient.create('alert', this.updateMeta(rawRule), {
        ...options,
        references,
        id: ruleId
      });
    } catch (e) {
      // Avoid unused API key
      await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
        apiKeys: rawRule.apiKey ? [rawRule.apiKey] : []
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }
    if (rawRule.enabled) {
      let scheduledTask;
      try {
        scheduledTask = await this.scheduleTask({
          id: createdAlert.id,
          consumer: rawRule.consumer,
          ruleTypeId: rawRule.alertTypeId,
          schedule: rawRule.schedule,
          throwOnConflict: true
        });
      } catch (e) {
        // Cleanup data, something went wrong scheduling the task
        try {
          await this.unsecuredSavedObjectsClient.delete('alert', createdAlert.id);
        } catch (err) {
          // Skip the cleanup error and throw the task manager error to avoid confusion
          this.logger.error(`Failed to cleanup alert "${createdAlert.id}" after scheduling task failed. Error: ${err.message}`);
        }
        throw e;
      }
      await this.unsecuredSavedObjectsClient.update('alert', createdAlert.id, {
        scheduledTaskId: scheduledTask.id
      });
      createdAlert.attributes.scheduledTaskId = scheduledTask.id;
    }

    // Log warning if schedule interval is less than the minimum but we're not enforcing it
    if (intervalInMs < this.minimumScheduleIntervalInMs && !this.minimumScheduleInterval.enforce) {
      this.logger.warn(`Rule schedule interval (${rawRule.schedule.interval}) for "${createdAlert.attributes.alertTypeId}" rule type with ID "${createdAlert.id}" is less than the minimum value (${this.minimumScheduleInterval.value}). Running rules at this interval may impact alerting performance. Set "xpack.alerting.rules.minimumScheduleInterval.enforce" to true to prevent creation of these rules.`);
    }
    return this.getAlertFromRaw(createdAlert.id, createdAlert.attributes.alertTypeId, createdAlert.attributes, references, false, true);
  }
  async get({
    id,
    includeLegacyId = false,
    includeSnoozeData = false,
    excludeFromPublicApi = false
  }) {
    var _this$auditLogger11;
    const result = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: result.attributes.alertTypeId,
        consumer: result.attributes.consumer,
        operation: _authorization.ReadOperations.Get,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger10;
      (_this$auditLogger10 = this.auditLogger) === null || _this$auditLogger10 === void 0 ? void 0 : _this$auditLogger10.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger11 = this.auditLogger) === null || _this$auditLogger11 === void 0 ? void 0 : _this$auditLogger11.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    return this.getAlertFromRaw(result.id, result.attributes.alertTypeId, result.attributes, result.references, includeLegacyId, excludeFromPublicApi, includeSnoozeData);
  }
  async resolve({
    id,
    includeLegacyId,
    includeSnoozeData = false
  }) {
    var _this$auditLogger13;
    const {
      saved_object: result,
      ...resolveResponse
    } = await this.unsecuredSavedObjectsClient.resolve('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: result.attributes.alertTypeId,
        consumer: result.attributes.consumer,
        operation: _authorization.ReadOperations.Get,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger12;
      (_this$auditLogger12 = this.auditLogger) === null || _this$auditLogger12 === void 0 ? void 0 : _this$auditLogger12.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.RESOLVE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger13 = this.auditLogger) === null || _this$auditLogger13 === void 0 ? void 0 : _this$auditLogger13.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.RESOLVE,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    const rule = this.getAlertFromRaw(result.id, result.attributes.alertTypeId, result.attributes, result.references, includeLegacyId, false, includeSnoozeData);
    return {
      ...rule,
      ...resolveResponse
    };
  }
  async getAlertState({
    id
  }) {
    const alert = await this.get({
      id
    });
    await this.authorization.ensureAuthorized({
      ruleTypeId: alert.alertTypeId,
      consumer: alert.consumer,
      operation: _authorization.ReadOperations.GetRuleState,
      entity: _authorization.AlertingAuthorizationEntity.Rule
    });
    if (alert.scheduledTaskId) {
      const {
        state
      } = (0, _alert_task_instance.taskInstanceToAlertTaskInstance)(await this.taskManager.get(alert.scheduledTaskId), alert);
      return state;
    }
  }
  async getAlertSummary({
    id,
    dateStart,
    numberOfExecutions
  }) {
    this.logger.debug(`getAlertSummary(): getting alert ${id}`);
    const rule = await this.get({
      id,
      includeLegacyId: true
    });
    await this.authorization.ensureAuthorized({
      ruleTypeId: rule.alertTypeId,
      consumer: rule.consumer,
      operation: _authorization.ReadOperations.GetAlertSummary,
      entity: _authorization.AlertingAuthorizationEntity.Rule
    });
    const dateNow = new Date();
    const durationMillis = (0, _parse_duration.parseDuration)(rule.schedule.interval) * (numberOfExecutions !== null && numberOfExecutions !== void 0 ? numberOfExecutions : 60);
    const defaultDateStart = new Date(dateNow.valueOf() - durationMillis);
    const parsedDateStart = parseDate(dateStart, 'dateStart', defaultDateStart);
    const eventLogClient = await this.getEventLogClient();
    this.logger.debug(`getAlertSummary(): search the event log for rule ${id}`);
    let events;
    let executionEvents;
    try {
      const [queryResults, executionResults] = await Promise.all([eventLogClient.findEventsBySavedObjectIds('alert', [id], {
        page: 1,
        per_page: 10000,
        start: parsedDateStart.toISOString(),
        sort: [{
          sort_field: '@timestamp',
          sort_order: 'desc'
        }],
        end: dateNow.toISOString()
      }, rule.legacyId !== null ? [rule.legacyId] : undefined), eventLogClient.findEventsBySavedObjectIds('alert', [id], {
        page: 1,
        per_page: numberOfExecutions !== null && numberOfExecutions !== void 0 ? numberOfExecutions : 60,
        filter: 'event.provider: alerting AND event.action:execute',
        sort: [{
          sort_field: '@timestamp',
          sort_order: 'desc'
        }],
        end: dateNow.toISOString()
      }, rule.legacyId !== null ? [rule.legacyId] : undefined)]);
      events = queryResults.data;
      executionEvents = executionResults.data;
    } catch (err) {
      this.logger.debug(`rulesClient.getAlertSummary(): error searching event log for rule ${id}: ${err.message}`);
      events = [];
      executionEvents = [];
    }
    return (0, _alert_summary_from_event_log.alertSummaryFromEventLog)({
      rule,
      events,
      executionEvents,
      dateStart: parsedDateStart.toISOString(),
      dateEnd: dateNow.toISOString()
    });
  }
  async getExecutionLogForRule({
    id,
    dateStart,
    dateEnd,
    filter,
    page,
    perPage,
    sort
  }) {
    var _this$auditLogger15;
    this.logger.debug(`getExecutionLogForRule(): getting execution log for rule ${id}`);
    const rule = await this.get({
      id,
      includeLegacyId: true
    });
    try {
      // Make sure user has access to this rule
      await this.authorization.ensureAuthorized({
        ruleTypeId: rule.alertTypeId,
        consumer: rule.consumer,
        operation: _authorization.ReadOperations.GetExecutionLog,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger14;
      (_this$auditLogger14 = this.auditLogger) === null || _this$auditLogger14 === void 0 ? void 0 : _this$auditLogger14.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_EXECUTION_LOG,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger15 = this.auditLogger) === null || _this$auditLogger15 === void 0 ? void 0 : _this$auditLogger15.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_EXECUTION_LOG,
      savedObject: {
        type: 'alert',
        id
      }
    }));

    // default duration of instance summary is 60 * rule interval
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const aggResult = await eventLogClient.aggregateEventsBySavedObjectIds('alert', [id], {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        aggs: (0, _get_execution_log_aggregation.getExecutionLogAggregation)({
          filter,
          page,
          perPage,
          sort
        })
      }, rule.legacyId !== null ? [rule.legacyId] : undefined);
      return (0, _get_execution_log_aggregation.formatExecutionLogResult)(aggResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getExecutionLogForRule(): error searching event log for rule ${id}: ${err.message}`);
      throw err;
    }
  }
  async getGlobalExecutionLogWithAuth({
    dateStart,
    dateEnd,
    filter,
    page,
    perPage,
    sort,
    namespaces
  }) {
    var _this$auditLogger17;
    this.logger.debug(`getGlobalExecutionLogWithAuth(): getting global execution log`);
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Alert, {
        type: _authorization.AlertingAuthorizationFilterType.KQL,
        fieldNames: {
          ruleTypeId: 'kibana.alert.rule.rule_type_id',
          consumer: 'kibana.alert.rule.consumer'
        }
      });
    } catch (error) {
      var _this$auditLogger16;
      (_this$auditLogger16 = this.auditLogger) === null || _this$auditLogger16 === void 0 ? void 0 : _this$auditLogger16.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_GLOBAL_EXECUTION_LOG,
        error
      }));
      throw error;
    }
    (_this$auditLogger17 = this.auditLogger) === null || _this$auditLogger17 === void 0 ? void 0 : _this$auditLogger17.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_GLOBAL_EXECUTION_LOG
    }));
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const aggResult = await eventLogClient.aggregateEventsWithAuthFilter('alert', authorizationTuple.filter, {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        aggs: (0, _get_execution_log_aggregation.getExecutionLogAggregation)({
          filter,
          page,
          perPage,
          sort
        })
      }, namespaces);
      return (0, _get_execution_log_aggregation.formatExecutionLogResult)(aggResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getGlobalExecutionLogWithAuth(): error searching global event log: ${err.message}`);
      throw err;
    }
  }
  async getActionErrorLog({
    id,
    dateStart,
    dateEnd,
    filter,
    page,
    perPage,
    sort
  }) {
    var _this$auditLogger19;
    this.logger.debug(`getActionErrorLog(): getting action error logs for rule ${id}`);
    const rule = await this.get({
      id,
      includeLegacyId: true
    });
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: rule.alertTypeId,
        consumer: rule.consumer,
        operation: _authorization.ReadOperations.GetActionErrorLog,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger18;
      (_this$auditLogger18 = this.auditLogger) === null || _this$auditLogger18 === void 0 ? void 0 : _this$auditLogger18.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_ACTION_ERROR_LOG,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger19 = this.auditLogger) === null || _this$auditLogger19 === void 0 ? void 0 : _this$auditLogger19.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_ACTION_ERROR_LOG,
      savedObject: {
        type: 'alert',
        id
      }
    }));

    // default duration of instance summary is 60 * rule interval
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const errorResult = await eventLogClient.findEventsBySavedObjectIds('alert', [id], {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        page,
        per_page: perPage,
        filter: filter ? `(${actionErrorLogDefaultFilter}) AND (${filter})` : actionErrorLogDefaultFilter,
        sort: (0, _lib.convertEsSortToEventLogSort)(sort)
      }, rule.legacyId !== null ? [rule.legacyId] : undefined);
      return (0, _format_execution_log_errors.formatExecutionErrorsResult)(errorResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getActionErrorLog(): error searching event log for rule ${id}: ${err.message}`);
      throw err;
    }
  }
  async getActionErrorLogWithAuth({
    id,
    dateStart,
    dateEnd,
    filter,
    page,
    perPage,
    sort,
    namespace
  }) {
    var _this$auditLogger21;
    this.logger.debug(`getActionErrorLogWithAuth(): getting action error logs for rule ${id}`);
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Alert, {
        type: _authorization.AlertingAuthorizationFilterType.KQL,
        fieldNames: {
          ruleTypeId: 'kibana.alert.rule.rule_type_id',
          consumer: 'kibana.alert.rule.consumer'
        }
      });
    } catch (error) {
      var _this$auditLogger20;
      (_this$auditLogger20 = this.auditLogger) === null || _this$auditLogger20 === void 0 ? void 0 : _this$auditLogger20.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_ACTION_ERROR_LOG,
        error
      }));
      throw error;
    }
    (_this$auditLogger21 = this.auditLogger) === null || _this$auditLogger21 === void 0 ? void 0 : _this$auditLogger21.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_ACTION_ERROR_LOG,
      savedObject: {
        type: 'alert',
        id
      }
    }));

    // default duration of instance summary is 60 * rule interval
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const errorResult = await eventLogClient.findEventsWithAuthFilter('alert', [id], authorizationTuple.filter, namespace, {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        page,
        per_page: perPage,
        filter: filter ? `(${actionErrorLogDefaultFilter}) AND (${filter})` : actionErrorLogDefaultFilter,
        sort: (0, _lib.convertEsSortToEventLogSort)(sort)
      });
      return (0, _format_execution_log_errors.formatExecutionErrorsResult)(errorResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getActionErrorLog(): error searching event log for rule ${id}: ${err.message}`);
      throw err;
    }
  }
  async getGlobalExecutionKpiWithAuth({
    dateStart,
    dateEnd,
    filter,
    namespaces
  }) {
    var _this$auditLogger23;
    this.logger.debug(`getGlobalExecutionLogWithAuth(): getting global execution log`);
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Alert, {
        type: _authorization.AlertingAuthorizationFilterType.KQL,
        fieldNames: {
          ruleTypeId: 'kibana.alert.rule.rule_type_id',
          consumer: 'kibana.alert.rule.consumer'
        }
      });
    } catch (error) {
      var _this$auditLogger22;
      (_this$auditLogger22 = this.auditLogger) === null || _this$auditLogger22 === void 0 ? void 0 : _this$auditLogger22.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_GLOBAL_EXECUTION_KPI,
        error
      }));
      throw error;
    }
    (_this$auditLogger23 = this.auditLogger) === null || _this$auditLogger23 === void 0 ? void 0 : _this$auditLogger23.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_GLOBAL_EXECUTION_KPI
    }));
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const aggResult = await eventLogClient.aggregateEventsWithAuthFilter('alert', authorizationTuple.filter, {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        aggs: (0, _get_execution_log_aggregation.getExecutionKPIAggregation)(filter)
      }, namespaces);
      return (0, _get_execution_log_aggregation.formatExecutionKPIResult)(aggResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getGlobalExecutionKpiWithAuth(): error searching global execution KPI: ${err.message}`);
      throw err;
    }
  }
  async getRuleExecutionKPI({
    id,
    dateStart,
    dateEnd,
    filter
  }) {
    var _this$auditLogger25;
    this.logger.debug(`getRuleExecutionKPI(): getting execution KPI for rule ${id}`);
    const rule = await this.get({
      id,
      includeLegacyId: true
    });
    try {
      // Make sure user has access to this rule
      await this.authorization.ensureAuthorized({
        ruleTypeId: rule.alertTypeId,
        consumer: rule.consumer,
        operation: _authorization.ReadOperations.GetRuleExecutionKPI,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger24;
      (_this$auditLogger24 = this.auditLogger) === null || _this$auditLogger24 === void 0 ? void 0 : _this$auditLogger24.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.GET_RULE_EXECUTION_KPI,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger25 = this.auditLogger) === null || _this$auditLogger25 === void 0 ? void 0 : _this$auditLogger25.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.GET_RULE_EXECUTION_KPI,
      savedObject: {
        type: 'alert',
        id
      }
    }));

    // default duration of instance summary is 60 * rule interval
    const dateNow = new Date();
    const parsedDateStart = parseDate(dateStart, 'dateStart', dateNow);
    const parsedDateEnd = parseDate(dateEnd, 'dateEnd', dateNow);
    const eventLogClient = await this.getEventLogClient();
    try {
      const aggResult = await eventLogClient.aggregateEventsBySavedObjectIds('alert', [id], {
        start: parsedDateStart.toISOString(),
        end: parsedDateEnd.toISOString(),
        aggs: (0, _get_execution_log_aggregation.getExecutionKPIAggregation)(filter)
      }, rule.legacyId !== null ? [rule.legacyId] : undefined);
      return (0, _get_execution_log_aggregation.formatExecutionKPIResult)(aggResult);
    } catch (err) {
      this.logger.debug(`rulesClient.getRuleExecutionKPI(): error searching execution KPI for rule ${id}: ${err.message}`);
      throw err;
    }
  }
  async find({
    options: {
      fields,
      ...options
    } = {},
    excludeFromPublicApi = false,
    includeSnoozeData = false
  } = {}) {
    var _ref;
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Rule, alertingAuthorizationFilterOpts);
    } catch (error) {
      var _this$auditLogger26;
      (_this$auditLogger26 = this.auditLogger) === null || _this$auditLogger26 === void 0 ? void 0 : _this$auditLogger26.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.FIND,
        error
      }));
      throw error;
    }
    const {
      filter: authorizationFilter,
      ensureRuleTypeIsAuthorized
    } = authorizationTuple;
    const filterKueryNode = (0, _lib2.buildKueryNodeFilter)(options.filter);
    let sortField = (0, _lib2.mapSortField)(options.sortField);
    if (excludeFromPublicApi) {
      try {
        (0, _lib2.validateOperationOnAttributes)(filterKueryNode, sortField, options.searchFields, this.fieldsToExcludeFromPublicApi);
      } catch (error) {
        throw _boom.default.badRequest(`Error find rules: ${error.message}`);
      }
    }
    sortField = (0, _lib2.mapSortField)((0, _mapped_params_utils.getModifiedField)(options.sortField));

    // Generate new modified search and search fields, translating certain params properties
    // to mapped_params. Thus, allowing for sort/search/filtering on params.
    // We do the modifcation after the validate check to make sure the public API does not
    // use the mapped_params in their queries.
    options = {
      ...options,
      ...(options.searchFields && {
        searchFields: (0, _mapped_params_utils.getModifiedSearchFields)(options.searchFields)
      }),
      ...(options.search && {
        search: (0, _mapped_params_utils.getModifiedSearch)(options.searchFields, options.search)
      })
    };

    // Modifies kuery node AST to translate params filter and the filter value to mapped_params.
    // This translation is done in place, and therefore is not a pure function.
    if (filterKueryNode) {
      (0, _mapped_params_utils.modifyFilterKueryNode)({
        astFilter: filterKueryNode
      });
    }
    const {
      page,
      per_page: perPage,
      total,
      saved_objects: data
    } = await this.unsecuredSavedObjectsClient.find({
      ...options,
      sortField,
      filter: (_ref = authorizationFilter && filterKueryNode ? _esQuery.nodeBuilder.and([filterKueryNode, authorizationFilter]) : authorizationFilter) !== null && _ref !== void 0 ? _ref : filterKueryNode,
      fields: fields ? this.includeFieldsRequiredForAuthentication(fields) : fields,
      type: 'alert'
    });
    const authorizedData = data.map(({
      id,
      attributes,
      references
    }) => {
      try {
        ensureRuleTypeIsAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.AlertingAuthorizationEntity.Rule);
      } catch (error) {
        var _this$auditLogger27;
        (_this$auditLogger27 = this.auditLogger) === null || _this$auditLogger27 === void 0 ? void 0 : _this$auditLogger27.log((0, _audit_events.ruleAuditEvent)({
          action: _audit_events.RuleAuditAction.FIND,
          savedObject: {
            type: 'alert',
            id
          },
          error
        }));
        throw error;
      }
      return this.getAlertFromRaw(id, attributes.alertTypeId, fields ? (0, _lodash.pick)(attributes, fields) : attributes, references, false, excludeFromPublicApi, includeSnoozeData);
    });
    authorizedData.forEach(({
      id
    }) => {
      var _this$auditLogger28;
      return (_this$auditLogger28 = this.auditLogger) === null || _this$auditLogger28 === void 0 ? void 0 : _this$auditLogger28.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.FIND,
        savedObject: {
          type: 'alert',
          id
        }
      }));
    });
    return {
      page,
      perPage,
      total,
      data: authorizedData
    };
  }
  async aggregate({
    options: {
      fields,
      filter,
      ...options
    } = {}
  } = {}) {
    var _enabledBuckets$find$, _enabledBuckets$find, _enabledBuckets$find$2, _enabledBuckets$find2, _mutedBuckets$find$do, _mutedBuckets$find, _mutedBuckets$find$do2, _mutedBuckets$find2, _resp$aggregations$sn, _resp$aggregations$sn2, _resp$aggregations$sn3, _resp$aggregations$ta;
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Rule, alertingAuthorizationFilterOpts);
    } catch (error) {
      var _this$auditLogger29;
      (_this$auditLogger29 = this.auditLogger) === null || _this$auditLogger29 === void 0 ? void 0 : _this$auditLogger29.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.AGGREGATE,
        error
      }));
      throw error;
    }
    const {
      filter: authorizationFilter
    } = authorizationTuple;
    const filterKueryNode = (0, _lib2.buildKueryNodeFilter)(filter);
    const resp = await this.unsecuredSavedObjectsClient.find({
      ...options,
      filter: authorizationFilter && filterKueryNode ? _esQuery.nodeBuilder.and([filterKueryNode, authorizationFilter]) : authorizationFilter,
      page: 1,
      perPage: 0,
      type: 'alert',
      aggs: {
        status: {
          terms: {
            field: 'alert.attributes.executionStatus.status'
          }
        },
        outcome: {
          terms: {
            field: 'alert.attributes.lastRun.outcome'
          }
        },
        enabled: {
          terms: {
            field: 'alert.attributes.enabled'
          }
        },
        muted: {
          terms: {
            field: 'alert.attributes.muteAll'
          }
        },
        tags: {
          terms: {
            field: 'alert.attributes.tags',
            order: {
              _key: 'asc'
            },
            size: 50
          }
        },
        snoozed: {
          nested: {
            path: 'alert.attributes.snoozeSchedule'
          },
          aggs: {
            count: {
              filter: {
                exists: {
                  field: 'alert.attributes.snoozeSchedule.duration'
                }
              }
            }
          }
        }
      }
    });
    if (!resp.aggregations) {
      // Return a placeholder with all zeroes
      const placeholder = {
        alertExecutionStatus: {},
        ruleLastRunOutcome: {},
        ruleEnabledStatus: {
          enabled: 0,
          disabled: 0
        },
        ruleMutedStatus: {
          muted: 0,
          unmuted: 0
        },
        ruleSnoozedStatus: {
          snoozed: 0
        }
      };
      for (const key of _types.RuleExecutionStatusValues) {
        placeholder.alertExecutionStatus[key] = 0;
      }
      return placeholder;
    }
    const alertExecutionStatus = resp.aggregations.status.buckets.map(({
      key,
      doc_count: docCount
    }) => ({
      [key]: docCount
    }));
    const ruleLastRunOutcome = resp.aggregations.outcome.buckets.map(({
      key,
      doc_count: docCount
    }) => ({
      [key]: docCount
    }));
    const ret = {
      alertExecutionStatus: alertExecutionStatus.reduce((acc, curr) => Object.assign(acc, curr), {}),
      ruleLastRunOutcome: ruleLastRunOutcome.reduce((acc, curr) => Object.assign(acc, curr), {})
    };

    // Fill missing keys with zeroes
    for (const key of _types.RuleExecutionStatusValues) {
      if (!ret.alertExecutionStatus.hasOwnProperty(key)) {
        ret.alertExecutionStatus[key] = 0;
      }
    }
    for (const key of _types.RuleLastRunOutcomeValues) {
      if (!ret.ruleLastRunOutcome.hasOwnProperty(key)) {
        ret.ruleLastRunOutcome[key] = 0;
      }
    }
    const enabledBuckets = resp.aggregations.enabled.buckets;
    ret.ruleEnabledStatus = {
      enabled: (_enabledBuckets$find$ = (_enabledBuckets$find = enabledBuckets.find(bucket => bucket.key === 1)) === null || _enabledBuckets$find === void 0 ? void 0 : _enabledBuckets$find.doc_count) !== null && _enabledBuckets$find$ !== void 0 ? _enabledBuckets$find$ : 0,
      disabled: (_enabledBuckets$find$2 = (_enabledBuckets$find2 = enabledBuckets.find(bucket => bucket.key === 0)) === null || _enabledBuckets$find2 === void 0 ? void 0 : _enabledBuckets$find2.doc_count) !== null && _enabledBuckets$find$2 !== void 0 ? _enabledBuckets$find$2 : 0
    };
    const mutedBuckets = resp.aggregations.muted.buckets;
    ret.ruleMutedStatus = {
      muted: (_mutedBuckets$find$do = (_mutedBuckets$find = mutedBuckets.find(bucket => bucket.key === 1)) === null || _mutedBuckets$find === void 0 ? void 0 : _mutedBuckets$find.doc_count) !== null && _mutedBuckets$find$do !== void 0 ? _mutedBuckets$find$do : 0,
      unmuted: (_mutedBuckets$find$do2 = (_mutedBuckets$find2 = mutedBuckets.find(bucket => bucket.key === 0)) === null || _mutedBuckets$find2 === void 0 ? void 0 : _mutedBuckets$find2.doc_count) !== null && _mutedBuckets$find$do2 !== void 0 ? _mutedBuckets$find$do2 : 0
    };
    ret.ruleSnoozedStatus = {
      snoozed: (_resp$aggregations$sn = (_resp$aggregations$sn2 = resp.aggregations.snoozed) === null || _resp$aggregations$sn2 === void 0 ? void 0 : (_resp$aggregations$sn3 = _resp$aggregations$sn2.count) === null || _resp$aggregations$sn3 === void 0 ? void 0 : _resp$aggregations$sn3.doc_count) !== null && _resp$aggregations$sn !== void 0 ? _resp$aggregations$sn : 0
    };
    const tagsBuckets = ((_resp$aggregations$ta = resp.aggregations.tags) === null || _resp$aggregations$ta === void 0 ? void 0 : _resp$aggregations$ta.buckets) || [];
    ret.ruleTags = tagsBuckets.map(bucket => bucket.key);
    return ret;
  }
  async delete({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.delete('${id}')`, async () => await this.deleteWithOCC({
      id
    }));
  }
  async deleteWithOCC({
    id
  }) {
    var _this$auditLogger31;
    let taskIdToRemove;
    let apiKeyToInvalidate = null;
    let attributes;
    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      taskIdToRemove = decryptedAlert.attributes.scheduledTaskId;
      attributes = decryptedAlert.attributes;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`delete(): Failed to load API key to invalidate on alert ${id}: ${e.message}`);
      // Still attempt to load the scheduledTaskId using SOC
      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      taskIdToRemove = alert.attributes.scheduledTaskId;
      attributes = alert.attributes;
    }
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.Delete,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger30;
      (_this$auditLogger30 = this.auditLogger) === null || _this$auditLogger30 === void 0 ? void 0 : _this$auditLogger30.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.DELETE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger31 = this.auditLogger) === null || _this$auditLogger31 === void 0 ? void 0 : _this$auditLogger31.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.DELETE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    const removeResult = await this.unsecuredSavedObjectsClient.delete('alert', id);
    await Promise.all([taskIdToRemove ? this.taskManager.removeIfExists(taskIdToRemove) : null, apiKeyToInvalidate ? (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
      apiKeys: [apiKeyToInvalidate]
    }, this.logger, this.unsecuredSavedObjectsClient) : null]);
    return removeResult;
  }
  async update({
    id,
    data
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.update('${id}')`, async () => await this.updateWithOCC({
      id,
      data
    }));
  }
  async updateWithOCC({
    id,
    data
  }) {
    var _this$auditLogger33;
    let alertSavedObject;
    try {
      alertSavedObject = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`update(): Failed to load API key to invalidate on alert ${id}: ${e.message}`);
      // Still attempt to load the object using SOC
      alertSavedObject = await this.unsecuredSavedObjectsClient.get('alert', id);
    }
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: alertSavedObject.attributes.alertTypeId,
        consumer: alertSavedObject.attributes.consumer,
        operation: _authorization.WriteOperations.Update,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger32;
      (_this$auditLogger32 = this.auditLogger) === null || _this$auditLogger32 === void 0 ? void 0 : _this$auditLogger32.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.UPDATE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger33 = this.auditLogger) === null || _this$auditLogger33 === void 0 ? void 0 : _this$auditLogger33.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.UPDATE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(alertSavedObject.attributes.alertTypeId);
    const updateResult = await this.updateAlert({
      id,
      data
    }, alertSavedObject);
    await Promise.all([alertSavedObject.attributes.apiKey ? (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
      apiKeys: [alertSavedObject.attributes.apiKey]
    }, this.logger, this.unsecuredSavedObjectsClient) : null, (async () => {
      if (updateResult.scheduledTaskId && updateResult.schedule && !(0, _lodash.isEqual)(alertSavedObject.attributes.schedule, updateResult.schedule)) {
        try {
          var _tasks$;
          const {
            tasks
          } = await this.taskManager.bulkUpdateSchedules([updateResult.scheduledTaskId], updateResult.schedule);
          this.logger.debug(`Rule update has rescheduled the underlying task: ${updateResult.scheduledTaskId} to run at: ${tasks === null || tasks === void 0 ? void 0 : (_tasks$ = tasks[0]) === null || _tasks$ === void 0 ? void 0 : _tasks$.runAt}`);
        } catch (err) {
          this.logger.error(`Rule update failed to run its underlying task. TaskManager bulkUpdateSchedules failed with Error: ${err.message}`);
        }
      }
    })()]);
    return updateResult;
  }
  async updateAlert({
    id,
    data
  }, {
    attributes,
    version
  }) {
    var _ruleType$validate2, _data$notifyWhen2, _data$throttle3;
    const ruleType = this.ruleTypeRegistry.get(attributes.alertTypeId);

    // Validate
    const validatedAlertTypeParams = (0, _lib.validateRuleTypeParams)(data.params, (_ruleType$validate2 = ruleType.validate) === null || _ruleType$validate2 === void 0 ? void 0 : _ruleType$validate2.params);
    await this.validateActions(ruleType, data);

    // Throw error if schedule interval is less than the minimum and we are enforcing it
    const intervalInMs = (0, _parse_duration.parseDuration)(data.schedule.interval);
    if (intervalInMs < this.minimumScheduleIntervalInMs && this.minimumScheduleInterval.enforce) {
      throw _boom.default.badRequest(`Error updating rule: the interval is less than the allowed minimum interval of ${this.minimumScheduleInterval.value}`);
    }

    // Extract saved object references for this rule
    const {
      references,
      params: updatedParams,
      actions
    } = await this.extractReferences(ruleType, data.actions, validatedAlertTypeParams);
    const username = await this.getUserName();
    let createdAPIKey = null;
    try {
      createdAPIKey = attributes.enabled ? await this.createAPIKey(this.generateAPIKeyName(ruleType.id, data.name)) : null;
    } catch (error) {
      throw _boom.default.badRequest(`Error updating rule: could not create API key - ${error.message}`);
    }
    const apiKeyAttributes = this.apiKeyAsAlertAttributes(createdAPIKey, username);
    const notifyWhen = (0, _lib.getRuleNotifyWhenType)((_data$notifyWhen2 = data.notifyWhen) !== null && _data$notifyWhen2 !== void 0 ? _data$notifyWhen2 : null, (_data$throttle3 = data.throttle) !== null && _data$throttle3 !== void 0 ? _data$throttle3 : null);
    let updatedObject;
    const createAttributes = this.updateMeta({
      ...attributes,
      ...data,
      ...apiKeyAttributes,
      params: updatedParams,
      actions,
      notifyWhen,
      updatedBy: username,
      updatedAt: new Date().toISOString()
    });
    const mappedParams = (0, _mapped_params_utils.getMappedParams)(updatedParams);
    if (Object.keys(mappedParams).length) {
      createAttributes.mapped_params = mappedParams;
    }
    try {
      updatedObject = await this.unsecuredSavedObjectsClient.create('alert', createAttributes, {
        id,
        overwrite: true,
        version,
        references
      });
    } catch (e) {
      // Avoid unused API key
      await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
        apiKeys: createAttributes.apiKey ? [createAttributes.apiKey] : []
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }

    // Log warning if schedule interval is less than the minimum but we're not enforcing it
    if (intervalInMs < this.minimumScheduleIntervalInMs && !this.minimumScheduleInterval.enforce) {
      this.logger.warn(`Rule schedule interval (${data.schedule.interval}) for "${ruleType.id}" rule type with ID "${id}" is less than the minimum value (${this.minimumScheduleInterval.value}). Running rules at this interval may impact alerting performance. Set "xpack.alerting.rules.minimumScheduleInterval.enforce" to true to prevent such changes.`);
    }
    return this.getPartialRuleFromRaw(id, ruleType, updatedObject.attributes, updatedObject.references, false, true);
  }
  async bulkEdit(options) {
    const queryFilter = options.filter;
    const ids = options.ids;
    if (ids && queryFilter) {
      throw _boom.default.badRequest("Both 'filter' and 'ids' are supplied. Define either 'ids' or 'filter' properties in method arguments");
    }
    const qNodeQueryFilter = (0, _lib2.buildKueryNodeFilter)(queryFilter);
    const qNodeFilter = ids ? (0, _lib.convertRuleIdsToKueryNode)(ids) : qNodeQueryFilter;
    let authorizationTuple;
    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter(_authorization.AlertingAuthorizationEntity.Rule, alertingAuthorizationFilterOpts);
    } catch (error) {
      var _this$auditLogger34;
      (_this$auditLogger34 = this.auditLogger) === null || _this$auditLogger34 === void 0 ? void 0 : _this$auditLogger34.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.BULK_EDIT,
        error
      }));
      throw error;
    }
    const {
      filter: authorizationFilter
    } = authorizationTuple;
    const qNodeFilterWithAuth = authorizationFilter && qNodeFilter ? _esQuery.nodeBuilder.and([qNodeFilter, authorizationFilter]) : qNodeFilter;
    const {
      aggregations,
      total
    } = await this.unsecuredSavedObjectsClient.find({
      filter: qNodeFilterWithAuth,
      page: 1,
      perPage: 0,
      type: 'alert',
      aggs: {
        alertTypeId: {
          multi_terms: {
            terms: [{
              field: 'alert.attributes.alertTypeId'
            }, {
              field: 'alert.attributes.consumer'
            }]
          }
        }
      }
    });
    if (total > MAX_RULES_NUMBER_FOR_BULK_OPERATION) {
      throw _boom.default.badRequest(`More than ${MAX_RULES_NUMBER_FOR_BULK_OPERATION} rules matched for bulk edit`);
    }
    const buckets = aggregations === null || aggregations === void 0 ? void 0 : aggregations.alertTypeId.buckets;
    if (buckets === undefined) {
      throw Error('No rules found for bulk edit');
    }
    await (0, _pMap.default)(buckets, async ({
      key: [ruleType, consumer]
    }) => {
      this.ruleTypeRegistry.ensureRuleTypeEnabled(ruleType);
      try {
        await this.authorization.ensureAuthorized({
          ruleTypeId: ruleType,
          consumer,
          operation: _authorization.WriteOperations.BulkEdit,
          entity: _authorization.AlertingAuthorizationEntity.Rule
        });
      } catch (error) {
        var _this$auditLogger35;
        (_this$auditLogger35 = this.auditLogger) === null || _this$auditLogger35 === void 0 ? void 0 : _this$auditLogger35.log((0, _audit_events.ruleAuditEvent)({
          action: _audit_events.RuleAuditAction.BULK_EDIT,
          error
        }));
        throw error;
      }
    }, {
      concurrency: RULE_TYPE_CHECKS_CONCURRENCY
    });
    const {
      apiKeysToInvalidate,
      results,
      errors
    } = await (0, _lib2.retryIfBulkEditConflicts)(this.logger, `rulesClient.update('operations=${JSON.stringify(options.operations)}, paramsModifier=${options.paramsModifier ? '[Function]' : undefined}')`, filterKueryNode => this.bulkEditOcc({
      filter: filterKueryNode,
      operations: options.operations,
      paramsModifier: options.paramsModifier
    }), qNodeFilterWithAuth);
    await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
      apiKeys: apiKeysToInvalidate
    }, this.logger, this.unsecuredSavedObjectsClient);
    const updatedRules = results.map(({
      id,
      attributes,
      references
    }) => {
      return this.getAlertFromRaw(id, attributes.alertTypeId, attributes, references, false);
    });

    // update schedules only if schedule operation is present
    const scheduleOperation = options.operations.find(operation => operation.field === 'schedule');
    if (scheduleOperation !== null && scheduleOperation !== void 0 && scheduleOperation.value) {
      const taskIds = updatedRules.reduce((acc, rule) => {
        if (rule.scheduledTaskId) {
          acc.push(rule.scheduledTaskId);
        }
        return acc;
      }, []);
      try {
        await this.taskManager.bulkUpdateSchedules(taskIds, scheduleOperation.value);
        this.logger.debug(`Successfully updated schedules for underlying tasks: ${taskIds.join(', ')}`);
      } catch (error) {
        this.logger.error(`Failure to update schedules for underlying tasks: ${taskIds.join(', ')}. TaskManager bulkUpdateSchedules failed with Error: ${error.message}`);
      }
    }
    return {
      rules: updatedRules,
      errors,
      total
    };
  }
  async bulkEditOcc({
    filter,
    operations,
    paramsModifier
  }) {
    const rulesFinder = await this.encryptedSavedObjectsClient.createPointInTimeFinderDecryptedAsInternalUser({
      filter,
      type: 'alert',
      perPage: 100,
      ...(this.namespace ? {
        namespaces: [this.namespace]
      } : undefined)
    });
    const rules = [];
    const errors = [];
    const apiKeysToInvalidate = [];
    const apiKeysMap = new Map();
    const username = await this.getUserName();
    for await (const response of rulesFinder.find()) {
      await (0, _pMap.default)(response.saved_objects, async rule => {
        try {
          var _ruleType$validate3, _ruleType$validate4, _attributes$notifyWhe, _attributes$throttle;
          if (rule.attributes.apiKey) {
            apiKeysMap.set(rule.id, {
              oldApiKey: rule.attributes.apiKey
            });
          }
          const ruleType = this.ruleTypeRegistry.get(rule.attributes.alertTypeId);
          let attributes = (0, _lodash.cloneDeep)(rule.attributes);
          let ruleActions = {
            actions: this.injectReferencesIntoActions(rule.id, rule.attributes.actions, rule.references || [])
          };
          for (const operation of operations) {
            const {
              field
            } = operation;
            if (field === 'snoozeSchedule' || field === 'apiKey') {
              if (rule.attributes.actions.length) {
                try {
                  await this.actionsAuthorization.ensureAuthorized('execute');
                } catch (error) {
                  throw Error(`Rule not authorized for bulk ${field} update - ${error.message}`);
                }
              }
            }
          }
          let hasUpdateApiKeyOperation = false;
          for (const operation of operations) {
            switch (operation.field) {
              case 'actions':
                await this.validateActions(ruleType, {
                  ...attributes,
                  actions: operation.value
                });
                ruleActions = (0, _lib2.applyBulkEditOperation)(operation, ruleActions);
                break;
              case 'snoozeSchedule':
                // Silently skip adding snooze or snooze schedules on security
                // rules until we implement snoozing of their rules
                if (attributes.consumer === _ruleDataUtils.AlertConsumers.SIEM) {
                  break;
                }
                if (operation.operation === 'set') {
                  const snoozeAttributes = getBulkSnoozeAttributes(attributes, operation.value);
                  try {
                    verifySnoozeScheduleLimit(snoozeAttributes);
                  } catch (error) {
                    throw Error(`Error updating rule: could not add snooze - ${error.message}`);
                  }
                  attributes = {
                    ...attributes,
                    ...snoozeAttributes
                  };
                }
                if (operation.operation === 'delete') {
                  const idsToDelete = operation.value && [...operation.value];
                  if ((idsToDelete === null || idsToDelete === void 0 ? void 0 : idsToDelete.length) === 0) {
                    var _attributes$snoozeSch;
                    (_attributes$snoozeSch = attributes.snoozeSchedule) === null || _attributes$snoozeSch === void 0 ? void 0 : _attributes$snoozeSch.forEach(schedule => {
                      if (schedule.id) {
                        idsToDelete.push(schedule.id);
                      }
                    });
                  }
                  attributes = {
                    ...attributes,
                    ...getBulkUnsnoozeAttributes(attributes, idsToDelete)
                  };
                }
                break;
              case 'apiKey':
                {
                  hasUpdateApiKeyOperation = true;
                  break;
                }
              default:
                attributes = (0, _lib2.applyBulkEditOperation)(operation, attributes);
            }
          }

          // validate schedule interval
          if (attributes.schedule.interval) {
            const isIntervalInvalid = (0, _parse_duration.parseDuration)(attributes.schedule.interval) < this.minimumScheduleIntervalInMs;
            if (isIntervalInvalid && this.minimumScheduleInterval.enforce) {
              throw Error(`Error updating rule: the interval is less than the allowed minimum interval of ${this.minimumScheduleInterval.value}`);
            } else if (isIntervalInvalid && !this.minimumScheduleInterval.enforce) {
              this.logger.warn(`Rule schedule interval (${attributes.schedule.interval}) for "${ruleType.id}" rule type with ID "${attributes.id}" is less than the minimum value (${this.minimumScheduleInterval.value}). Running rules at this interval may impact alerting performance. Set "xpack.alerting.rules.minimumScheduleInterval.enforce" to true to prevent such changes.`);
            }
          }
          const ruleParams = paramsModifier ? await paramsModifier(attributes.params) : attributes.params;

          // validate rule params
          const validatedAlertTypeParams = (0, _lib.validateRuleTypeParams)(ruleParams, (_ruleType$validate3 = ruleType.validate) === null || _ruleType$validate3 === void 0 ? void 0 : _ruleType$validate3.params);
          const validatedMutatedAlertTypeParams = (0, _lib.validateMutatedRuleTypeParams)(validatedAlertTypeParams, rule.attributes.params, (_ruleType$validate4 = ruleType.validate) === null || _ruleType$validate4 === void 0 ? void 0 : _ruleType$validate4.params);
          const {
            actions: rawAlertActions,
            references,
            params: updatedParams
          } = await this.extractReferences(ruleType, ruleActions.actions, validatedMutatedAlertTypeParams);
          const shouldUpdateApiKey = attributes.enabled || hasUpdateApiKeyOperation;

          // create API key
          let createdAPIKey = null;
          try {
            createdAPIKey = shouldUpdateApiKey ? await this.createAPIKey(this.generateAPIKeyName(ruleType.id, attributes.name)) : null;
          } catch (error) {
            throw Error(`Error updating rule: could not create API key - ${error.message}`);
          }
          const apiKeyAttributes = this.apiKeyAsAlertAttributes(createdAPIKey, username);

          // collect generated API keys
          if (apiKeyAttributes.apiKey) {
            apiKeysMap.set(rule.id, {
              ...apiKeysMap.get(rule.id),
              newApiKey: apiKeyAttributes.apiKey
            });
          }

          // get notifyWhen
          const notifyWhen = (0, _lib.getRuleNotifyWhenType)((_attributes$notifyWhe = attributes.notifyWhen) !== null && _attributes$notifyWhe !== void 0 ? _attributes$notifyWhe : null, (_attributes$throttle = attributes.throttle) !== null && _attributes$throttle !== void 0 ? _attributes$throttle : null);
          const updatedAttributes = this.updateMeta({
            ...attributes,
            ...apiKeyAttributes,
            params: updatedParams,
            actions: rawAlertActions,
            notifyWhen,
            updatedBy: username,
            updatedAt: new Date().toISOString()
          });

          // add mapped_params
          const mappedParams = (0, _mapped_params_utils.getMappedParams)(updatedParams);
          if (Object.keys(mappedParams).length) {
            updatedAttributes.mapped_params = mappedParams;
          }
          rules.push({
            ...rule,
            references,
            attributes: updatedAttributes
          });
        } catch (error) {
          var _rule$attributes2, _this$auditLogger36;
          errors.push({
            message: error.message,
            rule: {
              id: rule.id,
              name: (_rule$attributes2 = rule.attributes) === null || _rule$attributes2 === void 0 ? void 0 : _rule$attributes2.name
            }
          });
          (_this$auditLogger36 = this.auditLogger) === null || _this$auditLogger36 === void 0 ? void 0 : _this$auditLogger36.log((0, _audit_events.ruleAuditEvent)({
            action: _audit_events.RuleAuditAction.BULK_EDIT,
            error
          }));
        }
      }, {
        concurrency: API_KEY_GENERATE_CONCURRENCY
      });
    }
    let result;
    try {
      result = await this.unsecuredSavedObjectsClient.bulkCreate(rules, {
        overwrite: true
      });
    } catch (e) {
      // avoid unused newly generated API keys
      if (apiKeysMap.size > 0) {
        await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
          apiKeys: Array.from(apiKeysMap.values()).reduce((acc, value) => {
            if (value.newApiKey) {
              acc.push(value.newApiKey);
            }
            return acc;
          }, [])
        }, this.logger, this.unsecuredSavedObjectsClient);
      }
      throw e;
    }
    result.saved_objects.map(({
      id,
      error
    }) => {
      var _apiKeysMap$get, _apiKeysMap$get2;
      const oldApiKey = (_apiKeysMap$get = apiKeysMap.get(id)) === null || _apiKeysMap$get === void 0 ? void 0 : _apiKeysMap$get.oldApiKey;
      const newApiKey = (_apiKeysMap$get2 = apiKeysMap.get(id)) === null || _apiKeysMap$get2 === void 0 ? void 0 : _apiKeysMap$get2.newApiKey;

      // if SO wasn't saved and has new API key it will be invalidated
      if (error && newApiKey) {
        apiKeysToInvalidate.push(newApiKey);
        // if SO saved and has old Api Key it will be invalidate
      } else if (!error && oldApiKey) {
        apiKeysToInvalidate.push(oldApiKey);
      }
    });
    return {
      apiKeysToInvalidate,
      resultSavedObjects: result.saved_objects,
      errors,
      rules
    };
  }
  apiKeyAsAlertAttributes(apiKey, username) {
    return apiKey && apiKey.apiKeysEnabled ? {
      apiKeyOwner: username,
      apiKey: Buffer.from(`${apiKey.result.id}:${apiKey.result.api_key}`).toString('base64')
    } : {
      apiKeyOwner: null,
      apiKey: null
    };
  }
  async updateApiKey({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.updateApiKey('${id}')`, async () => await this.updateApiKeyWithOCC({
      id
    }));
  }
  async updateApiKeyWithOCC({
    id
  }) {
    var _this$auditLogger38;
    let apiKeyToInvalidate = null;
    let attributes;
    let version;
    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`updateApiKey(): Failed to load API key to invalidate on alert ${id}: ${e.message}`);
      // Still attempt to load the attributes and version using SOC
      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.UpdateApiKey,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger37;
      (_this$auditLogger37 = this.auditLogger) === null || _this$auditLogger37 === void 0 ? void 0 : _this$auditLogger37.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.UPDATE_API_KEY,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    const username = await this.getUserName();
    let createdAPIKey = null;
    try {
      createdAPIKey = await this.createAPIKey(this.generateAPIKeyName(attributes.alertTypeId, attributes.name));
    } catch (error) {
      throw _boom.default.badRequest(`Error updating API key for rule: could not create API key - ${error.message}`);
    }
    const updateAttributes = this.updateMeta({
      ...attributes,
      ...this.apiKeyAsAlertAttributes(createdAPIKey, username),
      updatedAt: new Date().toISOString(),
      updatedBy: username
    });
    (_this$auditLogger38 = this.auditLogger) === null || _this$auditLogger38 === void 0 ? void 0 : _this$auditLogger38.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.UPDATE_API_KEY,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    try {
      await this.unsecuredSavedObjectsClient.update('alert', id, updateAttributes, {
        version
      });
    } catch (e) {
      // Avoid unused API key
      await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
        apiKeys: updateAttributes.apiKey ? [updateAttributes.apiKey] : []
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }
    if (apiKeyToInvalidate) {
      await (0, _bulk_mark_api_keys_for_invalidation.bulkMarkApiKeysForInvalidation)({
        apiKeys: [apiKeyToInvalidate]
      }, this.logger, this.unsecuredSavedObjectsClient);
    }
  }
  async enable({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.enable('${id}')`, async () => await this.enableWithOCC({
      id
    }));
  }
  async enableWithOCC({
    id
  }) {
    var _this$auditLogger40;
    let existingApiKey = null;
    let attributes;
    let version;
    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      existingApiKey = decryptedAlert.attributes.apiKey;
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      this.logger.error(`enable(): Failed to load API key of alert ${id}: ${e.message}`);
      // Still attempt to load the attributes and version using SOC
      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.Enable,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger39;
      (_this$auditLogger39 = this.auditLogger) === null || _this$auditLogger39 === void 0 ? void 0 : _this$auditLogger39.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.ENABLE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger40 = this.auditLogger) === null || _this$auditLogger40 === void 0 ? void 0 : _this$auditLogger40.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.ENABLE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    if (attributes.enabled === false) {
      const username = await this.getUserName();
      const now = new Date();
      const schedule = attributes.schedule;
      const updateAttributes = this.updateMeta({
        ...attributes,
        ...(!existingApiKey && (await this.createNewAPIKeySet({
          attributes,
          username
        }))),
        ...(attributes.monitoring && {
          monitoring: (0, _lib.updateMonitoring)({
            monitoring: attributes.monitoring,
            timestamp: now.toISOString(),
            duration: 0
          })
        }),
        nextRun: (0, _lib.getNextRun)({
          interval: schedule.interval
        }),
        enabled: true,
        updatedBy: username,
        updatedAt: now.toISOString(),
        executionStatus: {
          status: 'pending',
          lastDuration: 0,
          lastExecutionDate: now.toISOString(),
          error: null,
          warning: null
        }
      });
      try {
        await this.unsecuredSavedObjectsClient.update('alert', id, updateAttributes, {
          version
        });
      } catch (e) {
        throw e;
      }
    }
    let scheduledTaskIdToCreate = null;
    if (attributes.scheduledTaskId) {
      // If scheduledTaskId defined in rule SO, make sure it exists
      try {
        await this.taskManager.get(attributes.scheduledTaskId);
      } catch (err) {
        scheduledTaskIdToCreate = id;
      }
    } else {
      // If scheduledTaskId doesn't exist in rule SO, set it to rule ID
      scheduledTaskIdToCreate = id;
    }
    if (scheduledTaskIdToCreate) {
      // Schedule the task if it doesn't exist
      const scheduledTask = await this.scheduleTask({
        id,
        consumer: attributes.consumer,
        ruleTypeId: attributes.alertTypeId,
        schedule: attributes.schedule,
        throwOnConflict: false
      });
      await this.unsecuredSavedObjectsClient.update('alert', id, {
        scheduledTaskId: scheduledTask.id
      });
    } else {
      // Task exists so set enabled to true
      await this.taskManager.bulkEnable([attributes.scheduledTaskId]);
    }
  }
  async createNewAPIKeySet({
    attributes,
    username
  }) {
    let createdAPIKey = null;
    try {
      createdAPIKey = await this.createAPIKey(this.generateAPIKeyName(attributes.alertTypeId, attributes.name));
    } catch (error) {
      throw _boom.default.badRequest(`Error creating API key for rule: ${error.message}`);
    }
    return this.apiKeyAsAlertAttributes(createdAPIKey, username);
  }
  async disable({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.disable('${id}')`, async () => await this.disableWithOCC({
      id
    }));
  }
  async disableWithOCC({
    id
  }) {
    var _this$auditLogger42;
    let attributes;
    let version;
    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      this.logger.error(`disable(): Failed to load API key of alert ${id}: ${e.message}`);
      // Still attempt to load the attributes and version using SOC
      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }
    if (this.eventLogger && attributes.scheduledTaskId) {
      try {
        var _state$alertInstances;
        const {
          state
        } = (0, _alert_task_instance.taskInstanceToAlertTaskInstance)(await this.taskManager.get(attributes.scheduledTaskId), attributes);
        const recoveredAlertInstances = (0, _lodash.mapValues)((_state$alertInstances = state.alertInstances) !== null && _state$alertInstances !== void 0 ? _state$alertInstances : {}, (rawAlertInstance, alertId) => new _alert.Alert(alertId, rawAlertInstance));
        const recoveredAlertInstanceIds = Object.keys(recoveredAlertInstances);
        for (const instanceId of recoveredAlertInstanceIds) {
          var _recoveredAlertInstan;
          const {
            group: actionGroup
          } = (_recoveredAlertInstan = recoveredAlertInstances[instanceId].getLastScheduledActions()) !== null && _recoveredAlertInstan !== void 0 ? _recoveredAlertInstan : {};
          const instanceState = recoveredAlertInstances[instanceId].getState();
          const message = `instance '${instanceId}' has recovered due to the rule was disabled`;
          const event = (0, _create_alert_event_log_record_object.createAlertEventLogRecordObject)({
            ruleId: id,
            ruleName: attributes.name,
            ruleType: this.ruleTypeRegistry.get(attributes.alertTypeId),
            consumer: attributes.consumer,
            instanceId,
            action: _plugin.EVENT_LOG_ACTIONS.recoveredInstance,
            message,
            state: instanceState,
            group: actionGroup,
            namespace: this.namespace,
            spaceId: this.spaceId,
            savedObjects: [{
              id,
              type: 'alert',
              typeId: attributes.alertTypeId,
              relation: _server3.SAVED_OBJECT_REL_PRIMARY
            }]
          });
          this.eventLogger.logEvent(event);
        }
      } catch (error) {
        // this should not block the rest of the disable process
        this.logger.warn(`rulesClient.disable('${id}') - Could not write recovery events - ${error.message}`);
      }
    }
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.Disable,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
    } catch (error) {
      var _this$auditLogger41;
      (_this$auditLogger41 = this.auditLogger) === null || _this$auditLogger41 === void 0 ? void 0 : _this$auditLogger41.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.DISABLE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger42 = this.auditLogger) === null || _this$auditLogger42 === void 0 ? void 0 : _this$auditLogger42.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.DISABLE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    if (attributes.enabled === true) {
      await this.unsecuredSavedObjectsClient.update('alert', id, this.updateMeta({
        ...attributes,
        enabled: false,
        scheduledTaskId: attributes.scheduledTaskId === id ? attributes.scheduledTaskId : null,
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString(),
        nextRun: null
      }), {
        version
      });

      // If the scheduledTaskId does not match the rule id, we should
      // remove the task, otherwise mark the task as disabled
      if (attributes.scheduledTaskId) {
        if (attributes.scheduledTaskId !== id) {
          await this.taskManager.removeIfExists(attributes.scheduledTaskId);
        } else {
          await this.taskManager.bulkDisable([attributes.scheduledTaskId]);
        }
      }
    }
  }
  async snooze({
    id,
    snoozeSchedule
  }) {
    const snoozeDateValidationMsg = (0, _validate_snooze_date.validateSnoozeStartDate)(snoozeSchedule.rRule.dtstart);
    if (snoozeDateValidationMsg) {
      throw new _rule_muted.RuleMutedError(snoozeDateValidationMsg);
    }
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.snooze('${id}', ${JSON.stringify(snoozeSchedule, null, 4)})`, async () => await this.snoozeWithOCC({
      id,
      snoozeSchedule
    }));
  }
  async snoozeWithOCC({
    id,
    snoozeSchedule
  }) {
    var _this$auditLogger44;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.Snooze,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger43;
      (_this$auditLogger43 = this.auditLogger) === null || _this$auditLogger43 === void 0 ? void 0 : _this$auditLogger43.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.SNOOZE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger44 = this.auditLogger) === null || _this$auditLogger44 === void 0 ? void 0 : _this$auditLogger44.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.SNOOZE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const newAttrs = getSnoozeAttributes(attributes, snoozeSchedule);
    try {
      verifySnoozeScheduleLimit(newAttrs);
    } catch (error) {
      throw _boom.default.badRequest(error.message);
    }
    const updateAttributes = this.updateMeta({
      ...newAttrs,
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }
  async unsnooze({
    id,
    scheduleIds
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.unsnooze('${id}')`, async () => await this.unsnoozeWithOCC({
      id,
      scheduleIds
    }));
  }
  async unsnoozeWithOCC({
    id,
    scheduleIds
  }) {
    var _this$auditLogger46;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.Unsnooze,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger45;
      (_this$auditLogger45 = this.auditLogger) === null || _this$auditLogger45 === void 0 ? void 0 : _this$auditLogger45.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.UNSNOOZE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger46 = this.auditLogger) === null || _this$auditLogger46 === void 0 ? void 0 : _this$auditLogger46.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.UNSNOOZE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const newAttrs = getUnsnoozeAttributes(attributes, scheduleIds);
    const updateAttributes = this.updateMeta({
      ...newAttrs,
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }
  calculateIsSnoozedUntil(rule) {
    const isSnoozedUntil = (0, _lib.getRuleSnoozeEndTime)(rule);
    return isSnoozedUntil ? isSnoozedUntil.toISOString() : null;
  }
  async clearExpiredSnoozes({
    id
  }) {
    var _attributes$snoozeSch2;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    const snoozeSchedule = attributes.snoozeSchedule ? attributes.snoozeSchedule.filter(s => {
      try {
        return !(0, _lib.isSnoozeExpired)(s);
      } catch (e) {
        this.logger.error(`Error checking for expiration of snooze ${s.id}: ${e}`);
        return true;
      }
    }) : [];
    if (snoozeSchedule.length === ((_attributes$snoozeSch2 = attributes.snoozeSchedule) === null || _attributes$snoozeSch2 === void 0 ? void 0 : _attributes$snoozeSch2.length)) return;
    const updateAttributes = this.updateMeta({
      snoozeSchedule,
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }
  async muteAll({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.muteAll('${id}')`, async () => await this.muteAllWithOCC({
      id
    }));
  }
  async muteAllWithOCC({
    id
  }) {
    var _this$auditLogger48;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.MuteAll,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger47;
      (_this$auditLogger47 = this.auditLogger) === null || _this$auditLogger47 === void 0 ? void 0 : _this$auditLogger47.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.MUTE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger48 = this.auditLogger) === null || _this$auditLogger48 === void 0 ? void 0 : _this$auditLogger48.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.MUTE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const updateAttributes = this.updateMeta({
      muteAll: true,
      mutedInstanceIds: [],
      snoozeSchedule: clearUnscheduledSnooze(attributes),
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }
  async unmuteAll({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.unmuteAll('${id}')`, async () => await this.unmuteAllWithOCC({
      id
    }));
  }
  async unmuteAllWithOCC({
    id
  }) {
    var _this$auditLogger50;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.UnmuteAll,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger49;
      (_this$auditLogger49 = this.auditLogger) === null || _this$auditLogger49 === void 0 ? void 0 : _this$auditLogger49.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.UNMUTE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger50 = this.auditLogger) === null || _this$auditLogger50 === void 0 ? void 0 : _this$auditLogger50.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.UNMUTE,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const updateAttributes = this.updateMeta({
      muteAll: false,
      mutedInstanceIds: [],
      snoozeSchedule: clearUnscheduledSnooze(attributes),
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }
  async muteInstance({
    alertId,
    alertInstanceId
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.muteInstance('${alertId}')`, async () => await this.muteInstanceWithOCC({
      alertId,
      alertInstanceId
    }));
  }
  async muteInstanceWithOCC({
    alertId,
    alertInstanceId
  }) {
    var _this$auditLogger52;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', alertId);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.MuteAlert,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger51;
      (_this$auditLogger51 = this.auditLogger) === null || _this$auditLogger51 === void 0 ? void 0 : _this$auditLogger51.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.MUTE_ALERT,
        savedObject: {
          type: 'alert',
          id: alertId
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger52 = this.auditLogger) === null || _this$auditLogger52 === void 0 ? void 0 : _this$auditLogger52.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.MUTE_ALERT,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id: alertId
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const mutedInstanceIds = attributes.mutedInstanceIds || [];
    if (!attributes.muteAll && !mutedInstanceIds.includes(alertInstanceId)) {
      mutedInstanceIds.push(alertInstanceId);
      await this.unsecuredSavedObjectsClient.update('alert', alertId, this.updateMeta({
        mutedInstanceIds,
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString()
      }), {
        version
      });
    }
  }
  async unmuteInstance({
    alertId,
    alertInstanceId
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `rulesClient.unmuteInstance('${alertId}')`, async () => await this.unmuteInstanceWithOCC({
      alertId,
      alertInstanceId
    }));
  }
  async unmuteInstanceWithOCC({
    alertId,
    alertInstanceId
  }) {
    var _this$auditLogger54;
    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', alertId);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.WriteOperations.UnmuteAlert,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger53;
      (_this$auditLogger53 = this.auditLogger) === null || _this$auditLogger53 === void 0 ? void 0 : _this$auditLogger53.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.UNMUTE_ALERT,
        savedObject: {
          type: 'alert',
          id: alertId
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger54 = this.auditLogger) === null || _this$auditLogger54 === void 0 ? void 0 : _this$auditLogger54.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.UNMUTE_ALERT,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id: alertId
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);
    const mutedInstanceIds = attributes.mutedInstanceIds || [];
    if (!attributes.muteAll && mutedInstanceIds.includes(alertInstanceId)) {
      await this.unsecuredSavedObjectsClient.update('alert', alertId, this.updateMeta({
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString(),
        mutedInstanceIds: mutedInstanceIds.filter(id => id !== alertInstanceId)
      }), {
        version
      });
    }
  }
  async runSoon({
    id
  }) {
    var _this$auditLogger56;
    const {
      attributes
    } = await this.unsecuredSavedObjectsClient.get('alert', id);
    try {
      await this.authorization.ensureAuthorized({
        ruleTypeId: attributes.alertTypeId,
        consumer: attributes.consumer,
        operation: _authorization.ReadOperations.RunSoon,
        entity: _authorization.AlertingAuthorizationEntity.Rule
      });
      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger55;
      (_this$auditLogger55 = this.auditLogger) === null || _this$auditLogger55 === void 0 ? void 0 : _this$auditLogger55.log((0, _audit_events.ruleAuditEvent)({
        action: _audit_events.RuleAuditAction.RUN_SOON,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }
    (_this$auditLogger56 = this.auditLogger) === null || _this$auditLogger56 === void 0 ? void 0 : _this$auditLogger56.log((0, _audit_events.ruleAuditEvent)({
      action: _audit_events.RuleAuditAction.RUN_SOON,
      outcome: 'unknown',
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.ruleTypeRegistry.ensureRuleTypeEnabled(attributes.alertTypeId);

    // Check that the rule is enabled
    if (!attributes.enabled) {
      return _i18n.i18n.translate('xpack.alerting.rulesClient.runSoon.disabledRuleError', {
        defaultMessage: 'Error running rule: rule is disabled'
      });
    }
    let taskDoc = null;
    try {
      taskDoc = attributes.scheduledTaskId ? await this.taskManager.get(attributes.scheduledTaskId) : null;
    } catch (err) {
      return _i18n.i18n.translate('xpack.alerting.rulesClient.runSoon.getTaskError', {
        defaultMessage: 'Error running rule: {errMessage}',
        values: {
          errMessage: err.message
        }
      });
    }
    if (taskDoc && (taskDoc.status === _server2.TaskStatus.Claiming || taskDoc.status === _server2.TaskStatus.Running)) {
      return _i18n.i18n.translate('xpack.alerting.rulesClient.runSoon.ruleIsRunning', {
        defaultMessage: 'Rule is already running'
      });
    }
    try {
      await this.taskManager.runSoon(attributes.scheduledTaskId ? attributes.scheduledTaskId : id);
    } catch (err) {
      return _i18n.i18n.translate('xpack.alerting.rulesClient.runSoon.runSoonError', {
        defaultMessage: 'Error running rule: {errMessage}',
        values: {
          errMessage: err.message
        }
      });
    }
  }
  async listAlertTypes() {
    return await this.authorization.filterByRuleTypeAuthorization(this.ruleTypeRegistry.list(), [_authorization.ReadOperations.Get, _authorization.WriteOperations.Create], _authorization.AlertingAuthorizationEntity.Rule);
  }
  getSpaceId() {
    return this.spaceId;
  }
  async scheduleTask(opts) {
    const {
      id,
      consumer,
      ruleTypeId,
      schedule,
      throwOnConflict
    } = opts;
    const taskInstance = {
      id,
      // use the same ID for task document as the rule
      taskType: `alerting:${ruleTypeId}`,
      schedule,
      params: {
        alertId: id,
        spaceId: this.spaceId,
        consumer
      },
      state: {
        previousStartedAt: null,
        alertTypeState: {},
        alertInstances: {}
      },
      scope: ['alerting'],
      enabled: true
    };
    try {
      return await this.taskManager.schedule(taskInstance);
    } catch (err) {
      if (err.statusCode === 409 && !throwOnConflict) {
        return taskInstance;
      }
      throw err;
    }
  }
  injectReferencesIntoActions(alertId, actions, references) {
    return actions.map(action => {
      if (action.actionRef.startsWith(preconfiguredConnectorActionRefPrefix)) {
        return {
          ...(0, _lodash.omit)(action, 'actionRef'),
          id: action.actionRef.replace(preconfiguredConnectorActionRefPrefix, '')
        };
      }
      const reference = references.find(ref => ref.name === action.actionRef);
      if (!reference) {
        throw new Error(`Action reference "${action.actionRef}" not found in alert id: ${alertId}`);
      }
      return {
        ...(0, _lodash.omit)(action, 'actionRef'),
        id: reference.id
      };
    });
  }
  getAlertFromRaw(id, ruleTypeId, rawRule, references, includeLegacyId = false, excludeFromPublicApi = false, includeSnoozeData = false) {
    const ruleType = this.ruleTypeRegistry.get(ruleTypeId);
    // In order to support the partial update API of Saved Objects we have to support
    // partial updates of an Alert, but when we receive an actual RawRule, it is safe
    // to cast the result to an Alert
    const res = this.getPartialRuleFromRaw(id, ruleType, rawRule, references, includeLegacyId, excludeFromPublicApi, includeSnoozeData);
    // include to result because it is for internal rules client usage
    if (includeLegacyId) {
      return res;
    }
    // exclude from result because it is an internal variable
    return (0, _lodash.omit)(res, ['legacyId']);
  }
  getPartialRuleFromRaw(id, ruleType, {
    createdAt,
    updatedAt,
    meta,
    notifyWhen,
    legacyId,
    scheduledTaskId,
    params,
    executionStatus,
    monitoring,
    nextRun,
    schedule,
    actions,
    snoozeSchedule,
    ...partialRawRule
  }, references, includeLegacyId = false, excludeFromPublicApi = false, includeSnoozeData = false) {
    var _partialRawRule$muteA, _getActiveScheduledSn, _partialRawRule$muteA2;
    const snoozeScheduleDates = snoozeSchedule === null || snoozeSchedule === void 0 ? void 0 : snoozeSchedule.map(s => ({
      ...s,
      rRule: {
        ...s.rRule,
        dtstart: new Date(s.rRule.dtstart),
        ...(s.rRule.until ? {
          until: new Date(s.rRule.until)
        } : {})
      }
    }));
    const includeSnoozeSchedule = snoozeSchedule !== undefined && !(0, _lodash.isEmpty)(snoozeSchedule) && !excludeFromPublicApi;
    const isSnoozedUntil = includeSnoozeSchedule ? this.calculateIsSnoozedUntil({
      muteAll: (_partialRawRule$muteA = partialRawRule.muteAll) !== null && _partialRawRule$muteA !== void 0 ? _partialRawRule$muteA : false,
      snoozeSchedule
    }) : null;
    const includeMonitoring = monitoring && !excludeFromPublicApi;
    const rule = {
      id,
      notifyWhen,
      ...(0, _lodash.omit)(partialRawRule, excludeFromPublicApi ? [...this.fieldsToExcludeFromPublicApi] : ''),
      // we currently only support the Interval Schedule type
      // Once we support additional types, this type signature will likely change
      schedule: schedule,
      actions: actions ? this.injectReferencesIntoActions(id, actions, references || []) : [],
      params: this.injectReferencesIntoParams(id, ruleType, params, references || []),
      ...(excludeFromPublicApi ? {} : {
        snoozeSchedule: snoozeScheduleDates !== null && snoozeScheduleDates !== void 0 ? snoozeScheduleDates : []
      }),
      ...(includeSnoozeData && !excludeFromPublicApi ? {
        activeSnoozes: (_getActiveScheduledSn = (0, _is_rule_snoozed.getActiveScheduledSnoozes)({
          snoozeSchedule,
          muteAll: (_partialRawRule$muteA2 = partialRawRule.muteAll) !== null && _partialRawRule$muteA2 !== void 0 ? _partialRawRule$muteA2 : false
        })) === null || _getActiveScheduledSn === void 0 ? void 0 : _getActiveScheduledSn.map(s => s.id),
        isSnoozedUntil
      } : {}),
      ...(updatedAt ? {
        updatedAt: new Date(updatedAt)
      } : {}),
      ...(createdAt ? {
        createdAt: new Date(createdAt)
      } : {}),
      ...(scheduledTaskId ? {
        scheduledTaskId
      } : {}),
      ...(executionStatus ? {
        executionStatus: (0, _lib.ruleExecutionStatusFromRaw)(this.logger, id, executionStatus)
      } : {}),
      ...(includeMonitoring ? {
        monitoring: (0, _lib.convertMonitoringFromRawAndVerify)(this.logger, id, monitoring)
      } : {}),
      ...(nextRun ? {
        nextRun: new Date(nextRun)
      } : {})
    };
    return includeLegacyId ? {
      ...rule,
      legacyId
    } : rule;
  }
  async validateActions(alertType, data) {
    const {
      actions,
      notifyWhen,
      throttle
    } = data;
    const hasNotifyWhen = typeof notifyWhen !== 'undefined';
    const hasThrottle = typeof throttle !== 'undefined';
    let usesRuleLevelFreqParams;
    if (hasNotifyWhen && hasThrottle) usesRuleLevelFreqParams = true;else if (!hasNotifyWhen && !hasThrottle) usesRuleLevelFreqParams = false;else {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.usesValidGlobalFreqParams.oneUndefined', {
        defaultMessage: 'Rule-level notifyWhen and throttle must both be defined or both be undefined'
      }));
    }
    if (actions.length === 0) {
      return;
    }

    // check for actions using connectors with missing secrets
    const actionsClient = await this.getActionsClient();
    const actionIds = [...new Set(actions.map(action => action.id))];
    const actionResults = (await actionsClient.getBulk(actionIds)) || [];
    const actionsUsingConnectorsWithMissingSecrets = actionResults.filter(result => result.isMissingSecrets);
    if (actionsUsingConnectorsWithMissingSecrets.length) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.validateActions.misconfiguredConnector', {
        defaultMessage: 'Invalid connectors: {groups}',
        values: {
          groups: actionsUsingConnectorsWithMissingSecrets.map(connector => connector.name).join(', ')
        }
      }));
    }

    // check for actions with invalid action groups
    const {
      actionGroups: alertTypeActionGroups
    } = alertType;
    const usedAlertActionGroups = actions.map(action => action.group);
    const availableAlertTypeActionGroups = new Set((0, _lodash.map)(alertTypeActionGroups, 'id'));
    const invalidActionGroups = usedAlertActionGroups.filter(group => !availableAlertTypeActionGroups.has(group));
    if (invalidActionGroups.length) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.validateActions.invalidGroups', {
        defaultMessage: 'Invalid action groups: {groups}',
        values: {
          groups: invalidActionGroups.join(', ')
        }
      }));
    }

    // check for actions using frequency params if the rule has rule-level frequency params defined
    if (usesRuleLevelFreqParams) {
      const actionsWithFrequency = actions.filter(action => Boolean(action.frequency));
      if (actionsWithFrequency.length) {
        throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.validateActions.mixAndMatchFreqParams', {
          defaultMessage: 'Cannot specify per-action frequency params when notify_when and throttle are defined at the rule level: {groups}',
          values: {
            groups: actionsWithFrequency.map(a => a.group).join(', ')
          }
        }));
      }
    } else {
      const actionsWithoutFrequency = actions.filter(action => !action.frequency);
      if (actionsWithoutFrequency.length) {
        throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.validateActions.notAllActionsWithFreq', {
          defaultMessage: 'Actions missing frequency parameters: {groups}',
          values: {
            groups: actionsWithoutFrequency.map(a => a.group).join(', ')
          }
        }));
      }
    }
  }
  async extractReferences(ruleType, ruleActions, ruleParams) {
    var _ruleType$useSavedObj, _extractedRefsAndPara, _ref2;
    const {
      references: actionReferences,
      actions
    } = await this.denormalizeActions(ruleActions);

    // Extracts any references using configured reference extractor if available
    const extractedRefsAndParams = ruleType !== null && ruleType !== void 0 && (_ruleType$useSavedObj = ruleType.useSavedObjectReferences) !== null && _ruleType$useSavedObj !== void 0 && _ruleType$useSavedObj.extractReferences ? ruleType.useSavedObjectReferences.extractReferences(ruleParams) : null;
    const extractedReferences = (_extractedRefsAndPara = extractedRefsAndParams === null || extractedRefsAndParams === void 0 ? void 0 : extractedRefsAndParams.references) !== null && _extractedRefsAndPara !== void 0 ? _extractedRefsAndPara : [];
    const params = (_ref2 = extractedRefsAndParams === null || extractedRefsAndParams === void 0 ? void 0 : extractedRefsAndParams.params) !== null && _ref2 !== void 0 ? _ref2 : ruleParams;

    // Prefix extracted references in order to avoid clashes with framework level references
    const paramReferences = extractedReferences.map(reference => ({
      ...reference,
      name: `${extractedSavedObjectParamReferenceNamePrefix}${reference.name}`
    }));
    const references = [...actionReferences, ...paramReferences];
    return {
      actions,
      params,
      references
    };
  }
  injectReferencesIntoParams(ruleId, ruleType, ruleParams, references) {
    try {
      var _ruleType$useSavedObj2;
      const paramReferences = references.filter(reference => reference.name.startsWith(extractedSavedObjectParamReferenceNamePrefix)).map(reference => ({
        ...reference,
        name: reference.name.replace(extractedSavedObjectParamReferenceNamePrefix, '')
      }));
      return ruleParams && ruleType !== null && ruleType !== void 0 && (_ruleType$useSavedObj2 = ruleType.useSavedObjectReferences) !== null && _ruleType$useSavedObj2 !== void 0 && _ruleType$useSavedObj2.injectReferences ? ruleType.useSavedObjectReferences.injectReferences(ruleParams, paramReferences) : ruleParams;
    } catch (err) {
      throw _boom.default.badRequest(`Error injecting reference into rule params for rule id ${ruleId} - ${err.message}`);
    }
  }
  async denormalizeActions(alertActions) {
    const references = [];
    const actions = [];
    if (alertActions.length) {
      const actionsClient = await this.getActionsClient();
      const actionIds = [...new Set(alertActions.map(alertAction => alertAction.id))];
      const actionResults = await actionsClient.getBulk(actionIds);
      const actionTypeIds = [...new Set(actionResults.map(action => action.actionTypeId))];
      actionTypeIds.forEach(id => {
        // Notify action type usage via "isActionTypeEnabled" function
        actionsClient.isActionTypeEnabled(id, {
          notifyUsage: true
        });
      });
      alertActions.forEach(({
        id,
        ...alertAction
      }, i) => {
        const actionResultValue = actionResults.find(action => action.id === id);
        if (actionResultValue) {
          if (actionsClient.isPreconfigured(id)) {
            actions.push({
              ...alertAction,
              actionRef: `${preconfiguredConnectorActionRefPrefix}${id}`,
              actionTypeId: actionResultValue.actionTypeId
            });
          } else {
            const actionRef = `action_${i}`;
            references.push({
              id,
              name: actionRef,
              type: 'action'
            });
            actions.push({
              ...alertAction,
              actionRef,
              actionTypeId: actionResultValue.actionTypeId
            });
          }
        } else {
          actions.push({
            ...alertAction,
            actionRef: '',
            actionTypeId: ''
          });
        }
      });
    }
    return {
      actions,
      references
    };
  }
  includeFieldsRequiredForAuthentication(fields) {
    return (0, _lodash.uniq)([...fields, 'alertTypeId', 'consumer']);
  }
  generateAPIKeyName(alertTypeId, alertName) {
    return (0, _lodash.truncate)(`Alerting: ${alertTypeId}/${(0, _lodash.trim)(alertName)}`, {
      length: 256
    });
  }
  updateMeta(alertAttributes) {
    if (alertAttributes.hasOwnProperty('apiKey') || alertAttributes.hasOwnProperty('apiKeyOwner')) {
      var _alertAttributes$meta;
      alertAttributes.meta = (_alertAttributes$meta = alertAttributes.meta) !== null && _alertAttributes$meta !== void 0 ? _alertAttributes$meta : {};
      alertAttributes.meta.versionApiKeyLastmodified = this.kibanaVersion;
    }
    return alertAttributes;
  }
}
exports.RulesClient = RulesClient;
function parseDate(dateString, propertyName, defaultValue) {
  if (dateString === undefined) {
    return defaultValue;
  }
  const parsedDate = (0, _iso_or_relative_date.parseIsoOrRelativeDate)(dateString);
  if (parsedDate === undefined) {
    throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerting.rulesClient.invalidDate', {
      defaultMessage: 'Invalid date for parameter {field}: "{dateValue}"',
      values: {
        field: propertyName,
        dateValue: dateString
      }
    }));
  }
  return parsedDate;
}
function getSnoozeAttributes(attributes, snoozeSchedule) {
  // If duration is -1, instead mute all
  const {
    id: snoozeId,
    duration
  } = snoozeSchedule;
  if (duration === -1) {
    return {
      muteAll: true,
      snoozeSchedule: clearUnscheduledSnooze(attributes)
    };
  }
  return {
    snoozeSchedule: (snoozeId ? clearScheduledSnoozesById(attributes, [snoozeId]) : clearUnscheduledSnooze(attributes)).concat(snoozeSchedule),
    muteAll: false
  };
}
function getBulkSnoozeAttributes(attributes, snoozeSchedule) {
  // If duration is -1, instead mute all
  const {
    id: snoozeId,
    duration
  } = snoozeSchedule;
  if (duration === -1) {
    return {
      muteAll: true,
      snoozeSchedule: clearUnscheduledSnooze(attributes)
    };
  }

  // Bulk adding snooze schedule, don't touch the existing snooze/indefinite snooze
  if (snoozeId) {
    const existingSnoozeSchedules = attributes.snoozeSchedule || [];
    return {
      muteAll: attributes.muteAll,
      snoozeSchedule: [...existingSnoozeSchedules, snoozeSchedule]
    };
  }

  // Bulk snoozing, don't touch the existing snooze schedules
  return {
    muteAll: false,
    snoozeSchedule: [...clearUnscheduledSnooze(attributes), snoozeSchedule]
  };
}
function getUnsnoozeAttributes(attributes, scheduleIds) {
  const snoozeSchedule = scheduleIds ? clearScheduledSnoozesById(attributes, scheduleIds) : clearCurrentActiveSnooze(attributes);
  return {
    snoozeSchedule,
    ...(!scheduleIds ? {
      muteAll: false
    } : {})
  };
}
function getBulkUnsnoozeAttributes(attributes, scheduleIds) {
  // Bulk removing snooze schedules, don't touch the current snooze/indefinite snooze
  if (scheduleIds) {
    var _attributes$snoozeSch3;
    const newSchedules = clearScheduledSnoozesById(attributes, scheduleIds);
    // Unscheduled snooze is also known as snooze now
    const unscheduledSnooze = ((_attributes$snoozeSch3 = attributes.snoozeSchedule) === null || _attributes$snoozeSch3 === void 0 ? void 0 : _attributes$snoozeSch3.filter(s => typeof s.id === 'undefined')) || [];
    return {
      snoozeSchedule: [...unscheduledSnooze, ...newSchedules],
      muteAll: attributes.muteAll
    };
  }

  // Bulk unsnoozing, don't touch current snooze schedules that are NOT active
  return {
    snoozeSchedule: clearCurrentActiveSnooze(attributes),
    muteAll: false
  };
}
function clearUnscheduledSnooze(attributes) {
  // Clear any snoozes that have no ID property. These are "simple" snoozes created with the quick UI, e.g. snooze for 3 days starting now
  return attributes.snoozeSchedule ? attributes.snoozeSchedule.filter(s => typeof s.id !== 'undefined') : [];
}
function clearScheduledSnoozesById(attributes, ids) {
  return attributes.snoozeSchedule ? attributes.snoozeSchedule.filter(s => s.id && !ids.includes(s.id)) : [];
}
function clearCurrentActiveSnooze(attributes) {
  var _activeSnoozes$map;
  // First attempt to cancel a simple (unscheduled) snooze
  const clearedUnscheduledSnoozes = clearUnscheduledSnooze(attributes);
  // Now clear any scheduled snoozes that are currently active and never recur
  const activeSnoozes = (0, _is_rule_snoozed.getActiveScheduledSnoozes)(attributes);
  const activeSnoozeIds = (_activeSnoozes$map = activeSnoozes === null || activeSnoozes === void 0 ? void 0 : activeSnoozes.map(s => s.id)) !== null && _activeSnoozes$map !== void 0 ? _activeSnoozes$map : [];
  const recurringSnoozesToSkip = [];
  const clearedNonRecurringActiveSnoozes = clearedUnscheduledSnoozes.filter(s => {
    if (!activeSnoozeIds.includes(s.id)) return true;
    // Check if this is a recurring snooze, and return true if so
    if (s.rRule.freq && s.rRule.count !== 1) {
      recurringSnoozesToSkip.push(s.id);
      return true;
    }
  });
  const clearedSnoozesAndSkippedRecurringSnoozes = clearedNonRecurringActiveSnoozes.map(s => {
    var _activeSnoozes$find, _s$skipRecurrences;
    if (s.id && !recurringSnoozesToSkip.includes(s.id)) return s;
    const currentRecurrence = activeSnoozes === null || activeSnoozes === void 0 ? void 0 : (_activeSnoozes$find = activeSnoozes.find(a => a.id === s.id)) === null || _activeSnoozes$find === void 0 ? void 0 : _activeSnoozes$find.lastOccurrence;
    if (!currentRecurrence) return s;
    return {
      ...s,
      skipRecurrences: ((_s$skipRecurrences = s.skipRecurrences) !== null && _s$skipRecurrences !== void 0 ? _s$skipRecurrences : []).concat(currentRecurrence.toISOString())
    };
  });
  return clearedSnoozesAndSkippedRecurringSnoozes;
}
function verifySnoozeScheduleLimit(attributes) {
  var _attributes$snoozeSch4;
  const schedules = (_attributes$snoozeSch4 = attributes.snoozeSchedule) === null || _attributes$snoozeSch4 === void 0 ? void 0 : _attributes$snoozeSch4.filter(snooze => snooze.id);
  if (schedules && schedules.length > 5) {
    throw Error(_i18n.i18n.translate('xpack.alerting.rulesClient.snoozeSchedule.limitReached', {
      defaultMessage: 'Rule cannot have more than 5 snooze schedules'
    }));
  }
}