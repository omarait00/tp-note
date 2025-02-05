"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Authorization = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _utils = require("./utils");
var _ = require(".");
var _error = require("../common/error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This class handles ensuring that the user making a request has the correct permissions
 * for the API request.
 */
class Authorization {
  constructor({
    request,
    securityAuth,
    caseOwners,
    auditLogger
  }) {
    (0, _defineProperty2.default)(this, "request", void 0);
    (0, _defineProperty2.default)(this, "securityAuth", void 0);
    (0, _defineProperty2.default)(this, "featureCaseOwners", void 0);
    (0, _defineProperty2.default)(this, "auditLogger", void 0);
    this.request = request;
    this.securityAuth = securityAuth;
    this.featureCaseOwners = caseOwners;
    this.auditLogger = auditLogger;
  }

  /**
   * Creates an Authorization object.
   */
  static async create({
    request,
    securityAuth,
    spaces,
    features,
    auditLogger,
    logger
  }) {
    const getSpace = async () => {
      return spaces.spacesService.getActiveSpace(request);
    };

    // Since we need to do async operations, this static method handles that before creating the Auth class
    let caseOwners;
    try {
      var _await$getSpace$disab;
      const disabledFeatures = new Set((_await$getSpace$disab = (await getSpace()).disabledFeatures) !== null && _await$getSpace$disab !== void 0 ? _await$getSpace$disab : []);
      caseOwners = new Set(features.getKibanaFeatures()
      // get all the features' cases owners that aren't disabled
      .filter(({
        id
      }) => !disabledFeatures.has(id)).flatMap(feature => {
        var _feature$cases;
        return (_feature$cases = feature.cases) !== null && _feature$cases !== void 0 ? _feature$cases : [];
      }));
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to create Authorization class: ${error}`,
        error,
        logger
      });
    }
    return new Authorization({
      request,
      securityAuth,
      caseOwners,
      auditLogger
    });
  }
  shouldCheckAuthorization() {
    var _this$securityAuth$mo, _this$securityAuth, _this$securityAuth$mo2;
    return (_this$securityAuth$mo = (_this$securityAuth = this.securityAuth) === null || _this$securityAuth === void 0 ? void 0 : (_this$securityAuth$mo2 = _this$securityAuth.mode) === null || _this$securityAuth$mo2 === void 0 ? void 0 : _this$securityAuth$mo2.useRbacForRequest(this.request)) !== null && _this$securityAuth$mo !== void 0 ? _this$securityAuth$mo : false;
  }

  /**
   * Checks that the user making the request for the passed in owner, saved object, and operation has the correct authorization. This
   * function will throw if the user is not authorized for the requested operation and owners.
   *
   * @param entities an array of entities describing the case owners in conjunction with the saved object ID attempting
   *  to be authorized
   * @param operation information describing the operation attempting to be authorized
   */
  async ensureAuthorized({
    entities,
    operation
  }) {
    const logSavedObjects = error => {
      for (const entity of entities) {
        this.auditLogger.log({
          operation,
          error,
          entity
        });
      }
    };
    try {
      await this._ensureAuthorized(entities.map(entity => entity.owner), operation);
    } catch (error) {
      logSavedObjects(error);
      throw error;
    }
    logSavedObjects();
  }

  /**
   * Returns an object to filter the saved object find request to the authorized owners of an entity.
   */
  async getAuthorizationFilter(operation) {
    try {
      return await this._getAuthorizationFilter(operation);
    } catch (error) {
      this.auditLogger.log({
        error,
        operation
      });
      throw error;
    }
  }
  async _ensureAuthorized(owners, operation) {
    const {
      securityAuth
    } = this;
    const areAllOwnersAvailable = owners.every(owner => this.featureCaseOwners.has(owner));
    if (securityAuth && this.shouldCheckAuthorization()) {
      const requiredPrivileges = owners.map(owner => securityAuth.actions.cases.get(owner, operation.name));
      const checkPrivileges = securityAuth.checkPrivilegesDynamicallyWithRequest(this.request);
      const {
        hasAllRequested
      } = await checkPrivileges({
        kibana: requiredPrivileges
      });
      if (!areAllOwnersAvailable) {
        /**
         * Under most circumstances this would have been caught by `checkPrivileges` as
         * a user can't have Privileges to an unknown owner, but super users
         * don't actually get "privilege checked" so the made up owner *will* return
         * as Privileged.
         * This check will ensure we don't accidentally let these through
         */
        throw _boom.default.forbidden(_.AuthorizationAuditLogger.createFailureMessage({
          owners,
          operation
        }));
      }
      if (!hasAllRequested) {
        throw _boom.default.forbidden(_.AuthorizationAuditLogger.createFailureMessage({
          owners,
          operation
        }));
      }
    } else if (!areAllOwnersAvailable) {
      throw _boom.default.forbidden(_.AuthorizationAuditLogger.createFailureMessage({
        owners,
        operation
      }));
    }

    // else security is disabled so let the operation proceed
  }

  async _getAuthorizationFilter(operation) {
    const {
      securityAuth
    } = this;
    if (securityAuth && this.shouldCheckAuthorization()) {
      const {
        authorizedOwners
      } = await this.getAuthorizedOwners([operation]);
      if (!authorizedOwners.length) {
        throw _boom.default.forbidden(_.AuthorizationAuditLogger.createFailureMessage({
          owners: authorizedOwners,
          operation
        }));
      }
      return {
        filter: (0, _utils.getOwnersFilter)(operation.savedObjectType, authorizedOwners),
        ensureSavedObjectsAreAuthorized: entities => {
          for (const entity of entities) {
            if (!authorizedOwners.includes(entity.owner)) {
              const error = _boom.default.forbidden(_.AuthorizationAuditLogger.createFailureMessage({
                operation,
                owners: [entity.owner]
              }));
              this.auditLogger.log({
                error,
                operation,
                entity
              });
              throw error;
            }
            this.auditLogger.log({
              operation,
              entity
            });
          }
        }
      };
    }
    return {
      ensureSavedObjectsAreAuthorized: entities => {}
    };
  }
  async getAuthorizedOwners(operations) {
    const {
      securityAuth,
      featureCaseOwners
    } = this;
    if (securityAuth && this.shouldCheckAuthorization()) {
      const checkPrivileges = securityAuth.checkPrivilegesDynamicallyWithRequest(this.request);
      const requiredPrivileges = new Map();
      for (const owner of featureCaseOwners) {
        for (const operation of operations) {
          requiredPrivileges.set(securityAuth.actions.cases.get(owner, operation.name), owner);
        }
      }
      const {
        hasAllRequested,
        username,
        privileges
      } = await checkPrivileges({
        kibana: [...requiredPrivileges.keys()]
      });
      return {
        hasAllRequested,
        username,
        authorizedOwners: hasAllRequested ? Array.from(featureCaseOwners) : privileges.kibana.reduce((authorizedOwners, {
          authorized,
          privilege
        }) => {
          if (authorized && requiredPrivileges.has(privilege)) {
            const owner = requiredPrivileges.get(privilege);
            if (owner) {
              authorizedOwners.push(owner);
            }
          }
          return authorizedOwners;
        }, [])
      };
    } else {
      return {
        hasAllRequested: true,
        authorizedOwners: Array.from(featureCaseOwners)
      };
    }
  }
}
exports.Authorization = Authorization;