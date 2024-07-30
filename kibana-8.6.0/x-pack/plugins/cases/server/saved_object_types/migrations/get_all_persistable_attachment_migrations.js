"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllPersistableAttachmentMigrations = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMigrateFunction = persistableStateAttachmentTypeRegistry => {
  const migrateFn = (state, version) => {
    let output = {
      ...state
    };
    if (!persistableStateAttachmentTypeRegistry.has(state.persistableStateAttachmentTypeId)) {
      return output;
    }
    const attachment = persistableStateAttachmentTypeRegistry.get(state.persistableStateAttachmentTypeId);
    const migrations = attachment.migrations;
    const attachmentMigrations = typeof migrations === 'function' ? migrations() : migrations;
    if (attachmentMigrations[version]) {
      output = attachmentMigrations[version](state);
    }
    return output;
  };
  return migrateFn;
};
const getAllPersistableAttachmentMigrations = persistableStateAttachmentTypeRegistry => {
  const migrateFn = getMigrateFunction(persistableStateAttachmentTypeRegistry);
  const uniqueVersions = new Set();
  for (const attachment of persistableStateAttachmentTypeRegistry.list()) {
    const migrations = attachment.migrations;
    const attachmentMigrations = typeof migrations === 'function' ? migrations() : migrations;
    Object.keys(attachmentMigrations).forEach(version => uniqueVersions.add(version));
  }
  const migrations = {};
  uniqueVersions.forEach(version => {
    migrations[version] = state => ({
      ...migrateFn(state, version)
    });
  });
  return migrations;
};
exports.getAllPersistableAttachmentMigrations = getAllPersistableAttachmentMigrations;