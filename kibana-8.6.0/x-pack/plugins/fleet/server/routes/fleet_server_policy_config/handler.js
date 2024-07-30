"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putFleetServerPolicyHandler = exports.postFleetServerHost = exports.getFleetServerPolicyHandler = exports.getAllFleetServerPolicyHandler = exports.deleteFleetServerPolicyHandler = void 0;
var _server = require("../../../../../../src/core/server");
var _errors = require("../../errors");
var _services = require("../../services");
var _fleet_server_host = require("../../services/fleet_server_host");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const postFleetServerHost = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const {
      id,
      ...data
    } = request.body;
    const FleetServerHost = await (0, _fleet_server_host.createFleetServerHost)(soClient, {
      ...data,
      is_preconfigured: false
    }, {
      id
    });
    if (FleetServerHost.is_default) {
      await _services.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
    }
    const body = {
      item: FleetServerHost
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
exports.postFleetServerHost = postFleetServerHost;
const getFleetServerPolicyHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const item = await (0, _fleet_server_host.getFleetServerHost)(soClient, request.params.itemId);
    const body = {
      item
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Fleet server ${request.params.itemId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getFleetServerPolicyHandler = getFleetServerPolicyHandler;
const deleteFleetServerPolicyHandler = async (context, request, response) => {
  try {
    const coreContext = await context.core;
    const soClient = coreContext.savedObjects.client;
    const esClient = coreContext.elasticsearch.client.asInternalUser;
    await (0, _fleet_server_host.deleteFleetServerHost)(soClient, esClient, request.params.itemId);
    const body = {
      id: request.params.itemId
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Fleet server ${request.params.itemId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.deleteFleetServerPolicyHandler = deleteFleetServerPolicyHandler;
const putFleetServerPolicyHandler = async (context, request, response) => {
  try {
    const coreContext = await await context.core;
    const esClient = coreContext.elasticsearch.client.asInternalUser;
    const soClient = coreContext.savedObjects.client;
    const item = await (0, _fleet_server_host.updateFleetServerHost)(soClient, request.params.itemId, request.body);
    const body = {
      item
    };
    if (item.is_default) {
      await _services.agentPolicyService.bumpAllAgentPolicies(soClient, esClient);
    } else {
      await _services.agentPolicyService.bumpAllAgentPoliciesForFleetServerHosts(soClient, esClient, item.id);
    }
    return response.ok({
      body
    });
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Fleet server ${request.params.itemId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.putFleetServerPolicyHandler = putFleetServerPolicyHandler;
const getAllFleetServerPolicyHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const res = await (0, _fleet_server_host.listFleetServerHosts)(soClient);
    const body = {
      items: res.items,
      page: res.page,
      perPage: res.perPage,
      total: res.total
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
exports.getAllFleetServerPolicyHandler = getAllFleetServerPolicyHandler;