"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestDiagnosticsHandler = exports.bulkRequestDiagnosticsHandler = void 0;
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

const requestDiagnosticsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const result = await AgentService.requestDiagnostics(esClient, request.params.agentId);
    return response.ok({
      body: {
        actionId: result.actionId
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.requestDiagnosticsHandler = requestDiagnosticsHandler;
const bulkRequestDiagnosticsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const soClient = coreContext.savedObjects.client;
  const agentOptions = Array.isArray(request.body.agents) ? {
    agentIds: request.body.agents
  } : {
    kuery: request.body.agents
  };
  try {
    const result = await AgentService.bulkRequestDiagnostics(esClient, soClient, {
      ...agentOptions,
      batchSize: request.body.batchSize
    });
    return response.ok({
      body: {
        actionId: result.actionId
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.bulkRequestDiagnosticsHandler = bulkRequestDiagnosticsHandler;