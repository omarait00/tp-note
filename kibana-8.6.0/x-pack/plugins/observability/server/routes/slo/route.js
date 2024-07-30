"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slosRouteRepository = void 0;
var _slo = require("../../services/slo");
var _transform_generators = require("../../services/slo/transform_generators");
var _rest_specs = require("../../types/rest_specs");
var _create_observability_server_route = require("../create_observability_server_route");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformGenerators = {
  'sli.apm.transaction_duration': new _transform_generators.ApmTransactionDurationTransformGenerator(),
  'sli.apm.transaction_error_rate': new _transform_generators.ApmTransactionErrorRateTransformGenerator(),
  'sli.kql.custom': new _transform_generators.KQLCustomTransformGenerator()
};
const createSLORoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'POST /api/observability/slos',
  options: {
    tags: []
  },
  params: _rest_specs.createSLOParamsSchema,
  handler: async ({
    context,
    params,
    logger
  }) => {
    const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    const soClient = (await context.core).savedObjects.client;
    const resourceInstaller = new _slo.DefaultResourceInstaller(esClient, logger);
    const repository = new _slo.KibanaSavedObjectsSLORepository(soClient);
    const transformManager = new _slo.DefaultTransformManager(transformGenerators, esClient, logger);
    const createSLO = new _slo.CreateSLO(resourceInstaller, repository, transformManager);
    const response = await createSLO.execute(params.body);
    return response;
  }
});
const updateSLORoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'PUT /api/observability/slos/{id}',
  options: {
    tags: []
  },
  params: _rest_specs.updateSLOParamsSchema,
  handler: async ({
    context,
    params,
    logger
  }) => {
    const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    const soClient = (await context.core).savedObjects.client;
    const repository = new _slo.KibanaSavedObjectsSLORepository(soClient);
    const transformManager = new _slo.DefaultTransformManager(transformGenerators, esClient, logger);
    const updateSLO = new _slo.UpdateSLO(repository, transformManager, esClient);
    const response = await updateSLO.execute(params.path.id, params.body);
    return response;
  }
});
const deleteSLORoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'DELETE /api/observability/slos/{id}',
  options: {
    tags: []
  },
  params: _rest_specs.deleteSLOParamsSchema,
  handler: async ({
    context,
    params,
    logger
  }) => {
    const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    const soClient = (await context.core).savedObjects.client;
    const repository = new _slo.KibanaSavedObjectsSLORepository(soClient);
    const transformManager = new _slo.DefaultTransformManager(transformGenerators, esClient, logger);
    const deleteSLO = new _slo.DeleteSLO(repository, transformManager, esClient);
    await deleteSLO.execute(params.path.id);
  }
});
const getSLORoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'GET /api/observability/slos/{id}',
  options: {
    tags: []
  },
  params: _rest_specs.getSLOParamsSchema,
  handler: async ({
    context,
    params
  }) => {
    const soClient = (await context.core).savedObjects.client;
    const esClient = (await context.core).elasticsearch.client.asCurrentUser;
    const repository = new _slo.KibanaSavedObjectsSLORepository(soClient);
    const sliClient = new _slo.DefaultSLIClient(esClient);
    const getSLO = new _slo.GetSLO(repository, sliClient);
    const response = await getSLO.execute(params.path.id);
    return response;
  }
});
const findSLORoute = (0, _create_observability_server_route.createObservabilityServerRoute)({
  endpoint: 'GET /api/observability/slos',
  options: {
    tags: []
  },
  params: _rest_specs.findSLOParamsSchema,
  handler: async ({
    context,
    params
  }) => {
    var _params$query;
    const soClient = (await context.core).savedObjects.client;
    const repository = new _slo.KibanaSavedObjectsSLORepository(soClient);
    const findSLO = new _slo.FindSLO(repository);
    const response = await findSLO.execute((_params$query = params === null || params === void 0 ? void 0 : params.query) !== null && _params$query !== void 0 ? _params$query : {});
    return response;
  }
});
const slosRouteRepository = {
  ...createSLORoute,
  ...updateSLORoute,
  ...getSLORoute,
  ...deleteSLORoute,
  ...findSLORoute
};
exports.slosRouteRepository = slosRouteRepository;