"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MAX_ATTEMPTS = exports.ActionTypeRegistry = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _i18n = require("@kbn/i18n");
var _common = require("../common");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_ATTEMPTS = 3;
exports.MAX_ATTEMPTS = MAX_ATTEMPTS;
class ActionTypeRegistry {
  constructor(constructorParams) {
    (0, _defineProperty2.default)(this, "taskManager", void 0);
    (0, _defineProperty2.default)(this, "actionTypes", new Map());
    (0, _defineProperty2.default)(this, "taskRunnerFactory", void 0);
    (0, _defineProperty2.default)(this, "actionsConfigUtils", void 0);
    (0, _defineProperty2.default)(this, "licenseState", void 0);
    (0, _defineProperty2.default)(this, "preconfiguredActions", void 0);
    (0, _defineProperty2.default)(this, "licensing", void 0);
    this.taskManager = constructorParams.taskManager;
    this.taskRunnerFactory = constructorParams.taskRunnerFactory;
    this.actionsConfigUtils = constructorParams.actionsConfigUtils;
    this.licenseState = constructorParams.licenseState;
    this.preconfiguredActions = constructorParams.preconfiguredActions;
    this.licensing = constructorParams.licensing;
  }

  /**
   * Returns if the action type registry has the given action type registered
   */
  has(id) {
    return this.actionTypes.has(id);
  }

  /**
   * Throws error if action type is not enabled.
   */
  ensureActionTypeEnabled(id) {
    this.actionsConfigUtils.ensureActionTypeEnabled(id);
    // Important to happen last because the function will notify of feature usage at the
    // same time and it shouldn't notify when the action type isn't enabled
    this.licenseState.ensureLicenseForActionType(this.get(id));
  }

  /**
   * Returns true if action type is enabled in the config and a valid license is used.
   */
  isActionTypeEnabled(id, options = {
    notifyUsage: false
  }) {
    return this.actionsConfigUtils.isActionTypeEnabled(id) && this.licenseState.isLicenseValidForActionType(this.get(id), options).isValid === true;
  }

  /**
   * Returns true if action type is enabled or it is a preconfigured action type.
   */
  isActionExecutable(actionId, actionTypeId, options = {
    notifyUsage: false
  }) {
    const actionTypeEnabled = this.isActionTypeEnabled(actionTypeId, options);
    return actionTypeEnabled || !actionTypeEnabled && this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === actionId) !== undefined;
  }

  /**
   * Registers an action type to the action type registry
   */
  register(actionType) {
    if (this.has(actionType.id)) {
      throw new Error(_i18n.i18n.translate('xpack.actions.actionTypeRegistry.register.duplicateActionTypeErrorMessage', {
        defaultMessage: 'Action type "{id}" is already registered.',
        values: {
          id: actionType.id
        }
      }));
    }
    if (!actionType.supportedFeatureIds || actionType.supportedFeatureIds.length === 0) {
      throw new Error(_i18n.i18n.translate('xpack.actions.actionTypeRegistry.register.missingSupportedFeatureIds', {
        defaultMessage: 'At least one "supportedFeatureId" value must be supplied for connector type "{connectorTypeId}".',
        values: {
          connectorTypeId: actionType.id
        }
      }));
    }
    if (!(0, _common.areValidFeatures)(actionType.supportedFeatureIds)) {
      throw new Error(_i18n.i18n.translate('xpack.actions.actionTypeRegistry.register.invalidConnectorFeatureIds', {
        defaultMessage: 'Invalid feature ids "{ids}" for connector type "{connectorTypeId}".',
        values: {
          connectorTypeId: actionType.id,
          ids: actionType.supportedFeatureIds.join(',')
        }
      }));
    }
    this.actionTypes.set(actionType.id, {
      ...actionType
    });
    this.taskManager.registerTaskDefinitions({
      [`actions:${actionType.id}`]: {
        title: actionType.name,
        maxAttempts: actionType.maxAttempts || MAX_ATTEMPTS,
        getRetry(attempts, error) {
          var _actionType$maxAttemp;
          if (error instanceof _lib.ExecutorError) {
            return error.retry == null ? false : error.retry;
          }
          // Only retry other kinds of errors based on attempts
          return attempts < ((_actionType$maxAttemp = actionType.maxAttempts) !== null && _actionType$maxAttemp !== void 0 ? _actionType$maxAttemp : 0);
        },
        createTaskRunner: context => this.taskRunnerFactory.create(context, actionType.maxAttempts)
      }
    });
    // No need to notify usage on basic action types
    if (actionType.minimumLicenseRequired !== 'basic') {
      this.licensing.featureUsage.register((0, _lib.getActionTypeFeatureUsageName)(actionType), actionType.minimumLicenseRequired);
    }
  }

  /**
   * Returns an action type, throws if not registered
   */
  get(id) {
    if (!this.has(id)) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.actions.actionTypeRegistry.get.missingActionTypeErrorMessage', {
        defaultMessage: 'Action type "{id}" is not registered.',
        values: {
          id
        }
      }));
    }
    return this.actionTypes.get(id);
  }

  /**
   * Returns a list of registered action types [{ id, name, enabled }], filtered by featureId if provided.
   */
  list(featureId) {
    return Array.from(this.actionTypes).filter(([_, actionType]) => featureId ? actionType.supportedFeatureIds.includes(featureId) : true).map(([actionTypeId, actionType]) => ({
      id: actionTypeId,
      name: actionType.name,
      minimumLicenseRequired: actionType.minimumLicenseRequired,
      enabled: this.isActionTypeEnabled(actionTypeId),
      enabledInConfig: this.actionsConfigUtils.isActionTypeEnabled(actionTypeId),
      enabledInLicense: !!this.licenseState.isLicenseValidForActionType(actionType).isValid,
      supportedFeatureIds: actionType.supportedFeatureIds
    }));
  }

  /**
   * Returns the actions configuration utilities
   */
  getUtils() {
    return this.actionsConfigUtils;
  }
  getAllTypes() {
    return [...this.list().map(({
      id
    }) => id)];
  }
}
exports.ActionTypeRegistry = ActionTypeRegistry;