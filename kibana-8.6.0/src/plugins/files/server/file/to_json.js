"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeJSON = serializeJSON;
exports.toJSON = toJSON;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function serializeJSON(attrs) {
  const {
    name,
    mimeType,
    size,
    created,
    updated,
    fileKind,
    status,
    alt,
    extension,
    meta,
    user
  } = attrs;
  return (0, _lodash.pickBy)({
    name,
    mime_type: mimeType,
    size,
    user,
    created,
    extension,
    Alt: alt,
    Status: status,
    Meta: meta,
    Updated: updated,
    FileKind: fileKind
  }, v => v != null);
}
function toJSON(id, attrs) {
  const {
    name,
    mime_type: mimeType,
    size,
    user,
    created,
    Updated,
    FileKind,
    Status,
    Alt,
    extension,
    Meta
  } = attrs;
  return (0, _lodash.pickBy)({
    id,
    user,
    name,
    mimeType,
    size,
    created,
    extension,
    alt: Alt,
    status: Status,
    meta: Meta,
    updated: Updated,
    fileKind: FileKind
  }, v => v != null);
}