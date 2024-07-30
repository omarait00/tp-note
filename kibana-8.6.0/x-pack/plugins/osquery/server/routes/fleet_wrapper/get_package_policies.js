"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPackagePoliciesRoute = void 0;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../../../fleet/common");
var _common2 = require("../../../common");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPackagePoliciesRoute = (router, osqueryContext) => {
  router.get({
    path: '/internal/osquery/fleet_wrapper/package_policies',
    validate: {
      query: _configSchema.schema.object({}, {
        unknowns: 'allow'
      })
    },
    options: {
      tags: [`access:${_common2.PLUGIN_ID}-read`]
    }
  }, async (context, request, response) => {
    const internalSavedObjectsClient = await (0, _utils.getInternalSavedObjectsClient)(osqueryContext.getStartServices);
    const kuery = `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.attributes.package.name: ${_common2.OSQUERY_INTEGRATION_NAME}`;
    const packagePolicyService = osqueryContext.service.getPackagePolicyService();
    const policies = await (packagePolicyService === null || packagePolicyService === void 0 ? void 0 : packagePolicyService.list(internalSavedObjectsClient, {
      kuery
    }));
    return response.ok({
      body: policies
    });
  });
};
exports.getPackagePoliciesRoute = getPackagePoliciesRoute;