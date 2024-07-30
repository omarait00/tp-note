"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telemetry = exports.migrateToLatest = exports.inject = exports.getAllMigrations = exports.extract = void 0;
var _lodash = require("lodash");
var _common = require("../../../kibana_utils/common");
var filtersPersistableState = _interopRequireWildcard(require("./filters/persistable_state"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const extract = queryState => {
  var _queryState$filters;
  const references = [];
  const {
    state: updatedFilters,
    references: referencesFromFilters
  } = filtersPersistableState.extract((_queryState$filters = queryState.filters) !== null && _queryState$filters !== void 0 ? _queryState$filters : []);
  references.push(...referencesFromFilters);
  return {
    state: {
      ...queryState,
      filters: updatedFilters
    },
    references
  };
};
exports.extract = extract;
const inject = (queryState, references) => {
  var _queryState$filters2;
  const updatedFilters = filtersPersistableState.inject((_queryState$filters2 = queryState.filters) !== null && _queryState$filters2 !== void 0 ? _queryState$filters2 : [], references);
  return {
    ...queryState,
    filters: updatedFilters
  };
};
exports.inject = inject;
const telemetry = (queryState, collector) => {
  var _queryState$filters3;
  const filtersTelemetry = filtersPersistableState.telemetry((_queryState$filters3 = queryState.filters) !== null && _queryState$filters3 !== void 0 ? _queryState$filters3 : [], collector);
  return {
    ...filtersTelemetry
  };
};
exports.telemetry = telemetry;
const migrateToLatest = ({
  state,
  version
}) => {
  var _state$filters;
  const migratedFilters = filtersPersistableState.migrateToLatest({
    state: (_state$filters = state.filters) !== null && _state$filters !== void 0 ? _state$filters : [],
    version
  });
  return {
    ...state,
    filters: migratedFilters
  };
};
exports.migrateToLatest = migrateToLatest;
const getAllMigrations = () => {
  const queryMigrations = {};
  const filterMigrations = (0, _lodash.mapValues)(filtersPersistableState.getAllMigrations(), migrate => {
    return state => {
      var _state$filters2;
      return {
        ...state,
        filters: migrate((_state$filters2 = state.filters) !== null && _state$filters2 !== void 0 ? _state$filters2 : [])
      };
    };
  });
  return (0, _common.mergeMigrationFunctionMaps)(queryMigrations, filterMigrations);
};
exports.getAllMigrations = getAllMigrations;