"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameStringOrArrayOfNameStrings = void 0;
exports.register = register;
exports.stringOrArrayOfStrings = void 0;
exports.toArrayOrUndefined = toArrayOrUndefined;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../../common/constants");
var _api_routes = require("./api_routes");
var _common_schemas = require("./common_schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const method = 'post';
const string64 = _configSchema.schema.string({
  maxLength: 64
});
const string256 = _configSchema.schema.string({
  maxLength: 256
});
const stringOrArrayOfStrings = _configSchema.schema.oneOf([string64, _configSchema.schema.arrayOf(string64)]);
exports.stringOrArrayOfStrings = stringOrArrayOfStrings;
const nameStringOrArrayOfNameStrings = _configSchema.schema.oneOf([string256, _configSchema.schema.arrayOf(string256)]);
exports.nameStringOrArrayOfNameStrings = nameStringOrArrayOfNameStrings;
function toArrayOrUndefined(val) {
  if (val == null) return undefined;
  return Array.isArray(val) ? val : [val];
}
const rt = {
  body: _configSchema.schema.object({
    kind: _configSchema.schema.maybe(stringOrArrayOfStrings),
    status: _configSchema.schema.maybe(stringOrArrayOfStrings),
    extension: _configSchema.schema.maybe(stringOrArrayOfStrings),
    name: _configSchema.schema.maybe(nameStringOrArrayOfNameStrings),
    meta: _configSchema.schema.maybe(_configSchema.schema.object({}, {
      unknowns: 'allow'
    }))
  }),
  query: _configSchema.schema.object({
    page: _configSchema.schema.maybe(_common_schemas.page),
    perPage: _configSchema.schema.maybe(_common_schemas.pageSize)
  })
};
const handler = async ({
  files
}, req, res) => {
  const {
    fileService
  } = await files;
  const {
    body: {
      meta,
      extension,
      kind,
      name,
      status
    },
    query
  } = req;
  const {
    files: results,
    total
  } = await fileService.asCurrentUser().find({
    kind: toArrayOrUndefined(kind),
    name: toArrayOrUndefined(name),
    status: toArrayOrUndefined(status),
    extension: toArrayOrUndefined(extension),
    meta,
    ...query
  });
  const body = {
    total,
    files: results
  };
  return res.ok({
    body
  });
};
function register(router) {
  router[method]({
    path: _api_routes.FILES_API_ROUTES.find,
    validate: {
      ...rt
    },
    options: {
      tags: [`access:${_constants.FILES_MANAGE_PRIVILEGE}`]
    }
  }, handler);
}