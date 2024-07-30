"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;
var _constants = require("../../constants");
var _types = require("../../types");
var _constants2 = require("../../../common/constants");
var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRoutes = router => {
  // List - Fleet Server needs access to run setup
  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentPoliciesRequestSchema,
    fleetAuthz: {
      fleet: {
        readAgentPolicies: true
      }
    }
  }, _handlers.getAgentPoliciesHandler);

  // Bulk GET
  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.BULK_GET_PATTERN,
    validate: _types.BulkGetAgentPoliciesRequestSchema,
    fleetAuthz: {
      fleet: {
        readAgentPolicies: true
      }
    }
  }, _handlers.bulkGetAgentPoliciesHandler);

  // Get one
  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getOneAgentPolicyHandler);

  // Create
  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.CREATE_PATTERN,
    validate: _types.CreateAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.createAgentPolicyHandler);

  // Update
  router.put({
    path: _constants.AGENT_POLICY_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.updateAgentPolicyHandler);

  // Copy
  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.COPY_PATTERN,
    validate: _types.CopyAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.copyAgentPolicyHandler);

  // Delete
  router.post({
    path: _constants.AGENT_POLICY_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.deleteAgentPoliciesHandler);

  // Get one full agent policy
  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getFullAgentPolicy);

  // Download one full agent policy
  router.get({
    path: _constants.AGENT_POLICY_API_ROUTES.FULL_INFO_DOWNLOAD_PATTERN,
    validate: _types.GetFullAgentPolicyRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.downloadFullAgentPolicy);

  // Get agent manifest
  router.get({
    path: _constants2.K8S_API_ROUTES.K8S_INFO_PATTERN,
    validate: _types.GetK8sManifestRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getK8sManifest);

  // Download agent manifest
  router.get({
    path: _constants2.K8S_API_ROUTES.K8S_DOWNLOAD_PATTERN,
    validate: _types.GetK8sManifestRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.downloadK8sManifest);
};
exports.registerRoutes = registerRoutes;