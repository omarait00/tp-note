"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInstalledIntegrationsRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _promise_pool = require("../../../../../utils/promise_pool");
var _utils = require("../../../routes/utils");
var _fleet_integrations = require("../../../../../../common/detection_engine/fleet_integrations");
var _installed_integration_set = require("./installed_integration_set");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_CONCURRENT_REQUESTS_TO_PACKAGE_REGISTRY = 5;

/**
 * Returns an array of installed Fleet integrations and their packages.
 */
const getInstalledIntegrationsRoute = (router, logger) => {
  router.get({
    path: _fleet_integrations.GET_INSTALLED_INTEGRATIONS_URL,
    validate: {},
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const ctx = await context.resolve(['core', 'securitySolution']);
      const fleet = ctx.securitySolution.getInternalFleetServices();
      const set = (0, _installed_integration_set.createInstalledIntegrationSet)();
      const packagePolicies = await fleet.packagePolicy.list(fleet.internalReadonlySoClient, {});
      packagePolicies.items.forEach(policy => {
        set.addPackagePolicy(policy);
      });
      const registryPackages = await (0, _promise_pool.initPromisePool)({
        concurrency: MAX_CONCURRENT_REQUESTS_TO_PACKAGE_REGISTRY,
        items: set.getPackages(),
        executor: async packageInfo => {
          const registryPackage = await fleet.packages.getPackage(packageInfo.package_name, packageInfo.package_version);
          return registryPackage;
        }
      });
      if (registryPackages.errors.length > 0) {
        const errors = registryPackages.errors.map(({
          error,
          item
        }) => {
          return {
            error,
            packageId: `${item.package_name}@${item.package_version}`
          };
        });
        const packages = errors.map(e => e.packageId).join(', ');
        logger.error(`Unable to retrieve installed integrations. Error fetching packages from registry: ${packages}.`);
        errors.forEach(({
          error,
          packageId
        }) => {
          const logMessage = `Error fetching package info from registry for ${packageId}`;
          const logReason = error instanceof Error ? error.message : String(error);
          logger.debug(`${logMessage}. ${logReason}`);
        });
      }
      registryPackages.results.forEach(({
        result
      }) => {
        set.addRegistryPackage(result.packageInfo);
      });
      const installedIntegrations = set.getIntegrations();
      const body = {
        installed_integrations: installedIntegrations
      };
      return response.ok({
        body
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getInstalledIntegrationsRoute = getInstalledIntegrationsRoute;