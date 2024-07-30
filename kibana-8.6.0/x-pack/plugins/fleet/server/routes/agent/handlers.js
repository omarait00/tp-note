"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAgentHandler = exports.putAgentsReassignHandler = exports.postBulkAgentsReassignHandler = exports.getAvailableVersionsHandler = exports.getAgentsHandler = exports.getAgentUploadsHandler = exports.getAgentUploadFileHandler = exports.getAgentTagsHandler = exports.getAgentStatusForAgentPolicyHandler = exports.getAgentHandler = exports.getAgentDataHandler = exports.getActionStatusHandler = exports.deleteAgentHandler = exports.bulkUpdateAgentTagsHandler = void 0;
var _promises = require("fs/promises");
var _path = _interopRequireDefault(require("path"));
var _utils = require("@kbn/utils");
var _lodash = require("lodash");
var _gte = _interopRequireDefault(require("semver/functions/gte"));
var _gt = _interopRequireDefault(require("semver/functions/gt"));
var _coerce = _interopRequireDefault(require("semver/functions/coerce"));
var _server = require("../../../../../../src/core/server");
var _services = require("../../services");
var _errors = require("../../errors");
var AgentService = _interopRequireWildcard(require("../../services/agents"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MINIMUM_SUPPORTED_VERSION = '7.17.0';
const getAgentHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const body = {
      item: await AgentService.getAgentById(esClient, request.params.agentId)
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getAgentHandler = getAgentHandler;
const deleteAgentHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    await AgentService.deleteAgent(esClient, request.params.agentId);
    const body = {
      action: 'deleted'
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom) {
      return response.customError({
        statusCode: error.output.statusCode,
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.deleteAgentHandler = deleteAgentHandler;
const updateAgentHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const partialAgent = {};
  if (request.body.user_provided_metadata) {
    partialAgent.user_provided_metadata = request.body.user_provided_metadata;
  }
  if (request.body.tags) {
    partialAgent.tags = (0, _lodash.uniq)(request.body.tags);
  }
  try {
    await AgentService.updateAgent(esClient, request.params.agentId, partialAgent);
    const body = {
      item: await AgentService.getAgentById(esClient, request.params.agentId)
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Agent ${request.params.agentId} not found`
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.updateAgentHandler = updateAgentHandler;
const bulkUpdateAgentTagsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const soClient = coreContext.savedObjects.client;
  const agentOptions = Array.isArray(request.body.agents) ? {
    agentIds: request.body.agents
  } : {
    kuery: request.body.agents
  };
  try {
    var _request$body$tagsToA, _request$body$tagsToR;
    const results = await AgentService.updateAgentTags(soClient, esClient, {
      ...agentOptions,
      batchSize: request.body.batchSize
    }, (_request$body$tagsToA = request.body.tagsToAdd) !== null && _request$body$tagsToA !== void 0 ? _request$body$tagsToA : [], (_request$body$tagsToR = request.body.tagsToRemove) !== null && _request$body$tagsToR !== void 0 ? _request$body$tagsToR : []);
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
exports.bulkUpdateAgentTagsHandler = bulkUpdateAgentTagsHandler;
const getAgentsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const {
      agents,
      total,
      page,
      perPage
    } = await AgentService.getAgentsByKuery(esClient, {
      page: request.query.page,
      perPage: request.query.perPage,
      showInactive: request.query.showInactive,
      showUpgradeable: request.query.showUpgradeable,
      kuery: request.query.kuery,
      sortField: request.query.sortField,
      sortOrder: request.query.sortOrder
    });
    const totalInactive = request.query.showInactive ? await AgentService.countInactiveAgents(esClient, {
      kuery: request.query.kuery
    }) : 0;
    const body = {
      list: agents,
      // deprecated
      items: agents,
      total,
      totalInactive,
      page,
      perPage
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
exports.getAgentsHandler = getAgentsHandler;
const getAgentTagsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const tags = await AgentService.getAgentTags(esClient, {
      showInactive: request.query.showInactive,
      kuery: request.query.kuery
    });
    const body = {
      items: tags
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
exports.getAgentTagsHandler = getAgentTagsHandler;
const putAgentsReassignHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    await AgentService.reassignAgent(soClient, esClient, request.params.agentId, request.body.policy_id);
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
exports.putAgentsReassignHandler = putAgentsReassignHandler;
const postBulkAgentsReassignHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const agentOptions = Array.isArray(request.body.agents) ? {
    agentIds: request.body.agents
  } : {
    kuery: request.body.agents
  };
  try {
    const results = await AgentService.reassignAgents(soClient, esClient, {
      ...agentOptions,
      batchSize: request.body.batchSize
    }, request.body.policy_id);
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
exports.postBulkAgentsReassignHandler = postBulkAgentsReassignHandler;
const getAgentStatusForAgentPolicyHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const results = await AgentService.getAgentStatusForAgentPolicy(esClient, request.query.policyId, request.query.kuery);
    const body = {
      results
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
exports.getAgentStatusForAgentPolicyHandler = getAgentStatusForAgentPolicyHandler;
const getAgentDataHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asCurrentUser;
  try {
    const returnDataPreview = request.query.previewData;
    const agentIds = isStringArray(request.query.agentsIds) ? request.query.agentsIds : [request.query.agentsIds];
    const {
      items,
      dataPreview
    } = await AgentService.getIncomingDataByAgentsId(esClient, agentIds, returnDataPreview);
    const body = {
      items,
      dataPreview
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
exports.getAgentDataHandler = getAgentDataHandler;
function isStringArray(arr) {
  return Array.isArray(arr) && arr.every(p => typeof p === 'string');
}

// Read a static file generated at build time
const getAvailableVersionsHandler = async (context, request, response) => {
  var _semverCoerce$version, _semverCoerce;
  const AGENT_VERSION_BUILD_FILE = 'x-pack/plugins/fleet/target/agent_versions_list.json';
  let versionsToDisplay = [];
  const kibanaVersion = _services.appContextService.getKibanaVersion();
  const kibanaVersionCoerced = (_semverCoerce$version = (_semverCoerce = (0, _coerce.default)(kibanaVersion)) === null || _semverCoerce === void 0 ? void 0 : _semverCoerce.version) !== null && _semverCoerce$version !== void 0 ? _semverCoerce$version : kibanaVersion;
  try {
    const file = await (0, _promises.readFile)(_path.default.join(_utils.REPO_ROOT, AGENT_VERSION_BUILD_FILE), 'utf-8');

    // Exclude versions older than MINIMUM_SUPPORTED_VERSION and pre-release versions (SNAPSHOT, rc..)
    // De-dup and sort in descending order
    const data = JSON.parse(file);
    const versions = data.map(item => {
      var _semverCoerce2;
      return ((_semverCoerce2 = (0, _coerce.default)(item)) === null || _semverCoerce2 === void 0 ? void 0 : _semverCoerce2.version) || '';
    }).filter(v => (0, _gte.default)(v, MINIMUM_SUPPORTED_VERSION)).sort((a, b) => (0, _gt.default)(a, b) ? -1 : 1);
    const parsedVersions = (0, _lodash.uniq)(versions);

    // Add current version if not already present
    const hasCurrentVersion = parsedVersions.some(v => v === kibanaVersionCoerced);
    versionsToDisplay = !hasCurrentVersion ? [kibanaVersionCoerced].concat(parsedVersions) : parsedVersions;
    const body = {
      items: versionsToDisplay
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
exports.getAvailableVersionsHandler = getAvailableVersionsHandler;
const getActionStatusHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const actionStatuses = await AgentService.getActionStatuses(esClient, request.query);
    const body = {
      items: actionStatuses
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
exports.getActionStatusHandler = getActionStatusHandler;
const getAgentUploadsHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const body = {
      items: await AgentService.getAgentUploads(esClient, request.params.agentId)
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
exports.getAgentUploadsHandler = getAgentUploadsHandler;
const getAgentUploadFileHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const resp = await AgentService.getAgentUploadFile(esClient, request.params.fileId, request.params.fileName);
    return response.ok(resp);
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getAgentUploadFileHandler = getAgentUploadFileHandler;