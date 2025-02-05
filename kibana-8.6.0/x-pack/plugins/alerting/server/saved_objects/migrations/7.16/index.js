"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations7160 = void 0;
var _fp = require("lodash/fp");
var _migrations = require("../../geo_containment/migrations");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setLegacyId(doc) {
  const {
    id
  } = doc;
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      legacyId: id
    }
  };
}
function getRemovePreconfiguredConnectorsFromReferencesFn(isPreconfigured) {
  return doc => {
    return removePreconfiguredConnectorsFromReferences(doc, isPreconfigured);
  };
}
function getCorrespondingAction(actions, connectorRef) {
  if (!Array.isArray(actions)) {
    return null;
  } else {
    return actions.find(action => (action === null || action === void 0 ? void 0 : action.actionRef) === connectorRef);
  }
}
function removePreconfiguredConnectorsFromReferences(doc, isPreconfigured) {
  const {
    attributes: {
      actions
    },
    references
  } = doc;

  // Look for connector references
  const connectorReferences = (references !== null && references !== void 0 ? references : []).filter(ref => ref.name.startsWith('action_'));
  if (connectorReferences.length > 0) {
    const restReferences = (references !== null && references !== void 0 ? references : []).filter(ref => !ref.name.startsWith('action_'));
    const updatedConnectorReferences = [];
    const updatedActions = [];

    // For each connector reference, check if connector is preconfigured
    // If yes, we need to remove from the references array and update
    // the corresponding action so it directly references the preconfigured connector id
    connectorReferences.forEach(connectorRef => {
      // Look for the corresponding entry in the actions array
      const correspondingAction = getCorrespondingAction(actions, connectorRef.name);
      if (correspondingAction) {
        if (isPreconfigured(connectorRef.id)) {
          updatedActions.push({
            ...correspondingAction,
            actionRef: `preconfigured:${connectorRef.id}`
          });
        } else {
          updatedActions.push(correspondingAction);
          updatedConnectorReferences.push(connectorRef);
        }
      } else {
        // Couldn't find the matching action, leave as is
        updatedConnectorReferences.push(connectorRef);
      }
    });
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        actions: [...updatedActions]
      },
      references: [...updatedConnectorReferences, ...restReferences]
    };
  }
  return doc;
}

/**
 * This migrates rule_id's within the legacy siem.notification to saved object references on an upgrade.
 * We only migrate if we find these conditions:
 *   - ruleAlertId is a string and not null, undefined, or malformed data.
 *   - The existing references do not already have a ruleAlertId found within it.
 * Some of these issues could crop up during either user manual errors of modifying things, earlier migration
 * issues, etc... so we are safer to check them as possibilities
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @param doc The document that might have "ruleAlertId" to migrate into the references
 * @returns The document migrated with saved object references
 */
function addRuleIdsToLegacyNotificationReferences(doc) {
  const {
    attributes: {
      params: {
        ruleAlertId
      }
    },
    references
  } = doc;
  if (!(0, _utils.isSecuritySolutionLegacyNotification)(doc) || !(0, _fp.isString)(ruleAlertId)) {
    // early return if we are not a string or if we are not a security solution notification saved object.
    return doc;
  } else {
    const existingReferences = references !== null && references !== void 0 ? references : [];
    const existingReferenceFound = existingReferences.find(reference => {
      return reference.id === ruleAlertId && reference.type === 'alert';
    });
    if (existingReferenceFound) {
      // skip this if the references already exists for some uncommon reason so we do not add an additional one.
      return doc;
    } else {
      const savedObjectReference = {
        id: ruleAlertId,
        name: 'param:alert_0',
        type: 'alert'
      };
      const newReferences = [...existingReferences, savedObjectReference];
      return {
        ...doc,
        references: newReferences
      };
    }
  }
}
const getMigrations7160 = (encryptedSavedObjects, isPreconfigured) => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(setLegacyId, getRemovePreconfiguredConnectorsFromReferencesFn(isPreconfigured), addRuleIdsToLegacyNotificationReferences, _migrations.extractRefsFromGeoContainmentAlert));
exports.getMigrations7160 = getMigrations7160;