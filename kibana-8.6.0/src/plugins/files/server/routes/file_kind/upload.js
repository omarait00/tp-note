"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _rxjs = require("rxjs");
var _api_routes = require("../api_routes");
var _file = require("../../file");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'put';
exports.method = method;
const rt = {
  params: _configSchema.schema.object({
    id: _configSchema.schema.string()
  }),
  body: _configSchema.schema.stream(),
  query: _configSchema.schema.object({
    selfDestructOnAbort: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
const handler = async ({
  files,
  fileKind
}, req, res) => {
  // Ensure that we are listening to the abort stream as early as possible.
  // In local testing I found that there is a chance for us to miss the abort event
  // if we subscribe too late.
  const abort$ = new _rxjs.ReplaySubject();
  const sub = req.events.aborted$.subscribe(abort$);
  const {
    fileService
  } = await files;
  const {
    logger
  } = fileService;
  const {
    body: stream,
    params: {
      id
    }
  } = req;
  const {
    error,
    result: file
  } = await (0, _helpers.getById)(fileService.asCurrentUser(), id, fileKind);
  if (error) return error;
  try {
    await file.uploadContent(stream, abort$);
  } catch (e) {
    if (e instanceof _file.fileErrors.ContentAlreadyUploadedError || e instanceof _file.fileErrors.UploadInProgressError) {
      return res.badRequest({
        body: {
          message: e.message
        }
      });
    } else if (e instanceof _file.fileErrors.AbortedUploadError) {
      var _fileService$usageCou;
      (_fileService$usageCou = fileService.usageCounter) === null || _fileService$usageCou === void 0 ? void 0 : _fileService$usageCou.call(fileService, 'UPLOAD_ERROR_ABORT');
      fileService.logger.error(e);
      if (req.query.selfDestructOnAbort) {
        logger.info(`File (id: ${file.id}) upload aborted. Deleting file due to self-destruct flag.`);
        file.delete(); // fire and forget
      }

      return res.customError({
        body: {
          message: e.message
        },
        statusCode: 499
      });
    }
    throw e;
  } finally {
    sub.unsubscribe();
  }
  const body = {
    ok: true,
    size: file.data.size
  };
  return res.ok({
    body
  });
};
exports.handler = handler;
const fourMiB = 4 * 1024 * 1024;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.create) {
    var _fileKind$allowedMime, _fileKind$maxSizeByte;
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getUploadRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.create.tags,
        body: {
          output: 'stream',
          parse: false,
          accepts: (_fileKind$allowedMime = fileKind.allowedMimeTypes) !== null && _fileKind$allowedMime !== void 0 ? _fileKind$allowedMime : 'application/octet-stream',
          maxBytes: (_fileKind$maxSizeByte = fileKind.maxSizeBytes) !== null && _fileKind$maxSizeByte !== void 0 ? _fileKind$maxSizeByte : fourMiB
        }
      }
    }, handler);
  }
}