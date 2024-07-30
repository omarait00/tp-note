"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CasesWebhookConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _cases.CasesWebhookConnectorTypeId;
  }
});
Object.defineProperty(exports, "EmailConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.EmailConnectorTypeId;
  }
});
Object.defineProperty(exports, "IndexConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.IndexConnectorTypeId;
  }
});
Object.defineProperty(exports, "JiraConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _cases.JiraConnectorTypeId;
  }
});
Object.defineProperty(exports, "PagerDutyConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.PagerDutyConnectorTypeId;
  }
});
Object.defineProperty(exports, "ResilientConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _cases.ResilientConnectorTypeId;
  }
});
Object.defineProperty(exports, "ServerLogConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.ServerLogConnectorTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowITOMConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.ServiceNowITOMConnectorTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowITSMConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _cases.ServiceNowITSMConnectorTypeId;
  }
});
Object.defineProperty(exports, "ServiceNowSIRConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _cases.ServiceNowSIRConnectorTypeId;
  }
});
Object.defineProperty(exports, "SlackConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.SlackConnectorTypeId;
  }
});
Object.defineProperty(exports, "TeamsConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.TeamsConnectorTypeId;
  }
});
Object.defineProperty(exports, "WebhookConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.WebhookConnectorTypeId;
  }
});
Object.defineProperty(exports, "XmattersConnectorTypeId", {
  enumerable: true,
  get: function () {
    return _stack.XmattersConnectorTypeId;
  }
});
exports.registerConnectorTypes = registerConnectorTypes;
var _stack = require("./stack");
var _cases = require("./cases");
var _security = require("./security");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function registerConnectorTypes({
  actions,
  publicBaseUrl
}) {
  actions.registerType((0, _stack.getEmailConnectorType)({
    publicBaseUrl
  }));
  actions.registerType((0, _stack.getIndexConnectorType)());
  actions.registerType((0, _stack.getPagerDutyConnectorType)());
  actions.registerType((0, _cases.getSwimlaneConnectorType)());
  actions.registerType((0, _stack.getServerLogConnectorType)());
  actions.registerType((0, _stack.getSlackConnectorType)({}));
  actions.registerType((0, _stack.getWebhookConnectorType)());
  actions.registerType((0, _cases.getCasesWebhookConnectorType)());
  actions.registerType((0, _stack.getXmattersConnectorType)());
  actions.registerType((0, _cases.getServiceNowITSMConnectorType)());
  actions.registerType((0, _cases.getServiceNowSIRConnectorType)());
  actions.registerType((0, _stack.getServiceNowITOMConnectorType)());
  actions.registerType((0, _cases.getJiraConnectorType)());
  actions.registerType((0, _cases.getResilientConnectorType)());
  actions.registerType((0, _stack.getTeamsConnectorType)());
  actions.registerSubActionConnectorType((0, _stack.getOpsgenieConnectorType)());
  actions.registerSubActionConnectorType((0, _security.getTinesConnectorType)());
}