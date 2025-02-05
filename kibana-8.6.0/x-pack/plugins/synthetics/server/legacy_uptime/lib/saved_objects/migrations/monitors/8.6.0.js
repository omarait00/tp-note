"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migration860 = void 0;
var _runtime_types = require("../../../../../../common/runtime_types");
var _synthetics_monitor = require("../../synthetics_monitor");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migration860 = encryptedSavedObjects => {
  return encryptedSavedObjects.createMigration({
    isMigrationNeededPredicate: function shouldBeMigrated(doc) {
      return true;
    },
    migration: doc => {
      const {
        attributes,
        id
      } = doc;
      return {
        ...doc,
        attributes: {
          ...attributes,
          [_runtime_types.ConfigKey.MONITOR_QUERY_ID]: attributes[_runtime_types.ConfigKey.CUSTOM_HEARTBEAT_ID] || id,
          [_runtime_types.ConfigKey.CONFIG_ID]: id
        }
      };
    },
    migratedType: _synthetics_monitor.SYNTHETICS_MONITOR_ENCRYPTED_TYPE
  });
};
exports.migration860 = migration860;