"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;
var _constants = require("../../../common/constants");
var _types = require("../../types");
var _handler = require("./handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerRoutes = router => {
  router.get({
    path: _constants.FLEET_SERVER_HOST_API_ROUTES.LIST_PATTERN,
    validate: _types.GetAllFleetServerHostRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getAllFleetServerPolicyHandler);
  router.post({
    path: _constants.FLEET_SERVER_HOST_API_ROUTES.CREATE_PATTERN,
    validate: _types.PostFleetServerHostRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.postFleetServerHost);
  router.get({
    path: _constants.FLEET_SERVER_HOST_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneFleetServerHostRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getFleetServerPolicyHandler);
  router.delete({
    path: _constants.FLEET_SERVER_HOST_API_ROUTES.DELETE_PATTERN,
    validate: _types.GetOneFleetServerHostRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.deleteFleetServerPolicyHandler);
  router.put({
    path: _constants.FLEET_SERVER_HOST_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutFleetServerHostRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.putFleetServerPolicyHandler);
};
exports.registerRoutes = registerRoutes;