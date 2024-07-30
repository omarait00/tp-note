"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.agentConfigurationRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _ioTsUtils = require("@kbn/io-ts-utils");
var _common = require("../../../../../observability/common");
var _create_or_update_configuration = require("./create_or_update_configuration");
var _search_configurations = require("./search_configurations");
var _find_exact_configuration = require("./find_exact_configuration");
var _list_configurations = require("./list_configurations");
var _get_environments = require("./get_environments");
var _delete_configuration = require("./delete_configuration");
var _create_apm_server_route = require("../../apm_routes/create_apm_server_route");
var _get_agent_name_by_service = require("./get_agent_name_by_service");
var _mark_applied_by_agent = require("./mark_applied_by_agent");
var _agent_configuration_intake_rt = require("../../../../common/agent_configuration/runtime_types/agent_configuration_intake_rt");
var _transactions = require("../../../lib/helpers/transactions");
var _sync_agent_configs_to_apm_package_policies = require("../../fleet/sync_agent_configs_to_apm_package_policies");
var _get_apm_event_client = require("../../../lib/helpers/get_apm_event_client");
var _create_internal_es_client = require("../../../lib/helpers/create_es_client/create_internal_es_client");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// get list of configurations
const agentConfigurationRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context,
      request,
      params,
      config
    } = resources;
    const internalESClient = await (0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: params.query._inspect,
      config
    });
    const configurations = await (0, _list_configurations.listConfigurations)(internalESClient);
    return {
      configurations
    };
  }
});

// get a single configuration
const getSingleAgentConfigurationRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/view',
  params: t.partial({
    query: _agent_configuration_intake_rt.serviceRt
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      params,
      logger,
      context,
      request,
      config
    } = resources;
    const {
      name,
      environment,
      _inspect
    } = params.query;
    const service = {
      name,
      environment
    };
    const internalESClient = await (0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: _inspect,
      config
    });
    const exactConfig = await (0, _find_exact_configuration.findExactConfiguration)({
      service,
      internalESClient
    });
    if (!exactConfig) {
      logger.info(`Config was not found for ${service.name}/${service.environment}`);
      throw _boom.default.notFound();
    }
    return exactConfig;
  }
});

// delete configuration
const deleteAgentConfigurationRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'DELETE /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.type({
    body: t.type({
      service: _agent_configuration_intake_rt.serviceRt
    })
  }),
  handler: async resources => {
    const {
      params,
      logger,
      core,
      telemetryUsageCounter,
      context,
      request,
      config
    } = resources;
    const {
      service
    } = params.body;
    const internalESClient = await (0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: params.query._inspect,
      config
    });
    const exactConfig = await (0, _find_exact_configuration.findExactConfiguration)({
      service,
      internalESClient
    });
    if (!exactConfig) {
      logger.info(`Config was not found for ${service.name}/${service.environment}`);
      throw _boom.default.notFound();
    }
    logger.info(`Deleting config ${service.name}/${service.environment} (${exactConfig.id})`);
    const deleteConfigurationResult = await (0, _delete_configuration.deleteConfiguration)({
      configurationId: exactConfig.id,
      internalESClient
    });
    if (resources.plugins.fleet) {
      await (0, _sync_agent_configs_to_apm_package_policies.syncAgentConfigsToApmPackagePolicies)({
        core,
        fleetPluginStart: await resources.plugins.fleet.start(),
        internalESClient,
        telemetryUsageCounter
      });
      logger.info(`Updated Fleet integration policy for APM to remove the deleted agent configuration.`);
    }
    return deleteConfigurationResult;
  }
});

// create/update configuration
const createOrUpdateAgentConfigurationRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'PUT /api/apm/settings/agent-configuration',
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  params: t.intersection([t.partial({
    query: t.partial({
      overwrite: _ioTsUtils.toBooleanRt
    })
  }), t.type({
    body: _agent_configuration_intake_rt.agentConfigurationIntakeRt
  })]),
  handler: async resources => {
    const {
      params,
      logger,
      core,
      telemetryUsageCounter,
      context,
      request,
      config
    } = resources;
    const {
      body,
      query
    } = params;
    const internalESClient = await (0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: params.query._inspect,
      config
    });

    // if the config already exists, it is fetched and updated
    // this is to avoid creating two configs with identical service params
    const exactConfig = await (0, _find_exact_configuration.findExactConfiguration)({
      service: body.service,
      internalESClient
    });

    // if the config exists ?overwrite=true is required
    if (exactConfig && !query.overwrite) {
      throw _boom.default.badRequest(`A configuration already exists for "${body.service.name}/${body.service.environment}. Use ?overwrite=true to overwrite the existing configuration.`);
    }
    logger.info(`${exactConfig ? 'Updating' : 'Creating'} config ${body.service.name}/${body.service.environment}`);
    await (0, _create_or_update_configuration.createOrUpdateConfiguration)({
      configurationId: exactConfig === null || exactConfig === void 0 ? void 0 : exactConfig.id,
      configurationIntake: body,
      internalESClient
    });
    if (resources.plugins.fleet) {
      await (0, _sync_agent_configs_to_apm_package_policies.syncAgentConfigsToApmPackagePolicies)({
        core,
        fleetPluginStart: await resources.plugins.fleet.start(),
        internalESClient,
        telemetryUsageCounter
      });
      logger.info(`Saved latest agent settings to Fleet integration policy for APM.`);
    }
  }
});
const searchParamsRt = t.intersection([t.type({
  service: _agent_configuration_intake_rt.serviceRt
}), t.partial({
  etag: t.string,
  mark_as_applied_by_agent: t.boolean
})]);
// Lookup single configuration (used by APM Server)
const agentConfigurationSearchRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /api/apm/settings/agent-configuration/search',
  params: t.type({
    body: searchParamsRt
  }),
  options: {
    tags: ['access:apm'],
    disableTelemetry: true
  },
  handler: async resources => {
    const {
      params,
      logger,
      context,
      config,
      request
    } = resources;
    const {
      service,
      etag,
      mark_as_applied_by_agent: markAsAppliedByAgent
    } = params.body;
    const internalESClient = await (0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: params.query._inspect,
      config
    });
    const configuration = await (0, _search_configurations.searchConfigurations)({
      service,
      internalESClient
    });
    if (!configuration) {
      logger.debug(`[Central configuration] Config was not found for ${service.name}/${service.environment}`);
      return null;
    }

    // whether to update `applied_by_agent` field
    // It will be set to true of the etags match or if `markAsAppliedByAgent=true`
    // `markAsAppliedByAgent=true` means "force setting it to true regardless of etag". This is needed for Jaeger agent that doesn't have etags
    const willMarkAsApplied = (markAsAppliedByAgent || etag === configuration._source.etag) && !configuration._source.applied_by_agent;
    logger.debug(`[Central configuration] Config was found for:
        service.name = ${service.name},
        service.environment = ${service.environment},
        etag (requested) = ${etag},
        etag (existing) = ${configuration._source.etag},
        markAsAppliedByAgent = ${markAsAppliedByAgent},
        willMarkAsApplied = ${willMarkAsApplied}`);
    if (willMarkAsApplied) {
      (0, _mark_applied_by_agent.markAppliedByAgent)({
        id: configuration._id,
        body: configuration._source,
        internalESClient
      });
    }
    return configuration;
  }
});

/*
 * Utility endpoints (not documented as part of the public API)
 */

// get environments for service
const listAgentConfigurationEnvironmentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/environments',
  params: t.partial({
    query: t.partial({
      serviceName: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const {
      context,
      request,
      params,
      config
    } = resources;
    const [internalESClient, apmEventClient] = await Promise.all([(0, _create_internal_es_client.createInternalESClient)({
      context,
      request,
      debug: params.query._inspect,
      config
    }), (0, _get_apm_event_client.getApmEventClient)(resources)]);
    const coreContext = await context.core;
    const {
      serviceName,
      start,
      end
    } = params.query;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config,
      kuery: '',
      start,
      end
    });
    const size = await coreContext.uiSettings.client.get(_common.maxSuggestions);
    const environments = await (0, _get_environments.getEnvironments)({
      serviceName,
      internalESClient,
      apmEventClient,
      searchAggregatedTransactions,
      size
    });
    return {
      environments
    };
  }
});

// get agentName for service
const agentConfigurationAgentNameRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /api/apm/settings/agent-configuration/agent_name',
  params: t.type({
    query: t.type({
      serviceName: t.string
    })
  }),
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const {
      params
    } = resources;
    const {
      serviceName
    } = params.query;
    const agentName = await (0, _get_agent_name_by_service.getAgentNameByService)({
      serviceName,
      apmEventClient
    });
    return {
      agentName
    };
  }
});
const agentConfigurationRouteRepository = {
  ...agentConfigurationRoute,
  ...getSingleAgentConfigurationRoute,
  ...deleteAgentConfigurationRoute,
  ...createOrUpdateAgentConfigurationRoute,
  ...agentConfigurationSearchRoute,
  ...listAgentConfigurationEnvironmentsRoute,
  ...agentConfigurationAgentNameRoute
};
exports.agentConfigurationRouteRepository = agentConfigurationRouteRepository;