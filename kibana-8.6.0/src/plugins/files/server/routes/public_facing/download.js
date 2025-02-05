"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _errors = require("../../file/errors");
var _errors2 = require("../../file_service/errors");
var _errors3 = require("../../file_share_service/errors");
var _api_routes = require("../api_routes");
var _common = require("../common");
var _common_schemas = require("../common_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'get';
const rt = {
  query: _configSchema.schema.object({
    token: _configSchema.schema.string()
  }),
  params: _configSchema.schema.object({
    fileName: _configSchema.schema.maybe(_common_schemas.fileNameWithExt)
  })
};
const handler = async ({
  files
}, req, res) => {
  const {
    fileService
  } = await files;
  const {
    query: {
      token
    },
    params: {
      fileName
    }
  } = req;
  try {
    const file = await fileService.asInternalUser().getByToken(token);
    const body = await file.downloadContent();
    return res.ok({
      body,
      headers: (0, _common.getDownloadHeadersForFile)({
        file,
        fileName
      })
    });
  } catch (e) {
    if (e instanceof _errors2.FileNotFoundError || e instanceof _errors3.FileShareNotFoundError || e instanceof _errors3.FileShareTokenInvalidError) {
      return res.badRequest({
        body: {
          message: 'Invalid token'
        }
      });
    }
    if (e instanceof _errors.NoDownloadAvailableError) {
      return res.badRequest({
        body: {
          message: 'No download available. Try uploading content to the file first.'
        }
      });
    }
    throw e;
  }
};
function register(router) {
  router[method]({
    path: _api_routes.FILES_API_ROUTES.public.download,
    validate: {
      ...rt
    },
    options: {
      authRequired: false
    }
  }, handler);
}