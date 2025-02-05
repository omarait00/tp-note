"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FILEBEAT_7X_INDICATOR_PATH", {
  enumerable: true,
  get: function () {
    return _constants.FILEBEAT_7X_INDICATOR_PATH;
  }
});
exports.getMigrations = getMigrations;
var _semver = require("semver");
var _server = require("../../../../../../src/core/server");
var _common = require("../../../../../../src/plugins/data/common");
var _ = require("./7.10");
var _2 = require("./7.11");
var _3 = require("./7.13");
var _4 = require("./7.14");
var _5 = require("./7.15");
var _6 = require("./7.16");
var _7 = require("./8.0");
var _8 = require("./8.2");
var _9 = require("./8.3");
var _10 = require("./8.4");
var _11 = require("./8.5");
var _12 = require("./8.6");
var _constants = require("./constants");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getMigrations(encryptedSavedObjects, searchSourceMigrations, isPreconfigured) {
  return (0, _server.mergeSavedObjectMigrationMaps)({
    '7.10.0': executeMigrationWithErrorHandling((0, _.getMigrations7100)(encryptedSavedObjects), '7.10.0'),
    '7.11.0': executeMigrationWithErrorHandling((0, _2.getMigrations7110)(encryptedSavedObjects), '7.11.0'),
    '7.11.2': executeMigrationWithErrorHandling((0, _2.getMigrations7112)(encryptedSavedObjects), '7.11.2'),
    '7.13.0': executeMigrationWithErrorHandling((0, _3.getMigrations7130)(encryptedSavedObjects), '7.13.0'),
    '7.14.1': executeMigrationWithErrorHandling((0, _4.getMigrations7140)(encryptedSavedObjects), '7.14.1'),
    '7.15.0': executeMigrationWithErrorHandling((0, _5.getMigrations7150)(encryptedSavedObjects), '7.15.0'),
    '7.16.0': executeMigrationWithErrorHandling((0, _6.getMigrations7160)(encryptedSavedObjects, isPreconfigured), '7.16.0'),
    '8.0.0': executeMigrationWithErrorHandling((0, _7.getMigrations800)(encryptedSavedObjects), '8.0.0'),
    '8.0.1': executeMigrationWithErrorHandling((0, _7.getMigrations801)(encryptedSavedObjects), '8.0.1'),
    '8.2.0': executeMigrationWithErrorHandling((0, _8.getMigrations820)(encryptedSavedObjects), '8.2.0'),
    '8.3.0': executeMigrationWithErrorHandling((0, _9.getMigrations830)(encryptedSavedObjects), '8.3.0'),
    '8.4.1': executeMigrationWithErrorHandling((0, _10.getMigrations841)(encryptedSavedObjects), '8.4.1'),
    '8.5.0': executeMigrationWithErrorHandling((0, _11.getMigrations850)(encryptedSavedObjects), '8.5.0'),
    '8.6.0': executeMigrationWithErrorHandling((0, _12.getMigrations860)(encryptedSavedObjects), '8.6.0')
  }, getSearchSourceMigrations(encryptedSavedObjects, searchSourceMigrations));
}
function executeMigrationWithErrorHandling(migrationFunc, version) {
  return (doc, context) => {
    try {
      return migrationFunc(doc, context);
    } catch (ex) {
      context.log.error(`encryptedSavedObject ${version} migration failed for alert ${doc.id} with error: ${ex.message}`, {
        migrations: {
          alertDocument: doc
        }
      });
      throw ex;
    }
  };
}
function mapSearchSourceMigrationFunc(migrateSerializedSearchSourceFields) {
  return doc => {
    const _doc = doc;
    const serializedSearchSource = _doc.attributes.params.searchConfiguration;
    if ((0, _common.isSerializedSearchSource)(serializedSearchSource)) {
      return {
        ..._doc,
        attributes: {
          ..._doc.attributes,
          params: {
            ..._doc.attributes.params,
            searchConfiguration: migrateSerializedSearchSourceFields(serializedSearchSource)
          }
        }
      };
    }
    return _doc;
  };
}

/**
 * This creates a migration map that applies search source migrations to legacy es query rules.
 * It doesn't modify existing migrations. The following migrations will occur at minimum version of 8.3+.
 */
function getSearchSourceMigrations(encryptedSavedObjects, searchSourceMigrations) {
  const filteredMigrations = {};
  for (const versionKey in searchSourceMigrations) {
    if ((0, _semver.gte)(versionKey, _constants.MINIMUM_SS_MIGRATION_VERSION)) {
      const migrateSearchSource = mapSearchSourceMigrationFunc(searchSourceMigrations[versionKey]);
      filteredMigrations[versionKey] = executeMigrationWithErrorHandling((0, _utils.createEsoMigration)(encryptedSavedObjects, doc => (0, _utils.isEsQueryRuleType)(doc), (0, _utils.pipeMigrations)(migrateSearchSource)), versionKey);
    }
  }
  return filteredMigrations;
}