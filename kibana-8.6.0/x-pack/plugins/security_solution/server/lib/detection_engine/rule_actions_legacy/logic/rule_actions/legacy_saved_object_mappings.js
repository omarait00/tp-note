"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyType = exports.legacyRuleActionsSavedObjectType = void 0;
var _legacy_migrations = require("./legacy_migrations");
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
const legacyRuleActionsSavedObjectType = 'siem-detection-engine-rule-actions';

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.legacyRuleActionsSavedObjectType = legacyRuleActionsSavedObjectType;
const legacyRuleActionsSavedObjectMappings = {
  properties: {
    alertThrottle: {
      type: 'keyword'
    },
    ruleAlertId: {
      type: 'keyword'
    },
    ruleThrottle: {
      type: 'keyword'
    },
    actions: {
      properties: {
        actionRef: {
          type: 'keyword'
        },
        group: {
          type: 'keyword'
        },
        id: {
          // "actions.id" is no longer used since the saved object references and "actionRef" was introduced. It is still here for legacy reasons such as migrations.
          type: 'keyword'
        },
        action_type_id: {
          type: 'keyword'
        },
        params: {
          type: 'object',
          enabled: false
        }
      }
    }
  }
};

/**
 * We keep this around to migrate and update data for the old deprecated rule actions saved object mapping but we
 * do not use it anymore within the code base. Once we feel comfortable that users are upgrade far enough and this is no longer
 * needed then it will be safe to remove this saved object and all its migrations.
 * @deprecated Remove this once we no longer need legacy migrations for rule actions (8.0.0)
 */
const legacyType = {
  convertToMultiNamespaceTypeVersion: '8.0.0',
  name: legacyRuleActionsSavedObjectType,
  hidden: false,
  namespaceType: 'multiple-isolated',
  mappings: legacyRuleActionsSavedObjectMappings,
  migrations: _legacy_migrations.legacyRuleActionsSavedObjectMigration
};
exports.legacyType = legacyType;