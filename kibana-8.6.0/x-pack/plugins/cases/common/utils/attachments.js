"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isCommentRequestTypePersistableState = exports.isCommentRequestTypeExternalReference = void 0;
var _api = require("../api");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A type narrowing function for external reference attachments.
 */
const isCommentRequestTypeExternalReference = context => {
  return context.type === _api.CommentType.externalReference;
};

/**
 * A type narrowing function for persistable state attachments.
 */
exports.isCommentRequestTypeExternalReference = isCommentRequestTypeExternalReference;
const isCommentRequestTypePersistableState = context => {
  return context.type === _api.CommentType.persistableState;
};
exports.isCommentRequestTypePersistableState = isCommentRequestTypePersistableState;