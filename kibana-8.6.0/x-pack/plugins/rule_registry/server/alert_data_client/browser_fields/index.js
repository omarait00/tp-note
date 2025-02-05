"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldDescriptorToBrowserFieldMapper = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFieldCategory = fieldCapability => {
  const name = fieldCapability.name.split('.');
  if (name.length === 1) {
    return 'base';
  }
  return name[0];
};
const browserFieldFactory = (fieldCapability, category) => {
  return {
    [fieldCapability.name]: {
      ...fieldCapability,
      category
    }
  };
};
const fieldDescriptorToBrowserFieldMapper = fields => {
  return fields.reduce((browserFields, field) => {
    const category = getFieldCategory(field);
    const browserField = browserFieldFactory(field, category);
    if (browserFields[category]) {
      browserFields[category] = {
        fields: {
          ...browserFields[category].fields,
          ...browserField
        }
      };
    } else {
      browserFields[category] = {
        fields: browserField
      };
    }
    return browserFields;
  }, {});
};
exports.fieldDescriptorToBrowserFieldMapper = fieldDescriptorToBrowserFieldMapper;