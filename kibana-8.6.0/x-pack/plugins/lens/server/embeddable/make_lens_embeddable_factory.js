"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeLensEmbeddableFactory = void 0;
var _common = require("../../../../../src/plugins/kibana_utils/common");
var _common2 = require("../../common");
var _common_migrations = require("../migrations/common_migrations");
var _embeddable_factory = require("../../common/embeddable_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const makeLensEmbeddableFactory = (getFilterMigrations, getDataViewMigrations, customVisualizationMigrations) => () => {
  return {
    id: _common2.DOC_TYPE,
    migrations: () => (0, _common.mergeMigrationFunctionMaps)((0, _common.mergeMigrationFunctionMaps)((0, _common.mergeMigrationFunctionMaps)((0, _common_migrations.getLensFilterMigrations)(getFilterMigrations()), {
      // This migration is run in 7.13.1 for `by value` panels because the 7.13 release window was missed.
      '7.13.1': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonRenameOperationsForFormula)(lensState.attributes);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '7.14.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonRemoveTimezoneDateHistogramParam)(lensState.attributes);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '7.15.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonUpdateVisLayerType)(lensState.attributes);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '7.16.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonMakeReversePaletteAsCustom)(lensState.attributes);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '8.1.0': state => {
        const lensState = state;
        const migratedLensState = (0, _common_migrations.commonRenameRecordsField)((0, _common_migrations.commonRenameFilterReferences)(lensState.attributes));
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '8.2.0': state => {
        const lensState = state;
        let migratedLensState = (0, _common_migrations.commonSetLastValueShowArrayValues)(lensState.attributes);
        migratedLensState = (0, _common_migrations.commonEnhanceTableRowHeight)(migratedLensState);
        migratedLensState = (0, _common_migrations.commonSetIncludeEmptyRowsDateHistogram)(migratedLensState);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '8.3.0': state => {
        const lensState = state;
        let migratedLensState = (0, _common_migrations.commonLockOldMetricVisSettings)(lensState.attributes);
        migratedLensState = (0, _common_migrations.commonPreserveOldLegendSizeDefault)(migratedLensState);
        migratedLensState = (0, _common_migrations.commonFixValueLabelsInXY)(migratedLensState);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '8.5.0': state => {
        const lensState = state;
        let migratedLensState = (0, _common_migrations.commonMigrateMetricIds)(lensState.attributes);
        migratedLensState = (0, _common_migrations.commonEnrichAnnotationLayer)(migratedLensState);
        migratedLensState = (0, _common_migrations.commonMigratePartitionChartGroups)(migratedLensState);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      },
      '8.6.0': state => {
        const lensState = state;
        let migratedLensState = (0, _common_migrations.commonMigrateIndexPatternDatasource)(lensState.attributes);
        migratedLensState = (0, _common_migrations.commonMigratePartitionMetrics)(migratedLensState);
        return {
          ...lensState,
          attributes: migratedLensState
        };
      }
      // FOLLOW THESE GUIDELINES IF YOU ARE ADDING A NEW MIGRATION!
      // 1. Make sure you are applying migrations for a given version in the same order here as they are applied in x-pack/plugins/lens/server/migrations/saved_object_migrations.ts
    }), (0, _common_migrations.getLensCustomVisualizationMigrations)(customVisualizationMigrations)), (0, _common_migrations.getLensDataViewMigrations)(getDataViewMigrations())),
    extract: _embeddable_factory.extract,
    inject: _embeddable_factory.inject
  };
};
exports.makeLensEmbeddableFactory = makeLensEmbeddableFactory;