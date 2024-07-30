"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserProfileService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../common/api");
var _authorization = require("../../authorization");
var _error = require("../../common/error");
var _licensing = require("../licensing");
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_PROFILES_SIZE = 100;
const MIN_PROFILES_SIZE = 0;
class UserProfileService {
  constructor(logger) {
    (0, _defineProperty2.default)(this, "options", void 0);
    this.logger = logger;
  }
  initialize(options) {
    if (this.options !== undefined) {
      throw new Error('UserProfileService was already initialized');
    }
    this.options = options;
  }
  static suggestUsers({
    securityPluginStart,
    spaceId,
    searchTerm,
    size,
    owners
  }) {
    return securityPluginStart.userProfiles.suggest({
      name: searchTerm,
      size,
      dataPath: 'avatar',
      requiredPrivileges: {
        spaceId,
        privileges: {
          kibana: UserProfileService.buildRequiredPrivileges(owners, securityPluginStart)
        }
      }
    });
  }
  async suggest(request) {
    const params = (0, _pipeable.pipe)((0, _api.excess)(_api.SuggestUserProfilesRequestRt).decode(request.body), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
    const {
      name,
      size,
      owners
    } = params;
    try {
      this.validateInitialization();
      const licensingService = new _licensing.LicensingService(this.options.licensingPluginStart.license$, this.options.licensingPluginStart.featureUsage.notifyUsage);
      const hasPlatinumLicenseOrGreater = await licensingService.isAtLeastPlatinum();
      if (!hasPlatinumLicenseOrGreater) {
        throw _boom.default.forbidden('In order to retrieve suggested user profiles, you must be subscribed to an Elastic Platinum license');
      }
      licensingService.notifyUsage(_constants.LICENSING_CASE_ASSIGNMENT_FEATURE);
      const {
        spaces
      } = this.options;
      UserProfileService.validateSizeParam(size);
      if (!this.isSecurityEnabled() || owners.length <= 0) {
        return [];
      }
      return UserProfileService.suggestUsers({
        searchTerm: name,
        size,
        owners,
        securityPluginStart: this.options.securityPluginStart,
        spaceId: spaces.spacesService.getSpaceId(request)
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        logger: this.logger,
        message: `Failed to retrieve suggested user profiles in service for name: ${name} owners: [${owners}]: ${error}`,
        error
      });
    }
  }
  validateInitialization() {
    if (this.options == null) {
      throw new Error('UserProfileService must be initialized before calling suggest');
    }
  }
  static validateSizeParam(size) {
    /**
     * The limit of 100 helps prevent DDoS attacks and is also enforced by the security plugin.
     */
    if (size !== undefined && (size > MAX_PROFILES_SIZE || size < MIN_PROFILES_SIZE)) {
      throw _boom.default.badRequest('size must be between 0 and 100');
    }
  }
  isSecurityEnabled() {
    this.validateInitialization();
    return this.options.securityPluginSetup.license.isEnabled();
  }

  /**
   * This function constructs the privileges required for a user to be assigned to a case. We're requiring the ability
   * to read and update a case saved object. My thought process was that a user should at a minimum be able to read it
   * and change its status to close it. This is does not require that the user have access to comments or various other
   * privileges around the other entities within cases. If we move to a more granular object level permissions we'll
   * likely need to expand this to include the privileges for the other entities as well.
   */
  static buildRequiredPrivileges(owners, security) {
    const privileges = [];
    for (const owner of owners) {
      for (const operation of [_authorization.Operations.updateCase.name, _authorization.Operations.getCase.name]) {
        privileges.push(security.authz.actions.cases.get(owner, operation));
      }
    }
    return privileges;
  }
}
exports.UserProfileService = UserProfileService;