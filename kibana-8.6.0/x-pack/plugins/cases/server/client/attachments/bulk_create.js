"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreate = void 0;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _server = require("../../../../../../src/core/server");
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
const bulkCreate = async (args, clientArgs) => {
  const {
    attachments,
    caseId
  } = args;
  (0, _pipeable.pipe)(_api.BulkCreateCommentRequestRt.decode(attachments), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
  attachments.forEach(attachment => {
    (0, _utils.decodeCommentRequest)(attachment);
  });
  const {
    logger,
    authorization
  } = clientArgs;
  try {
    const [attachmentsWithIds, entities] = attachments.reduce(([a, e], attachment) => {
      const savedObjectID = _server.SavedObjectsUtils.generateId();
      return [[...a, {
        id: savedObjectID,
        ...attachment
      }], [...e, {
        owner: attachment.owner,
        id: savedObjectID
      }]];
    }, [[], []]);
    await authorization.ensureAuthorized({
      operation: _authorization.Operations.createComment,
      entities
    });
    const model = await _models.CaseCommentModel.create(caseId, clientArgs);
    const updatedModel = await model.bulkCreate({
      attachments: attachmentsWithIds
    });
    return await updatedModel.encodeWithComments();
  } catch (error) {
    throw (0, _error.createCaseError)({
      message: `Failed while bulk creating attachment to case id: ${caseId} error: ${error}`,
      error,
      logger
    });
  }
};
exports.bulkCreate = bulkCreate;