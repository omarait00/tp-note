"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUnauthorizedException = exports.isResourceNotFoundException = exports.isResourceAlreadyExistsException = exports.isPipelineIsInUseException = exports.isNotFoundException = exports.isIndexNotFoundException = void 0;
var _error_codes = require("../../common/types/error_codes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isIndexNotFoundException = error => {
  var _error$meta, _error$meta$body, _error$meta$body$erro;
  return (error === null || error === void 0 ? void 0 : (_error$meta = error.meta) === null || _error$meta === void 0 ? void 0 : (_error$meta$body = _error$meta.body) === null || _error$meta$body === void 0 ? void 0 : (_error$meta$body$erro = _error$meta$body.error) === null || _error$meta$body$erro === void 0 ? void 0 : _error$meta$body$erro.type) === 'index_not_found_exception';
};
exports.isIndexNotFoundException = isIndexNotFoundException;
const isResourceAlreadyExistsException = error => {
  var _error$meta2, _error$meta2$body, _error$meta2$body$err;
  return (error === null || error === void 0 ? void 0 : (_error$meta2 = error.meta) === null || _error$meta2 === void 0 ? void 0 : (_error$meta2$body = _error$meta2.body) === null || _error$meta2$body === void 0 ? void 0 : (_error$meta2$body$err = _error$meta2$body.error) === null || _error$meta2$body$err === void 0 ? void 0 : _error$meta2$body$err.type) === 'resource_already_exists_exception';
};
exports.isResourceAlreadyExistsException = isResourceAlreadyExistsException;
const isResourceNotFoundException = error => {
  var _error$meta3, _error$meta3$body, _error$meta3$body$err;
  return (error === null || error === void 0 ? void 0 : (_error$meta3 = error.meta) === null || _error$meta3 === void 0 ? void 0 : (_error$meta3$body = _error$meta3.body) === null || _error$meta3$body === void 0 ? void 0 : (_error$meta3$body$err = _error$meta3$body.error) === null || _error$meta3$body$err === void 0 ? void 0 : _error$meta3$body$err.type) === 'resource_not_found_exception';
};
exports.isResourceNotFoundException = isResourceNotFoundException;
const isUnauthorizedException = error => {
  var _error$meta4;
  return ((_error$meta4 = error.meta) === null || _error$meta4 === void 0 ? void 0 : _error$meta4.statusCode) === 403;
};
exports.isUnauthorizedException = isUnauthorizedException;
const isPipelineIsInUseException = error => error.message === _error_codes.ErrorCode.PIPELINE_IS_IN_USE;
exports.isPipelineIsInUseException = isPipelineIsInUseException;
const isNotFoundException = error => {
  var _error$meta5;
  return ((_error$meta5 = error.meta) === null || _error$meta5 === void 0 ? void 0 : _error$meta5.statusCode) === 404;
};
exports.isNotFoundException = isNotFoundException;