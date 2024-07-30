"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupSavedObjects = setupSavedObjects;
var _common = require("../../../../src/plugins/data_views/common");
var _common2 = require("../common");
var _saved_object_migrations = require("./migrations/saved_object_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function setupSavedObjects(core, getFilterMigrations, customVisualizationMigrations) {
  core.savedObjects.registerType({
    name: 'lens',
    hidden: false,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    management: {
      icon: 'lensApp',
      defaultSearchField: 'title',
      importableAndExportable: true,
      getTitle: obj => obj.attributes.title,
      getInAppUrl: obj => ({
        path: `/app/lens${(0, _common2.getEditPath)(obj.id)}`,
        uiCapabilitiesPath: 'visualize.show'
      })
    },
    migrations: () => (0, _saved_object_migrations.getAllMigrations)(getFilterMigrations(), _common.DataViewPersistableStateService.getAllMigrations(), customVisualizationMigrations),
    mappings: {
      properties: {
        title: {
          type: 'text'
        },
        description: {
          type: 'text'
        },
        visualizationType: {
          type: 'keyword'
        },
        state: {
          type: 'flattened'
        },
        expression: {
          index: false,
          doc_values: false,
          type: 'keyword'
        }
      }
    }
  });
  core.savedObjects.registerType({
    name: 'lens-ui-telemetry',
    hidden: false,
    namespaceType: 'single',
    mappings: {
      properties: {
        name: {
          type: 'keyword'
        },
        type: {
          type: 'keyword'
        },
        date: {
          type: 'date'
        },
        count: {
          type: 'integer'
        }
      }
    }
  });
}