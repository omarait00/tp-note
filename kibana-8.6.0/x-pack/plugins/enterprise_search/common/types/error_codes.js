"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorCode = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ErrorCode;
exports.ErrorCode = ErrorCode;
(function (ErrorCode) {
  ErrorCode["ANALYTICS_COLLECTION_ALREADY_EXISTS"] = "analytics_collection_already_exists";
  ErrorCode["ANALYTICS_COLLECTION_NOT_FOUND"] = "analytics_collection_not_found";
  ErrorCode["ANALYTICS_COLLECTION_NAME_INVALID"] = "analytics_collection_name_invalid";
  ErrorCode["CONNECTOR_DOCUMENT_ALREADY_EXISTS"] = "connector_document_already_exists";
  ErrorCode["CRAWLER_ALREADY_EXISTS"] = "crawler_already_exists";
  ErrorCode["DOCUMENT_NOT_FOUND"] = "document_not_found";
  ErrorCode["INDEX_ALREADY_EXISTS"] = "index_already_exists";
  ErrorCode["INDEX_NOT_FOUND"] = "index_not_found";
  ErrorCode["PIPELINE_ALREADY_EXISTS"] = "pipeline_already_exists";
  ErrorCode["PIPELINE_IS_IN_USE"] = "pipeline_is_in_use";
  ErrorCode["PIPELINE_NOT_FOUND"] = "pipeline_not_found";
  ErrorCode["RESOURCE_NOT_FOUND"] = "resource_not_found";
  ErrorCode["UNAUTHORIZED"] = "unauthorized";
  ErrorCode["UNCAUGHT_EXCEPTION"] = "uncaught_exception";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));