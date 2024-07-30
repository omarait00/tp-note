"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EndpointFleetServicesFactory = void 0;
var _create_internal_readonly_so_client = require("../../utils/create_internal_readonly_so_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EndpointFleetServicesFactory {
  constructor(fleetDependencies, savedObjectsStart) {
    this.fleetDependencies = fleetDependencies;
    this.savedObjectsStart = savedObjectsStart;
  }
  asScoped(req) {
    const {
      agentPolicyService: agentPolicy,
      packagePolicyService: packagePolicy,
      agentService,
      packageService
    } = this.fleetDependencies;
    return {
      agent: agentService.asScoped(req),
      agentPolicy,
      packages: packageService.asScoped(req),
      packagePolicy,
      asInternal: this.asInternalUser.bind(this)
    };
  }
  asInternalUser() {
    const {
      agentPolicyService: agentPolicy,
      packagePolicyService: packagePolicy,
      agentService,
      packageService
    } = this.fleetDependencies;
    return {
      agent: agentService.asInternalUser,
      agentPolicy,
      packages: packageService.asInternalUser,
      packagePolicy,
      asScoped: this.asScoped.bind(this),
      internalReadonlySoClient: (0, _create_internal_readonly_so_client.createInternalReadonlySoClient)(this.savedObjectsStart)
    };
  }
}

/**
 * The set of Fleet services used by Endpoint
 */
exports.EndpointFleetServicesFactory = EndpointFleetServicesFactory;