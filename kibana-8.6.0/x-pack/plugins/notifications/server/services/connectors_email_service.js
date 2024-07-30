"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorsEmailService = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class ConnectorsEmailService {
  constructor(requesterId, connectorId, actionsClient) {
    this.requesterId = requesterId;
    this.connectorId = connectorId;
    this.actionsClient = actionsClient;
  }
  async sendPlainTextEmail(params) {
    const actions = params.to.map(to => {
      var _params$context;
      return {
        id: this.connectorId,
        params: {
          to: [to],
          subject: params.subject,
          message: params.message
        },
        relatedSavedObjects: (_params$context = params.context) === null || _params$context === void 0 ? void 0 : _params$context.relatedObjects
      };
    });
    return await this.actionsClient.bulkEnqueueExecution(this.requesterId, actions);
  }
}
exports.ConnectorsEmailService = ConnectorsEmailService;