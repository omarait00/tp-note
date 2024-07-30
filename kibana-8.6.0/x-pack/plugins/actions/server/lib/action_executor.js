"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionExecutor = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _lodash = require("lodash");
var _apmUtils = require("@kbn/apm-utils");
var _server = require("../../../event_log/server");
var _validate_with_schema = require("./validate_with_schema");
var _event_log = require("../constants/event_log");
var _create_action_event_log_record_object = require("./create_action_event_log_record_object");
var _action_execution_error = require("./errors/action_execution_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// 1,000,000 nanoseconds in 1 millisecond
const Millis2Nanos = 1000 * 1000;
class ActionExecutor {
  constructor({
    isESOCanEncrypt
  }) {
    (0, _defineProperty2.default)(this, "isInitialized", false);
    (0, _defineProperty2.default)(this, "actionExecutorContext", void 0);
    (0, _defineProperty2.default)(this, "isESOCanEncrypt", void 0);
    (0, _defineProperty2.default)(this, "actionInfo", void 0);
    this.isESOCanEncrypt = isESOCanEncrypt;
  }
  initialize(actionExecutorContext) {
    if (this.isInitialized) {
      throw new Error('ActionExecutor already initialized');
    }
    this.isInitialized = true;
    this.actionExecutorContext = actionExecutorContext;
  }
  async execute({
    actionId,
    params,
    request,
    source,
    isEphemeral,
    taskInfo,
    executionId,
    consumer,
    relatedSavedObjects
  }) {
    if (!this.isInitialized) {
      throw new Error('ActionExecutor not initialized');
    }
    return (0, _apmUtils.withSpan)({
      name: `execute_action`,
      type: 'actions',
      labels: {
        actions_connector_id: actionId
      }
    }, async span => {
      const {
        spaces,
        getServices,
        encryptedSavedObjectsClient,
        actionTypeRegistry,
        eventLogger,
        preconfiguredActions,
        getActionsClientWithRequest
      } = this.actionExecutorContext;
      const services = getServices(request);
      const spaceId = spaces && spaces.getSpaceId(request);
      const namespace = spaceId && spaceId !== 'default' ? {
        namespace: spaceId
      } : {};
      const actionInfo = await getActionInfoInternal(getActionsClientWithRequest, request, this.isESOCanEncrypt, encryptedSavedObjectsClient, preconfiguredActions, actionId, namespace.namespace, source);
      const {
        actionTypeId,
        name,
        config,
        secrets
      } = actionInfo;
      const loggerId = actionTypeId.startsWith('.') ? actionTypeId.substring(1) : actionTypeId;
      let {
        logger
      } = this.actionExecutorContext;
      logger = logger.get(loggerId);
      if (!this.actionInfo || this.actionInfo.actionId !== actionId) {
        this.actionInfo = actionInfo;
      }
      if (span) {
        span.name = `execute_action ${actionTypeId}`;
        span.addLabels({
          actions_connector_type_id: actionTypeId
        });
      }
      if (!actionTypeRegistry.isActionExecutable(actionId, actionTypeId, {
        notifyUsage: true
      })) {
        actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
      }
      const actionType = actionTypeRegistry.get(actionTypeId);
      const actionLabel = `${actionTypeId}:${actionId}: ${name}`;
      logger.debug(`executing action ${actionLabel}`);
      const task = taskInfo ? {
        task: {
          scheduled: taskInfo.scheduled.toISOString(),
          scheduleDelay: Millis2Nanos * (Date.now() - taskInfo.scheduled.getTime())
        }
      } : {};
      const event = (0, _create_action_event_log_record_object.createActionEventLogRecordObject)({
        actionId,
        action: _event_log.EVENT_LOG_ACTIONS.execute,
        consumer,
        ...namespace,
        ...task,
        executionId,
        spaceId,
        savedObjects: [{
          type: 'action',
          id: actionId,
          typeId: actionTypeId,
          relation: _server.SAVED_OBJECT_REL_PRIMARY
        }],
        relatedSavedObjects
      });
      eventLogger.startTiming(event);
      const startEvent = (0, _lodash.cloneDeep)({
        ...event,
        event: {
          ...event.event,
          action: _event_log.EVENT_LOG_ACTIONS.executeStart
        },
        message: `action started: ${actionLabel}`
      });
      eventLogger.logEvent(startEvent);
      let rawResult;
      try {
        const configurationUtilities = actionTypeRegistry.getUtils();
        const {
          validatedParams,
          validatedConfig,
          validatedSecrets
        } = validateAction({
          actionId,
          actionType,
          params,
          config,
          secrets
        }, {
          configurationUtilities
        });
        rawResult = await actionType.executor({
          actionId,
          services,
          params: validatedParams,
          config: validatedConfig,
          secrets: validatedSecrets,
          isEphemeral,
          taskInfo,
          configurationUtilities,
          logger
        });
      } catch (err) {
        if (err.reason === _action_execution_error.ActionExecutionErrorReason.Validation) {
          rawResult = err.result;
        } else {
          rawResult = {
            actionId,
            status: 'error',
            message: 'an error occurred while running the action',
            serviceMessage: err.message,
            error: err,
            retry: true
          };
        }
      }
      eventLogger.stopTiming(event);

      // allow null-ish return to indicate success
      const result = rawResult || {
        actionId,
        status: 'ok'
      };
      event.event = event.event || {};
      if (result.status === 'ok') {
        span === null || span === void 0 ? void 0 : span.setOutcome('success');
        event.event.outcome = 'success';
        event.message = `action executed: ${actionLabel}`;
      } else if (result.status === 'error') {
        span === null || span === void 0 ? void 0 : span.setOutcome('failure');
        event.event.outcome = 'failure';
        event.message = `action execution failure: ${actionLabel}`;
        event.error = event.error || {};
        event.error.message = actionErrorToMessage(result);
        if (result.error) {
          logger.error(result.error, {
            tags: [actionTypeId, actionId, 'action-run-failed'],
            error: {
              stack_trace: result.error.stack
            }
          });
        }
        logger.warn(`action execution failure: ${actionLabel}: ${event.error.message}`);
      } else {
        span === null || span === void 0 ? void 0 : span.setOutcome('failure');
        event.event.outcome = 'failure';
        event.message = `action execution returned unexpected result: ${actionLabel}: "${result.status}"`;
        event.error = event.error || {};
        event.error.message = 'action execution returned unexpected result';
        logger.warn(`action execution failure: ${actionLabel}: returned unexpected result "${result.status}"`);
      }
      eventLogger.logEvent(event);
      const {
        error,
        ...resultWithoutError
      } = result;
      return resultWithoutError;
    });
  }
  async logCancellation({
    actionId,
    request,
    relatedSavedObjects,
    source,
    executionId,
    taskInfo,
    consumer
  }) {
    var _this$actionInfo$name;
    const {
      spaces,
      encryptedSavedObjectsClient,
      preconfiguredActions,
      eventLogger,
      getActionsClientWithRequest
    } = this.actionExecutorContext;
    const spaceId = spaces && spaces.getSpaceId(request);
    const namespace = spaceId && spaceId !== 'default' ? {
      namespace: spaceId
    } : {};
    if (!this.actionInfo || this.actionInfo.actionId !== actionId) {
      this.actionInfo = await getActionInfoInternal(getActionsClientWithRequest, request, this.isESOCanEncrypt, encryptedSavedObjectsClient, preconfiguredActions, actionId, namespace.namespace, source);
    }
    const task = taskInfo ? {
      task: {
        scheduled: taskInfo.scheduled.toISOString(),
        scheduleDelay: Millis2Nanos * (Date.now() - taskInfo.scheduled.getTime())
      }
    } : {};
    // Write event log entry
    const event = (0, _create_action_event_log_record_object.createActionEventLogRecordObject)({
      actionId,
      consumer,
      action: _event_log.EVENT_LOG_ACTIONS.executeTimeout,
      message: `action: ${this.actionInfo.actionTypeId}:${actionId}: '${(_this$actionInfo$name = this.actionInfo.name) !== null && _this$actionInfo$name !== void 0 ? _this$actionInfo$name : ''}' execution cancelled due to timeout - exceeded default timeout of "5m"`,
      ...namespace,
      ...task,
      executionId,
      spaceId,
      savedObjects: [{
        type: 'action',
        id: actionId,
        typeId: this.actionInfo.actionTypeId,
        relation: _server.SAVED_OBJECT_REL_PRIMARY
      }],
      relatedSavedObjects
    });
    eventLogger.logEvent(event);
  }
}
exports.ActionExecutor = ActionExecutor;
async function getActionInfoInternal(getActionsClientWithRequest, request, isESOCanEncrypt, encryptedSavedObjectsClient, preconfiguredActions, actionId, namespace, source) {
  // check to see if it's a pre-configured action first
  const pcAction = preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === actionId);
  if (pcAction) {
    return {
      actionTypeId: pcAction.actionTypeId,
      name: pcAction.name,
      config: pcAction.config,
      secrets: pcAction.secrets,
      actionId
    };
  }
  if (!isESOCanEncrypt) {
    throw new Error(`Unable to execute action because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
  }
  const actionsClient = await getActionsClientWithRequest(request, source);

  // if not pre-configured action, should be a saved object
  // ensure user can read the action before processing
  const {
    actionTypeId,
    config,
    name
  } = await actionsClient.get({
    id: actionId
  });
  const {
    attributes: {
      secrets
    }
  } = await encryptedSavedObjectsClient.getDecryptedAsInternalUser('action', actionId, {
    namespace: namespace === 'default' ? undefined : namespace
  });
  return {
    actionTypeId,
    name,
    config,
    secrets,
    actionId
  };
}
function actionErrorToMessage(result) {
  let message = result.message || 'unknown error running action';
  if (result.serviceMessage) {
    message = `${message}: ${result.serviceMessage}`;
  }
  if (result.retry instanceof Date) {
    message = `${message}; retry at ${result.retry.toISOString()}`;
  } else if (result.retry) {
    message = `${message}; retry: ${JSON.stringify(result.retry)}`;
  }
  return message;
}
function validateAction({
  actionId,
  actionType,
  params,
  config,
  secrets
}, validatorServices) {
  let validatedParams;
  let validatedConfig;
  let validatedSecrets;
  try {
    var _actionType$validate;
    validatedParams = (0, _validate_with_schema.validateParams)(actionType, params, validatorServices);
    validatedConfig = (0, _validate_with_schema.validateConfig)(actionType, config, validatorServices);
    validatedSecrets = (0, _validate_with_schema.validateSecrets)(actionType, secrets, validatorServices);
    if ((_actionType$validate = actionType.validate) !== null && _actionType$validate !== void 0 && _actionType$validate.connector) {
      (0, _validate_with_schema.validateConnector)(actionType, {
        config,
        secrets
      });
    }
    return {
      validatedParams,
      validatedConfig,
      validatedSecrets
    };
  } catch (err) {
    throw new _action_execution_error.ActionExecutionError(err.message, _action_execution_error.ActionExecutionErrorReason.Validation, {
      actionId,
      status: 'error',
      message: err.message,
      retry: false
    });
  }
}