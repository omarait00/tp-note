"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;
var _constants = require("../../constants");
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
    path: _constants.DOWNLOAD_SOURCE_API_ROUTES.LIST_PATTERN,
    validate: _types.getDownloadSourcesRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getDownloadSourcesHandler);
  router.get({
    path: _constants.DOWNLOAD_SOURCE_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneDownloadSourcesRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.getOneDownloadSourcesHandler);
  router.put({
    path: _constants.DOWNLOAD_SOURCE_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutDownloadSourcesRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.putDownloadSourcesHandler);
  router.post({
    path: _constants.DOWNLOAD_SOURCE_API_ROUTES.CREATE_PATTERN,
    validate: _types.PostDownloadSourcesRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.postDownloadSourcesHandler);
  router.delete({
    path: _constants.DOWNLOAD_SOURCE_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeleteDownloadSourcesRequestSchema,
    fleetAuthz: {
      fleet: {
        all: true
      }
    }
  }, _handler.deleteDownloadSourcesHandler);
};
exports.registerRoutes = registerRoutes;