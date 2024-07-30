"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpsgenieConnectorType = void 0;
var _common = require("../../../../../actions/common");
var _server = require("../../../../../actions/server");
var _types = require("../../../../../actions/server/sub_action_framework/types");
var _common2 = require("../../../../common");
var _connector = require("./connector");
var _schema = require("./schema");
var i18n = _interopRequireWildcard(require("./translations"));
var _render_template_variables = require("./render_template_variables");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getOpsgenieConnectorType = () => {
  return {
    Service: _connector.OpsgenieConnector,
    minimumLicenseRequired: 'platinum',
    name: i18n.OPSGENIE_NAME,
    id: _common2.OpsgenieConnectorTypeId,
    schema: {
      config: _schema.ConfigSchema,
      secrets: _schema.SecretsSchema
    },
    validators: [{
      type: _types.ValidatorType.CONFIG,
      validator: (0, _server.urlAllowListValidator)('apiUrl')
    }],
    supportedFeatureIds: [_common.AlertingConnectorFeatureId, _common.UptimeConnectorFeatureId, _common.SecurityConnectorFeatureId],
    renderParameterTemplates: _render_template_variables.renderParameterTemplates
  };
};
exports.getOpsgenieConnectorType = getOpsgenieConnectorType;