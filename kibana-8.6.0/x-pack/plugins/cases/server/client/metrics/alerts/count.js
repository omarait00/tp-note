"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsCount = void 0;
var _authorization = require("../../../authorization");
var _error = require("../../../common/error");
var _single_case_base_handler = require("../single_case_base_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertsCount extends _single_case_base_handler.SingleCaseBaseHandler {
  constructor(options) {
    super(options, ['alerts.count']);
  }
  async compute() {
    const {
      unsecuredSavedObjectsClient,
      authorization,
      services: {
        attachmentService
      },
      logger
    } = this.options.clientArgs;
    const {
      casesClient
    } = this.options;
    try {
      // This will perform an authorization check to ensure the user has access to the parent case
      const theCase = await casesClient.cases.get({
        id: this.caseId,
        includeComments: false
      });
      const {
        filter: authorizationFilter
      } = await authorization.getAuthorizationFilter(_authorization.Operations.getAttachmentMetrics);
      const alertsCount = await attachmentService.countAlertsAttachedToCase({
        unsecuredSavedObjectsClient,
        caseId: theCase.id,
        filter: authorizationFilter
      });
      return {
        alerts: {
          count: alertsCount !== null && alertsCount !== void 0 ? alertsCount : 0
        }
      };
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to count alerts attached case id: ${this.caseId}: ${error}`,
        error,
        logger
      });
    }
  }
}
exports.AlertsCount = AlertsCount;