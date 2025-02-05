"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewSavedObjectConflictError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Error thrown when saved object has been changed when attempting to save.
 */
class DataViewSavedObjectConflictError extends Error {
  /**
   * constructor
   * @param savedObjectId saved object id with conflict
   */
  constructor(savedObjectId) {
    super(`Conflict loading DataView saved object, id: ${savedObjectId}`);
    this.name = 'DataViewSavedObjectConflictError';
  }
}
exports.DataViewSavedObjectConflictError = DataViewSavedObjectConflictError;