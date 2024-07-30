"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionListHandler = void 0;
var _constants = require("../../../../common/endpoint/constants");
var _services = require("../../services");
var _error_handler = require("../error_handler");
var _utils = require("../../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const formatStringIds = value => typeof value === 'string' ? [value] : value;
const formatCommandValues = value => typeof value === 'string' ? [value] : value;
const formatStatusValues = value => typeof value === 'string' ? [value] : value;
const actionListHandler = endpointContext => {
  const logger = endpointContext.logFactory.get('endpoint_action_list');
  return async (context, req, res) => {
    const {
      query: {
        agentIds: elasticAgentIds,
        page,
        pageSize,
        startDate,
        endDate,
        userIds,
        commands,
        statuses
      }
    } = req;
    const esClient = (await context.core).elasticsearch.client.asInternalUser;
    try {
      const indexExists = await (0, _utils.doesLogsEndpointActionsIndexExist)({
        context,
        logger,
        indexName: _constants.ENDPOINT_ACTIONS_INDEX
      });
      if (!indexExists) {
        return res.notFound({
          body: 'index_not_found_exception'
        });
      }
      const requestParams = {
        commands: formatCommandValues(commands),
        esClient,
        elasticAgentIds: formatStringIds(elasticAgentIds),
        metadataService: endpointContext.service.getEndpointMetadataService(),
        page,
        pageSize,
        startDate,
        endDate,
        userIds: formatStringIds(userIds),
        logger
      };

      // wrapper method to branch logic for
      // normal paged search via page, size
      // vs full search for status filters
      const getActionsLog = () => {
        if (statuses !== null && statuses !== void 0 && statuses.length) {
          return (0, _services.getActionListByStatus)({
            ...requestParams,
            statuses: formatStatusValues(statuses)
          });
        }
        return (0, _services.getActionList)(requestParams);
      };
      const body = await getActionsLog();
      return res.ok({
        body
      });
    } catch (error) {
      return (0, _error_handler.errorHandler)(logger, res, error);
    }
  };
};
exports.actionListHandler = actionListHandler;