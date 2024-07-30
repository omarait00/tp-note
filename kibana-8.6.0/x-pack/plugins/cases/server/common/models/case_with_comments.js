"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaseCommentModel = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _api = require("../../../common/api");
var _constants = require("../../../common/constants");
var _error = require("../error");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALERT_LIMIT_MSG = `Case has reached the maximum allowed number (${_constants.MAX_ALERTS_PER_CASE}) of attached alerts.`;

/**
 * This class represents a case that can have a comment attached to it.
 */
class CaseCommentModel {
  constructor(caseInfo, params) {
    (0, _defineProperty2.default)(this, "params", void 0);
    (0, _defineProperty2.default)(this, "caseInfo", void 0);
    this.caseInfo = caseInfo;
    this.params = params;
  }
  static async create(id, options) {
    const savedObject = await options.services.caseService.getCase({
      id
    });
    return new CaseCommentModel(savedObject, options);
  }
  get savedObject() {
    return this.caseInfo;
  }

  /**
   * Update a comment and update the corresponding case's update_at and updated_by fields.
   */
  async updateComment({
    updateRequest,
    updatedAt,
    owner
  }) {
    try {
      const {
        id,
        version,
        ...queryRestAttributes
      } = updateRequest;
      const options = {
        version,
        refresh: false
      };
      if (queryRestAttributes.type === _api.CommentType.user && queryRestAttributes !== null && queryRestAttributes !== void 0 && queryRestAttributes.comment) {
        const currentComment = await this.params.services.attachmentService.get({
          unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
          attachmentId: id
        });
        const updatedReferences = (0, _utils.getOrUpdateLensReferences)(this.params.lensEmbeddableFactory, queryRestAttributes.comment, currentComment);
        options.references = updatedReferences;
      }
      const [comment, commentableCase] = await Promise.all([this.params.services.attachmentService.update({
        unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
        attachmentId: id,
        updatedAttributes: {
          ...queryRestAttributes,
          updated_at: updatedAt,
          updated_by: this.params.user
        },
        options
      }), this.updateCaseUserAndDateSkipRefresh(updatedAt)]);
      await commentableCase.createUpdateCommentUserAction(comment, updateRequest, owner);
      return commentableCase;
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update comment in commentable case, case id: ${this.caseInfo.id}: ${error}`,
        error,
        logger: this.params.logger
      });
    }
  }
  async updateCaseUserAndDateSkipRefresh(date) {
    return this.updateCaseUserAndDate(date, false);
  }
  async updateCaseUserAndDate(date, refresh) {
    try {
      var _updatedCase$version;
      const updatedCase = await this.params.services.caseService.patchCase({
        originalCase: this.caseInfo,
        caseId: this.caseInfo.id,
        updatedAttributes: {
          updated_at: date,
          updated_by: {
            ...this.params.user
          }
        },
        version: this.caseInfo.version,
        refresh
      });
      return this.newObjectWithInfo({
        ...this.caseInfo,
        attributes: {
          ...this.caseInfo.attributes,
          ...updatedCase.attributes
        },
        version: (_updatedCase$version = updatedCase.version) !== null && _updatedCase$version !== void 0 ? _updatedCase$version : this.caseInfo.version
      });
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to update commentable case, case id: ${this.caseInfo.id}: ${error}`,
        error,
        logger: this.params.logger
      });
    }
  }
  newObjectWithInfo(caseInfo) {
    return new CaseCommentModel(caseInfo, this.params);
  }
  async createUpdateCommentUserAction(comment, updateRequest, owner) {
    const {
      id,
      version,
      ...queryRestAttributes
    } = updateRequest;
    await this.params.services.userActionService.createUserAction({
      type: _api.ActionTypes.comment,
      action: _api.Actions.update,
      unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
      caseId: this.caseInfo.id,
      attachmentId: comment.id,
      payload: {
        attachment: queryRestAttributes
      },
      user: this.params.user,
      owner
    });
  }

  /**
   * Create a new comment on the appropriate case. This updates the case's updated_at and updated_by fields.
   */
  async createComment({
    createdDate,
    commentReq,
    id
  }) {
    try {
      await this.validateCreateCommentRequest([commentReq]);
      const references = [...this.buildRefsToCase(), ...this.getCommentReferences(commentReq)];
      const [comment, commentableCase] = await Promise.all([this.params.services.attachmentService.create({
        unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
        attributes: (0, _utils.transformNewComment)({
          createdDate,
          ...commentReq,
          ...this.params.user
        }),
        references,
        id,
        refresh: false
      }), this.updateCaseUserAndDateSkipRefresh(createdDate)]);
      await Promise.all([commentableCase.handleAlertComments([commentReq]), this.createCommentUserAction(comment, commentReq)]);
      return commentableCase;
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed creating a comment on a commentable case, case id: ${this.caseInfo.id}: ${error}`,
        error,
        logger: this.params.logger
      });
    }
  }
  async validateCreateCommentRequest(req) {
    const totalAlertsInReq = req.filter(_utils.isCommentRequestTypeAlert).reduce((count, attachment) => {
      const ids = Array.isArray(attachment.alertId) ? attachment.alertId : [attachment.alertId];
      return count + ids.length;
    }, 0);
    const reqHasAlerts = totalAlertsInReq > 0;
    if (reqHasAlerts && this.caseInfo.attributes.status === _api.CaseStatuses.closed) {
      throw _boom.default.badRequest('Alert cannot be attached to a closed case');
    }
    if (req.some(attachment => attachment.owner !== this.caseInfo.attributes.owner)) {
      throw _boom.default.badRequest('The owner field of the comment must match the case');
    }
    if (reqHasAlerts) {
      /**
       * This check is for optimization reasons.
       * It saves one aggregation if the total number
       * of alerts of the request is already greater than
       * MAX_ALERTS_PER_CASE
       */
      if (totalAlertsInReq > _constants.MAX_ALERTS_PER_CASE) {
        throw _boom.default.badRequest(ALERT_LIMIT_MSG);
      }
      await this.validateAlertsLimitOnCase(totalAlertsInReq);
    }
  }
  async validateAlertsLimitOnCase(totalAlertsInReq) {
    const alertsValueCount = await this.params.services.attachmentService.valueCountAlertsAttachedToCase({
      unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
      caseId: this.caseInfo.id
    });
    if (alertsValueCount + totalAlertsInReq > _constants.MAX_ALERTS_PER_CASE) {
      throw _boom.default.badRequest(ALERT_LIMIT_MSG);
    }
  }
  buildRefsToCase() {
    return [{
      type: _constants.CASE_SAVED_OBJECT,
      name: `associated-${_constants.CASE_SAVED_OBJECT}`,
      id: this.caseInfo.id
    }];
  }
  getCommentReferences(commentReq) {
    let references = [];
    if (commentReq.type === _api.CommentType.user && commentReq !== null && commentReq !== void 0 && commentReq.comment) {
      const commentStringReferences = (0, _utils.getOrUpdateLensReferences)(this.params.lensEmbeddableFactory, commentReq.comment);
      references = [...references, ...commentStringReferences];
    }
    return references;
  }
  async handleAlertComments(attachments) {
    const alerts = attachments.filter(attachment => attachment.type === _api.CommentType.alert && this.caseInfo.attributes.settings.syncAlerts);
    await this.updateAlertsStatus(alerts);
  }
  async updateAlertsStatus(alerts) {
    const alertsToUpdate = alerts.map(alert => (0, _utils.createAlertUpdateRequest)({
      comment: alert,
      status: this.caseInfo.attributes.status
    })).flat();
    await this.params.services.alertsService.updateAlertsStatus(alertsToUpdate);
  }
  async createCommentUserAction(comment, req) {
    await this.params.services.userActionService.createUserAction({
      type: _api.ActionTypes.comment,
      action: _api.Actions.create,
      unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
      caseId: this.caseInfo.id,
      attachmentId: comment.id,
      payload: {
        attachment: req
      },
      user: this.params.user,
      owner: comment.attributes.owner
    });
  }
  async bulkCreateCommentUserAction(attachments) {
    await this.params.services.userActionService.bulkCreateAttachmentCreation({
      unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
      caseId: this.caseInfo.id,
      attachments: attachments.map(({
        id,
        ...attachment
      }) => ({
        id,
        owner: attachment.owner,
        attachment
      })),
      user: this.params.user
    });
  }
  formatForEncoding(totalComment) {
    var _this$caseInfo$versio;
    return {
      id: this.caseInfo.id,
      version: (_this$caseInfo$versio = this.caseInfo.version) !== null && _this$caseInfo$versio !== void 0 ? _this$caseInfo$versio : '0',
      totalComment,
      ...this.caseInfo.attributes
    };
  }
  async encodeWithComments() {
    try {
      var _countAlertsForID;
      const comments = await this.params.services.caseService.getAllCaseComments({
        id: this.caseInfo.id,
        options: {
          fields: [],
          page: 1,
          perPage: _constants.MAX_DOCS_PER_PAGE
        }
      });
      const totalAlerts = (_countAlertsForID = (0, _utils.countAlertsForID)({
        comments,
        id: this.caseInfo.id
      })) !== null && _countAlertsForID !== void 0 ? _countAlertsForID : 0;
      const caseResponse = {
        comments: (0, _utils.flattenCommentSavedObjects)(comments.saved_objects),
        totalAlerts,
        ...this.formatForEncoding(comments.total)
      };
      return _api.CaseResponseRt.encode(caseResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed encoding the commentable case, case id: ${this.caseInfo.id}: ${error}`,
        error,
        logger: this.params.logger
      });
    }
  }
  async bulkCreate({
    attachments
  }) {
    try {
      await this.validateCreateCommentRequest(attachments);
      const caseReference = this.buildRefsToCase();
      const [newlyCreatedAttachments, commentableCase] = await Promise.all([this.params.services.attachmentService.bulkCreate({
        unsecuredSavedObjectsClient: this.params.unsecuredSavedObjectsClient,
        attachments: attachments.map(({
          id,
          ...attachment
        }) => {
          return {
            attributes: (0, _utils.transformNewComment)({
              createdDate: new Date().toISOString(),
              ...attachment,
              ...this.params.user
            }),
            references: [...caseReference, ...this.getCommentReferences(attachment)],
            id
          };
        }),
        refresh: false
      }), this.updateCaseUserAndDateSkipRefresh(new Date().toISOString())]);
      const savedObjectsWithoutErrors = newlyCreatedAttachments.saved_objects.filter(attachment => attachment.error == null);
      const attachmentsWithoutErrors = attachments.filter(attachment => savedObjectsWithoutErrors.some(so => so.id === attachment.id));
      await Promise.all([commentableCase.handleAlertComments(attachmentsWithoutErrors), this.bulkCreateCommentUserAction(attachmentsWithoutErrors)]);
      return commentableCase;
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed bulk creating attachments on a commentable case, case id: ${this.caseInfo.id}: ${error}`,
        error,
        logger: this.params.logger
      });
    }
  }
}
exports.CaseCommentModel = CaseCommentModel;