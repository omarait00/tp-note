"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savedObjectsTaggingMock = void 0;
var _tags_client = require("./services/tags/tags_client.mock");
var _assignment_service = require("./services/assignments/assignment_service.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createStartMock = () => {
  const start = {
    createTagClient: jest.fn(),
    createInternalAssignmentService: jest.fn()
  };
  start.createTagClient.mockImplementation(() => _tags_client.tagsClientMock.create());
  start.createInternalAssignmentService.mockImplementation(() => _assignment_service.assigmentServiceMock.create());
  return start;
};
const savedObjectsTaggingMock = {
  createStartContract: createStartMock,
  createTagClient: _tags_client.tagsClientMock.create,
  createAssignmentService: _assignment_service.assigmentServiceMock.create
};
exports.savedObjectsTaggingMock = savedObjectsTaggingMock;