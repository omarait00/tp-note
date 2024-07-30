"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anomalyDetectionRouteRepository = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _common = require("../../../../../observability/common");
var _license_check = require("../../../../common/license_check");
var _anomaly_detection = require("../../../../common/anomaly_detection");
var _create_apm_server_route = require("../../apm_routes/create_apm_server_route");
var _create_anomaly_detection_jobs = require("../../../lib/anomaly_detection/create_anomaly_detection_jobs");
var _get_ml_client = require("../../../lib/helpers/get_ml_client");
var _get_all_environments = require("../../environments/get_all_environments");
var _transactions = require("../../../lib/helpers/transactions");
var _feature = require("../../../feature");
var _update_to_v = require("./update_to_v3");
var _environment_rt = require("../../../../common/environment_rt");
var _get_ml_jobs_with_apm_group = require("../../../lib/anomaly_detection/get_ml_jobs_with_apm_group");
var _get_apm_event_client = require("../../../lib/helpers/get_apm_event_client");
var _get_apm_indices = require("../apm_indices/get_apm_indices");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// get ML anomaly detection jobs for each environment
const anomalyDetectionJobsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/anomaly-detection/jobs',
  options: {
    tags: ['access:apm', 'access:ml:canGetJobs']
  },
  handler: async resources => {
    const mlClient = await (0, _get_ml_client.getMlClient)(resources);
    const {
      context
    } = resources;
    const licensingContext = await context.licensing;
    if (!(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.INVALID_LICENSE);
    }
    if (!mlClient) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.ML_NOT_AVAILABLE);
    }
    const jobs = await (0, _get_ml_jobs_with_apm_group.getMlJobsWithAPMGroup)(mlClient === null || mlClient === void 0 ? void 0 : mlClient.anomalyDetectors);
    return {
      jobs,
      hasLegacyJobs: jobs.some(job => job.version === 1)
    };
  }
});

// create new ML anomaly detection jobs for each given environment
const createAnomalyDetectionJobsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/settings/anomaly-detection/jobs',
  options: {
    tags: ['access:apm', 'access:apm_write', 'access:ml:canCreateJob']
  },
  params: t.type({
    body: t.type({
      environments: t.array(_environment_rt.environmentStringRt)
    })
  }),
  handler: async resources => {
    const {
      params,
      context,
      logger,
      config
    } = resources;
    const {
      environments
    } = params.body;
    const licensingContext = await context.licensing;
    const coreContext = await context.core;
    const [mlClient, indices] = await Promise.all([(0, _get_ml_client.getMlClient)(resources), (0, _get_apm_indices.getApmIndices)({
      savedObjectsClient: coreContext.savedObjects.client,
      config
    })]);
    if (!(0, _license_check.isActivePlatinumLicense)(licensingContext.license)) {
      throw _boom.default.forbidden(_anomaly_detection.ML_ERRORS.INVALID_LICENSE);
    }
    await (0, _create_anomaly_detection_jobs.createAnomalyDetectionJobs)({
      mlClient,
      indices,
      environments,
      logger
    });
    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: licensingContext,
      featureName: 'ml'
    });
    return {
      jobCreated: true
    };
  }
});

// get all available environments to create anomaly detection jobs for
const anomalyDetectionEnvironmentsRoute = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'GET /internal/apm/settings/anomaly-detection/environments',
  options: {
    tags: ['access:apm']
  },
  handler: async resources => {
    const apmEventClient = await (0, _get_apm_event_client.getApmEventClient)(resources);
    const coreContext = await resources.context.core;
    const searchAggregatedTransactions = await (0, _transactions.getSearchTransactionsEvents)({
      apmEventClient,
      config: resources.config,
      kuery: ''
    });
    const size = await coreContext.uiSettings.client.get(_common.maxSuggestions);
    const environments = await (0, _get_all_environments.getAllEnvironments)({
      includeMissing: true,
      searchAggregatedTransactions,
      apmEventClient,
      size
    });
    return {
      environments
    };
  }
});
const anomalyDetectionUpdateToV3Route = (0, _create_apm_server_route.createApmServerRoute)({
  endpoint: 'POST /internal/apm/settings/anomaly-detection/update_to_v3',
  options: {
    tags: ['access:apm', 'access:apm_write', 'access:ml:canCreateJob', 'access:ml:canGetJobs', 'access:ml:canCloseJob']
  },
  handler: async resources => {
    const {
      config,
      context
    } = resources;
    const coreContext = await context.core;
    const [mlClient, esClient, indices] = await Promise.all([(0, _get_ml_client.getMlClient)(resources), resources.core.start().then(start => start.elasticsearch.client.asInternalUser), (0, _get_apm_indices.getApmIndices)({
      config,
      savedObjectsClient: coreContext.savedObjects.client
    })]);
    const {
      logger
    } = resources;
    return {
      update: await (0, _update_to_v.updateToV3)({
        mlClient,
        logger,
        indices,
        esClient
      })
    };
  }
});
const anomalyDetectionRouteRepository = {
  ...anomalyDetectionJobsRoute,
  ...createAnomalyDetectionJobsRoute,
  ...anomalyDetectionEnvironmentsRoute,
  ...anomalyDetectionUpdateToV3Route
};
exports.anomalyDetectionRouteRepository = anomalyDetectionRouteRepository;