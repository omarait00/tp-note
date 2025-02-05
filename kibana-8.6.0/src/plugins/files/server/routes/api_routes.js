"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  FILES_API_ROUTES: true
};
exports.FILES_API_ROUTES = void 0;
var _api_routes = require("../../common/api_routes");
Object.keys(_api_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _api_routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api_routes[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const FILES_API_ROUTES = {
  find: `${_api_routes.API_BASE_PATH}/find`,
  metrics: `${_api_routes.API_BASE_PATH}/metrics`,
  public: {
    download: `${_api_routes.FILES_PUBLIC_API_BASE_PATH}/blob/{fileName?}`
  },
  fileKind: {
    getCreateFileRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}`,
    getUploadRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/{id}/blob`,
    getDownloadRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/{id}/blob/{fileName?}`,
    getUpdateRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/{id}`,
    getDeleteRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/{id}`,
    getListRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/list`,
    getByIdRoute: fileKind => `${_api_routes.FILES_API_BASE_PATH}/${fileKind}/{id}`,
    getShareRoute: fileKind => `${_api_routes.FILES_SHARE_API_BASE_PATH}/${fileKind}/{fileId}`,
    getUnshareRoute: fileKind => `${_api_routes.FILES_SHARE_API_BASE_PATH}/${fileKind}/{id}`,
    getGetShareRoute: fileKind => `${_api_routes.FILES_SHARE_API_BASE_PATH}/${fileKind}/{id}`,
    getListShareRoute: fileKind => `${_api_routes.FILES_SHARE_API_BASE_PATH}/${fileKind}`
  }
};
exports.FILES_API_ROUTES = FILES_API_ROUTES;