"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTinesConnectorType = void 0;
var _types = require("../../../../../actions/server/sub_action_framework/types");
var _common = require("../../../../../actions/common");
var _server = require("../../../../../actions/server");
var _constants = require("../../../../common/connector_types/security/tines/constants");
var _schema = require("../../../../common/connector_types/security/tines/schema");
var _tines = require("./tines");
var _render = require("./render");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getTinesConnectorType = () => ({
  id: _constants.TINES_CONNECTOR_ID,
  name: _constants.TINES_TITLE,
  Service: _tines.TinesConnector,
  schema: {
    config: _schema.TinesConfigSchema,
    secrets: _schema.TinesSecretsSchema
  },
  validators: [{
    type: _types.ValidatorType.CONFIG,
    validator: (0, _server.urlAllowListValidator)('url')
  }],
  supportedFeatureIds: [_common.SecurityConnectorFeatureId],
  minimumLicenseRequired: 'gold',
  renderParameterTemplates: _render.renderParameterTemplates
});
exports.getTinesConnectorType = getTinesConnectorType;