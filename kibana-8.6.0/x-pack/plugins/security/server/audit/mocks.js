"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auditServiceMock = exports.auditLoggerMock = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const auditLoggerMock = {
  create() {
    return {
      log: jest.fn(),
      enabled: true
    };
  }
};
exports.auditLoggerMock = auditLoggerMock;
const auditServiceMock = {
  create() {
    return {
      getLogger: jest.fn(),
      asScoped: jest.fn().mockReturnValue(auditLoggerMock.create()),
      withoutRequest: auditLoggerMock.create()
    };
  }
};
exports.auditServiceMock = auditServiceMock;