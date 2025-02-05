"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapStatsCollector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _layer_stats_collector = require("../../../common/telemetry/layer_stats_collector");
var _map_settings_collector = require("../../../common/telemetry/map_settings_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Use MapStatsCollector instance to track map saved object stats.
 */
class MapStatsCollector {
  constructor() {
    (0, _defineProperty2.default)(this, "_mapCount", 0);
    (0, _defineProperty2.default)(this, "_basemapClusterStats", {});
    (0, _defineProperty2.default)(this, "_joinClusterStats", {});
    (0, _defineProperty2.default)(this, "_layerClusterStats", {});
    (0, _defineProperty2.default)(this, "_resolutionClusterStats", {});
    (0, _defineProperty2.default)(this, "_scalingClusterStats", {});
    (0, _defineProperty2.default)(this, "_emsFileClusterStats", {});
    (0, _defineProperty2.default)(this, "_layerCountStats", void 0);
    (0, _defineProperty2.default)(this, "_layerTypeClusterStats", {});
    (0, _defineProperty2.default)(this, "_customIconsCountStats", void 0);
    (0, _defineProperty2.default)(this, "_sourceCountStats", void 0);
  }
  push(attributes) {
    if (!attributes || !attributes.mapStateJSON || !attributes.layerListJSON) {
      return;
    }
    this._mapCount++;
    const mapSettingsCollector = new _map_settings_collector.MapSettingsCollector(attributes);
    if (mapSettingsCollector) {
      const customIconsCount = mapSettingsCollector.getCustomIconsCount();
      if (this._customIconsCountStats) {
        const customIconsCountTotal = this._customIconsCountStats.total + customIconsCount;
        this._customIconsCountStats = {
          min: Math.min(customIconsCount, this._customIconsCountStats.min),
          max: Math.max(customIconsCount, this._customIconsCountStats.max),
          total: customIconsCountTotal,
          avg: customIconsCountTotal / this._mapCount
        };
      } else {
        this._customIconsCountStats = {
          min: customIconsCount,
          max: customIconsCount,
          total: customIconsCount,
          avg: customIconsCount
        };
      }
    }
    const layerStatsCollector = new _layer_stats_collector.LayerStatsCollector(attributes);
    if (layerStatsCollector) {
      const layerCount = layerStatsCollector.getLayerCount();
      if (this._layerCountStats) {
        const layerCountTotal = this._layerCountStats.total + layerCount;
        this._layerCountStats = {
          min: Math.min(layerCount, this._layerCountStats.min),
          max: Math.max(layerCount, this._layerCountStats.max),
          total: layerCountTotal,
          avg: layerCountTotal / this._mapCount
        };
      } else {
        this._layerCountStats = {
          min: layerCount,
          max: layerCount,
          total: layerCount,
          avg: layerCount
        };
      }
      const sourceCount = layerStatsCollector.getSourceCount();
      if (this._sourceCountStats) {
        const sourceCountTotal = this._sourceCountStats.total + sourceCount;
        this._sourceCountStats = {
          min: Math.min(sourceCount, this._sourceCountStats.min),
          max: Math.max(sourceCount, this._sourceCountStats.max),
          total: sourceCountTotal,
          avg: sourceCountTotal / this._mapCount
        };
      } else {
        this._sourceCountStats = {
          min: sourceCount,
          max: sourceCount,
          total: sourceCount,
          avg: sourceCount
        };
      }
      this._updateClusterStats(this._basemapClusterStats, layerStatsCollector.getBasemapCounts());
      this._updateClusterStats(this._joinClusterStats, layerStatsCollector.getJoinCounts());
      this._updateClusterStats(this._layerClusterStats, layerStatsCollector.getLayerCounts());
      this._updateClusterStats(this._resolutionClusterStats, layerStatsCollector.getResolutionCounts());
      this._updateClusterStats(this._scalingClusterStats, layerStatsCollector.getScalingCounts());
      this._updateClusterStats(this._emsFileClusterStats, layerStatsCollector.getEmsFileCounts());
      this._updateClusterStats(this._layerTypeClusterStats, layerStatsCollector.getLayerTypeCounts());
    }
  }
  getStats() {
    return {
      timeCaptured: new Date().toISOString(),
      mapsTotalCount: this._mapCount,
      basemaps: this._basemapClusterStats,
      joins: this._joinClusterStats,
      layerTypes: this._layerClusterStats,
      resolutions: this._resolutionClusterStats,
      scalingOptions: this._scalingClusterStats,
      attributesPerMap: {
        // Count of data sources per map
        dataSourcesCount: this._sourceCountStats ? this._excludeTotal(this._sourceCountStats) : {
          min: 0,
          max: 0,
          avg: 0
        },
        // Total count of layers per map
        layersCount: this._layerCountStats ? this._excludeTotal(this._layerCountStats) : {
          min: 0,
          max: 0,
          avg: 0
        },
        // Count of layers by type
        layerTypesCount: this._excludeTotalFromKeyedStats(this._layerTypeClusterStats),
        // Count of layer by EMS region
        emsVectorLayersCount: this._excludeTotalFromKeyedStats(this._emsFileClusterStats),
        // Count of custom icons per map
        customIconsCount: this._customIconsCountStats ? this._excludeTotal(this._customIconsCountStats) : {
          min: 0,
          max: 0,
          avg: 0
        }
      }
    };
  }
  _updateClusterStats(clusterStats, counts) {
    for (const key in counts) {
      if (!counts.hasOwnProperty(key)) {
        continue;
      }
      if (!clusterStats[key]) {
        clusterStats[key] = {
          min: counts[key],
          max: counts[key],
          total: counts[key],
          avg: 0
        };
      } else {
        clusterStats[key].min = Math.min(counts[key], clusterStats[key].min);
        clusterStats[key].max = Math.max(counts[key], clusterStats[key].max);
        clusterStats[key].total += counts[key];
      }
    }
    for (const key in clusterStats) {
      if (clusterStats.hasOwnProperty(key)) {
        clusterStats[key].avg = clusterStats[key].total / this._mapCount;
      }
    }
  }

  // stats in attributesPerMap do not include 'total' key. Use this method to remove 'total' key from ClusterCountStats
  _excludeTotalFromKeyedStats(clusterStats) {
    const results = {};
    for (const key in clusterStats) {
      if (clusterStats.hasOwnProperty(key)) {
        results[key] = this._excludeTotal(clusterStats[key]);
      }
    }
    return results;
  }
  _excludeTotal(stats) {
    const modifiedStats = {
      ...stats
    };
    delete modifiedStats.total;
    return modifiedStats;
  }
}
exports.MapStatsCollector = MapStatsCollector;