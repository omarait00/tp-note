"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = update;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _models = require("../../common/models");
var _error = require("../../common/error");
var _attachments = require("../../../common/utils/attachments");
var _constants = require("../../../common/constants");
var _utils = require("../utils");
var _authorization = require("../../authorization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Update an attachment.
 *
 * @ignore
 */
async function update({
  caseID,
  updateRequest: queryParams
}, clientArgs) {
  const {
    services: {
      attachmentService
    },
    unsecuredSavedObjectsClient,
    logger,
    authorization
  } = clientArgs;
  try {
    const {
      id: queryCommentId,
      version: queryCommentVersion,
      ...queryRestAttributes
    } = queryParams;
    (0, _utils.decodeCommentRequest)(queryRestAttributes);
    const myComment = await attachmentService.get({
      unsecuredSavedObjectsClient,
      attachmentId: queryCommentId
    });
    if (myComment == null) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist anymore.`);
    }
    await authorization.ensureAuthorized({
      entities: [{
        owner: myComment.attributes.owner,
        id: myComment.id
      }],
      operation: _authorization.Operations.updateComment
    });
    const model = await _models.CaseCommentModel.create(caseID, clientArgs);
    if (myComment.attributes.type !== queryRestAttributes.type) {
      throw _boom.default.badRequest(`You cannot change the type of the comment.`);
    }
    if (myComment.attributes.owner !== queryRestAttributes.owner) {
      throw _boom.default.badRequest(`You cannot change the owner of the comment.`);
    }
    if ((0, _attachments.isCommentRequestTypeExternalReference)(myComment.attributes) && (0, _attachments.isCommentRequestTypeExternalReference)(queryRestAttributes) && myComment.attributes.externalReferenceStorage.type !== queryRestAttributes.externalReferenceStorage.type) {
      throw _boom.default.badRequest(`You cannot change the storage type of an external reference comment.`);
    }
    const caseRef = myComment.references.find(c => c.type === _constants.CASE_SAVED_OBJECT);
    if (caseRef == null || caseRef != null && caseRef.id !== model.savedObject.id) {
      throw _boom.default.notFound(`This comment ${queryCommentId} does not exist in ${model.savedObject.id}).`);
    }
    if (queryCommentVersion !== myComment.version) {
      throw _boom.default.conflict('This case has been updated. Please refresh before saving additional updates.');
    }
    const updatedDate = new Date().toISOString();
    const updatedModel = await model.updateComment({
      updateRequest: queryParams,
      updatedAt: updatedDate,
      owner: myComment.attributes.owner
    });
    return await updatedModel.encodeWithComments();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed to patch comment case id: ${caseID}: ${error}`,
      error,
      logger
    });
  }
}