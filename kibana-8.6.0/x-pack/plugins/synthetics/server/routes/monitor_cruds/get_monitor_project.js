"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSyntheticsProjectMonitorsRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _runtime_types = require("../../../common/runtime_types");
var _constants = require("../../../common/constants");
var _synthetics_monitor = require("../../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const querySchema = _configSchema.schema.object({
  search_after: _configSchema.schema.maybe(_configSchema.schema.string()),
  per_page: _configSchema.schema.maybe(_configSchema.schema.number())
});
const getSyntheticsProjectMonitorsRoute = () => ({
  method: 'GET',
  path: _constants.API_URLS.SYNTHETICS_MONITORS_PROJECT,
  validate: {
    params: _configSchema.schema.object({
      projectName: _configSchema.schema.string()
    }),
    query: querySchema
  },
  handler: async ({
    request,
    response,
    server: {
      logger
    },
    savedObjectsClient,
    syntheticsMonitorClient
  }) => {
    const {
      projectName
    } = request.params;
    const {
      per_page: perPage = 500,
      search_after: searchAfter
    } = request.query;
    const decodedProjectName = decodeURI(projectName);
    const decodedSearchAfter = searchAfter ? decodeURI(searchAfter) : undefined;
    try {
      var _monitors$sort;
      const {
        saved_objects: monitors,
        total
      } = await (0, _common.getMonitors)({
        filter: `${_synthetics_monitor.syntheticsMonitorType}.attributes.${_runtime_types.ConfigKey.PROJECT_ID}: "${decodedProjectName}"`,
        fields: [_runtime_types.ConfigKey.JOURNEY_ID, _runtime_types.ConfigKey.CONFIG_HASH],
        perPage,
        sortField: _runtime_types.ConfigKey.JOURNEY_ID,
        sortOrder: 'asc',
        searchAfter: decodedSearchAfter ? [...decodedSearchAfter.split(',')] : undefined
      }, syntheticsMonitorClient.syntheticsService, savedObjectsClient);
      const projectMonitors = monitors.map(monitor => ({
        journey_id: monitor.attributes[_runtime_types.ConfigKey.JOURNEY_ID],
        hash: monitor.attributes[_runtime_types.ConfigKey.CONFIG_HASH] || ''
      }));
      return {
        total,
        after_key: monitors.length ? (_monitors$sort = monitors[monitors.length - 1].sort) === null || _monitors$sort === void 0 ? void 0 : _monitors$sort.join(',') : null,
        monitors: projectMonitors
      };
    } catch (error) {
      logger.error(error);
    }
  }
});
exports.getSyntheticsProjectMonitorsRoute = getSyntheticsProjectMonitorsRoute;