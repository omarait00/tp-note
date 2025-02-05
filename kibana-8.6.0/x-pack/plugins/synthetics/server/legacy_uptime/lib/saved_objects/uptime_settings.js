"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.umDynamicSettings = exports.settingsObjectType = exports.settingsObjectId = void 0;
var _i18n = require("@kbn/i18n");
var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const settingsObjectType = 'uptime-dynamic-settings';
exports.settingsObjectType = settingsObjectType;
const settingsObjectId = 'uptime-dynamic-settings-singleton';
exports.settingsObjectId = settingsObjectId;
const umDynamicSettings = {
  name: settingsObjectType,
  hidden: false,
  namespaceType: 'single',
  mappings: {
    dynamic: false,
    properties: {
      /* Leaving these commented to make it clear that these fields exist, even though we don't want them indexed.
         When adding new fields please add them here. If they need to be searchable put them in the uncommented
         part of properties.
      heartbeatIndices: {
        type: 'keyword',
      },
      certAgeThreshold: {
        type: 'long',
      },
      certExpirationThreshold: {
        type: 'long',
      },
      defaultConnectors: {
        type: 'keyword',
      },
      */
    }
  },
  management: {
    importableAndExportable: true,
    icon: 'uptimeApp',
    getTitle: () => _i18n.i18n.translate('xpack.synthetics.uptimeSettings.index', {
      defaultMessage: 'Uptime Settings - Index'
    })
  },
  migrations: {
    // Takes a pre 8.2.0 doc, and converts it to 8.2.0
    '8.2.0': _migrations.add820Indices
  }
};
exports.umDynamicSettings = umDynamicSettings;