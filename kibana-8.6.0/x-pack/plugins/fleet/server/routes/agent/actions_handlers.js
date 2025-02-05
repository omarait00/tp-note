"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postNewAgentActionHandlerBuilder = exports.postCancelActionHandlerBuilder = void 0;
var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// handlers that handle agent actions request

const postNewAgentActionHandlerBuilder = function (actionsService) {
  return async (context, request, response) => {
    try {
      const esClient = (await context.core).elasticsearch.client.asInternalUser;
      const agent = await actionsService.getAgent(esClient, request.params.agentId);
      const newAgentAction = request.body.action;
      const savedAgentAction = await actionsService.createAgentAction(esClient, {
        created_at: new Date().toISOString(),
        ...newAgentAction,
        agents: [agent.id]
      });
      const body = {
        item: savedAgentAction
      };
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
};
exports.postNewAgentActionHandlerBuilder = postNewAgentActionHandlerBuilder;
const postCancelActionHandlerBuilder = function (actionsService) {
  return async (context, request, response) => {
    try {
      const esClient = (await context.core).elasticsearch.client.asInternalUser;
      const action = await actionsService.cancelAgentAction(esClient, request.params.actionId);
      const body = {
        item: action
      };
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
};
exports.postCancelActionHandlerBuilder = postCancelActionHandlerBuilder;