"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateConfiguration = createOrUpdateConfiguration;
var _objectHash = _interopRequireDefault(require("object-hash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createOrUpdateConfiguration({
  configurationId,
  configurationIntake,
  internalESClient
}) {
  const params = {
    refresh: true,
    index: internalESClient.apmIndices.apmAgentConfigurationIndex,
    body: {
      agent_name: configurationIntake.agent_name,
      service: {
        name: configurationIntake.service.name,
        environment: configurationIntake.service.environment
      },
      settings: configurationIntake.settings,
      '@timestamp': Date.now(),
      applied_by_agent: false,
      etag: (0, _objectHash.default)(configurationIntake)
    }
  };

  // by specifying an id elasticsearch will delete the previous doc and insert the updated doc
  if (configurationId) {
    params.id = configurationId;
  }
  return internalESClient.index('create_or_update_agent_configuration', params);
}