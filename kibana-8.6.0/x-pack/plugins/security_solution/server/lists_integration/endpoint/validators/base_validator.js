"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicEndpointExceptionDataSchema = exports.BaseValidator = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _configSchema = require("@kbn/config-schema");
var _fp = require("lodash/fp");
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _authz = require("../../../../common/endpoint/service/authz");
var _artifacts = require("../../../../common/endpoint/service/artifacts");
var _errors = require("./errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const BasicEndpointExceptionDataSchema = _configSchema.schema.object({
  // must have a name
  name: _configSchema.schema.string({
    minLength: 1,
    maxLength: 256
  }),
  description: _configSchema.schema.maybe(_configSchema.schema.string({
    minLength: 0,
    maxLength: 256,
    defaultValue: ''
  })),
  // We only support agnostic entries
  namespaceType: _configSchema.schema.literal('agnostic'),
  // only one OS per entry
  osTypes: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.WINDOWS), _configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.LINUX), _configSchema.schema.literal(_securitysolutionUtils.OperatingSystem.MAC)]), {
    minSize: 1,
    maxSize: 1
  })
},
// Because we are only validating some fields from the Exception Item, we set `unknowns` to `ignore` here
{
  unknowns: 'ignore'
});

/**
 * Provides base methods for doing validation that apply across endpoint exception entries
 */
exports.BasicEndpointExceptionDataSchema = BasicEndpointExceptionDataSchema;
class BaseValidator {
  constructor(endpointAppContext,
  /**
   * Request is optional only because it needs to be optional in the Lists ExceptionListClient
   */
  request) {
    (0, _defineProperty2.default)(this, "endpointAuthzPromise", void 0);
    this.endpointAppContext = endpointAppContext;
    this.request = request;
    if (this.request) {
      this.endpointAuthzPromise = this.endpointAppContext.getEndpointAuthz(this.request);
    } else {
      this.endpointAuthzPromise = Promise.resolve((0, _authz.getEndpointAuthzInitialState)());
    }
  }
  notifyFeatureUsage(item, featureKey) {
    if (this.isItemByPolicy(item) && featureKey.endsWith('_BY_POLICY') || !this.isItemByPolicy(item) && !featureKey.endsWith('_BY_POLICY')) {
      this.endpointAppContext.getFeatureUsageService().notifyUsage(featureKey);
    }
  }
  async validateHasPrivilege(privilege) {
    if (!(await this.endpointAuthzPromise)[privilege]) {
      throw new _errors.EndpointArtifactExceptionValidationError('Endpoint authorization failure', 403);
    }
  }
  isItemByPolicy(item) {
    return (0, _artifacts.isArtifactByPolicy)(item);
  }
  async isAllowedToCreateArtifactsByPolicy() {
    return (await this.endpointAuthzPromise).canCreateArtifactsByPolicy;
  }
  async validateCanManageEndpointArtifacts() {
    if (!(await this.endpointAuthzPromise).canAccessEndpointManagement) {
      throw new _errors.EndpointArtifactExceptionValidationError('Endpoint authorization failure', 403);
    }
  }
  async validateCanIsolateHosts() {
    if (!(await this.endpointAuthzPromise).canIsolateHost) {
      throw new _errors.EndpointArtifactExceptionValidationError('Endpoint authorization failure', 403);
    }
  }

  /**
   * validates some basic common data that can be found across all endpoint exceptions
   * @param item
   * @protected
   */
  async validateBasicData(item) {
    try {
      BasicEndpointExceptionDataSchema.validate(item);
    } catch (error) {
      throw new _errors.EndpointArtifactExceptionValidationError(error.message);
    }
  }
  async validateCanCreateByPolicyArtifacts(item) {
    if (this.isItemByPolicy(item) && !(await this.isAllowedToCreateArtifactsByPolicy())) {
      throw new _errors.EndpointArtifactExceptionValidationError('Your license level does not allow create/update of by policy artifacts', 403);
    }
  }

  /**
   * Validates that by-policy artifacts is permitted and that each policy referenced in the item is valid
   * @protected
   */
  async validateByPolicyItem(item) {
    if (this.isItemByPolicy(item)) {
      const {
        packagePolicy,
        internalReadonlySoClient
      } = this.endpointAppContext.getInternalFleetServices();
      const policyIds = (0, _artifacts.getPolicyIdsFromArtifact)(item);
      if (policyIds.length === 0) {
        return;
      }
      const policiesFromFleet = await packagePolicy.getByIDs(internalReadonlySoClient, policyIds, {
        ignoreMissing: true
      });
      if (!policiesFromFleet) {
        throw new _errors.EndpointArtifactExceptionValidationError(`invalid policy ids: ${policyIds.join(', ')}`);
      }
      const invalidPolicyIds = policyIds.filter(policyId => !policiesFromFleet.some(policy => policyId === policy.id));
      if (invalidPolicyIds.length) {
        throw new _errors.EndpointArtifactExceptionValidationError(`invalid policy ids: ${invalidPolicyIds.join(', ')}`);
      }
    }
  }

  /**
   * If the item being updated is `by policy`, method validates if anyting was changes in regard to
   * the effected scope of the by policy settings.
   *
   * @param updatedItem
   * @param currentItem
   * @protected
   */
  wasByPolicyEffectScopeChanged(updatedItem, currentItem) {
    // if global, then return. Nothing to validate and setting the trusted app to global is allowed
    if (!this.isItemByPolicy(updatedItem)) {
      return false;
    }
    if (updatedItem.tags) {
      return !(0, _fp.isEqual)((0, _artifacts.getPolicyIdsFromArtifact)({
        tags: updatedItem.tags
      }), (0, _artifacts.getPolicyIdsFromArtifact)(currentItem));
    }
    return false;
  }
}
exports.BaseValidator = BaseValidator;