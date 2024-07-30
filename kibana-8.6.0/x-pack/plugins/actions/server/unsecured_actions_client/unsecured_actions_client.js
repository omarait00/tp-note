"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnsecuredActionsClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// allowlist for features wanting access to the unsecured actions client
// which allows actions to be enqueued for execution without a user request
const ALLOWED_REQUESTER_IDS = ['notifications',
// For functional testing
'functional_tester'];
class UnsecuredActionsClient {
  constructor(params) {
    (0, _defineProperty2.default)(this, "internalSavedObjectsRepository", void 0);
    (0, _defineProperty2.default)(this, "executionEnqueuer", void 0);
    this.executionEnqueuer = params.executionEnqueuer;
    this.internalSavedObjectsRepository = params.internalSavedObjectsRepository;
  }
  async bulkEnqueueExecution(requesterId, actionsToExecute) {
    // Check that requesterId is allowed
    if (!ALLOWED_REQUESTER_IDS.includes(requesterId)) {
      throw new Error(`"${requesterId}" feature is not allow-listed for UnsecuredActionsClient access.`);
    }
    return this.executionEnqueuer(this.internalSavedObjectsRepository, actionsToExecute);
  }
}
exports.UnsecuredActionsClient = UnsecuredActionsClient;