"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migratePersistableStateAttachments = exports.createUserActionsMigrations = void 0;
var _server = require("../../../../../../../src/core/server");
var _lodash = require("lodash");
var _api = require("../../../../common/api");
var _ = require("..");
var _alerts = require("./alerts");
var _connector_id = require("./connector_id");
var _payload = require("./payload");
var _severity = require("./severity");
var _get_all_persistable_attachment_migrations = require("../get_all_persistable_attachment_migrations");
var _assignees = require("./assignees");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/naming-convention */

const createUserActionsMigrations = deps => {
  const persistableStateAttachmentMigrations = (0, _lodash.mapValues)((0, _get_all_persistable_attachment_migrations.getAllPersistableAttachmentMigrations)(deps.persistableStateAttachmentTypeRegistry), migratePersistableStateAttachments);
  const userActionsMigrations = {
    '7.10.0': doc => {
      const {
        action_field,
        new_value,
        old_value,
        ...restAttributes
      } = doc.attributes;
      if (action_field == null || !Array.isArray(action_field) || action_field[0] !== 'connector_id') {
        return {
          ...doc,
          references: doc.references || []
        };
      }
      return {
        ...doc,
        attributes: {
          ...restAttributes,
          action_field: ['connector'],
          new_value: new_value != null ? JSON.stringify({
            id: new_value,
            name: 'none',
            type: _api.ConnectorTypes.none,
            fields: null
          }) : new_value,
          old_value: old_value != null ? JSON.stringify({
            id: old_value,
            name: 'none',
            type: _api.ConnectorTypes.none,
            fields: null
          }) : old_value
        },
        references: doc.references || []
      };
    },
    '7.14.0': doc => {
      return (0, _.addOwnerToSO)(doc);
    },
    '7.16.0': _connector_id.userActionsConnectorIdMigration,
    '8.0.0': _alerts.removeRuleInformation,
    '8.1.0': _payload.payloadMigration,
    '8.3.0': _severity.addSeverityToCreateUserAction,
    '8.5.0': _assignees.addAssigneesToCreateUserAction
  };
  return (0, _server.mergeSavedObjectMigrationMaps)(persistableStateAttachmentMigrations, userActionsMigrations);
};
exports.createUserActionsMigrations = createUserActionsMigrations;
const migratePersistableStateAttachments = migrate => doc => {
  var _doc$references;
  if (doc.attributes.type !== _api.ActionTypes.comment || doc.attributes.payload.comment.type !== _api.CommentType.persistableState) {
    return doc;
  }
  const {
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  } = doc.attributes.payload.comment;
  const migratedState = migrate({
    persistableStateAttachmentState,
    persistableStateAttachmentTypeId
  });
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      payload: {
        ...doc.attributes.payload,
        comment: {
          ...doc.attributes.payload.comment,
          persistableStateAttachmentState: migratedState.persistableStateAttachmentState
        }
      }
    },
    references: (_doc$references = doc.references) !== null && _doc$references !== void 0 ? _doc$references : []
  };
};
exports.migratePersistableStateAttachments = migratePersistableStateAttachments;