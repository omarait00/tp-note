"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEsoMigration = createEsoMigration;
exports.isSiemSignalsRuleType = exports.isSecuritySolutionLegacyNotification = exports.isEsQueryRuleType = exports.isDetectionEngineAADRuleType = void 0;
exports.pipeMigrations = pipeMigrations;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createEsoMigration(encryptedSavedObjects, isMigrationNeededPredicate, migrationFunc) {
  return encryptedSavedObjects.createMigration({
    isMigrationNeededPredicate,
    migration: migrationFunc,
    shouldMigrateIfDecryptionFails: true // shouldMigrateIfDecryptionFails flag that applies the migration to undecrypted document if decryption fails
  });
}

function pipeMigrations(...migrations) {
  return (doc, context) => migrations.reduce((migratedDoc, nextMigration) => nextMigration(migratedDoc, context), doc);
}

// Deprecated in 8.0
const isSiemSignalsRuleType = doc => doc.attributes.alertTypeId === 'siem.signals';
exports.isSiemSignalsRuleType = isSiemSignalsRuleType;
const isEsQueryRuleType = doc => doc.attributes.alertTypeId === '.es-query';
exports.isEsQueryRuleType = isEsQueryRuleType;
const isDetectionEngineAADRuleType = doc => Object.values(_securitysolutionRules.ruleTypeMappings).includes(doc.attributes.alertTypeId);

/**
 * Returns true if the alert type is that of "siem.notifications" which is a legacy notification system that was deprecated in 7.16.0
 * in favor of using the newer alerting notifications system.
 * @param doc The saved object alert type document
 * @returns true if this is a legacy "siem.notifications" rule, otherwise false
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
exports.isDetectionEngineAADRuleType = isDetectionEngineAADRuleType;
const isSecuritySolutionLegacyNotification = doc => doc.attributes.alertTypeId === 'siem.notifications';
exports.isSecuritySolutionLegacyNotification = isSecuritySolutionLegacyNotification;