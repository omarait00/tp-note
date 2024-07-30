"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerAPIRoutes = void 0;
var _constants = require("../../constants");
var _types = require("../../types");
var AgentService = _interopRequireWildcard(require("../../services/agents"));
var _agent = require("../../types/rest_spec/agent");
var _handlers = require("./handlers");
var _actions_handlers = require("./actions_handlers");
var _unenroll_handler = require("./unenroll_handler");
var _upgrade_handler = require("./upgrade_handler");
var _request_diagnostics_handler = require("./request_diagnostics_handler");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerAPIRoutes = (router, config) => {
  // Get one
  router.get({
    path: _constants.AGENT_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentHandler);
  // Update
  router.put({
    path: _constants.AGENT_API_ROUTES.UPDATE_PATTERN,
    validate: _types.UpdateAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.updateAgentHandler);
  // Bulk Update Tags
  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UPDATE_AGENT_TAGS_PATTERN,
    validate: _agent.PostBulkUpdateAgentTagsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.bulkUpdateAgentTagsHandler);
  // Delete
  router.delete({
    path: _constants.AGENT_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteAgentRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.deleteAgentHandler);
  // List
  router.get({
    path: _constants.AGENT_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAgentsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentsHandler);
  // List Agent Tags
  router.get({
    path: _constants.AGENT_API_ROUTES.LIST_TAGS_PATTERN,
    validate: _types.GetTagsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentTagsHandler);

  // Agent actions
  router.post({
    path: _constants.AGENT_API_ROUTES.ACTIONS_PATTERN,
    validate: _types.PostNewAgentActionRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, (0, _actions_handlers.postNewAgentActionHandlerBuilder)({
    getAgent: AgentService.getAgentById,
    cancelAgentAction: AgentService.cancelAgentAction,
    createAgentAction: AgentService.createAgentAction,
    getAgentActions: AgentService.getAgentActions
  }));
  router.post({
    path: _constants.AGENT_API_ROUTES.CANCEL_ACTIONS_PATTERN,
    validate: _types.PostCancelActionRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, (0, _actions_handlers.postCancelActionHandlerBuilder)({
    getAgent: AgentService.getAgentById,
    cancelAgentAction: AgentService.cancelAgentAction,
    createAgentAction: AgentService.createAgentAction,
    getAgentActions: AgentService.getAgentActions
  }));
  router.post({
    path: _constants.AGENT_API_ROUTES.UNENROLL_PATTERN,
    validate: _types.PostAgentUnenrollRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _unenroll_handler.postAgentUnenrollHandler);
  router.put({
    path: _constants.AGENT_API_ROUTES.REASSIGN_PATTERN,
    validate: _types.PutAgentReassignRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.putAgentsReassignHandler);
  router.post({
    path: _constants.AGENT_API_ROUTES.REQUEST_DIAGNOSTICS_PATTERN,
    validate: _types.PostRequestDiagnosticsActionRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _request_diagnostics_handler.requestDiagnosticsHandler);
  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_REQUEST_DIAGNOSTICS_PATTERN,
    validate: _types.PostBulkRequestDiagnosticsActionRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _request_diagnostics_handler.bulkRequestDiagnosticsHandler);
  router.get({
    path: _constants.AGENT_API_ROUTES.LIST_UPLOADS_PATTERN,
    validate: _types.ListAgentUploadsRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentUploadsHandler);
  router.get({
    path: _constants.AGENT_API_ROUTES.GET_UPLOAD_FILE_PATTERN,
    validate: _types.GetAgentUploadFileRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentUploadFileHandler);

  // Get agent status for policy
  router.get({
    path: _constants.AGENT_API_ROUTES.STATUS_PATTERN,
    validate: _types.GetAgentStatusRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentStatusForAgentPolicyHandler);
  router.get({
    path: _constants.AGENT_API_ROUTES.STATUS_PATTERN_DEPRECATED,
    validate: _types.GetAgentStatusRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentStatusForAgentPolicyHandler);
  // Agent data
  router.get({
    path: _constants.AGENT_API_ROUTES.DATA_PATTERN,
    validate: _types.GetAgentDataRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAgentDataHandler);

  // upgrade agent
  router.post({
    path: _constants.AGENT_API_ROUTES.UPGRADE_PATTERN,
    validate: _types.PostAgentUpgradeRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _upgrade_handler.postAgentUpgradeHandler);
  // bulk upgrade
  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UPGRADE_PATTERN,
    validate: _types.PostBulkAgentUpgradeRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _upgrade_handler.postBulkAgentsUpgradeHandler);
  // Current upgrades
  router.get({
    path: _constants.AGENT_API_ROUTES.CURRENT_UPGRADES_PATTERN,
    validate: false,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _upgrade_handler.getCurrentUpgradesHandler);

  // Current actions
  router.get({
    path: _constants.AGENT_API_ROUTES.ACTION_STATUS_PATTERN,
    validate: _types.GetActionStatusRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getActionStatusHandler);

  // Bulk reassign
  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_REASSIGN_PATTERN,
    validate: _types.PostBulkAgentReassignRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.postBulkAgentsReassignHandler);

  // Bulk unenroll
  router.post({
    path: _constants.AGENT_API_ROUTES.BULK_UNENROLL_PATTERN,
    validate: _types.PostBulkAgentUnenrollRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _unenroll_handler.postBulkAgentsUnenrollHandler);

  // Available versions for upgrades
  router.get({
    path: _constants.AGENT_API_ROUTES.AVAILABLE_VERSIONS_PATTERN,
    validate: false,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handlers.getAvailableVersionsHandler);
};
exports.registerAPIRoutes = registerAPIRoutes;