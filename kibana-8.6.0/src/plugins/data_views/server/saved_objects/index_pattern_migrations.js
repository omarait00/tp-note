"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indexPatternSavedObjectTypeMigrations = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const migrateAttributeTypeAndAttributeTypeMeta = doc => ({
  ...doc,
  attributes: {
    ...doc.attributes,
    type: doc.attributes.type || undefined,
    typeMeta: doc.attributes.typeMeta || undefined
  }
});
const migrateSubTypeAndParentFieldProperties = doc => {
  if (!doc.attributes.fields) return doc;
  const fieldsString = doc.attributes.fields;
  const fields = JSON.parse(fieldsString);
  const migratedFields = fields.map(field => {
    if (field.subType === 'multi') {
      return {
        ...(0, _lodash.omit)(field, 'parent'),
        subType: {
          multi: {
            parent: field.parent
          }
        }
      };
    }
    return field;
  });
  return {
    ...doc,
    attributes: {
      ...doc.attributes,
      fields: JSON.stringify(migratedFields)
    }
  };
};
const addAllowNoIndex = doc => ({
  ...doc,
  attributes: {
    ...doc.attributes,
    allowNoIndex: doc.id === 'logs-*' || doc.id === 'metrics-*' || undefined
  }
});
const indexPatternSavedObjectTypeMigrations = {
  '6.5.0': (0, _lodash.flow)(migrateAttributeTypeAndAttributeTypeMeta),
  '7.6.0': (0, _lodash.flow)(migrateSubTypeAndParentFieldProperties),
  '7.11.0': (0, _lodash.flow)(addAllowNoIndex)
};
exports.indexPatternSavedObjectTypeMigrations = indexPatternSavedObjectTypeMigrations;