"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upgradePackagePolicyHandler = exports.updatePackagePolicyHandler = exports.getPackagePoliciesHandler = exports.getOrphanedPackagePolicies = exports.getOnePackagePolicyHandler = exports.dryRunUpgradePackagePolicyHandler = exports.deletePackagePolicyHandler = exports.deleteOnePackagePolicyHandler = exports.createPackagePolicyHandler = exports.bulkGetPackagePoliciesHandler = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _server = require("../../../../../../src/core/server");
var _lodash = require("lodash");
var _services = require("../../services");
var _constants = require("../../../common/constants");
var _errors = require("../../errors");
var _packages = require("../../services/epm/packages");
var _constants2 = require("../../constants");
var _simplified_package_policy_helper = require("../../../common/services/simplified_package_policy_helper");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPackagePoliciesHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const {
      items,
      total,
      page,
      perPage
    } = await _services.packagePolicyService.list(soClient, request.query);
    return response.ok({
      body: {
        items,
        total,
        page,
        perPage
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getPackagePoliciesHandler = getPackagePoliciesHandler;
const bulkGetPackagePoliciesHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  const {
    ids,
    ignoreMissing
  } = request.body;
  try {
    const items = await _services.packagePolicyService.getByIDs(soClient, ids, {
      ignoreMissing
    });
    const body = {
      items: items !== null && items !== void 0 ? items : []
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error instanceof _errors.PackagePolicyNotFoundError) {
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
exports.bulkGetPackagePoliciesHandler = bulkGetPackagePoliciesHandler;
const getOnePackagePolicyHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  const {
    packagePolicyId
  } = request.params;
  const notFoundResponse = () => response.notFound({
    body: {
      message: `Package policy ${packagePolicyId} not found`
    }
  });
  try {
    const packagePolicy = await _services.packagePolicyService.get(soClient, packagePolicyId);
    if (packagePolicy) {
      return response.ok({
        body: {
          item: packagePolicy
        }
      });
    } else {
      return notFoundResponse();
    }
  } catch (error) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(error)) {
      return notFoundResponse();
    } else {
      return (0, _errors.defaultFleetErrorHandler)({
        error,
        response
      });
    }
  }
};
exports.getOnePackagePolicyHandler = getOnePackagePolicyHandler;
const getOrphanedPackagePolicies = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const installedPackages = await (0, _packages.getInstallations)(soClient, {
      perPage: _constants2.SO_SEARCH_LIMIT,
      filter: `
        ${_constants2.PACKAGES_SAVED_OBJECT_TYPE}.attributes.install_status:${_constants.installationStatuses.Installed}
    `
    });
    const orphanedPackagePolicies = [];
    const packagePolicies = await _services.packagePolicyService.list(soClient, {
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const packagePoliciesByPackage = (0, _lodash.groupBy)(packagePolicies.items, 'package.name');
    const agentPolicies = await _services.agentPolicyService.list(soClient, {
      perPage: _constants2.SO_SEARCH_LIMIT
    });
    const agentPoliciesById = (0, _lodash.keyBy)(agentPolicies.items, 'id');
    const usedPackages = installedPackages.saved_objects.filter(({
      attributes: {
        name
      }
    }) => !!packagePoliciesByPackage[name]);
    usedPackages.forEach(({
      attributes: {
        name
      }
    }) => {
      packagePoliciesByPackage[name].forEach(packagePolicy => {
        if (!agentPoliciesById[packagePolicy.policy_id]) {
          orphanedPackagePolicies.push(packagePolicy);
        }
      });
    });
    return response.ok({
      body: {
        items: orphanedPackagePolicies,
        total: orphanedPackagePolicies.length
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.getOrphanedPackagePolicies = getOrphanedPackagePolicies;
function isSimplifiedCreatePackagePolicyRequest(body) {
  // If `inputs` is not defined or if it's a non-array, the request body is using the new simplified API
  if (body.inputs && Array.isArray(body.inputs)) {
    return false;
  }
  return true;
}
const createPackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge;
  const coreContext = await context.core;
  const fleetContext = await context.fleet;
  const soClient = fleetContext.epm.internalSoClient;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge = _services.appContextService.getSecurity()) === null || _appContextService$ge === void 0 ? void 0 : _appContextService$ge.authc.getCurrentUser(request)) || undefined;
  const {
    force,
    package: pkg,
    ...newPolicy
  } = request.body;
  if ('output_id' in newPolicy) {
    // TODO Remove deprecated APIs https://github.com/elastic/kibana/issues/121485
    delete newPolicy.output_id;
  }
  const spaceId = fleetContext.spaceId;
  try {
    let newPackagePolicy;
    if (isSimplifiedCreatePackagePolicyRequest(newPolicy)) {
      if (!pkg) {
        throw new Error('Package is required');
      }
      const pkgInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkg.name,
        pkgVersion: pkg.version,
        ignoreUnverified: force,
        prerelease: true
      });
      newPackagePolicy = (0, _simplified_package_policy_helper.simplifiedPackagePolicytoNewPackagePolicy)(newPolicy, pkgInfo, {
        experimental_data_stream_features: pkg.experimental_data_stream_features
      });
    } else {
      newPackagePolicy = await _services.packagePolicyService.enrichPolicyWithDefaultsFromPackage(soClient, {
        ...newPolicy,
        package: pkg
      });
    }
    const newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyCreate', newPackagePolicy, context, request);

    // Create package policy
    const packagePolicy = await fleetContext.packagePolicyService.asCurrentUser.create(soClient, esClient, newData, {
      user,
      force,
      spaceId
    });
    const enrichedPackagePolicy = await _services.packagePolicyService.runExternalCallbacks('packagePolicyPostCreate', packagePolicy, context, request);
    const body = {
      item: enrichedPackagePolicy
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.statusCode) {
      return response.customError({
        statusCode: error.statusCode,
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
exports.createPackagePolicyHandler = createPackagePolicyHandler;
const updatePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge2;
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge2 = _services.appContextService.getSecurity()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.authc.getCurrentUser(request)) || undefined;
  const packagePolicy = await _services.packagePolicyService.get(soClient, request.params.packagePolicyId);
  if (!packagePolicy) {
    throw _boom.default.notFound('Package policy not found');
  }
  try {
    var _packagePolicy$packag;
    const {
      force,
      package: pkg,
      ...body
    } = request.body;
    // TODO Remove deprecated APIs https://github.com/elastic/kibana/issues/121485
    if ('output_id' in body) {
      delete body.output_id;
    }
    let newData;
    if (body.inputs && isSimplifiedCreatePackagePolicyRequest(body)) {
      if (!pkg) {
        throw new Error('package is required');
      }
      const pkgInfo = await (0, _packages.getPackageInfo)({
        savedObjectsClient: soClient,
        pkgName: pkg.name,
        pkgVersion: pkg.version
      });
      newData = (0, _simplified_package_policy_helper.simplifiedPackagePolicytoNewPackagePolicy)(body, pkgInfo, {
        experimental_data_stream_features: pkg.experimental_data_stream_features
      });
    } else {
      var _body$name, _body$description, _body$namespace, _body$policy_id, _body$enabled, _body$inputs, _body$vars;
      // removed fields not recognized by schema
      const packagePolicyInputs = packagePolicy.inputs.map(input => {
        const newInput = {
          ...input,
          streams: input.streams.map(stream => {
            const newStream = {
              ...stream
            };
            delete newStream.compiled_stream;
            return newStream;
          })
        };
        delete newInput.compiled_input;
        return newInput;
      });
      // listing down accepted properties, because loaded packagePolicy contains some that are not accepted in update
      newData = {
        ...body,
        name: (_body$name = body.name) !== null && _body$name !== void 0 ? _body$name : packagePolicy.name,
        description: (_body$description = body.description) !== null && _body$description !== void 0 ? _body$description : packagePolicy.description,
        namespace: (_body$namespace = body.namespace) !== null && _body$namespace !== void 0 ? _body$namespace : packagePolicy.namespace,
        policy_id: (_body$policy_id = body.policy_id) !== null && _body$policy_id !== void 0 ? _body$policy_id : packagePolicy.policy_id,
        enabled: 'enabled' in body ? (_body$enabled = body.enabled) !== null && _body$enabled !== void 0 ? _body$enabled : packagePolicy.enabled : packagePolicy.enabled,
        package: pkg !== null && pkg !== void 0 ? pkg : packagePolicy.package,
        inputs: (_body$inputs = body.inputs) !== null && _body$inputs !== void 0 ? _body$inputs : packagePolicyInputs,
        vars: (_body$vars = body.vars) !== null && _body$vars !== void 0 ? _body$vars : packagePolicy.vars
      };
    }
    newData = await _services.packagePolicyService.runExternalCallbacks('packagePolicyUpdate', newData, context, request);
    const updatedPackagePolicy = await _services.packagePolicyService.update(soClient, esClient, request.params.packagePolicyId, newData, {
      user,
      force
    }, (_packagePolicy$packag = packagePolicy.package) === null || _packagePolicy$packag === void 0 ? void 0 : _packagePolicy$packag.version);
    return response.ok({
      body: {
        item: updatedPackagePolicy
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.updatePackagePolicyHandler = updatePackagePolicyHandler;
const deletePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge3;
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge3 = _services.appContextService.getSecurity()) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.authc.getCurrentUser(request)) || undefined;
  try {
    const body = await _services.packagePolicyService.delete(soClient, esClient, request.body.packagePolicyIds, {
      user,
      force: request.body.force,
      skipUnassignFromAgentPolicies: request.body.force
    });
    try {
      await _services.packagePolicyService.runExternalCallbacks('postPackagePolicyDelete', body, context, request);
    } catch (error) {
      const logger = _services.appContextService.getLogger();
      logger.error(`An error occurred executing external callback: ${error}`);
      logger.error(error);
    }
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
exports.deletePackagePolicyHandler = deletePackagePolicyHandler;
const deleteOnePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge4;
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge4 = _services.appContextService.getSecurity()) === null || _appContextService$ge4 === void 0 ? void 0 : _appContextService$ge4.authc.getCurrentUser(request)) || undefined;
  try {
    const res = await _services.packagePolicyService.delete(soClient, esClient, [request.params.packagePolicyId], {
      user,
      force: request.query.force,
      skipUnassignFromAgentPolicies: request.query.force
    });
    if (res[0] && res[0].success === false && res[0].statusCode !== 404 // ignore 404 to allow that call to be idempotent
    ) {
      var _res$0$statusCode;
      return response.customError({
        statusCode: (_res$0$statusCode = res[0].statusCode) !== null && _res$0$statusCode !== void 0 ? _res$0$statusCode : 500,
        body: res[0].body
      });
    }
    try {
      await _services.packagePolicyService.runExternalCallbacks('postPackagePolicyDelete', res, context, request);
    } catch (error) {
      const logger = _services.appContextService.getLogger();
      logger.error(`An error occurred executing external callback: ${error}`);
      logger.error(error);
    }
    return response.ok({
      body: {
        id: request.params.packagePolicyId
      }
    });
  } catch (error) {
    return (0, _errors.defaultFleetErrorHandler)({
      error,
      response
    });
  }
};
exports.deleteOnePackagePolicyHandler = deleteOnePackagePolicyHandler;
const upgradePackagePolicyHandler = async (context, request, response) => {
  var _appContextService$ge5;
  const coreContext = await context.core;
  const soClient = coreContext.savedObjects.client;
  const esClient = coreContext.elasticsearch.client.asInternalUser;
  const user = ((_appContextService$ge5 = _services.appContextService.getSecurity()) === null || _appContextService$ge5 === void 0 ? void 0 : _appContextService$ge5.authc.getCurrentUser(request)) || undefined;
  try {
    const body = await _services.packagePolicyService.upgrade(soClient, esClient, request.body.packagePolicyIds, {
      user
    });
    const firstFatalError = body.find(item => item.statusCode && item.statusCode !== 200);
    if (firstFatalError) {
      return response.customError({
        statusCode: firstFatalError.statusCode,
        body: {
          message: firstFatalError.body.message
        }
      });
    }
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
exports.upgradePackagePolicyHandler = upgradePackagePolicyHandler;
const dryRunUpgradePackagePolicyHandler = async (context, request, response) => {
  const soClient = (await context.core).savedObjects.client;
  try {
    const body = [];
    const {
      packagePolicyIds
    } = request.body;
    for (const id of packagePolicyIds) {
      const result = await _services.packagePolicyService.getUpgradeDryRunDiff(soClient, id);
      body.push(result);
    }
    const firstFatalError = body.find(item => item.statusCode && item.statusCode !== 200);
    if (firstFatalError) {
      return response.customError({
        statusCode: firstFatalError.statusCode,
        body: {
          message: firstFatalError.body.message
        }
      });
    }
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
exports.dryRunUpgradePackagePolicyHandler = dryRunUpgradePackagePolicyHandler;