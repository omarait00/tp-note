"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSavedSearchObjectType = getSavedSearchObjectType;
var _search_migrations = require("./search_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function getSavedSearchObjectType(getSearchSourceMigrations) {
  return {
    name: 'search',
    hidden: false,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    management: {
      icon: 'discoverApp',
      defaultSearchField: 'title',
      importableAndExportable: true,
      getTitle(obj) {
        return obj.attributes.title;
      },
      getInAppUrl(obj) {
        return {
          path: `/app/discover#/view/${encodeURIComponent(obj.id)}`,
          uiCapabilitiesPath: 'discover.show'
        };
      }
    },
    mappings: {
      properties: {
        columns: {
          type: 'keyword',
          index: false,
          doc_values: false
        },
        description: {
          type: 'text'
        },
        viewMode: {
          type: 'keyword',
          index: false,
          doc_values: false
        },
        hideChart: {
          type: 'boolean',
          index: false,
          doc_values: false
        },
        isTextBasedQuery: {
          type: 'boolean',
          index: false,
          doc_values: false
        },
        usesAdHocDataView: {
          type: 'boolean',
          index: false,
          doc_values: false
        },
        hideAggregatedPreview: {
          type: 'boolean',
          index: false,
          doc_values: false
        },
        hits: {
          type: 'integer',
          index: false,
          doc_values: false
        },
        kibanaSavedObjectMeta: {
          properties: {
            searchSourceJSON: {
              type: 'text',
              index: false
            }
          }
        },
        sort: {
          type: 'keyword',
          index: false,
          doc_values: false
        },
        title: {
          type: 'text'
        },
        grid: {
          type: 'object',
          enabled: false
        },
        version: {
          type: 'integer'
        },
        rowHeight: {
          type: 'text'
        },
        timeRestore: {
          type: 'boolean',
          index: false,
          doc_values: false
        },
        timeRange: {
          dynamic: false,
          properties: {
            from: {
              type: 'keyword',
              index: false,
              doc_values: false
            },
            to: {
              type: 'keyword',
              index: false,
              doc_values: false
            }
          }
        },
        refreshInterval: {
          dynamic: false,
          properties: {
            pause: {
              type: 'boolean',
              index: false,
              doc_values: false
            },
            value: {
              type: 'integer',
              index: false,
              doc_values: false
            }
          }
        },
        rowsPerPage: {
          type: 'integer',
          index: false,
          doc_values: false
        }
      }
    },
    migrations: () => (0, _search_migrations.getAllMigrations)(getSearchSourceMigrations())
  };
}