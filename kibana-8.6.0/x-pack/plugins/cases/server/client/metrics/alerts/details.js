"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertDetails = void 0;
var _error = require("../../../common/error");
var _single_case_aggregation_handler = require("../single_case_aggregation_handler");
var _aggregations = require("./aggregations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class AlertDetails extends _single_case_aggregation_handler.SingleCaseAggregationHandler {
  constructor(options) {
    super(options, new Map([['alerts.hosts', new _aggregations.AlertHosts()], ['alerts.users', new _aggregations.AlertUsers()]]));
  }
  async compute() {
    const {
      services: {
        alertsService
      },
      logger
    } = this.options.clientArgs;
    const {
      casesClient
    } = this.options;
    try {
      const alerts = await casesClient.attachments.getAllAlertsAttachToCase({
        caseId: this.caseId
      });
      if (alerts.length <= 0 || this.aggregationBuilders.length <= 0) {
        return this.formatResponse();
      }
      const aggregationsResponse = await alertsService.executeAggregations({
        aggregationBuilders: this.aggregationBuilders,
        alerts
      });
      return this.formatResponse(aggregationsResponse);
    } catch (error) {
      throw (0, _error.createCaseError)({
        message: `Failed to retrieve alerts details attached case id: ${this.caseId}: ${error}`,
        error,
        logger
      });
    }
  }
}
exports.AlertDetails = AlertDetails;