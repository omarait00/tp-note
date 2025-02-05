"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLensFilterMigrations = exports.getLensDataViewMigrations = exports.getLensCustomVisualizationMigrations = exports.fixLensTopValuesCustomFormatting = exports.commonUpdateVisLayerType = exports.commonSetLastValueShowArrayValues = exports.commonSetIncludeEmptyRowsDateHistogram = exports.commonRenameRecordsField = exports.commonRenameOperationsForFormula = exports.commonRenameFilterReferences = exports.commonRemoveTimezoneDateHistogramParam = exports.commonPreserveOldLegendSizeDefault = exports.commonMigratePartitionMetrics = exports.commonMigratePartitionChartGroups = exports.commonMigrateMetricIds = exports.commonMigrateIndexPatternDatasource = exports.commonMakeReversePaletteAsCustom = exports.commonLockOldMetricVisSettings = exports.commonFixValueLabelsInXY = exports.commonEnrichAnnotationLayer = exports.commonEnhanceTableRowHeight = void 0;
var _lodash = require("lodash");
var _common = require("../../../../../src/plugins/chart_expressions/expression_xy/common");
var _common2 = require("../../../../../src/plugins/kibana_utils/common");
var _common3 = require("../../common");
var _visualizations = require("../../common/visualizations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const commonRenameOperationsForFormula = attributes => {
  const renameMapping = {
    avg: 'average',
    cardinality: 'unique_count',
    derivative: 'differences'
  };
  function shouldBeRenamed(op) {
    return op in renameMapping;
  }
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const datasourceLayers = newAttributes.state.datasourceStates.indexpattern.layers || {};
  newAttributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, {
      ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        const copy = {
          ...column,
          operationType: shouldBeRenamed(column.operationType) ? renameMapping[column.operationType] : column.operationType
        };
        return [columnId, copy];
      }))
    }];
  }));
  return newAttributes;
};
exports.commonRenameOperationsForFormula = commonRenameOperationsForFormula;
const commonRemoveTimezoneDateHistogramParam = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const datasourceLayers = newAttributes.state.datasourceStates.indexpattern.layers || {};
  newAttributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, {
      ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        if (column.operationType === 'date_histogram' && 'params' in column) {
          const copy = {
            ...column,
            params: {
              ...column.params
            }
          };
          delete copy.params.timeZone;
          return [columnId, copy];
        }
        return [columnId, column];
      }))
    }];
  }));
  return newAttributes;
};
exports.commonRemoveTimezoneDateHistogramParam = commonRemoveTimezoneDateHistogramParam;
const commonUpdateVisLayerType = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const visState = newAttributes.state.visualization;
  if ('layerId' in visState) {
    visState.layerType = _common.LayerTypes.DATA;
  }
  if ('layers' in visState) {
    for (const layer of visState.layers) {
      layer.layerType = _common.LayerTypes.DATA;
    }
  }
  return newAttributes;
};
exports.commonUpdateVisLayerType = commonUpdateVisLayerType;
function moveDefaultPaletteToPercentCustomInPlace(palette) {
  var _palette$params;
  if (palette !== null && palette !== void 0 && (_palette$params = palette.params) !== null && _palette$params !== void 0 && _palette$params.reverse && palette.params.name !== 'custom' && palette.params.stops) {
    // change to palette type to custom and migrate to a percentage type of mode
    palette.name = 'custom';
    palette.params.name = 'custom';
    // we can make strong assumptions here:
    // because it was a default palette reversed it means that stops were the default ones
    // so when migrating, because there's no access to active data, we could leverage the
    // percent rangeType to define colorStops in percent.
    //
    // Stops should be defined, but reversed, as the previous code was rewriting them on reverse.
    //
    // The only change the user should notice should be the mode changing from number to percent
    // but the final result *must* be identical
    palette.params.rangeType = 'percent';
    const steps = palette.params.stops.length;
    palette.params.rangeMin = 0;
    palette.params.rangeMax = 80;
    palette.params.steps = steps;
    palette.params.colorStops = palette.params.stops.map(({
      color
    }, index) => ({
      color,
      stop: index * 100 / steps
    }));
    palette.params.stops = palette.params.stops.map(({
      color
    }, index) => ({
      color,
      stop: (1 + index) * 100 / steps
    }));
  }
}
const commonMakeReversePaletteAsCustom = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const vizState = newAttributes.state.visualization;
  if (attributes.visualizationType !== 'lnsDatatable' && attributes.visualizationType !== 'lnsHeatmap') {
    return newAttributes;
  }
  if ('columns' in vizState) {
    for (const column of vizState.columns) {
      if (column.colorMode && column.colorMode !== 'none') {
        moveDefaultPaletteToPercentCustomInPlace(column.palette);
      }
    }
  } else {
    moveDefaultPaletteToPercentCustomInPlace(vizState.palette);
  }
  return newAttributes;
};
exports.commonMakeReversePaletteAsCustom = commonMakeReversePaletteAsCustom;
const commonRenameRecordsField = attributes => {
  var _newAttributes$state, _newAttributes$state$, _newAttributes$state$2;
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  Object.keys(((_newAttributes$state = newAttributes.state) === null || _newAttributes$state === void 0 ? void 0 : (_newAttributes$state$ = _newAttributes$state.datasourceStates) === null || _newAttributes$state$ === void 0 ? void 0 : (_newAttributes$state$2 = _newAttributes$state$.indexpattern) === null || _newAttributes$state$2 === void 0 ? void 0 : _newAttributes$state$2.layers) || {}).forEach(layerId => {
    newAttributes.state.datasourceStates.indexpattern.layers[layerId].columnOrder.forEach(columnId => {
      const column = newAttributes.state.datasourceStates.indexpattern.layers[layerId].columns[columnId];
      if (column && column.operationType === 'count') {
        column.sourceField = _common3.DOCUMENT_FIELD_NAME;
      }
    });
  });
  return newAttributes;
};
exports.commonRenameRecordsField = commonRenameRecordsField;
const commonRenameFilterReferences = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  for (const filter of newAttributes.state.filters) {
    filter.meta.index = filter.meta.indexRefName;
    delete filter.meta.indexRefName;
  }
  return newAttributes;
};
exports.commonRenameFilterReferences = commonRenameFilterReferences;
const commonSetLastValueShowArrayValues = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  for (const layer of Object.values(newAttributes.state.datasourceStates.indexpattern.layers)) {
    for (const column of Object.values(layer.columns)) {
      if (column.operationType === 'last_value' && !(typeof column.params.showArrayValues === 'boolean')) {
        column.params.showArrayValues = true;
      }
    }
  }
  return newAttributes;
};
exports.commonSetLastValueShowArrayValues = commonSetLastValueShowArrayValues;
const commonEnhanceTableRowHeight = attributes => {
  if (attributes.visualizationType !== 'lnsDatatable') {
    return attributes;
  }
  const visState810 = attributes.state.visualization;
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const vizState = newAttributes.state.visualization;
  vizState.rowHeight = visState810.fitRowToContent ? 'auto' : 'single';
  vizState.rowHeightLines = visState810.fitRowToContent ? 2 : 1;
  return newAttributes;
};
exports.commonEnhanceTableRowHeight = commonEnhanceTableRowHeight;
const commonSetIncludeEmptyRowsDateHistogram = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  for (const layer of Object.values(newAttributes.state.datasourceStates.indexpattern.layers)) {
    for (const column of Object.values(layer.columns)) {
      if (column.operationType === 'date_histogram') {
        column.params.includeEmptyRows = true;
      }
    }
  }
  return newAttributes;
};
exports.commonSetIncludeEmptyRowsDateHistogram = commonSetIncludeEmptyRowsDateHistogram;
const commonLockOldMetricVisSettings = attributes => {
  var _visState$textAlign, _visState$titlePositi, _visState$size;
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  if (newAttributes.visualizationType !== 'lnsMetric') {
    return newAttributes;
  }
  const visState = newAttributes.state.visualization;
  visState.textAlign = (_visState$textAlign = visState.textAlign) !== null && _visState$textAlign !== void 0 ? _visState$textAlign : 'center';
  visState.titlePosition = (_visState$titlePositi = visState.titlePosition) !== null && _visState$titlePositi !== void 0 ? _visState$titlePositi : 'bottom';
  visState.size = (_visState$size = visState.size) !== null && _visState$size !== void 0 ? _visState$size : 'xl';
  return newAttributes;
};
exports.commonLockOldMetricVisSettings = commonLockOldMetricVisSettings;
const commonPreserveOldLegendSizeDefault = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const pixelsToLegendSize = {
    undefined: 'auto',
    '80': 'small',
    '130': 'medium',
    '180': 'large',
    '230': 'xlarge'
  };
  if (['lnsXY', 'lnsHeatmap'].includes(newAttributes.visualizationType + '')) {
    const legendConfig = newAttributes.state.visualization.legend;
    legendConfig.legendSize = pixelsToLegendSize[String(legendConfig.legendSize)];
  }
  if (newAttributes.visualizationType === 'lnsPie') {
    const layers = newAttributes.state.visualization.layers;
    layers.forEach(layer => {
      layer.legendSize = pixelsToLegendSize[String(layer.legendSize)];
    });
  }
  return newAttributes;
};
exports.commonPreserveOldLegendSizeDefault = commonPreserveOldLegendSizeDefault;
const getApplyCustomVisualizationMigrationToLens = (id, migration) => {
  return savedObject => {
    if (savedObject.attributes.visualizationType !== id) return savedObject;
    return {
      ...savedObject,
      attributes: {
        ...savedObject.attributes,
        state: {
          ...savedObject.attributes.state,
          visualization: migration(savedObject.attributes.state.visualization)
        }
      }
    };
  };
};

/**
 * This creates a migration map that applies custom visualization migrations
 */
const getLensCustomVisualizationMigrations = customVisualizationMigrations => {
  return Object.entries(customVisualizationMigrations).map(([id, migrationGetter]) => {
    const migrationMap = {};
    const currentMigrations = migrationGetter();
    for (const version in currentMigrations) {
      if (currentMigrations.hasOwnProperty(version)) {
        migrationMap[version] = getApplyCustomVisualizationMigrationToLens(id, currentMigrations[version]);
      }
    }
    return migrationMap;
  }).reduce((fullMigrationMap, currentVisualizationTypeMigrationMap) => (0, _common2.mergeMigrationFunctionMaps)(fullMigrationMap, currentVisualizationTypeMigrationMap), {});
};

/**
 * This creates a migration map that applies filter migrations to Lens visualizations
 */
exports.getLensCustomVisualizationMigrations = getLensCustomVisualizationMigrations;
const getLensFilterMigrations = filterMigrations => (0, _lodash.mapValues)(filterMigrations, migrate => lensDoc => ({
  ...lensDoc,
  attributes: {
    ...lensDoc.attributes,
    state: {
      ...lensDoc.attributes.state,
      filters: migrate(lensDoc.attributes.state.filters)
    }
  }
}));
exports.getLensFilterMigrations = getLensFilterMigrations;
const getLensDataViewMigrations = dataViewMigrations => (0, _lodash.mapValues)(dataViewMigrations, migrate => lensDoc => ({
  ...lensDoc,
  attributes: {
    ...lensDoc.attributes,
    state: {
      ...lensDoc.attributes.state,
      adHocDataViews: !lensDoc.attributes.state.adHocDataViews ? undefined : Object.fromEntries(Object.entries(lensDoc.attributes.state.adHocDataViews).map(([id, spec]) => [id, migrate(spec)]))
    }
  }
}));
exports.getLensDataViewMigrations = getLensDataViewMigrations;
const fixLensTopValuesCustomFormatting = attributes => {
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const datasourceLayers = newAttributes.state.datasourceStates.indexpattern.layers || {};
  newAttributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, {
      ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        if (column.operationType === 'terms') {
          return [columnId, {
            ...column,
            params: {
              ...column.params,
              parentFormat: {
                id: 'terms'
              }
            }
          }];
        }
        return [columnId, column];
      }))
    }];
  }));
  return newAttributes;
};
exports.fixLensTopValuesCustomFormatting = fixLensTopValuesCustomFormatting;
const commonFixValueLabelsInXY = attributes => {
  if (attributes.visualizationType !== 'lnsXY') {
    return attributes;
  }
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const {
    visualization
  } = newAttributes.state;
  const {
    valueLabels
  } = visualization;
  return {
    ...newAttributes,
    state: {
      ...newAttributes.state,
      visualization: {
        ...visualization,
        valueLabels: valueLabels && valueLabels !== 'hide' ? 'show' : valueLabels
      }
    }
  };
};
exports.commonFixValueLabelsInXY = commonFixValueLabelsInXY;
const commonEnrichAnnotationLayer = attributes => {
  // Skip the migration heavy part if not XY or it does not contain annotations
  if (attributes.visualizationType !== 'lnsXY' || attributes.state.visualization.layers.every(l => l.layerType !== 'annotations')) {
    return attributes;
  }
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  const {
    visualization
  } = newAttributes.state;
  const {
    layers
  } = visualization;
  return {
    ...newAttributes,
    state: {
      ...newAttributes.state,
      visualization: {
        ...visualization,
        layers: layers.map(l => {
          if (l.layerType !== 'annotations') {
            return l;
          }
          return {
            ...l,
            annotations: l.annotations.map(a => ({
              ...a,
              type: 'manual'
            })),
            ignoreGlobalFilters: true
          };
        })
      }
    }
  };
};
exports.commonEnrichAnnotationLayer = commonEnrichAnnotationLayer;
const commonMigrateMetricIds = attributes => {
  const typeMappings = {
    lnsMetric: 'lnsLegacyMetric',
    lnsMetricNew: 'lnsMetric'
  };
  if (!attributes.visualizationType || !(attributes.visualizationType in typeMappings)) {
    return attributes;
  }
  const newAttributes = (0, _lodash.cloneDeep)(attributes);
  newAttributes.visualizationType = typeMappings[attributes.visualizationType];
  return newAttributes;
};
exports.commonMigrateMetricIds = commonMigrateMetricIds;
const commonMigrateIndexPatternDatasource = attributes => {
  const newAttrs = {
    ...attributes,
    state: {
      ...attributes.state,
      datasourceStates: {
        formBased: attributes.state.datasourceStates.indexpattern
      }
    }
  };
  return newAttrs;
};
exports.commonMigrateIndexPatternDatasource = commonMigrateIndexPatternDatasource;
const commonMigratePartitionChartGroups = attributes => {
  var _attributes$state$vis;
  if ((_attributes$state$vis = attributes.state.visualization) !== null && _attributes$state$vis !== void 0 && _attributes$state$vis.layers && (0, _visualizations.isPartitionShape)(attributes.state.visualization.shape)) {
    return {
      ...attributes,
      state: {
        ...attributes.state,
        visualization: {
          ...attributes.state.visualization,
          layers: attributes.state.visualization.layers.map(l => {
            const groups = l.groups;
            if (groups) {
              delete l.groups;
              if (attributes.state.visualization.shape === 'mosaic') {
                return {
                  ...l,
                  primaryGroups: [groups[0]],
                  secondaryGroups: groups.length === 2 ? [groups[1]] : undefined
                };
              }
              return {
                ...l,
                primaryGroups: groups
              };
            }
            return l;
          })
        }
      }
    };
  }
  return attributes;
};
exports.commonMigratePartitionChartGroups = commonMigratePartitionChartGroups;
const commonMigratePartitionMetrics = attributes => {
  if (attributes.visualizationType !== 'lnsPie') {
    return attributes;
  }
  const partitionAttributes = attributes;
  return {
    ...attributes,
    state: {
      ...attributes.state,
      visualization: {
        ...partitionAttributes.state.visualization,
        layers: partitionAttributes.state.visualization.layers.map(layer => ({
          ...layer,
          metrics: [layer.metric],
          metric: undefined
        }))
      }
    }
  };
};
exports.commonMigratePartitionMetrics = commonMigratePartitionMetrics;