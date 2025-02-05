"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeDownloadShareableWorkpadRoute = initializeDownloadShareableWorkpadRoute;
var _fs = require("fs");
var _constants = require("../../../shareable_runtime/constants");
var _constants2 = require("../../../common/lib/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line @kbn/imports/no_boundary_crossing

function initializeDownloadShareableWorkpadRoute(deps) {
  const {
    router
  } = deps;
  router.get({
    path: _constants2.API_ROUTE_SHAREABLE_RUNTIME_DOWNLOAD,
    validate: false
  }, async (_context, _request, response) => {
    // TODO: check if this is still an issue on cloud after migrating to NP
    //
    // The option setting is not for typical use.  We're using it here to avoid
    // problems in Cloud environments.  See elastic/kibana#47405.
    // const file = handler.file(SHAREABLE_RUNTIME_FILE, { confine: false });
    const file = (0, _fs.readFileSync)(_constants.SHAREABLE_RUNTIME_FILE);
    return response.ok({
      headers: {
        'content-type': 'application/octet-stream'
      },
      body: file
    });
  });
}