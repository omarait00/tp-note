"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEBHOOK_PATH = exports.WEBHOOK_AGENT_TYPE = exports.TinesConnector = exports.API_PATH = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../../actions/server");
var _schema = require("../../../../common/connector_types/security/tines/schema");
var _api_schema = require("./api_schema");
var _constants = require("../../../../common/connector_types/security/tines/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const API_PATH = '/api/v1';
exports.API_PATH = API_PATH;
const WEBHOOK_PATH = '/webhook';
exports.WEBHOOK_PATH = WEBHOOK_PATH;
const WEBHOOK_AGENT_TYPE = 'Agents::WebhookAgent';
exports.WEBHOOK_AGENT_TYPE = WEBHOOK_AGENT_TYPE;
const storiesReducer = ({
  stories
}) => ({
  stories: stories.map(({
    id,
    name,
    published
  }) => ({
    id,
    name,
    published
  }))
});
const webhooksReducer = ({
  agents
}) => ({
  webhooks: agents.reduce((webhooks, {
    id,
    type,
    name,
    story_id: storyId,
    options: {
      path = '',
      secret = ''
    }
  }) => {
    if (type === WEBHOOK_AGENT_TYPE) {
      webhooks.push({
        id,
        name,
        path,
        secret,
        storyId
      });
    }
    return webhooks;
  }, [])
});
class TinesConnector extends _server.SubActionConnector {
  constructor(params) {
    super(params);
    (0, _defineProperty2.default)(this, "urls", void 0);
    this.urls = {
      stories: `${this.config.url}${API_PATH}/stories`,
      agents: `${this.config.url}${API_PATH}/agents`,
      getRunWebhookURL: webhook => `${this.config.url}${WEBHOOK_PATH}/${webhook.path}/${webhook.secret}`
    };
    this.registerSubActions();
  }
  registerSubActions() {
    this.registerSubAction({
      name: _constants.SUB_ACTION.STORIES,
      method: 'getStories',
      schema: _schema.TinesStoriesActionParamsSchema
    });
    this.registerSubAction({
      name: _constants.SUB_ACTION.WEBHOOKS,
      method: 'getWebhooks',
      schema: _schema.TinesWebhooksActionParamsSchema
    });
    this.registerSubAction({
      name: _constants.SUB_ACTION.RUN,
      method: 'runWebhook',
      schema: _schema.TinesRunActionParamsSchema
    });
    this.registerSubAction({
      name: _constants.SUB_ACTION.TEST,
      method: 'runWebhook',
      schema: _schema.TinesRunActionParamsSchema
    });
  }
  getAuthHeaders() {
    return {
      'x-user-email': this.secrets.email,
      'x-user-token': this.secrets.token
    };
  }
  async tinesApiRequest(req, reducer) {
    const response = await this.request({
      ...req,
      params: {
        ...req.params,
        per_page: _constants.API_MAX_RESULTS
      }
    });
    return {
      ...reducer(response.data),
      incompleteResponse: response.data.meta.pages > 1
    };
  }
  getResponseErrorMessage(error) {
    var _error$response, _error$response2;
    if (!((_error$response = error.response) !== null && _error$response !== void 0 && _error$response.status)) {
      return 'Unknown API Error';
    }
    if (error.response.status === 401) {
      return 'Unauthorized API Error';
    }
    return `API Error: ${(_error$response2 = error.response) === null || _error$response2 === void 0 ? void 0 : _error$response2.statusText}`;
  }
  async getStories() {
    return this.tinesApiRequest({
      url: this.urls.stories,
      headers: this.getAuthHeaders(),
      responseSchema: _api_schema.TinesStoriesApiResponseSchema
    }, storiesReducer);
  }
  async getWebhooks({
    storyId
  }) {
    return this.tinesApiRequest({
      url: this.urls.agents,
      params: {
        story_id: storyId
      },
      headers: this.getAuthHeaders(),
      responseSchema: _api_schema.TinesWebhooksApiResponseSchema
    }, webhooksReducer);
  }
  async runWebhook({
    webhook,
    webhookUrl,
    body
  }) {
    if (!webhook && !webhookUrl) {
      throw Error('Invalid subActionsParams: [webhook] or [webhookUrl] expected but got none');
    }
    const response = await this.request({
      url: webhookUrl ? webhookUrl : this.urls.getRunWebhookURL(webhook),
      method: 'post',
      responseSchema: _api_schema.TinesRunApiResponseSchema,
      data: body
    });
    return response.data;
  }
}
exports.TinesConnector = TinesConnector;