"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAgentPolicyHandler = exports.getOneAgentPolicyHandler = exports.getK8sManifest = exports.getFullAgentPolicy = exports.getAgentPoliciesHandler = exports.downloadK8sManifest = exports.downloadFullAgentPolicy = exports.deleteAgentPoliciesHandler = exports.createAgentPolicyHandler = exports.copyAgentPolicyHandler = exports.bulkGetAgentPoliciesHandler = void 0;
var _pMap = _interopRequireDefault(require("p-map"));
var _jsYaml = require("js-yaml");
var _services = require("../../../common/services");
var _services2 = require("../../services");
var _agents = require("../../services/agents");
var _constants = require("../../constants");
var _errors = require("../../errors");
var _agent_policy_create = require("../../services/agent_policy_create");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function populateAssignedAgentsCount(esClient, agentPolicies) {
  await (0, _pMap.default)(agentPolicies, agentPolicy => (0, _agents.getAgentsByKuery)(esClient, {
    showInactive: false,
    perPage: 0,
    page: 1,
    kuery: `${_constants.AGENTS_PREFIX}.policy_id:${agentPolicy.id}`
  }).then(({
    total: agentTotal
  }) => agentPolicy.agents = agentTotal), {
    concurrency: 10
  });
}
const getAgentPoliciesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const {
    full: withPackagePolicies = false,
    ...restOfQuery
  } = request.query;
  try {
    const {
      items,
      total,
      page,
      perPage
    } = await _services2.agentPolicyService.list(soClient, {
      withPackagePolicies,
      ...restOfQuery
    });
    const body = {
      items,
      total,
      page,
      perPage
    };
    await populateAssignedAgentsCount(esClient, items);
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
exports.getAgentPoliciesHandler = getAgentPoliciesHandler;
const bulkGetAgentPoliciesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const {
    full: withPackagePolicies = false,
    ignoreMissing = false,
    ids
  } = request.body;
  try {
    const items = await _services2.agentPolicyService.getByIDs(soClient, ids, {
      withPackagePolicies,
      ignoreMissing
    });
    const body = {
      items
    };
    await populateAssignedAgentsCount(esClient, items);
    return response.ok({
      body
    });
  } catch (error) {
    if (error instanceof _errors.AgentPolicyNotFoundError) {
      return response.notFound({
        body: {
          message: error.message
        }
      });
    }
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.bulkGetAgentPoliciesHandler = bulkGetAgentPoliciesHandler;
const getOneAgentPolicyHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  try {
    const agentPolicy = await _services2.agentPolicyService.get(soClient, request.params.agentPolicyId);
    if (agentPolicy) {
      const body = {
        item: agentPolicy
      };
      return response.ok({
        body
      });
    } else {
      return response.customError({
        statusCode: 404,
        body: {
          message: 'Agent policy not found'
        }
      });
    }
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getOneAgentPolicyHandler = getOneAgentPolicyHandler;
const createAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge, _request$query$sys_mo;
  const coreContext = await context.core;
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = (await ((_appContextService$ge = _services2.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request))) || undefined;
  const withSysMonitoring = (_request$query$sys_mo = request.query.sys_monitoring) !== null && _request$query$sys_mo !== void 0 ? _request$query$sys_mo : false;
  const monitoringEnabled = request.body.monitoring_enabled;
  const {
    has_fleet_server: hasFleetServer,
    ...newPolicy
  } = request.body;
  const spaceId = fleetContext.spaceId;
  try {
    const body = {
      item: await (0, _agent_policy_create.createAgentPolicyWithPackages)({
        soClient,
        esClient,
        newPolicy,
        hasFleetServer,
        withSysMonitoring,
        monitoringEnabled,
        spaceId,
        user
      })
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
exports.createAgentPolicyHandler = createAgentPolicyHandler;
const updateAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge2;
  const coreContext = await context.core;
  const fleetContext = await context.fleet;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = await ((_appContextService$ge2 = _services2.appContextService.getSecurity()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.authc.getCurrentUser(request));
  const {
    force,
    ...data
  } = request.body;
  const spaceId = fleetContext.spaceId;
  try {
    const agentPolicy = await _services2.agentPolicyService.update(soClient, esClient, request.params.agentPolicyId, data, {
      force,
      user: user || undefined,
      spaceId
    });
    const body = {
      item: agentPolicy
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
exports.updateAgentPolicyHandler = updateAgentPolicyHandler;
const copyAgentPolicyHandler = async (context, request, response) => {
  var _appContextService$ge3;
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = await ((_appContextService$ge3 = _services2.appContextService.getSecurity()) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.authc.getCurrentUser(request));
  try {
    const agentPolicy = await _services2.agentPolicyService.copy(soClient, esClient, request.params.agentPolicyId, request.body, {
      user: user || undefined
    });
    const body = {
      item: agentPolicy
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
exports.copyAgentPolicyHandler = copyAgentPolicyHandler;
const deleteAgentPoliciesHandler = async (context, request, response) => {
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  try {
    const body = await _services2.agentPolicyService.delete(soClient, esClient, request.body.agentPolicyId);
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
exports.deleteAgentPoliciesHandler = deleteAgentPoliciesHandler;
const getFullAgentPolicy = async (context, request, response) => {
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  if (request.query.kubernetes === true) {
    try {
      const fullAgentConfigMap = await _services2.agentPolicyService.getFullAgentConfigMap(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });
      if (fullAgentConfigMap) {
        const body = {
          item: fullAgentConfigMap
        };
        return response.ok({
          body
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent config map not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultFleetErrorHandler)({
        error,
        response
      });
    }
  } else {
    try {
      const fullAgentPolicy = await _services2.agentPolicyService.getFullAgentPolicy(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });
      if (fullAgentPolicy) {
        const body = {
          item: fullAgentPolicy
        };
        return response.ok({
          body
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent policy not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultFleetErrorHandler)({
        error,
        response
      });
    }
  }
};
exports.getFullAgentPolicy = getFullAgentPolicy;
const downloadFullAgentPolicy = async (context, request, response) => {
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  const {
    params: {
      agentPolicyId
    }
  } = request;
  if (request.query.kubernetes === true) {
    try {
      const fullAgentConfigMap = await _services2.agentPolicyService.getFullAgentConfigMap(soClient, request.params.agentPolicyId, {
        standalone: request.query.standalone === true
      });
      if (fullAgentConfigMap) {
        const body = fullAgentConfigMap;
        const headers = {
          'content-type': 'text/x-yaml',
          'content-disposition': `attachment; filename="elastic-agent-standalone-kubernetes.yaml"`
        };
        return response.ok({
          body,
          headers
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent config map not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultFleetErrorHandler)({
        error,
        response
      });
    }
  } else {
    try {
      const fullAgentPolicy = await _services2.agentPolicyService.getFullAgentPolicy(soClient, agentPolicyId, {
        standalone: request.query.standalone === true
      });
      if (fullAgentPolicy) {
        const body = (0, _services.fullAgentPolicyToYaml)(fullAgentPolicy, _jsYaml.safeDump);
        const headers = {
          'content-type': 'text/x-yaml',
          'content-disposition': `attachment; filename="elastic-agent.yml"`
        };
        return response.ok({
          body,
          headers
        });
      } else {
        return response.customError({
          statusCode: 404,
          body: {
            message: 'Agent policy not found'
          }
        });
      }
    } catch (error) {
      return (0, _errors.defaultFleetErrorHandler)({
        error,
        response
      });
    }
  }
};
exports.downloadFullAgentPolicy = downloadFullAgentPolicy;
const getK8sManifest = async (context, request, response) => {
  try {
    var _request$query$fleetS, _request$query$enrolT;
    const fleetServer = (_request$query$fleetS = request.query.fleetServer) !== null && _request$query$fleetS !== void 0 ? _request$query$fleetS : '';
    const token = (_request$query$enrolT = request.query.enrolToken) !== null && _request$query$enrolT !== void 0 ? _request$query$enrolT : '';
    const fullAgentManifest = await _services2.agentPolicyService.getFullAgentManifest(fleetServer, token);
    if (fullAgentManifest) {
      const body = {
        item: fullAgentManifest
      };
      return response.ok({
        body
      });
    } else {
      return response.customError({
        statusCode: 404,
        body: {
          message: 'Agent manifest not found'
        }
      });
    }
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getK8sManifest = getK8sManifest;
const downloadK8sManifest = async (context, request, response) => {
  try {
    var _request$query$fleetS2, _request$query$enrolT2;
    const fleetServer = (_request$query$fleetS2 = request.query.fleetServer) !== null && _request$query$fleetS2 !== void 0 ? _request$query$fleetS2 : '';
    const token = (_request$query$enrolT2 = request.query.enrolToken) !== null && _request$query$enrolT2 !== void 0 ? _request$query$enrolT2 : '';
    const fullAgentManifest = await _services2.agentPolicyService.getFullAgentManifest(fleetServer, token);
    if (fullAgentManifest) {
      const body = fullAgentManifest;
      const headers = {
        'content-type': 'text/x-yaml',
        'content-disposition': `attachment; filename="elastic-agent-managed-kubernetes.yaml"`
      };
      return response.ok({
        body,
        headers
      });
    } else {
      return response.customError({
        statusCode: 404,
        body: {
          message: 'Agent manifest not found'
        }
      });
    }
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.downloadK8sManifest = downloadK8sManifest;