"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestSubActionConnector = exports.TestSecretsSchema = exports.TestNoSubActions = exports.TestExecutor = exports.TestConfigSchema = exports.TestCaseConnector = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _configSchema = require("@kbn/config-schema");
var _sub_action_connector = require("./sub_action_connector");
var _case = require("./case");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/* eslint-disable max-classes-per-file */

const TestConfigSchema = _configSchema.schema.object({
  url: _configSchema.schema.string()
});
exports.TestConfigSchema = TestConfigSchema;
const TestSecretsSchema = _configSchema.schema.object({
  username: _configSchema.schema.string(),
  password: _configSchema.schema.string()
});
exports.TestSecretsSchema = TestSecretsSchema;
class TestSubActionConnector extends _sub_action_connector.SubActionConnector {
  constructor(params) {
    super(params);
    this.registerSubAction({
      name: 'testUrl',
      method: 'testUrl',
      schema: _configSchema.schema.object({
        url: _configSchema.schema.string()
      })
    });
    this.registerSubAction({
      name: 'testData',
      method: 'testData',
      schema: null
    });
  }
  getResponseErrorMessage(error) {
    var _error$response, _error$response2;
    return `Message: ${(_error$response = error.response) === null || _error$response === void 0 ? void 0 : _error$response.data.errorMessage}. Code: ${(_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.data.errorCode}`;
  }
  async testUrl({
    url,
    data = {}
  }) {
    const res = await this.request({
      url,
      data,
      headers: {
        'X-Test-Header': 'test'
      },
      responseSchema: _configSchema.schema.object({
        status: _configSchema.schema.string()
      })
    });
    return res;
  }
  async testData({
    data
  }) {
    const res = await this.request({
      url: 'https://example.com',
      data: this.removeNullOrUndefinedFields(data),
      headers: {
        'X-Test-Header': 'test'
      },
      responseSchema: _configSchema.schema.object({
        status: _configSchema.schema.string()
      })
    });
    return res;
  }
}
exports.TestSubActionConnector = TestSubActionConnector;
class TestNoSubActions extends _sub_action_connector.SubActionConnector {
  getResponseErrorMessage(error) {
    return `Error`;
  }
}
exports.TestNoSubActions = TestNoSubActions;
class TestExecutor extends _sub_action_connector.SubActionConnector {
  constructor(params) {
    super(params);
    (0, _defineProperty2.default)(this, "notAFunction", 'notAFunction');
    this.registerSubAction({
      name: 'testUrl',
      method: 'not-exist',
      schema: _configSchema.schema.object({})
    });
    this.registerSubAction({
      name: 'notAFunction',
      method: 'notAFunction',
      schema: _configSchema.schema.object({})
    });
    this.registerSubAction({
      name: 'echo',
      method: 'echo',
      schema: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    });
    this.registerSubAction({
      name: 'noSchema',
      method: 'noSchema',
      schema: null
    });
    this.registerSubAction({
      name: 'noData',
      method: 'noData',
      schema: null
    });
    this.registerSubAction({
      name: 'noAsync',
      method: 'noAsync',
      schema: null
    });
  }
  getResponseErrorMessage(error) {
    return `Error`;
  }
  async echo({
    id
  }) {
    return Promise.resolve({
      id
    });
  }
  async noSchema({
    id
  }) {
    return {
      id
    };
  }
  async noData() {}
  noAsync() {}
}
exports.TestExecutor = TestExecutor;
class TestCaseConnector extends _case.CaseConnector {
  constructor(params) {
    super(params);
  }
  getResponseErrorMessage(error) {
    var _error$response3, _error$response4;
    return `Message: ${(_error$response3 = error.response) === null || _error$response3 === void 0 ? void 0 : _error$response3.data.errorMessage}. Code: ${(_error$response4 = error.response) === null || _error$response4 === void 0 ? void 0 : _error$response4.data.errorCode}`;
  }
  async createIncident(incident) {
    return {
      id: 'create-incident',
      title: 'Test incident',
      url: 'https://example.com',
      pushedDate: '2022-05-06T09:41:00.401Z'
    };
  }
  async addComment({
    incidentId,
    comment
  }) {
    return {
      id: 'add-comment',
      title: 'Test incident',
      url: 'https://example.com',
      pushedDate: '2022-05-06T09:41:00.401Z'
    };
  }
  async updateIncident({
    incidentId,
    incident
  }) {
    return {
      id: 'update-incident',
      title: 'Test incident',
      url: 'https://example.com',
      pushedDate: '2022-05-06T09:41:00.401Z'
    };
  }
  async getIncident({
    id
  }) {
    return {
      id: 'get-incident',
      title: 'Test incident',
      url: 'https://example.com',
      pushedDate: '2022-05-06T09:41:00.401Z'
    };
  }
}
exports.TestCaseConnector = TestCaseConnector;