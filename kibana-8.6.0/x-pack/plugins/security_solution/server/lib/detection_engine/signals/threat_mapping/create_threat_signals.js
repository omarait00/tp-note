"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThreatSignals = void 0;
var _chunk = _interopRequireDefault(require("lodash/fp/chunk"));
var _get_threat_list = require("./get_threat_list");
var _create_threat_signal = require("./create_threat_signal");
var _create_event_signal = require("./create_event_signal");
var _utils = require("./utils");
var _build_threat_enrichment = require("./build_threat_enrichment");
var _get_event_count = require("./get_event_count");
var _get_mapping_filters = require("./get_mapping_filters");
var _constants = require("../../../../../common/cti/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createThreatSignals = async ({
  alertId,
  bulkCreate,
  completeRule,
  concurrentSearches,
  eventsTelemetry,
  filters,
  inputIndex,
  itemsPerSearch,
  language,
  listClient,
  outputIndex,
  query,
  ruleExecutionLogger,
  savedId,
  searchAfterSize,
  services,
  threatFilters,
  threatIndex,
  threatIndicatorPath,
  threatLanguage,
  threatMapping,
  threatQuery,
  tuple,
  type,
  wrapHits,
  runtimeMappings,
  primaryTimestamp,
  secondaryTimestamp,
  exceptionFilter,
  unprocessedExceptions
}) => {
  const params = completeRule.ruleParams;
  ruleExecutionLogger.debug('Indicator matching rule starting');
  const perPage = concurrentSearches * itemsPerSearch;
  const verifyExecutionCanProceed = (0, _utils.buildExecutionIntervalValidator)(completeRule.ruleConfig.schedule.interval);
  let results = {
    success: true,
    warning: false,
    enrichmentTimes: [],
    bulkCreateTimes: [],
    searchAfterTimes: [],
    lastLookBackDate: null,
    createdSignalsCount: 0,
    createdSignals: [],
    errors: [],
    warningMessages: []
  };
  const {
    eventMappingFilter,
    indicatorMappingFilter
  } = (0, _get_mapping_filters.getMappingFilters)(threatMapping);
  const allEventFilters = [...filters, eventMappingFilter];
  const allThreatFilters = [...threatFilters, indicatorMappingFilter];
  const eventCount = await (0, _get_event_count.getEventCount)({
    esClient: services.scopedClusterClient.asCurrentUser,
    index: inputIndex,
    tuple,
    query,
    language,
    filters: allEventFilters,
    primaryTimestamp,
    secondaryTimestamp,
    exceptionFilter
  });
  ruleExecutionLogger.debug(`Total event count: ${eventCount}`);

  // if (eventCount === 0) {
  //   ruleExecutionLogger.debug('Indicator matching rule has completed');
  //   return results;
  // }

  let threatPitId = (await services.scopedClusterClient.asCurrentUser.openPointInTime({
    index: threatIndex,
    keep_alive: _constants.THREAT_PIT_KEEP_ALIVE
  })).id;
  const reassignThreatPitId = newPitId => {
    if (newPitId) threatPitId = newPitId;
  };
  const threatListCount = await (0, _get_threat_list.getThreatListCount)({
    esClient: services.scopedClusterClient.asCurrentUser,
    threatFilters: allThreatFilters,
    query: threatQuery,
    language: threatLanguage,
    index: threatIndex,
    exceptionFilter
  });
  ruleExecutionLogger.debug(`Total indicator items: ${threatListCount}`);
  const threatListConfig = {
    fields: threatMapping.map(mapping => mapping.entries.map(item => item.value)).flat(),
    _source: false
  };
  const threatEnrichment = (0, _build_threat_enrichment.buildThreatEnrichment)({
    ruleExecutionLogger,
    services,
    threatFilters: allThreatFilters,
    threatIndex,
    threatIndicatorPath,
    threatLanguage,
    threatQuery,
    pitId: threatPitId,
    reassignPitId: reassignThreatPitId,
    listClient,
    exceptionFilter
  });
  const createSignals = async ({
    getDocumentList,
    createSignal,
    totalDocumentCount
  }) => {
    let list = await getDocumentList({
      searchAfter: undefined
    });
    let documentCount = totalDocumentCount;
    while (list.hits.hits.length !== 0) {
      verifyExecutionCanProceed();
      const chunks = (0, _chunk.default)(itemsPerSearch, list.hits.hits);
      ruleExecutionLogger.debug(`${chunks.length} concurrent indicator searches are starting.`);
      const concurrentSearchesPerformed = chunks.map(createSignal);
      const searchesPerformed = await Promise.all(concurrentSearchesPerformed);
      results = (0, _utils.combineConcurrentResults)(results, searchesPerformed);
      documentCount -= list.hits.hits.length;
      ruleExecutionLogger.debug(`Concurrent indicator match searches completed with ${results.createdSignalsCount} signals found`, `search times of ${results.searchAfterTimes}ms,`, `bulk create times ${results.bulkCreateTimes}ms,`, `all successes are ${results.success}`);
      if (results.createdSignalsCount >= params.maxSignals) {
        ruleExecutionLogger.debug(`Indicator match has reached its max signals count ${params.maxSignals}. Additional documents not checked are ${documentCount}`);
        break;
      }
      ruleExecutionLogger.debug(`Documents items left to check are ${documentCount}`);
      list = await getDocumentList({
        searchAfter: list.hits.hits[list.hits.hits.length - 1].sort
      });
    }
  };
  if (eventCount < threatListCount) {
    await createSignals({
      totalDocumentCount: eventCount,
      getDocumentList: async ({
        searchAfter
      }) => (0, _get_event_count.getEventList)({
        services,
        ruleExecutionLogger,
        filters: allEventFilters,
        query,
        language,
        index: inputIndex,
        searchAfter,
        perPage,
        tuple,
        runtimeMappings,
        primaryTimestamp,
        secondaryTimestamp,
        exceptionFilter
      }),
      createSignal: slicedChunk => (0, _create_event_signal.createEventSignal)({
        alertId,
        bulkCreate,
        completeRule,
        currentEventList: slicedChunk,
        currentResult: results,
        eventsTelemetry,
        filters: allEventFilters,
        inputIndex,
        language,
        listClient,
        outputIndex,
        query,
        reassignThreatPitId,
        ruleExecutionLogger,
        savedId,
        searchAfterSize,
        services,
        threatEnrichment,
        threatFilters: allThreatFilters,
        threatIndex,
        threatIndicatorPath,
        threatLanguage,
        threatMapping,
        threatPitId,
        threatQuery,
        tuple,
        type,
        wrapHits,
        runtimeMappings,
        primaryTimestamp,
        secondaryTimestamp,
        exceptionFilter,
        unprocessedExceptions
      })
    });
  } else {
    await createSignals({
      totalDocumentCount: threatListCount,
      getDocumentList: async ({
        searchAfter
      }) => (0, _get_threat_list.getThreatList)({
        esClient: services.scopedClusterClient.asCurrentUser,
        threatFilters: allThreatFilters,
        query: threatQuery,
        language: threatLanguage,
        index: threatIndex,
        searchAfter,
        ruleExecutionLogger,
        perPage,
        threatListConfig,
        pitId: threatPitId,
        reassignPitId: reassignThreatPitId,
        runtimeMappings,
        listClient,
        exceptionFilter
      }),
      createSignal: slicedChunk => (0, _create_threat_signal.createThreatSignal)({
        alertId,
        bulkCreate,
        completeRule,
        currentResult: results,
        currentThreatList: slicedChunk,
        eventsTelemetry,
        filters: allEventFilters,
        inputIndex,
        language,
        listClient,
        outputIndex,
        query,
        ruleExecutionLogger,
        savedId,
        searchAfterSize,
        services,
        threatEnrichment,
        threatMapping,
        tuple,
        type,
        wrapHits,
        runtimeMappings,
        primaryTimestamp,
        secondaryTimestamp,
        exceptionFilter,
        unprocessedExceptions
      })
    });
  }
  try {
    await services.scopedClusterClient.asCurrentUser.closePointInTime({
      id: threatPitId
    });
  } catch (error) {
    // Don't fail due to a bad point in time closure. We have seen failures in e2e tests during nominal operations.
    ruleExecutionLogger.warn(`Error trying to close point in time: "${threatPitId}", it will expire within "${_constants.THREAT_PIT_KEEP_ALIVE}". Error is: "${error}"`);
  }
  ruleExecutionLogger.debug('Indicator matching rule has completed');
  return results;
};
exports.createThreatSignals = createThreatSignals;