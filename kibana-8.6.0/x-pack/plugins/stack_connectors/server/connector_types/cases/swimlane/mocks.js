"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recordResponseUpdate = exports.recordResponseCreate = exports.mappings = exports.getApplicationResponse = exports.externalServiceMock = exports.executorParams = exports.commentResponse = exports.applicationFields = exports.apiParams = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const applicationFields = [{
  id: 'adnlas',
  name: 'Severity',
  key: 'severity',
  fieldType: 'text'
}, {
  id: 'adnfls',
  name: 'Rule Name',
  key: 'rule-name',
  fieldType: 'text'
}, {
  id: 'a6sst',
  name: 'Case Id',
  key: 'case-id-name',
  fieldType: 'text'
}, {
  id: 'a6fst',
  name: 'Case Name',
  key: 'case-name',
  fieldType: 'text'
}, {
  id: 'a6fdf',
  name: 'Comments',
  key: 'comments',
  fieldType: 'notes'
}, {
  id: 'a6fde',
  name: 'Description',
  key: 'description',
  fieldType: 'text'
}, {
  id: 'dfnkls',
  name: 'Alert ID',
  key: 'alert-id',
  fieldType: 'text'
}];
exports.applicationFields = applicationFields;
const mappings = {
  severityConfig: applicationFields[0],
  ruleNameConfig: applicationFields[1],
  caseIdConfig: applicationFields[2],
  caseNameConfig: applicationFields[3],
  commentsConfig: applicationFields[4],
  descriptionConfig: applicationFields[5],
  alertIdConfig: applicationFields[6]
};
exports.mappings = mappings;
const getApplicationResponse = {
  fields: applicationFields
};
exports.getApplicationResponse = getApplicationResponse;
const recordResponseCreate = {
  id: '123456',
  title: 'neato',
  url: 'swimlane.com',
  pushedDate: '2021-06-01T17:29:51.092Z'
};
exports.recordResponseCreate = recordResponseCreate;
const recordResponseUpdate = {
  id: '98765',
  title: 'not neato',
  url: 'laneswim.com',
  pushedDate: '2021-06-01T17:29:51.092Z'
};
exports.recordResponseUpdate = recordResponseUpdate;
const commentResponse = {
  commentId: '123456',
  pushedDate: '2021-06-01T17:29:51.092Z'
};
exports.commentResponse = commentResponse;
const createMock = () => {
  return {
    createComment: jest.fn().mockImplementation(() => Promise.resolve(commentResponse)),
    createRecord: jest.fn().mockImplementation(() => Promise.resolve(recordResponseCreate)),
    updateRecord: jest.fn().mockImplementation(() => Promise.resolve(recordResponseUpdate))
  };
};
const externalServiceMock = {
  create: createMock
};
exports.externalServiceMock = externalServiceMock;
const executorParams = {
  incident: {
    ruleName: 'rule name',
    alertId: '123456',
    caseName: 'case name',
    severity: 'critical',
    caseId: '123456',
    description: 'case desc',
    externalId: 'incident-3'
  },
  comments: [{
    commentId: 'case-comment-1',
    comment: 'A comment'
  }, {
    commentId: 'case-comment-2',
    comment: 'Another comment'
  }]
};
exports.executorParams = executorParams;
const apiParams = {
  ...executorParams
};
exports.apiParams = apiParams;