"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchAfterAndBulkCreate = void 0;
var _lodash = require("lodash");
var _single_search_after = require("./single_search_after");
var _filter_events_against_list = require("./filters/filter_events_against_list");
var _send_telemetry_events = require("./send_telemetry_events");
var _utils = require("./utils");
var _with_security_span = require("../../../utils/with_security_span");
var _enrichments = require("./enrichments");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// search_after through documents and re-index using bulk endpoint.
const searchAfterAndBulkCreate = async ({
  buildReasonMessage,
  bulkCreate,
  enrichment = _lodash.identity,
  eventsTelemetry,
  exceptionsList,
  filter,
  inputIndexPattern,
  listClient,
  pageSize,
  ruleExecutionLogger,
  services,
  sortOrder,
  trackTotalHits,
  tuple,
  wrapHits,
  runtimeMappings,
  primaryTimestamp,
  secondaryTimestamp
}) => {
  return (0, _with_security_span.withSecuritySpan)('searchAfterAndBulkCreate', async () => {
    let toReturn = (0, _utils.createSearchAfterReturnType)();

    // sortId tells us where to start our next consecutive search_after query
    let sortIds;
    let hasSortId = true; // default to true so we execute the search on initial run

    if (tuple == null || tuple.to == null || tuple.from == null) {
      ruleExecutionLogger.error(`[-] malformed date tuple`);
      return (0, _utils.createSearchAfterReturnType)({
        success: false,
        errors: ['malformed date tuple']
      });
    }
    while (toReturn.createdSignalsCount < tuple.maxSignals) {
      try {
        let mergedSearchResults = (0, _utils.createSearchResultReturnType)();
        ruleExecutionLogger.debug(`sortIds: ${sortIds}`);
        if (hasSortId) {
          var _searchResult$hits$hi;
          const {
            searchResult,
            searchDuration,
            searchErrors
          } = await (0, _single_search_after.singleSearchAfter)({
            searchAfterSortIds: sortIds,
            index: inputIndexPattern,
            runtimeMappings,
            from: tuple.from.toISOString(),
            to: tuple.to.toISOString(),
            services,
            ruleExecutionLogger,
            filter,
            pageSize: Math.ceil(Math.min(tuple.maxSignals, pageSize)),
            primaryTimestamp,
            secondaryTimestamp,
            trackTotalHits,
            sortOrder
          });
          mergedSearchResults = (0, _utils.mergeSearchResults)([mergedSearchResults, searchResult]);
          toReturn = (0, _utils.mergeReturns)([toReturn, (0, _utils.createSearchAfterReturnTypeFromResponse)({
            searchResult: mergedSearchResults,
            primaryTimestamp
          }), (0, _utils.createSearchAfterReturnType)({
            searchAfterTimes: [searchDuration],
            errors: searchErrors
          })]);
          const lastSortIds = (0, _utils.getSafeSortIds)((_searchResult$hits$hi = searchResult.hits.hits[searchResult.hits.hits.length - 1]) === null || _searchResult$hits$hi === void 0 ? void 0 : _searchResult$hits$hi.sort);
          if (lastSortIds != null && lastSortIds.length !== 0) {
            sortIds = lastSortIds;
            hasSortId = true;
          } else {
            hasSortId = false;
          }
        }

        // determine if there are any candidate signals to be processed
        const totalHits = (0, _utils.getTotalHitsValue)(mergedSearchResults.hits.total);
        ruleExecutionLogger.debug(`totalHits: ${totalHits}`);
        ruleExecutionLogger.debug(`searchResult.hit.hits.length: ${mergedSearchResults.hits.hits.length}`);
        if (totalHits === 0 || mergedSearchResults.hits.hits.length === 0) {
          ruleExecutionLogger.debug(`${totalHits === 0 ? 'totalHits' : 'searchResult.hits.hits.length'} was 0, exiting early`);
          break;
        }

        // filter out the search results that match with the values found in the list.
        // the resulting set are signals to be indexed, given they are not duplicates
        // of signals already present in the signals index.
        const [includedEvents, _] = await (0, _filter_events_against_list.filterEventsAgainstList)({
          listClient,
          exceptionsList,
          ruleExecutionLogger,
          events: mergedSearchResults.hits.hits
        });

        // only bulk create if there are filteredEvents leftover
        // if there isn't anything after going through the value list filter
        // skip the call to bulk create and proceed to the next search_after,
        // if there is a sort id to continue the search_after with.
        if (includedEvents.length !== 0) {
          // make sure we are not going to create more signals than maxSignals allows
          const limitedEvents = includedEvents.slice(0, tuple.maxSignals - toReturn.createdSignalsCount);
          const enrichedEvents = await enrichment(limitedEvents);
          const wrappedDocs = wrapHits(enrichedEvents, buildReasonMessage);
          const bulkCreateResult = await bulkCreate(wrappedDocs, undefined, (0, _enrichments.createEnrichEventsFunction)({
            services,
            logger: ruleExecutionLogger
          }));
          (0, _utils.addToSearchAfterReturn)({
            current: toReturn,
            next: bulkCreateResult
          });
          ruleExecutionLogger.debug(`created ${bulkCreateResult.createdItemsCount} signals`);
          ruleExecutionLogger.debug(`signalsCreatedCount: ${toReturn.createdSignalsCount}`);
          ruleExecutionLogger.debug(`enrichedEvents.hits.hits: ${enrichedEvents.length}`);
          (0, _send_telemetry_events.sendAlertTelemetryEvents)(enrichedEvents, bulkCreateResult.createdItems, eventsTelemetry, ruleExecutionLogger);
        }
        if (!hasSortId) {
          ruleExecutionLogger.debug('ran out of sort ids to sort on');
          break;
        }
      } catch (exc) {
        ruleExecutionLogger.error(`[-] search_after_bulk_create threw an error ${exc}`);
        return (0, _utils.mergeReturns)([toReturn, (0, _utils.createSearchAfterReturnType)({
          success: false,
          errors: [`${exc}`]
        })]);
      }
    }
    ruleExecutionLogger.debug(`[+] completed bulk index of ${toReturn.createdSignalsCount}`);
    return toReturn;
  });
};
exports.searchAfterAndBulkCreate = searchAfterAndBulkCreate;