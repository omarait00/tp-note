"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMultiField = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Returns true if we are a multiField when passed in a fields entry and a fields key,
 * otherwise false. Notice that runtime fields can have multiple levels of multiFields which is kind a problem
 * but we compensate and test for that here as well. So technically this matches both multiFields and
 * invalid multiple-multiFields.
 * @param fieldsKey The key to check against the entries to see if it is a multiField
 * @param fieldEntries The entries to check against.
 * @returns True if we are a subObject, otherwise false.
 */
const isMultiField = (fieldsKey, fieldEntries) => {
  const splitPath = fieldsKey.split('.');
  return splitPath.some((_, index, array) => {
    if (index + 1 === array.length) {
      return false;
    } else {
      const newPath = [...array].splice(0, index + 1).join('.');
      return fieldEntries.some(([fieldKeyToCheck]) => {
        return fieldKeyToCheck === newPath;
      });
    }
  });
};
exports.isMultiField = isMultiField;