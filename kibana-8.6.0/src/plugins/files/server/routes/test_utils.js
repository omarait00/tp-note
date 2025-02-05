"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFileKindsRequestHandlerContextMock = void 0;
var _mocks = require("../../../../core/server/mocks");
var _mocks2 = require("../mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const createFileKindsRequestHandlerContextMock = (fileKind = 'test') => {
  const fileService = (0, _mocks2.createFileServiceMock)();
  const ctx = {
    fileKind,
    files: Promise.resolve({
      fileService: {
        asCurrentUser: () => fileService,
        asInternalUser: () => fileService,
        logger: _mocks.loggingSystemMock.createLogger()
      }
    })
  };
  return {
    ctx,
    fileService
  };
};
exports.createFileKindsRequestHandlerContextMock = createFileKindsRequestHandlerContextMock;