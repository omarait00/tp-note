"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateEsListSchema = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const updateEsListSchema = t.exact(t.type({
  description: _securitysolutionIoTsListTypes.descriptionOrUndefined,
  meta: _securitysolutionIoTsListTypes.metaOrUndefined,
  name: _securitysolutionIoTsListTypes.nameOrUndefined,
  updated_at: _securitysolutionIoTsListTypes.updated_at,
  updated_by: _securitysolutionIoTsListTypes.updated_by
}));
exports.updateEsListSchema = updateEsListSchema;