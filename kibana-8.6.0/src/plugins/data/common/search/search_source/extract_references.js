"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractReferences = void 0;
var _common = require("../../../../data_views/common");
var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const extractReferences = state => {
  let searchSourceFields = {
    ...state
  };
  const references = [];
  if (searchSourceFields.index) {
    if (typeof searchSourceFields.index === 'string') {
      const indexId = searchSourceFields.index;
      const refName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
      references.push({
        name: refName,
        type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
        id: indexId
      });
      searchSourceFields = {
        ...searchSourceFields,
        indexRefName: refName,
        index: undefined
      };
    } else {
      const {
        state: dataViewState,
        references: dataViewReferences
      } = _common.DataViewPersistableStateService.extract(searchSourceFields.index);
      searchSourceFields.index = dataViewState;
      references.push(...dataViewReferences);
    }
  }
  if (searchSourceFields.filter) {
    searchSourceFields = {
      ...searchSourceFields,
      filter: searchSourceFields.filter.map((filterRow, i) => {
        if (!filterRow.meta || !filterRow.meta.index) {
          return filterRow;
        }
        const refName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
        references.push({
          name: refName,
          type: _.DATA_VIEW_SAVED_OBJECT_TYPE,
          id: filterRow.meta.index
        });
        return {
          ...filterRow,
          meta: {
            ...filterRow.meta,
            indexRefName: refName,
            index: undefined
          }
        };
      })
    };
  }
  return [searchSourceFields, references];
};
exports.extractReferences = extractReferences;