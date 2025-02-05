"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexPatternsStartMock = exports.createIndexPatternsMock = exports.createIndexPatternMock = void 0;
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _common = require("../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createIndexPatternMock = ({
  id,
  title,
  type = undefined,
  fields,
  runtimeFields,
  timeFieldName
}) => {
  const indexPatternFieldList = (0, _common.fieldList)(fields);
  return {
    id,
    title,
    type,
    fields: indexPatternFieldList,
    getTimeField: () => indexPatternFieldList.find(({
      name
    }) => name === timeFieldName),
    isTimeBased: () => timeFieldName != null,
    getFieldByName: fieldName => indexPatternFieldList.find(({
      name
    }) => name === fieldName),
    getComputedFields: () => ({
      runtimeFields: runtimeFields !== null && runtimeFields !== void 0 ? runtimeFields : {},
      scriptFields: {},
      storedFields: [],
      docvalueFields: []
    }),
    getRuntimeMappings: () => runtimeFields !== null && runtimeFields !== void 0 ? runtimeFields : {}
  };
};
exports.createIndexPatternMock = createIndexPatternMock;
const createIndexPatternsMock = (asyncDelay, indexPatterns) => {
  return {
    async getIdsWithTitle(_refresh) {
      const indexPatterns$ = (0, _rxjs.of)(indexPatterns.map(({
        id = 'unknown_id',
        title
      }) => ({
        id,
        title
      })));
      return await (0, _rxjs.firstValueFrom)(indexPatterns$.pipe((0, _operators.delay)(asyncDelay)));
    },
    async get(indexPatternId) {
      const indexPatterns$ = (0, _rxjs.from)(indexPatterns.filter(indexPattern => indexPattern.id === indexPatternId));
      return await (0, _rxjs.firstValueFrom)(indexPatterns$.pipe((0, _operators.delay)(asyncDelay)));
    }
  };
};
exports.createIndexPatternsMock = createIndexPatternsMock;
const createIndexPatternsStartMock = (asyncDelay, indexPatterns) => {
  return {
    dataViewsServiceFactory: async () => createIndexPatternsMock(asyncDelay, indexPatterns)
  };
};
exports.createIndexPatternsStartMock = createIndexPatternsStartMock;