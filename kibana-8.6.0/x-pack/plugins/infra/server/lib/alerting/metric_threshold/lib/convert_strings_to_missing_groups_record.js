"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertStringsToMissingGroupsRecord = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const convertStringsToMissingGroupsRecord = missingGroups => {
  return missingGroups.map(subject => {
    if ((0, _lodash.isString)(subject)) {
      const parts = subject.split(',');
      return {
        key: subject,
        bucketKey: parts.reduce((acc, part, index) => {
          return {
            ...acc,
            [`groupBy${index}`]: part
          };
        }, {})
      };
    }
    return subject;
  });
};
exports.convertStringsToMissingGroupsRecord = convertStringsToMissingGroupsRecord;