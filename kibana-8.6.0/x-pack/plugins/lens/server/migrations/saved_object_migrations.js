"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllMigrations = void 0;
var _lodash = require("lodash");
var _interpreter = require("@kbn/interpreter");
var _server = require("../../../../../src/core/server");
var _common_migrations = require("./common_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Removes the `lens_auto_date` subexpression from a stored expression
 * string. For example: aggConfigs={lens_auto_date aggConfigs="JSON string"}
 */
const removeLensAutoDate = (doc, context) => {
  const expression = doc.attributes.expression;
  if (!expression) {
    return doc;
  }
  try {
    const ast = (0, _interpreter.fromExpression)(expression);
    const newChain = ast.chain.map(topNode => {
      if (topNode.function !== 'lens_merge_tables') {
        return topNode;
      }
      return {
        ...topNode,
        arguments: {
          ...topNode.arguments,
          tables: topNode.arguments.tables.map(middleNode => {
            return {
              type: 'expression',
              chain: middleNode.chain.map(node => {
                // Check for sub-expression in aggConfigs
                if (node.function === 'esaggs' && typeof node.arguments.aggConfigs[0] !== 'string') {
                  return {
                    ...node,
                    arguments: {
                      ...node.arguments,
                      aggConfigs: node.arguments.aggConfigs[0].chain[0].arguments.aggConfigs
                    }
                  };
                }
                return node;
              })
            };
          })
        }
      };
    });
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        expression: (0, _interpreter.toExpression)({
          ...ast,
          chain: newChain
        })
      }
    };
  } catch (e) {
    context.log.warn(e.message);
    return {
      ...doc
    };
  }
};

/**
 * Adds missing timeField arguments to esaggs in the Lens expression
 */
const addTimeFieldToEsaggs = (doc, context) => {
  const expression = doc.attributes.expression;
  if (!expression) {
    return doc;
  }
  try {
    const ast = (0, _interpreter.fromExpression)(expression);
    const newChain = ast.chain.map(topNode => {
      if (topNode.function !== 'lens_merge_tables') {
        return topNode;
      }
      return {
        ...topNode,
        arguments: {
          ...topNode.arguments,
          tables: topNode.arguments.tables.map(middleNode => {
            return {
              type: 'expression',
              chain: middleNode.chain.map(node => {
                // Skip if there are any timeField arguments already, because that indicates
                // the fix is already applied
                if (node.function !== 'esaggs' || node.arguments.timeFields) {
                  return node;
                }
                const timeFields = [];
                JSON.parse(node.arguments.aggConfigs[0]).forEach(agg => {
                  if (agg.type !== 'date_histogram') {
                    return;
                  }
                  timeFields.push(agg.params.field);
                });
                return {
                  ...node,
                  arguments: {
                    ...node.arguments,
                    timeFields
                  }
                };
              })
            };
          })
        }
      };
    });
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        expression: (0, _interpreter.toExpression)({
          ...ast,
          chain: newChain
        })
      }
    };
  } catch (e) {
    context.log.warn(e.message);
    return {
      ...doc
    };
  }
};
const removeInvalidAccessors = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  if (newDoc.attributes.visualizationType === 'lnsXY') {
    const datasourceLayers = newDoc.attributes.state.datasourceStates.indexpattern.layers || {};
    const xyState = newDoc.attributes.state.visualization;
    newDoc.attributes.state.visualization.layers = xyState.layers.map(layer => {
      const layerId = layer.layerId;
      const datasource = datasourceLayers[layerId];
      return {
        ...layer,
        xAccessor: datasource !== null && datasource !== void 0 && datasource.columns[layer.xAccessor] ? layer.xAccessor : undefined,
        splitAccessor: datasource !== null && datasource !== void 0 && datasource.columns[layer.splitAccessor] ? layer.splitAccessor : undefined,
        accessors: layer.accessors.filter(accessor => !!(datasource !== null && datasource !== void 0 && datasource.columns[accessor]))
      };
    });
  }
  return newDoc;
};
const extractReferences = ({
  attributes,
  references,
  ...docMeta
}) => {
  const savedObjectReferences = [];
  // add currently selected index pattern to reference list
  savedObjectReferences.push({
    type: 'index-pattern',
    id: attributes.state.datasourceStates.indexpattern.currentIndexPatternId,
    name: 'indexpattern-datasource-current-indexpattern'
  });

  // add layer index patterns to list and remove index pattern ids from layers
  const persistableLayers = {};
  Object.entries(attributes.state.datasourceStates.indexpattern.layers).forEach(([layerId, {
    indexPatternId,
    ...persistableLayer
  }]) => {
    savedObjectReferences.push({
      type: 'index-pattern',
      id: indexPatternId,
      name: `indexpattern-datasource-layer-${layerId}`
    });
    persistableLayers[layerId] = persistableLayer;
  });

  // add filter index patterns to reference list and remove index pattern ids from filter definitions
  const persistableFilters = attributes.state.filters.map((filterRow, i) => {
    if (!filterRow.meta || !filterRow.meta.index) {
      return filterRow;
    }
    const refName = `filter-index-pattern-${i}`;
    savedObjectReferences.push({
      name: refName,
      type: 'index-pattern',
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
  });

  // put together new saved object format
  const newDoc = {
    ...docMeta,
    references: savedObjectReferences,
    attributes: {
      visualizationType: attributes.visualizationType,
      title: attributes.title,
      state: {
        datasourceStates: {
          indexpattern: {
            layers: persistableLayers
          }
        },
        visualization: attributes.state.visualization,
        query: attributes.state.query,
        filters: persistableFilters
      }
    }
  };
  return newDoc;
};
const removeSuggestedPriority = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  const datasourceLayers = newDoc.attributes.state.datasourceStates.indexpattern.layers || {};
  newDoc.attributes.state.datasourceStates.indexpattern.layers = Object.fromEntries(Object.entries(datasourceLayers).map(([layerId, layer]) => {
    return [layerId, {
      ...layer,
      columns: Object.fromEntries(Object.entries(layer.columns).map(([columnId, column]) => {
        const copy = {
          ...column
        };
        delete copy.suggestedPriority;
        return [columnId, copy];
      }))
    }];
  }));
  return newDoc;
};
const transformTableState = doc => {
  // nothing to do for non-datatable visualizations
  if (doc.attributes.visualizationType !== 'lnsDatatable') return doc;
  const oldState = doc.attributes.state.visualization;
  const layer = oldState.layers[0] || {
    layerId: '',
    columns: []
  };
  // put together new saved object format
  const newDoc = {
    ...doc,
    attributes: {
      ...doc.attributes,
      state: {
        ...doc.attributes.state,
        visualization: {
          sorting: oldState.sorting,
          layerId: layer.layerId,
          columns: layer.columns.map(columnId => ({
            columnId
          }))
        }
      }
    }
  };
  return newDoc;
};
const renameOperationsForFormula = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonRenameOperationsForFormula)(newDoc.attributes)
  };
};
const removeTimezoneDateHistogramParam = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonRemoveTimezoneDateHistogramParam)(newDoc.attributes)
  };
};
const addLayerTypeToVisualization = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonUpdateVisLayerType)(newDoc.attributes)
  };
};
const moveDefaultReversedPaletteToCustom = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonMakeReversePaletteAsCustom)(newDoc.attributes)
  };
};
const renameFilterReferences = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonRenameFilterReferences)(newDoc.attributes)
  };
};
const renameRecordsField = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonRenameRecordsField)(newDoc.attributes)
  };
};
const addParentFormatter = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.fixLensTopValuesCustomFormatting)(newDoc.attributes)
  };
};
const setLastValueShowArrayValues = doc => {
  return {
    ...doc,
    attributes: (0, _common_migrations.commonSetLastValueShowArrayValues)(doc.attributes)
  };
};
const enhanceTableRowHeight = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonEnhanceTableRowHeight)(newDoc.attributes)
  };
};
const setIncludeEmptyRowsDateHistogram = doc => {
  return {
    ...doc,
    attributes: (0, _common_migrations.commonSetIncludeEmptyRowsDateHistogram)(doc.attributes)
  };
};
const fixValueLabelsInXY = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonFixValueLabelsInXY)(newDoc.attributes)
  };
};
const lockOldMetricVisSettings = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonLockOldMetricVisSettings)(doc.attributes)
});
const preserveOldLegendSizeDefault = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonPreserveOldLegendSizeDefault)(doc.attributes)
});
const enrichAnnotationLayers = doc => {
  const newDoc = (0, _lodash.cloneDeep)(doc);
  return {
    ...newDoc,
    attributes: (0, _common_migrations.commonEnrichAnnotationLayer)(newDoc.attributes)
  };
};
const migrateMetricIds = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonMigrateMetricIds)(doc.attributes)
});
const migrateIndexPatternDatasource = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonMigrateIndexPatternDatasource)(doc.attributes)
});
const migratePartitionChartGroups = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonMigratePartitionChartGroups)(doc.attributes)
});
const migratePartitionMetrics = doc => ({
  ...doc,
  attributes: (0, _common_migrations.commonMigratePartitionMetrics)(doc.attributes)
});
const lensMigrations = {
  '7.7.0': removeInvalidAccessors,
  // The order of these migrations matter, since the timefield migration relies on the aggConfigs
  // sitting directly on the esaggs as an argument and not a nested function (which lens_auto_date was).
  '7.8.0': (doc, context) => addTimeFieldToEsaggs(removeLensAutoDate(doc, context), context),
  '7.10.0': extractReferences,
  '7.11.0': removeSuggestedPriority,
  '7.12.0': transformTableState,
  '7.13.0': renameOperationsForFormula,
  '7.13.1': renameOperationsForFormula,
  // duplicate this migration in case a broken by value panel is added to the library
  '7.14.0': removeTimezoneDateHistogramParam,
  '7.15.0': addLayerTypeToVisualization,
  '7.16.0': moveDefaultReversedPaletteToCustom,
  '8.1.0': (0, _lodash.flow)(renameFilterReferences, renameRecordsField, addParentFormatter),
  '8.2.0': (0, _lodash.flow)(setLastValueShowArrayValues, setIncludeEmptyRowsDateHistogram, enhanceTableRowHeight),
  '8.3.0': (0, _lodash.flow)(lockOldMetricVisSettings, preserveOldLegendSizeDefault, fixValueLabelsInXY),
  '8.5.0': (0, _lodash.flow)(migrateMetricIds, enrichAnnotationLayers, migratePartitionChartGroups),
  '8.6.0': (0, _lodash.flow)(migrateIndexPatternDatasource, migratePartitionMetrics)
  // FOLLOW THESE GUIDELINES IF YOU ARE ADDING A NEW MIGRATION!
  // 1. Make sure you are applying migrations for a given version in the same order here as they are applied in x-pack/plugins/lens/server/embeddable/make_lens_embeddable_factory.ts
};

const getAllMigrations = (filterMigrations, dataViewMigrations, customVisualizationMigrations) => (0, _server.mergeSavedObjectMigrationMaps)((0, _server.mergeSavedObjectMigrationMaps)((0, _server.mergeSavedObjectMigrationMaps)(lensMigrations, (0, _common_migrations.getLensFilterMigrations)(filterMigrations)), (0, _common_migrations.getLensCustomVisualizationMigrations)(customVisualizationMigrations)), (0, _common_migrations.getLensDataViewMigrations)(dataViewMigrations));
exports.getAllMigrations = getAllMigrations;