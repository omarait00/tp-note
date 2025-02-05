"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerNodeDiskSpaceRoute = registerNodeDiskSpaceRoute;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _es_version_precheck = require("../lib/es_version_precheck");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getLowDiskWatermarkSetting = clusterSettings => {
  const {
    defaults,
    persistent,
    transient
  } = clusterSettings;
  const defaultLowDiskWatermarkSetting = defaults && defaults['cluster.routing.allocation.disk.watermark.low'];
  const transientLowDiskWatermarkSetting = transient && transient['cluster.routing.allocation.disk.watermark.low'];
  const persistentLowDiskWatermarkSetting = persistent && persistent['cluster.routing.allocation.disk.watermark.low'];

  // ES applies cluster settings in the following order of precendence: transient, persistent, default
  if (transientLowDiskWatermarkSetting) {
    return transientLowDiskWatermarkSetting;
  } else if (persistentLowDiskWatermarkSetting) {
    return persistentLowDiskWatermarkSetting;
  } else if (defaultLowDiskWatermarkSetting) {
    return defaultLowDiskWatermarkSetting;
  }

  // May be undefined if defined in elasticsearch.yml
  return undefined;
};
function registerNodeDiskSpaceRoute({
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/node_disk_space`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client
        }
      } = await core;
      const clusterSettings = await client.asCurrentUser.cluster.getSettings({
        flat_settings: true,
        include_defaults: true
      });
      const lowDiskWatermarkSetting = getLowDiskWatermarkSetting(clusterSettings);
      if (lowDiskWatermarkSetting) {
        const nodeStats = await client.asCurrentUser.nodes.stats({
          metric: 'fs'
        });
        const nodeIds = Object.keys(nodeStats.nodes);
        const nodesWithLowDiskSpace = [];
        nodeIds.forEach(nodeId => {
          var _node$fs;
          const node = nodeStats.nodes[nodeId];
          const byteStats = node === null || node === void 0 ? void 0 : (_node$fs = node.fs) === null || _node$fs === void 0 ? void 0 : _node$fs.total;
          // @ts-expect-error @elastic/elasticsearch not supported
          const {
            total_in_bytes: totalInBytes,
            available_in_bytes: availableInBytes
          } = byteStats;

          // Regex to determine if the low disk watermark setting is configured as a percentage value
          // Elasticsearch accepts a percentage or bytes value
          const isLowDiskWatermarkPercentage = /^(\d+|(\.\d+))(\.\d+)?%$/.test(lowDiskWatermarkSetting);
          if (isLowDiskWatermarkPercentage) {
            const percentageAvailable = availableInBytes / totalInBytes * 100;
            const rawLowDiskWatermarkPercentageValue = Number(lowDiskWatermarkSetting.replace('%', ''));

            // If the percentage available is < the low disk watermark setting, mark node as having low disk space
            if (percentageAvailable < rawLowDiskWatermarkPercentageValue) {
              nodesWithLowDiskSpace.push({
                nodeId,
                nodeName: node.name || nodeId,
                available: `${Math.round(percentageAvailable)}%`,
                lowDiskWatermarkSetting: lowDiskWatermarkSetting
              });
            }
          } else {
            // If not a percentage value, assume user configured low disk watermark setting in bytes
            const rawLowDiskWatermarkBytesValue = _configSchema.ByteSizeValue.parse(lowDiskWatermarkSetting).getValueInBytes();
            const percentageAvailable = availableInBytes / totalInBytes * 100;

            // If bytes available < the low disk watermarket setting, mark node as having low disk space
            if (availableInBytes < rawLowDiskWatermarkBytesValue) {
              nodesWithLowDiskSpace.push({
                nodeId,
                nodeName: node.name || nodeId,
                available: `${Math.round(percentageAvailable)}%`,
                lowDiskWatermarkSetting: lowDiskWatermarkSetting
              });
            }
          }
        });
        return response.ok({
          body: nodesWithLowDiskSpace
        });
      }

      // If the low disk watermark setting is undefined, send empty array
      // This could occur if the setting is configured in elasticsearch.yml
      return response.ok({
        body: []
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}