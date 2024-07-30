"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.method = exports.handler = void 0;
exports.register = register;
var _configSchema = require("@kbn/config-schema");
var _api_routes = require("../api_routes");
var cs = _interopRequireWildcard(require("../common_schemas"));
var _find = require("../find");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'post';
exports.method = method;
const rt = {
  body: _configSchema.schema.object({
    status: _configSchema.schema.maybe(_find.stringOrArrayOfStrings),
    extension: _configSchema.schema.maybe(_find.stringOrArrayOfStrings),
    name: _configSchema.schema.maybe(_find.nameStringOrArrayOfNameStrings),
    meta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    }))
  }),
  query: _configSchema.schema.object({
    page: _configSchema.schema.maybe(cs.page),
    perPage: _configSchema.schema.maybe(cs.pageSize)
  })
};
const handler = async ({
  files,
  fileKind
}, req, res) => {
  const {
    body: {
      name,
      status,
      extension,
      meta
    },
    query: {
      page,
      perPage
    }
  } = req;
  const {
    fileService
  } = await files;
  const body = await fileService.asCurrentUser().find({
    kind: [fileKind],
    name: (0, _find.toArrayOrUndefined)(name),
    status: (0, _find.toArrayOrUndefined)(status),
    extension: (0, _find.toArrayOrUndefined)(extension),
    page,
    perPage,
    meta
  });
  return res.ok({
    body
  });
};
exports.handler = handler;
function register(fileKindRouter, fileKind) {
  if (fileKind.http.list) {
    fileKindRouter[method]({
      path: _api_routes.FILES_API_ROUTES.fileKind.getListRoute(fileKind.id),
      validate: {
        ...rt
      },
      options: {
        tags: fileKind.http.list.tags
      }
    }, handler);
  }
}