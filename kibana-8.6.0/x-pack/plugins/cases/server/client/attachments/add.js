"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _server = require("../../../../../../src/core/server");
var _attachments = require("../../../common/utils/attachments");
var _api = require("../../../common/api");
var _models = require("../../common/models");
var _error = require("../../common/error");
var _utils = require("../utils");
var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Create an attachment to a case.
 *
 * @ignore
 */
const addComment = async (addArgs, clientArgs) => {
  const {
    comment,
    caseId
  } = addArgs;
  const query = (0, _pipeable.pipe)(_api.CommentRequestRt.decode(comment), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
  const {
    logger,
    authorization,
    persistableStateAttachmentTypeRegistry,
    externalReferenceAttachmentTypeRegistry
  } = clientArgs;
  (0, _utils.decodeCommentRequest)(comment);
  try {
    const savedObjectID = _server.SavedObjectsUtils.generateId();
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.createComment,
      entities: [{
        owner: comment.owner,
        id: savedObjectID
      }]
    });
    if ((0, _attachments.isCommentRequestTypeExternalReference)(query) && !externalReferenceAttachmentTypeRegistry.has(query.externalReferenceAttachmentTypeId)) {
      throw _boom.default.badRequest(`Attachment type ${query.externalReferenceAttachmentTypeId} is not registered.`);
    }
    if ((0, _attachments.isCommentRequestTypePersistableState)(query) && !persistableStateAttachmentTypeRegistry.has(query.persistableStateAttachmentTypeId)) {
      throw _boom.default.badRequest(`Attachment type ${query.persistableStateAttachmentTypeId} is not registered.`);
    }
    const createdDate = new Date().toISOString();
    const model = await _models.CaseCommentModel.create(caseId, clientArgs);
    const updatedModel = await model.createComment({
      createdDate,
      commentReq: query,
      id: savedObjectID
    });
    return await updatedModel.encodeWithComments();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed while adding a comment to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};
exports.addComment = addComment;