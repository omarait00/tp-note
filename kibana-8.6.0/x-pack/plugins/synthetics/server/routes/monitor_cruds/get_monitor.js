"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSyntheticsMonitorRoute = exports.getSyntheticsMonitorOverviewRoute = exports.getAllSyntheticsMonitorRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../../../src/core/server");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _service_errors = require("../synthetics_service/service_errors");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSyntheticsMonitorRoute = libs => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_MONITORS + '/{monitorId}',
  validate: {
    params: _configSchema.schema.object({
      monitorId: _configSchema.schema.string({
        minLength: 1,
        maxLength: 1024
      })
    })
  },
  handler: async ({
    request,
    response,
    server: {
      encryptedSavedObjects
    },
    savedObjectsClient
  }) => {
    const {
      monitorId
    } = request.params;
    const encryptedSavedObjectsClient = encryptedSavedObjects.getClient();
    try {
      return await libs.requests.getSyntheticsMonitor({
        monitorId,
        encryptedSavedObjectsClient,
        savedObjectsClient
      });
    } catch (getErr) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(getErr)) {
        return (0, _service_errors.getMonitorNotFoundResponse)(response, monitorId);
      }
      throw getErr;
    }
  }
});
exports.getSyntheticsMonitorRoute = getSyntheticsMonitorRoute;
const getAllSyntheticsMonitorRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_MONITORS,
  validate: {
    query: _common.QuerySchema
  },
  handler: async ({
    request,
    savedObjectsClient,
    syntheticsMonitorClient
  }) => {
    var _totalCount$total;
    const totalCountQuery = async () => {
      if ((0, _common.isMonitorsQueryFiltered)(request.query)) {
        return savedObjectsClient.find({
          type: _synthetics_monitor.syntheticsMonitorType,
          perPage: 0,
          page: 1
        });
      }
    };
    const [queryResult, totalCount] = await Promise.all([(0, _common.getMonitors)(request.query, syntheticsMonitorClient.syntheticsService, savedObjectsClient), totalCountQuery()]);
    const absoluteTotal = (_totalCount$total = totalCount === null || totalCount === void 0 ? void 0 : totalCount.total) !== null && _totalCount$total !== void 0 ? _totalCount$total : queryResult.total;
    const {
      saved_objects: monitors,
      per_page: perPageT,
      ...rest
    } = queryResult;
    return {
      ...rest,
      monitors,
      absoluteTotal,
      perPage: perPageT,
      syncErrors: syntheticsMonitorClient.syntheticsService.syncErrors
    };
  }
});
exports.getAllSyntheticsMonitorRoute = getAllSyntheticsMonitorRoute;
const getSyntheticsMonitorOverviewRoute = () => ({
  method: 'GET',
  path: _constants.SYNTHETICS_API_URLS.SYNTHETICS_OVERVIEW,
  validate: {
    query: _common.QuerySchema
  },
  handler: async ({
    request,
    savedObjectsClient
  }) => {
    const {
      sortField,
      sortOrder,
      query
    } = request.query;
    const finder = savedObjectsClient.createPointInTimeFinder({
      type: _synthetics_monitor.syntheticsMonitorType,
      sortField: sortField === 'status' ? `${_runtime_types.ConfigKey.NAME}.keyword` : sortField,
      sortOrder,
      perPage: 500,
      search: query ? `${query}*` : undefined,
      searchFields: _common.SEARCH_FIELDS
    });
    const allMonitorIds = [];
    let total = 0;
    const allMonitors = [];
    for await (const result of finder.find()) {
      /* collect all monitor ids for use
       * in filtering overview requests */
      result.saved_objects.forEach(monitor => {
        const id = monitor.attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID];
        const configId = monitor.attributes[_runtime_types.ConfigKey.CONFIG_ID];
        allMonitorIds.push(configId);

        /* for each location, add a config item */
        const locations = monitor.attributes[_runtime_types.ConfigKey.LOCATIONS];
        locations.forEach(location => {
          const config = {
            id,
            configId,
            name: monitor.attributes[_runtime_types.ConfigKey.NAME],
            location,
            isEnabled: monitor.attributes[_runtime_types.ConfigKey.ENABLED]
          };
          allMonitors.push(config);
          total++;
        });
      });
    }
    return {
      monitors: allMonitors,
      total,
      allMonitorIds
    };
  }
});
exports.getSyntheticsMonitorOverviewRoute = getSyntheticsMonitorOverviewRoute;