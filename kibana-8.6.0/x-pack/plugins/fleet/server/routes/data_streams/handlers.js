"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListHandler = void 0;
var _lodash = require("lodash");
var _types = require("../../../common/types");
var _get = require("../../services/epm/packages/get");
var _errors = require("../../errors");
var _get_data_streams_query_metadata = require("./get_data_streams_query_metadata");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const DATA_STREAM_INDEX_PATTERN = 'logs-*-*,metrics-*-*,traces-*-*,synthetics-*-*';
const getListHandler = async (context, request, response) => {
  // Query datastreams as the current user as the Kibana internal user may not have all the required permission
  const {
    savedObjects,
    elasticsearch
  } = await context.core;
  const esClient = elasticsearch.client.asCurrentUser;
  const body = {
    data_streams: []
  };
  try {
    // Get matching data streams, their stats, and package SOs
    const [{
      data_streams: dataStreamsInfo
    }, {
      data_streams: dataStreamStats
    }, packageSavedObjects] = await Promise.all([esClient.indices.getDataStream({
      name: DATA_STREAM_INDEX_PATTERN
    }), esClient.indices.dataStreamsStats({
      name: DATA_STREAM_INDEX_PATTERN,
      human: true
    }), (0, _get.getPackageSavedObjects)(savedObjects.client)]);
    const filteredDataStreamsInfo = dataStreamsInfo.filter(ds => {
      var _ds$_meta;
      return (ds === null || ds === void 0 ? void 0 : (_ds$_meta = ds._meta) === null || _ds$_meta === void 0 ? void 0 : _ds$_meta.managed_by) === 'fleet';
    });
    const dataStreamsInfoByName = (0, _lodash.keyBy)(filteredDataStreamsInfo, 'name');
    const filteredDataStreamsStats = dataStreamStats.filter(dss => !!dataStreamsInfoByName[dss.data_stream]);
    const dataStreamsStatsByName = (0, _lodash.keyBy)(filteredDataStreamsStats, 'data_stream');

    // Combine data stream info
    const dataStreams = (0, _lodash.merge)(dataStreamsInfoByName, dataStreamsStatsByName);
    const dataStreamNames = (0, _lodash.keys)(dataStreams);

    // Map package SOs
    const packageSavedObjectsByName = (0, _lodash.keyBy)(packageSavedObjects.saved_objects, 'id');
    const packageMetadata = {};

    // Get dashboard information for all packages
    const dashboardIdsByPackageName = packageSavedObjects.saved_objects.reduce((allDashboards, pkgSavedObject) => {
      var _pkgSavedObject$attri;
      const dashboards = [];
      (((_pkgSavedObject$attri = pkgSavedObject.attributes) === null || _pkgSavedObject$attri === void 0 ? void 0 : _pkgSavedObject$attri.installed_kibana) || []).forEach(o => {
        if (o.type === _types.KibanaSavedObjectType.dashboard) {
          dashboards.push(o.id);
        }
      });
      allDashboards[pkgSavedObject.id] = dashboards;
      return allDashboards;
    }, {});
    const allDashboardSavedObjectsResponse = await savedObjects.client.bulkGet(Object.values(dashboardIdsByPackageName).flatMap(dashboardIds => dashboardIds.map(id => ({
      id,
      type: _types.KibanaSavedObjectType.dashboard,
      fields: ['title']
    }))));
    // Ignore dashboards not found
    const allDashboardSavedObjects = allDashboardSavedObjectsResponse.saved_objects.filter(so => {
      if (so.error) {
        if (so.error.statusCode === 404) {
          return false;
        }
        throw so.error;
      }
      return true;
    });
    const allDashboardSavedObjectsById = (0, _lodash.keyBy)(allDashboardSavedObjects, dashboardSavedObject => dashboardSavedObject.id);

    // Query additional information for each data stream
    const dataStreamPromises = dataStreamNames.map(async dataStreamName => {
      var _dataStream$_meta, _dataStream$_meta$pac;
      const dataStream = dataStreams[dataStreamName];
      const dataStreamResponse = {
        index: dataStreamName,
        dataset: '',
        namespace: '',
        type: '',
        package: ((_dataStream$_meta = dataStream._meta) === null || _dataStream$_meta === void 0 ? void 0 : (_dataStream$_meta$pac = _dataStream$_meta.package) === null || _dataStream$_meta$pac === void 0 ? void 0 : _dataStream$_meta$pac.name) || '',
        package_version: '',
        last_activity_ms: dataStream.maximum_timestamp,
        // overridden below if maxIngestedTimestamp agg returns a result
        size_in_bytes: dataStream.store_size_bytes,
        // `store_size` should be available from ES due to ?human=true flag
        // but fallback to bytes just in case
        size_in_bytes_formatted: dataStream.store_size || `${dataStream.store_size_bytes}b`,
        dashboards: [],
        serviceDetails: null
      };
      const {
        maxIngested,
        namespace,
        dataset,
        type,
        serviceNames,
        environments
      } = await (0, _get_data_streams_query_metadata.getDataStreamsQueryMetadata)({
        dataStreamName: dataStream.name,
        esClient
      });

      // some integrations e.g custom logs don't have event.ingested
      if (maxIngested) {
        dataStreamResponse.last_activity_ms = maxIngested;
      }
      if ((serviceNames === null || serviceNames === void 0 ? void 0 : serviceNames.length) === 1) {
        const serviceDetails = {
          serviceName: serviceNames[0],
          environment: (environments === null || environments === void 0 ? void 0 : environments.length) === 1 ? environments[0] : 'ENVIRONMENT_ALL'
        };
        dataStreamResponse.serviceDetails = serviceDetails;
      }
      dataStreamResponse.dataset = dataset;
      dataStreamResponse.namespace = namespace;
      dataStreamResponse.type = type;

      // Find package saved object
      const pkgName = dataStreamResponse.package;
      const pkgSavedObject = pkgName ? packageSavedObjectsByName[pkgName] : null;
      if (pkgSavedObject) {
        // if
        // - the data stream is associated with a package
        // - and the package has been installed through EPM
        // - and we didn't pick the metadata in an earlier iteration of this map()
        if (!packageMetadata[pkgName]) {
          var _pkgSavedObject$attri2;
          // then pick the dashboards from the package saved object
          const packageDashboardIds = dashboardIdsByPackageName[pkgName] || [];
          const packageDashboards = packageDashboardIds.reduce((dashboards, dashboardId) => {
            const dashboard = allDashboardSavedObjectsById[dashboardId];
            if (dashboard) {
              dashboards.push({
                id: dashboard.id,
                title: dashboard.attributes.title || dashboard.id
              });
            }
            return dashboards;
          }, []);
          packageMetadata[pkgName] = {
            version: ((_pkgSavedObject$attri2 = pkgSavedObject.attributes) === null || _pkgSavedObject$attri2 === void 0 ? void 0 : _pkgSavedObject$attri2.version) || '',
            dashboards: packageDashboards
          };
        }

        // Set values from package information
        dataStreamResponse.package = pkgName;
        dataStreamResponse.package_version = packageMetadata[pkgName].version;
        dataStreamResponse.dashboards = packageMetadata[pkgName].dashboards;
      }
      return dataStreamResponse;
    });

    // Return final data streams objects sorted by last activity, descending
    // After filtering out data streams that are missing dataset/namespace/type/package fields
    body.data_streams = (await Promise.all(dataStreamPromises)).filter(({
      dataset,
      namespace,
      type
    }) => dataset && namespace && type).sort((a, b) => b.last_activity_ms - a.last_activity_ms);
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getListHandler = getListHandler;