"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postBulkAgentsUnenrollHandler = exports.postAgentUnenrollHandler = void 0;
var AgentService = _interopRequireWildcard(require("../../services/agents"));
var _errors = require("../../errors");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const postAgentUnenrollHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    var _request$body, _request$body2;
    await AgentService.unenrollAgent(soClient, esClient, request.params.agentId, {
      force: (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.force,
      revoke: (_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : _request$body2.revoke
    });
    const body = {};
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
exports.postAgentUnenrollHandler = postAgentUnenrollHandler;
const postBulkAgentsUnenrollHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const agentOptions = Array.isArray(request.body.agents) ? {
    agentIds: request.body.agents
  } : {
    kuery: request.body.agents
  };
  try {
    var _request$body3, _request$body4, _request$body5;
    const results = await AgentService.unenrollAgents(soClient, esClient, {
      ...agentOptions,
      revoke: (_request$body3 = request.body) === null || _request$body3 === void 0 ? void 0 : _request$body3.revoke,
      force: (_request$body4 = request.body) === null || _request$body4 === void 0 ? void 0 : _request$body4.force,
      batchSize: (_request$body5 = request.body) === null || _request$body5 === void 0 ? void 0 : _request$body5.batchSize
    });
    return response.ok({
      body: {
        actionId: results.actionId
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.postBulkAgentsUnenrollHandler = postBulkAgentsUnenrollHandler;