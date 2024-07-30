"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleExecutionLogService = void 0;
var _with_security_span = require("../../../../../utils/with_security_span");
var _client = require("./client_for_routes/client");
var _client2 = require("./client_for_executors/client");
var _register_event_log_provider = require("./event_log/register_event_log_provider");
var _event_log_reader = require("./event_log/event_log_reader");
var _event_log_writer = require("./event_log/event_log_writer");
var _saved_objects_client = require("./execution_saved_object/saved_objects_client");
var _fetch_rule_execution_settings = require("./execution_settings/fetch_rule_execution_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRuleExecutionLogService = (config, logger, core, plugins) => {
  return {
    registerEventLogProvider: () => {
      (0, _register_event_log_provider.registerEventLogProvider)(plugins.eventLog);
    },
    createClientForRoutes: params => {
      const {
        savedObjectsClient,
        eventLogClient
      } = params;
      const soClient = (0, _saved_objects_client.createRuleExecutionSavedObjectsClient)(savedObjectsClient, logger);
      const eventLogReader = (0, _event_log_reader.createEventLogReader)(eventLogClient);
      return (0, _client.createClientForRoutes)(soClient, eventLogReader, logger);
    },
    createClientForExecutors: params => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogService.createClientForExecutors', async () => {
        const {
          savedObjectsClient,
          context
        } = params;
        const childLogger = logger.get('ruleExecution');
        const ruleExecutionSettings = await (0, _fetch_rule_execution_settings.fetchRuleExecutionSettings)(config, childLogger, core, savedObjectsClient);
        const soClient = (0, _saved_objects_client.createRuleExecutionSavedObjectsClient)(savedObjectsClient, childLogger);
        const eventLogWriter = (0, _event_log_writer.createEventLogWriter)(plugins.eventLog);
        return (0, _client2.createClientForExecutors)(ruleExecutionSettings, soClient, eventLogWriter, childLogger, context);
      });
    }
  };
};
exports.createRuleExecutionLogService = createRuleExecutionLogService;