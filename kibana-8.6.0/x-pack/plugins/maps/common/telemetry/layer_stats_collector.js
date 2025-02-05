"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LayerStatsCollector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _common = require("../../../../../src/plugins/maps_ems/common");
var _constants = require("../constants");
var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LayerStatsCollector {
  constructor(attributes) {
    (0, _defineProperty2.default)(this, "_layerCount", 0);
    (0, _defineProperty2.default)(this, "_basemapCounts", {});
    (0, _defineProperty2.default)(this, "_joinCounts", {});
    (0, _defineProperty2.default)(this, "_layerCounts", {});
    (0, _defineProperty2.default)(this, "_resolutionCounts", {});
    (0, _defineProperty2.default)(this, "_scalingCounts", {});
    (0, _defineProperty2.default)(this, "_emsFileCounts", {});
    (0, _defineProperty2.default)(this, "_layerTypeCounts", {});
    (0, _defineProperty2.default)(this, "_sourceIds", new Set());
    if (!attributes || !attributes.layerListJSON) {
      return;
    }
    let layerList = [];
    try {
      layerList = JSON.parse(attributes.layerListJSON);
    } catch (e) {
      return;
    }
    this._layerCount = layerList.length;
    layerList.forEach(layerDescriptor => {
      var _layerDescriptor$sour;
      this._updateCounts(getBasemapKey(layerDescriptor), this._basemapCounts);
      this._updateCounts(getJoinKey(layerDescriptor), this._joinCounts);
      this._updateCounts(getLayerKey(layerDescriptor), this._layerCounts);
      this._updateCounts(getResolutionKey(layerDescriptor), this._resolutionCounts);
      this._updateCounts(getScalingKey(layerDescriptor), this._scalingCounts);
      this._updateCounts(getEmsFileId(layerDescriptor), this._emsFileCounts);
      if (layerDescriptor.type) {
        this._updateCounts(layerDescriptor.type, this._layerTypeCounts);
      }
      if ((_layerDescriptor$sour = layerDescriptor.sourceDescriptor) !== null && _layerDescriptor$sour !== void 0 && _layerDescriptor$sour.id) {
        this._sourceIds.add(layerDescriptor.sourceDescriptor.id);
      }
    });
  }
  getLayerCount() {
    return this._layerCount;
  }
  getBasemapCounts() {
    return this._basemapCounts;
  }
  getJoinCounts() {
    return this._joinCounts;
  }
  getLayerCounts() {
    return this._layerCounts;
  }
  getResolutionCounts() {
    return this._resolutionCounts;
  }
  getScalingCounts() {
    return this._scalingCounts;
  }
  getEmsFileCounts() {
    return this._emsFileCounts;
  }
  getLayerTypeCounts() {
    return this._layerTypeCounts;
  }
  getSourceCount() {
    return this._sourceIds.size;
  }
  _updateCounts(key, counts) {
    if (key) {
      if (key in counts) {
        counts[key] += 1;
      } else {
        counts[key] = 1;
      }
    }
  }
}
exports.LayerStatsCollector = LayerStatsCollector;
function getEmsFileId(layerDescriptor) {
  return layerDescriptor.sourceDescriptor !== null && layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_FILE && 'id' in layerDescriptor.sourceDescriptor ? layerDescriptor.sourceDescriptor.id : null;
}
function getBasemapKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.EMS_TMS) {
    return null;
  }
  const descriptor = layerDescriptor.sourceDescriptor;
  if (descriptor.isAutoSelect) {
    return _types.EMS_BASEMAP_KEYS.AUTO;
  }
  if (descriptor.id === _common.DEFAULT_EMS_ROADMAP_ID) {
    return _types.EMS_BASEMAP_KEYS.ROADMAP;
  }
  if (descriptor.id === _common.DEFAULT_EMS_ROADMAP_DESATURATED_ID) {
    return _types.EMS_BASEMAP_KEYS.ROADMAP_DESATURATED;
  }
  if (descriptor.id === _common.DEFAULT_EMS_DARKMAP_ID) {
    return _types.EMS_BASEMAP_KEYS.DARK;
  }
  return null;
}
function getJoinKey(layerDescriptor) {
  var _joins;
  return layerDescriptor.type === _constants.LAYER_TYPE.GEOJSON_VECTOR && layerDescriptor !== null && layerDescriptor !== void 0 && (_joins = layerDescriptor.joins) !== null && _joins !== void 0 && _joins.length ? _types.JOIN_KEYS.TERM : null;
}
function getLayerKey(layerDescriptor) {
  if (layerDescriptor.type === _constants.LAYER_TYPE.HEATMAP) {
    return _types.LAYER_KEYS.ES_AGG_HEATMAP;
  }
  if (layerDescriptor.type === _constants.LAYER_TYPE.LAYER_GROUP) {
    return _types.LAYER_KEYS.LAYER_GROUP;
  }
  if (!layerDescriptor.sourceDescriptor) {
    return null;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_FILE) {
    return _types.LAYER_KEYS.EMS_REGION;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_TMS) {
    return _types.LAYER_KEYS.EMS_BASEMAP;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.KIBANA_TILEMAP) {
    return _types.LAYER_KEYS.KBN_TMS_RASTER;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.EMS_XYZ) {
    return _types.LAYER_KEYS.UX_TMS_RASTER;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.WMS) {
    return _types.LAYER_KEYS.UX_WMS;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.MVT_SINGLE_LAYER) {
    return _types.LAYER_KEYS.UX_TMS_MVT;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_LINE) {
    return _types.LAYER_KEYS.ES_TRACKS;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_PEW_PEW) {
    return _types.LAYER_KEYS.ES_POINT_TO_POINT;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_ML_ANOMALIES) {
    return _types.LAYER_KEYS.ES_ML_ANOMALIES;
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_SEARCH) {
    const sourceDescriptor = layerDescriptor.sourceDescriptor;
    if (sourceDescriptor.scalingType === _constants.SCALING_TYPES.TOP_HITS) {
      return _types.LAYER_KEYS.ES_TOP_HITS;
    } else {
      return _types.LAYER_KEYS.ES_DOCS;
    }
  }
  if (layerDescriptor.sourceDescriptor.type === _constants.SOURCE_TYPES.ES_GEO_GRID) {
    const sourceDescriptor = layerDescriptor.sourceDescriptor;
    if (sourceDescriptor.requestType === _constants.RENDER_AS.POINT) {
      return _types.LAYER_KEYS.ES_AGG_CLUSTERS;
    } else if (sourceDescriptor.requestType === _constants.RENDER_AS.GRID) {
      return _types.LAYER_KEYS.ES_AGG_GRIDS;
    } else if (sourceDescriptor.requestType === _constants.RENDER_AS.HEX) {
      return _types.LAYER_KEYS.ES_AGG_HEXAGONS;
    }
  }
  return null;
}
function getResolutionKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.ES_GEO_GRID || !layerDescriptor.sourceDescriptor.resolution) {
    return null;
  }
  const descriptor = layerDescriptor.sourceDescriptor;
  if (descriptor.resolution === _constants.GRID_RESOLUTION.COARSE) {
    return _types.RESOLUTION_KEYS.COARSE;
  }
  if (descriptor.resolution === _constants.GRID_RESOLUTION.FINE) {
    return _types.RESOLUTION_KEYS.FINE;
  }
  if (descriptor.resolution === _constants.GRID_RESOLUTION.MOST_FINE) {
    return _types.RESOLUTION_KEYS.MOST_FINE;
  }
  if (descriptor.resolution === _constants.GRID_RESOLUTION.SUPER_FINE) {
    return _types.RESOLUTION_KEYS.SUPER_FINE;
  }
  return null;
}
function getScalingKey(layerDescriptor) {
  if (!layerDescriptor.sourceDescriptor || layerDescriptor.sourceDescriptor.type !== _constants.SOURCE_TYPES.ES_SEARCH || !layerDescriptor.sourceDescriptor.scalingType) {
    return null;
  }
  const descriptor = layerDescriptor.sourceDescriptor;
  if (descriptor.scalingType === _constants.SCALING_TYPES.CLUSTERS) {
    return _types.SCALING_KEYS.CLUSTERS;
  }
  if (descriptor.scalingType === _constants.SCALING_TYPES.MVT) {
    return _types.SCALING_KEYS.MVT;
  }
  if (descriptor.scalingType === _constants.SCALING_TYPES.LIMIT) {
    return _types.SCALING_KEYS.LIMIT;
  }
  return null;
}