"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDatatables = exports.logDatatable = exports.getLayerDimensions = void 0;
var _utils = require("../../../../visualizations/common/utils");
var _constants = require("../constants");
var _i18n = require("../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const logDatatables = (layers, handlers, splitColumnAccessor, splitRowAccessor, annotations) => {
  var _handlers$inspectorAd;
  if (!(handlers !== null && handlers !== void 0 && (_handlers$inspectorAd = handlers.inspectorAdapters) !== null && _handlers$inspectorAd !== void 0 && _handlers$inspectorAd.tables)) {
    return;
  }
  handlers.inspectorAdapters.tables.reset();
  handlers.inspectorAdapters.tables.allowCsvExport = true;
  layers.forEach(layer => {
    if (layer.layerType === _constants.LayerTypes.ANNOTATIONS || layer.type === _constants.REFERENCE_LINE) {
      return;
    }
    const layerDimensions = getLayerDimensions(layer);
    layerDimensions.push([splitColumnAccessor ? [splitColumnAccessor] : undefined, _i18n.strings.getSplitColumnHelp()]);
    layerDimensions.push([splitRowAccessor ? [splitRowAccessor] : undefined, _i18n.strings.getSplitRowHelp()]);
    const logTable = (0, _utils.prepareLogTable)(layer.table, layerDimensions, true);
    handlers.inspectorAdapters.tables.logDatatable(layer.layerId, logTable);
  });
  if (annotations) {
    annotations.layers.forEach(layer => {
      const logTable = getLogAnnotationTable(annotations.datatable, layer);
      handlers.inspectorAdapters.tables.logDatatable(layer.layerId, logTable);
    });
  }
};
exports.logDatatables = logDatatables;
const getLogAnnotationTable = (data, layer) => {
  const layerDimensions = [[['label'], _i18n.strings.getLabelLabel()], [['time'], _i18n.strings.getTimeLabel()]];
  const layerAnnotationsId = new Set(layer.annotations.map(annotation => annotation.id));
  layer.annotations.filter(a => a.type === 'query_point_event_annotation').forEach(annotation => {
    const dynamicDimensions = [...(annotation.extraFields ? annotation.extraFields : []), ...(annotation.textField ? [annotation.textField] : [])].map(f => [[`field:${f}`], f]);
    layerDimensions.push(...dynamicDimensions);
  });
  return (0, _utils.prepareLogTable)({
    ...data,
    rows: data.rows.filter(row => layerAnnotationsId.has(row.id))
  }, layerDimensions, true);
};
const logDatatable = (data, layers, handlers, splitColumnAccessor, splitRowAccessor) => {
  if (handlers.inspectorAdapters.tables) {
    handlers.inspectorAdapters.tables.reset();
    handlers.inspectorAdapters.tables.allowCsvExport = true;
    const layerDimensions = layers.reduce((dimensions, layer) => {
      if (layer.layerType === _constants.LayerTypes.ANNOTATIONS || layer.type === _constants.REFERENCE_LINE) {
        return dimensions;
      }
      return [...dimensions, ...getLayerDimensions(layer)];
    }, []);
    layerDimensions.push([splitColumnAccessor ? [splitColumnAccessor] : undefined, _i18n.strings.getSplitColumnHelp()]);
    layerDimensions.push([splitRowAccessor ? [splitRowAccessor] : undefined, _i18n.strings.getSplitRowHelp()]);
    const logTable = (0, _utils.prepareLogTable)(data, layerDimensions, true);
    handlers.inspectorAdapters.tables.logDatatable('default', logTable);
  }
};
exports.logDatatable = logDatatable;
const getLayerDimensions = layer => {
  let xAccessor;
  let splitAccessors;
  let markSizeAccessor;
  if (layer.layerType === _constants.LayerTypes.DATA) {
    xAccessor = layer.xAccessor;
    splitAccessors = layer.splitAccessors;
    markSizeAccessor = layer.markSizeAccessor;
  }
  const {
    accessors,
    layerType
  } = layer;
  return [[accessors ? accessors : undefined, layerType === _constants.LayerTypes.DATA ? _i18n.strings.getMetricHelp() : _i18n.strings.getReferenceLineHelp()], [xAccessor ? [xAccessor] : undefined, _i18n.strings.getXAxisHelp()], [splitAccessors ? splitAccessors : undefined, _i18n.strings.getBreakdownHelp()], [markSizeAccessor ? [markSizeAccessor] : undefined, _i18n.strings.getMarkSizeHelp()]];
};
exports.getLayerDimensions = getLayerDimensions;