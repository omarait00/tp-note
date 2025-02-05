"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterEventsAgainstList = void 0;
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _filter_events = require("./filter_events");
var _create_field_and_set_tuples = require("./create_field_and_set_tuples");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Filters events against a large value based list. It does this through these
 * steps below.
 *
 * 1. acquire the values from the specified fields to check
 * e.g. if the value list is checking against source.ip, gather
 * all the values for source.ip from the search response events.
 *
 * 2. search against the value list with the values found in the search result
 * and see if there are any matches. For every match, add that value to a set
 * that represents the "matched" values
 *
 * 3. filter the search result against the set from step 2 using the
 * given operator (included vs excluded).
 * acquire the list values we are checking for in the field.
 *
 * @param listClient The list client to use for queries
 * @param exceptionsList The exception list
 * @param ruleExecutionLogger Logger for messages
 * @param events The current events from the search
 */
const filterEventsAgainstList = async ({
  listClient,
  exceptionsList,
  ruleExecutionLogger,
  events
}) => {
  try {
    const atLeastOneLargeValueList = exceptionsList.some(({
      entries
    }) => (0, _securitysolutionListUtils.hasLargeValueList)(entries));
    if (!atLeastOneLargeValueList) {
      ruleExecutionLogger.debug('no exception items of type list found - returning original search result');
      return [events, []];
    }
    const valueListExceptionItems = exceptionsList.filter(listItem => {
      return listItem.entries.every(entry => _securitysolutionIoTsListTypes.entriesList.is(entry));
    });

    // Every event starts out in the 'included' list, and each value list item checks all the
    // current 'included' events and moves events that match the exception to the 'excluded' list
    return valueListExceptionItems.reduce(async (filteredAccum, exceptionItem) => {
      const [includedEvents, excludedEvents] = await filteredAccum;
      const fieldAndSetTuples = await (0, _create_field_and_set_tuples.createFieldAndSetTuples)({
        events: includedEvents,
        exceptionItem,
        listClient,
        ruleExecutionLogger
      });
      const [nextIncludedEvents, nextExcludedEvents] = (0, _filter_events.partitionEvents)({
        events: includedEvents,
        fieldAndSetTuples
      });
      ruleExecutionLogger.debug(`Exception with id ${exceptionItem.id} filtered out ${nextExcludedEvents.length} events`);
      return [nextIncludedEvents, [...excludedEvents, ...nextExcludedEvents]];
    }, Promise.resolve([events, []]));
  } catch (exc) {
    throw new Error(`Failed to query large value based lists index. Reason: ${exc.message}`);
  }
};
exports.filterEventsAgainstList = filterEventsAgainstList;