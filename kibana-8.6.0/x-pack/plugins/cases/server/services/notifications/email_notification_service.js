"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailNotificationService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _pMap = _interopRequireDefault(require("p-map"));
var _constants = require("../../../common/constants");
var _utils = require("../../common/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EmailNotificationService {
  constructor({
    logger,
    notifications,
    security,
    publicBaseUrl,
    spaceId
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "notifications", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "spaceId", void 0);
    (0, _defineProperty2.default)(this, "publicBaseUrl", void 0);
    this.logger = logger;
    this.notifications = notifications;
    this.security = security;
    this.spaceId = spaceId;
    this.publicBaseUrl = publicBaseUrl;
  }
  static getTitle(theCase) {
    return `[Elastic][Cases] ${theCase.attributes.title}`;
  }
  static getMessage(theCase, spaceId, publicBaseUrl) {
    const lineBreak = '\r\n\r\n';
    let message = `You are assigned to an Elastic Case.${lineBreak}`;
    message = `${message}Title: ${theCase.attributes.title}${lineBreak}`;
    message = `${message}Status: ${theCase.attributes.status}${lineBreak}`;
    message = `${message}Severity: ${theCase.attributes.severity}${lineBreak}`;
    if (theCase.attributes.tags.length > 0) {
      message = `${message}Tags: ${theCase.attributes.tags.join(', ')}${lineBreak}`;
    }
    if (publicBaseUrl) {
      const caseUrl = (0, _utils.getCaseViewPath)({
        publicBaseUrl,
        caseId: theCase.id,
        owner: theCase.attributes.owner,
        spaceId
      });
      message = `${message}${lineBreak}[View the case details](${caseUrl})`;
    }
    return message;
  }
  async notifyAssignees({
    assignees,
    theCase
  }) {
    try {
      var _theCase$namespaces;
      if (!this.notifications.isEmailServiceAvailable()) {
        this.logger.warn('Could not notifying assignees. Email service is not available.');
        return;
      }
      const uids = new Set(assignees.map(assignee => assignee.uid));
      const userProfiles = await this.security.userProfiles.bulkGet({
        uids
      });
      const users = userProfiles.map(profile => profile.user);
      const to = users.filter(user => user.email != null).map(user => user.email);
      const subject = EmailNotificationService.getTitle(theCase);
      const message = EmailNotificationService.getMessage(theCase, this.spaceId, this.publicBaseUrl);
      await this.notifications.getEmailService().sendPlainTextEmail({
        to,
        subject,
        message,
        context: {
          relatedObjects: [{
            id: theCase.id,
            type: _constants.CASE_SAVED_OBJECT,
            /**
             * Cases are not shareable at the moment from the UI
             * The namespaces should be either undefined or contain
             * only one item, the space the case got created. If we decide
             * in the future to share cases in multiple spaces we need
             * to change the logic.
             */
            namespace: (_theCase$namespaces = theCase.namespaces) === null || _theCase$namespaces === void 0 ? void 0 : _theCase$namespaces[0]
          }]
        }
      });
    } catch (error) {
      this.logger.warn(`Error notifying assignees: ${error.message}`);
    }
  }
  async bulkNotifyAssignees(casesAndAssigneesToNotifyForAssignment) {
    if (casesAndAssigneesToNotifyForAssignment.length === 0) {
      return;
    }
    await (0, _pMap.default)(casesAndAssigneesToNotifyForAssignment, args => this.notifyAssignees(args), {
      concurrency: _constants.MAX_CONCURRENT_SEARCHES
    });
  }
}
exports.EmailNotificationService = EmailNotificationService;