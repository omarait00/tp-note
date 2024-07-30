"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMapsFilterMigrations = exports.getMapsDataViewMigrations = void 0;
exports.setupSavedObjects = setupSavedObjects;
var _lodash = require("lodash");
var _server = require("../../../../../src/core/server");
var _constants = require("../../common/constants");
var _migrate_data_persisted_state = require("../../common/migrations/migrate_data_persisted_state");
var _migrate_data_view_persisted_state = require("../../common/migrations/migrate_data_view_persisted_state");
var _saved_object_migrations = require("./saved_object_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupSavedObjects(core, getFilterMigrations, getDataViewMigrations) {
  core.savedObjects.registerType({
    name: 'map',
    hidden: false,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    mappings: {
      properties: {
        description: {
          type: 'text'
        },
        title: {
          type: 'text'
        },
        version: {
          type: 'integer'
        },
        mapStateJSON: {
          type: 'text'
        },
        layerListJSON: {
          type: 'text'
        },
        uiStateJSON: {
          type: 'text'
        },
        bounds: {
          dynamic: false,
          properties: {}
        } // Disable removed field
      }
    },

    management: {
      icon: _constants.APP_ICON,
      defaultSearchField: 'title',
      importableAndExportable: true,
      getTitle(obj) {
        return obj.attributes.title;
      },
      getInAppUrl(obj) {
        return {
          path: (0, _constants.getFullPath)(obj.id),
          uiCapabilitiesPath: 'maps.show'
        };
      }
    },
    migrations: () => {
      return (0, _server.mergeSavedObjectMigrationMaps)((0, _server.mergeSavedObjectMigrationMaps)(_saved_object_migrations.savedObjectMigrations, getMapsFilterMigrations(getFilterMigrations())), getMapsDataViewMigrations(getDataViewMigrations()));
    }
  });

  /*
   * The maps-telemetry saved object type isn't used, but in order to remove these fields from
   * the mappings we register this type with `type: 'object', enabled: true` to remove all
   * previous fields from the mappings until https://github.com/elastic/kibana/issues/67086 is
   * solved.
   */
  core.savedObjects.registerType({
    name: 'maps-telemetry',
    hidden: false,
    namespaceType: 'agnostic',
    mappings: {
      // @ts-ignore Core types don't support this since it's only really valid when removing a previously registered type
      type: 'object',
      enabled: false
    }
  });
}

/**
 * This creates a migration map that applies external data plugin migrations to persisted filter state stored in Maps
 */
const getMapsFilterMigrations = filterMigrations => (0, _lodash.mapValues)(filterMigrations, filterMigration => doc => {
  try {
    const attributes = (0, _migrate_data_persisted_state.migrateDataPersistedState)(doc, filterMigration);
    return {
      ...doc,
      attributes
    };
  } catch (e) {
    // Do not fail migration
    // Maps application can display error when saved object is viewed
    return doc;
  }
});

/**
 * This creates a migration map that applies external data view plugin migrations to persisted data view state stored in Maps
 */
exports.getMapsFilterMigrations = getMapsFilterMigrations;
const getMapsDataViewMigrations = migrations => (0, _lodash.mapValues)(migrations, migration => doc => {
  try {
    const attributes = (0, _migrate_data_view_persisted_state.migrateDataViewsPersistedState)(doc, migration);
    return {
      ...doc,
      attributes
    };
  } catch (e) {
    // Do not fail migration
    // Maps application can display error when saved object is viewed
    return doc;
  }
});
exports.getMapsDataViewMigrations = getMapsDataViewMigrations;