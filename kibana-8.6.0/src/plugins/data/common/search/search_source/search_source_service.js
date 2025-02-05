"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSourceService = void 0;
var _lodash = require("lodash");
var _common = require("../../../../kibana_utils/common");
var _common2 = require("../../../../data_views/common");
var _ = require(".");
var _persistable_state = require("../../query/filters/persistable_state");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getAllMigrations = () => {
  const searchSourceMigrations = {};

  // we don't know if embeddables have any migrations defined so we need to fetch them and map the received functions so we pass
  // them the correct input and that we correctly map the response
  const filterMigrations = (0, _lodash.mapValues)((0, _persistable_state.getAllMigrations)(), migrate => {
    return state => ({
      ...state,
      filter: migrate(state.filter)
    });
  });
  const dataviewsMigrations = (0, _lodash.mapValues)(_common2.DataViewPersistableStateService.getAllMigrations(), migrate => {
    return state => ({
      ...state,
      index: migrate(state.index)
    });
  });
  return (0, _common.mergeMigrationFunctionMaps)((0, _common.mergeMigrationFunctionMaps)(searchSourceMigrations, filterMigrations), dataviewsMigrations);
};
class SearchSourceService {
  setup() {
    return {
      getAllMigrations
    };
  }
  start(indexPatterns, dependencies) {
    return {
      /**
       * creates searchsource based on serialized search source fields
       */
      create: (0, _.createSearchSource)(indexPatterns, dependencies),
      /**
       * creates an enpty search source
       */
      createEmpty: () => {
        return new _.SearchSource({}, dependencies);
      },
      extract: state => {
        const [newState, references] = (0, _.extractReferences)(state);
        return {
          state: newState,
          references
        };
      },
      inject: _.injectReferences,
      getAllMigrations,
      telemetry: () => {
        return {};
      }
    };
  }
  stop() {}
}
exports.SearchSourceService = SearchSourceService;