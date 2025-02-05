"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _common_schemas = require("../common_schemas");
var _file = require("../../file");
var _common = require("../common");
var _helpers = require("./helpers");
var _api_routes = require("../api_routes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'get';
exports.method = method;
const rt = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string(),
    fileName: _configSchema.schema.maybe(_common_schemas.fileNameWithExt)
  })
};
const handler = async ({
  files,
  fileKind
}, req, res) => {
  const {
    fileService
  } = await files;
  const {
    params: {
      id,
      fileName
    }
  } = req;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), id, fileKind);
  if (error) return error;
  try {
    const body = await file.downloadContent();
    return res.ok({
      body,
      headers: (0, _common.getDownloadHeadersForFile)({
        file,
        fileName
      })
    });
  } catch (e) {
    if (e instanceof _file.fileErrors.NoDownloadAvailableError) {
      return res.notFound({
        body: {
          message: e.message
        }
      });
    }
    throw e;
  }
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.download) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getDownloadRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.download.tags
      }
    }, handler);
  }
}