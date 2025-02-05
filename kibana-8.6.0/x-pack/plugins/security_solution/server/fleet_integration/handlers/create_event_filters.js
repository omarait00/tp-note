"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createNonInteractiveSessionEventFilter = exports.createEventFilters = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _i18n = require("@kbn/i18n");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _server = require("../../../../../../src/core/server");
var _utils = require("../../endpoint/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PROCESS_INTERACTIVE_ECS_FIELD = 'process.entry_leader.interactive';

/**
 * Create the Event Filter list if not exists and Create Event Filters for the Elastic Defend integration.
 */
const createEventFilters = async (logger, exceptionsClient, eventFilters, packagePolicy) => {
  if (!(eventFilters !== null && eventFilters !== void 0 && eventFilters.nonInteractiveSession)) {
    return;
  }
  try {
    // Attempt to Create the Event Filter List. It won't create the list if it already exists.
    // So we can skip the validation and ignore the conflict error
    await exceptionsClient.createExceptionList({
      name: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_NAME,
      namespaceType: 'agnostic',
      description: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_DESCRIPTION,
      listId: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID,
      type: _securitysolutionIoTsListTypes.ExceptionListTypeEnum.ENDPOINT_EVENTS,
      immutable: false,
      meta: undefined,
      tags: [],
      version: 1
    });
  } catch (err) {
    // Ignoring error 409 (Conflict)
    if (!_server.SavedObjectsErrorHelpers.isConflictError(err)) {
      logger.error(`Error creating Event Filter List: ${(0, _utils.wrapErrorIfNeeded)(err)}`);
      return;
    }
  }
  createNonInteractiveSessionEventFilter(logger, exceptionsClient, packagePolicy);
};

/**
 * Create an Event Filter for non-interactive sessions and attach it to the policy
 */
exports.createEventFilters = createEventFilters;
const createNonInteractiveSessionEventFilter = (logger, exceptionsClient, packagePolicy) => {
  try {
    exceptionsClient.createExceptionListItem({
      listId: _securitysolutionListConstants.ENDPOINT_EVENT_FILTERS_LIST_ID,
      description: _i18n.i18n.translate('xpack.securitySolution.fleetIntegration.elasticDefend.eventFilter.nonInteractiveSessions.description', {
        defaultMessage: 'Event filter for Cloud Security. Created by Elastic Defend integration.'
      }),
      name: _i18n.i18n.translate('xpack.securitySolution.fleetIntegration.elasticDefend.eventFilter.nonInteractiveSessions.name', {
        defaultMessage: 'Non-interactive Sessions'
      }),
      // Attach to the created policy
      tags: [`policy:${packagePolicy.id}`],
      osTypes: ['linux'],
      type: 'simple',
      namespaceType: 'agnostic',
      entries: [{
        field: PROCESS_INTERACTIVE_ECS_FIELD,
        operator: 'included',
        type: 'match',
        value: 'false'
      }],
      itemId: _uuid.default.v4(),
      meta: [],
      comments: []
    });
  } catch (err) {
    logger.error(`Error creating Event Filter: ${(0, _utils.wrapErrorIfNeeded)(err)}`);
  }
};
exports.createNonInteractiveSessionEventFilter = createNonInteractiveSessionEventFilter;