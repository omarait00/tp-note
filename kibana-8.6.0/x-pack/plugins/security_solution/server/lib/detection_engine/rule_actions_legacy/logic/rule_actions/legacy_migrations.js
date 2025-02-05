"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyRuleActionsSavedObjectMigration = exports.legacyMigrateRuleAlertId = exports.legacyMigrateAlertId = void 0;
var _fp = require("lodash/fp");
var _legacy_utils = require("./legacy_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
function isEmptyObject(obj) {
  for (const attr in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, attr)) {
      return false;
    }
  }
  return true;
}

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyRuleActionsSavedObjectMigration = {
  '7.11.2': doc => {
    const {
      actions
    } = doc.attributes;
    const newActions = actions.reduce((acc, action) => {
      if (['.servicenow', '.jira', '.resilient'].includes(action.action_type_id) && action.params.subAction === 'pushToService') {
        var _incident, _action$params, _action$params$subAct;
        // Future developer, we needed to do that because when we created this migration
        // we forget to think about user already using 7.11.0 and having an incident attribute build the right way
        // IMPORTANT -> if you change this code please do the same inside of this file
        // x-pack/plugins/alerting/server/saved_objects/migrations.ts
        const subActionParamsIncident = (_incident = (_action$params = action.params) === null || _action$params === void 0 ? void 0 : (_action$params$subAct = _action$params.subActionParams) === null || _action$params$subAct === void 0 ? void 0 : _action$params$subAct.incident) !== null && _incident !== void 0 ? _incident : null;
        if (subActionParamsIncident != null && !isEmptyObject(subActionParamsIncident)) {
          return [...acc, action];
        }
        if (action.action_type_id === '.servicenow') {
          const {
            title,
            comments,
            comment,
            description,
            severity,
            urgency,
            impact,
            short_description: shortDescription
          } = action.params.subActionParams;
          return [...acc, {
            ...action,
            params: {
              subAction: 'pushToService',
              subActionParams: {
                incident: {
                  short_description: shortDescription !== null && shortDescription !== void 0 ? shortDescription : title,
                  description,
                  severity,
                  urgency,
                  impact
                },
                comments: [...(comments !== null && comments !== void 0 ? comments : []), ...(comment != null ? [{
                  commentId: '1',
                  comment
                }] : [])]
              }
            }
          }];
        } else if (action.action_type_id === '.jira') {
          const {
            title,
            comments,
            description,
            issueType,
            priority,
            labels,
            parent,
            summary
          } = action.params.subActionParams;
          return [...acc, {
            ...action,
            params: {
              subAction: 'pushToService',
              subActionParams: {
                incident: {
                  summary: summary !== null && summary !== void 0 ? summary : title,
                  description,
                  issueType,
                  priority,
                  labels,
                  parent
                },
                comments
              }
            }
          }];
        } else if (action.action_type_id === '.resilient') {
          const {
            title,
            comments,
            description,
            incidentTypes,
            severityCode,
            name
          } = action.params.subActionParams;
          return [...acc, {
            ...action,
            params: {
              subAction: 'pushToService',
              subActionParams: {
                incident: {
                  name: name !== null && name !== void 0 ? name : title,
                  description,
                  incidentTypes,
                  severityCode
                },
                comments
              }
            }
          }];
        }
      }
      return [...acc, action];
    }, []);
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        actions: newActions
      },
      references: doc.references || []
    };
  },
  '7.16.0': doc => {
    return legacyMigrateRuleAlertId(doc);
  }
};

/**
 * This migrates rule_id's and actions within the legacy siem.notification to saved object references on an upgrade.
 * We only migrate rule_id if we find these conditions:
 *   - ruleAlertId is a string and not null, undefined, or malformed data.
 *   - The existing references do not already have a ruleAlertId found within it.
 * We only migrate the actions if we find these conditions:
 *   - The actions exists and is an array.
 * Some of these issues could crop up during either user manual errors of modifying things, earlier migration
 * issues, etc... so we are safer to check them as possibilities
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @param doc The document that might have ruleId's to migrate into the references
 * @returns The document migrated with saved object references
 */
exports.legacyRuleActionsSavedObjectMigration = legacyRuleActionsSavedObjectMigration;
const legacyMigrateRuleAlertId = doc => {
  const {
    attributes: {
      actions
    },
    references
  } = doc;
  // remove the ruleAlertId from the doc
  const {
    ruleAlertId,
    ...attributesWithoutRuleAlertId
  } = doc.attributes;
  const existingReferences = references !== null && references !== void 0 ? references : [];
  if (!(0, _fp.isString)(ruleAlertId) || !Array.isArray(actions)) {
    // early return if we are not a string or if we are not a security solution notification saved object.
    return {
      ...doc,
      references: existingReferences
    };
  } else {
    const alertReferences = legacyMigrateAlertId({
      ruleAlertId,
      existingReferences
    });

    // we use flat map here to be "idempotent" and skip it if it has already been migrated for any particular reason
    const actionsReferences = actions.flatMap((action, index) => {
      if (existingReferences.find(reference => {
        return (
          // we as cast it to the pre-7.16 version to get the old id from it
          action.id === reference.id && reference.type === 'action'
        );
      })) {
        return [];
      }
      return [
      // we as cast it to the pre-7.16 version to get the old id from it
      (0, _legacy_utils.legacyGetActionReference)(action.id, index)];
    });
    const actionsWithRef = actions.map((action, index) =>
    // we as cast it to the pre-7.16 version to pass it to get the actions with ref.
    (0, _legacy_utils.legacyTransformLegacyRuleAlertActionToReference)(action, index));
    return {
      ...doc,
      attributes: {
        ...attributesWithoutRuleAlertId,
        actions: actionsWithRef
      },
      references: [...existingReferences, ...alertReferences, ...actionsReferences]
    };
  }
};

/**
 * This is a helper to migrate "ruleAlertId"
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 * @param existingReferences The existing saved object references
 * @param ruleAlertId The ruleAlertId to migrate
 * @returns The savedObjectReferences migrated
 */
exports.legacyMigrateRuleAlertId = legacyMigrateRuleAlertId;
const legacyMigrateAlertId = ({
  existingReferences,
  ruleAlertId
}) => {
  const existingReferenceFound = existingReferences.find(reference => {
    return reference.id === ruleAlertId && reference.type === 'alert';
  });
  if (existingReferenceFound) {
    return [];
  } else {
    return [(0, _legacy_utils.legacyGetRuleReference)(ruleAlertId)];
  }
};
exports.legacyMigrateAlertId = legacyMigrateAlertId;