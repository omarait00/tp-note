"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ensureAuthorized = ensureAuthorized;
exports.getEnsureAuthorizedActionResult = getEnsureAuthorizedActionResult;
exports.isAuthorizedForObjectInAllSpaces = isAuthorizedForObjectInAllSpaces;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Checks to ensure a user is authorized to access object types in given spaces.
 *
 * @param {EnsureAuthorizedDependencies} deps the dependencies needed to make the privilege checks.
 * @param {string[]} types the type(s) to check privileges for.
 * @param {T[]} actions the action(s) to check privileges for.
 * @param {string[]} spaceIds the id(s) of spaces to check privileges for.
 * @param {EnsureAuthorizedOptions} options the options to use.
 */
async function ensureAuthorized(deps, types, actions, spaceIds, options = {}) {
  const {
    requireFullAuthorization = true
  } = options;
  const privilegeActionsMap = new Map(types.flatMap(type => actions.map(action => [deps.actions.savedObject.get(type, action), {
    type,
    action
  }])));
  const privilegeActions = Array.from(privilegeActionsMap.keys());
  const {
    hasAllRequested,
    privileges
  } = await checkPrivileges(deps, privilegeActions, spaceIds);
  const missingPrivileges = getMissingPrivileges(privileges);
  const typeActionMap = privileges.kibana.reduce((acc, {
    resource,
    privilege
  }) => {
    var _missingPrivileges$ge, _missingPrivileges$ge2, _acc$get, _actionAuthorizations;
    const missingPrivilegesAtResource = resource && ((_missingPrivileges$ge = missingPrivileges.get(resource)) === null || _missingPrivileges$ge === void 0 ? void 0 : _missingPrivileges$ge.has(privilege)) || !resource && ((_missingPrivileges$ge2 = missingPrivileges.get(undefined)) === null || _missingPrivileges$ge2 === void 0 ? void 0 : _missingPrivileges$ge2.has(privilege));
    if (missingPrivilegesAtResource) {
      return acc;
    }
    const {
      type,
      action
    } = privilegeActionsMap.get(privilege); // always defined
    const actionAuthorizations = (_acc$get = acc.get(type)) !== null && _acc$get !== void 0 ? _acc$get : {};
    const authorization = (_actionAuthorizations = actionAuthorizations[action]) !== null && _actionAuthorizations !== void 0 ? _actionAuthorizations : {
      authorizedSpaces: []
    };
    if (resource === undefined) {
      return acc.set(type, {
        ...actionAuthorizations,
        [action]: {
          ...authorization,
          isGloballyAuthorized: true
        }
      });
    }
    return acc.set(type, {
      ...actionAuthorizations,
      [action]: {
        ...authorization,
        authorizedSpaces: authorization.authorizedSpaces.concat(resource)
      }
    });
  }, new Map());
  if (hasAllRequested) {
    return {
      typeActionMap,
      status: 'fully_authorized'
    };
  }
  if (!requireFullAuthorization) {
    const isPartiallyAuthorized = typeActionMap.size > 0;
    if (isPartiallyAuthorized) {
      return {
        typeActionMap,
        status: 'partially_authorized'
      };
    } else {
      return {
        typeActionMap,
        status: 'unauthorized'
      };
    }
  }

  // Neither fully nor partially authorized. Bail with error.
  const uniqueUnauthorizedPrivileges = [...missingPrivileges.entries()].reduce((acc, [, privilegeSet]) => new Set([...acc, ...privilegeSet]), new Set());
  const targetTypesAndActions = [...uniqueUnauthorizedPrivileges].map(privilege => {
    const {
      type,
      action
    } = privilegeActionsMap.get(privilege);
    return `(${action} ${type})`;
  }).sort().join(',');
  const msg = `Unable to ${targetTypesAndActions}`;
  throw deps.errors.decorateForbiddenError(new Error(msg));
}

/**
 * Helper function that, given an `EnsureAuthorizedResult`, checks to see what spaces the user is authorized to perform a given action for
 * the given object type.
 *
 * @param {string} objectType the object type to check.
 * @param {T} action the action to check.
 * @param {EnsureAuthorizedResult<T>['typeActionMap']} typeActionMap the typeActionMap from an EnsureAuthorizedResult.
 */
function getEnsureAuthorizedActionResult(objectType, action, typeActionMap) {
  var _typeActionMap$get, _record$action;
  const record = (_typeActionMap$get = typeActionMap.get(objectType)) !== null && _typeActionMap$get !== void 0 ? _typeActionMap$get : {};
  return (_record$action = record[action]) !== null && _record$action !== void 0 ? _record$action : {
    authorizedSpaces: []
  };
}

/**
 * Helper function that, given an `EnsureAuthorizedResult`, ensures that the user is authorized to perform a given action for the given
 * object type in the given spaces.
 *
 * @param {string} objectType the object type to check.
 * @param {T} action the action to check.
 * @param {EnsureAuthorizedResult<T>['typeActionMap']} typeActionMap the typeActionMap from an EnsureAuthorizedResult.
 * @param {string[]} spacesToAuthorizeFor the spaces to check.
 */
function isAuthorizedForObjectInAllSpaces(objectType, action, typeActionMap, spacesToAuthorizeFor) {
  const actionResult = getEnsureAuthorizedActionResult(objectType, action, typeActionMap);
  const {
    authorizedSpaces,
    isGloballyAuthorized
  } = actionResult;
  const authorizedSpacesSet = new Set(authorizedSpaces);
  return isGloballyAuthorized || spacesToAuthorizeFor.every(space => authorizedSpacesSet.has(space));
}
async function checkPrivileges(deps, actions, namespaceOrNamespaces) {
  try {
    return await deps.checkSavedObjectsPrivilegesAsCurrentUser(actions, namespaceOrNamespaces);
  } catch (error) {
    throw deps.errors.decorateGeneralError(error, error.body && error.body.reason);
  }
}
function getMissingPrivileges(privileges) {
  return privileges.kibana.reduce((acc, {
    resource,
    privilege,
    authorized
  }) => {
    if (!authorized) {
      if (resource) {
        acc.set(resource, (acc.get(resource) || new Set()).add(privilege));
      }
      // Fail-secure: if a user is not authorized for a specific resource, they are not authorized for the global resource too (global resource is undefined)
      // The inverse is not true; if a user is not authorized for the global resource, they may still be authorized for a specific resource
      acc.set(undefined, (acc.get(undefined) || new Set()).add(privilege));
    }
    return acc;
  }, new Map());
}