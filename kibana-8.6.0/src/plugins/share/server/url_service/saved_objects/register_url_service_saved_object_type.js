"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUrlServiceSavedObjectType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const registerUrlServiceSavedObjectType = (so, service) => {
  const urlSavedObjectType = {
    name: 'url',
    namespaceType: 'single',
    hidden: false,
    management: {
      icon: 'link',
      defaultSearchField: 'url',
      importableAndExportable: true,
      getTitle(obj) {
        return `/goto/${encodeURIComponent(obj.id)}`;
      },
      getInAppUrl(obj) {
        return {
          path: '/goto/' + encodeURIComponent(obj.id),
          uiCapabilitiesPath: ''
        };
      }
    },
    mappings: {
      properties: {
        slug: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword'
            }
          }
        },
        accessCount: {
          type: 'long'
        },
        accessDate: {
          type: 'date'
        },
        createDate: {
          type: 'date'
        },
        // Legacy field - contains already pre-formatted final URL.
        // This is here to support old saved objects that have this field.
        // TODO: Remove this field and execute a migration to the new format.
        url: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 2048
            }
          }
        },
        // Information needed to load and execute a locator.
        locatorJSON: {
          type: 'text',
          index: false
        }
      }
    },
    migrations: () => {
      const locatorMigrations = service.locators.getAllMigrations();
      const savedObjectLocatorMigrations = {};
      for (const [version, locatorMigration] of Object.entries(locatorMigrations)) {
        savedObjectLocatorMigrations[version] = doc => {
          const locator = JSON.parse(doc.attributes.locatorJSON);
          doc.attributes = {
            ...doc.attributes,
            locatorJSON: JSON.stringify(locatorMigration(locator))
          };
          return doc;
        };
      }
      return savedObjectLocatorMigrations;
    }
  };
  so.registerType(urlSavedObjectType);
};
exports.registerUrlServiceSavedObjectType = registerUrlServiceSavedObjectType;