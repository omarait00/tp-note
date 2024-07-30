"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eqlExecutor = void 0;
var _perf_hooks = require("perf_hooks");
var _build_events_query = require("../build_events_query");
var _enrichments = require("../enrichments");
var _utils = require("../utils");
var _reason_formatters = require("../reason_formatters");
var _with_security_span = require("../../../../utils/with_security_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const eqlExecutor = async ({
  inputIndex,
  runtimeMappings,
  completeRule,
  tuple,
  ruleExecutionLogger,
  services,
  version,
  bulkCreate,
  wrapHits,
  wrapSequences,
  primaryTimestamp,
  secondaryTimestamp,
  exceptionFilter,
  unprocessedExceptions
}) => {
  const ruleParams = completeRule.ruleParams;
  return (0, _with_security_span.withSecuritySpan)('eqlExecutor', async () => {
    var _newSignals;
    const result = (0, _utils.createSearchAfterReturnType)();
    const request = (0, _build_events_query.buildEqlSearchRequest)({
      query: ruleParams.query,
      index: inputIndex,
      from: tuple.from.toISOString(),
      to: tuple.to.toISOString(),
      size: ruleParams.maxSignals,
      filters: ruleParams.filters,
      primaryTimestamp,
      secondaryTimestamp,
      runtimeMappings,
      eventCategoryOverride: ruleParams.eventCategoryOverride,
      timestampField: ruleParams.timestampField,
      tiebreakerField: ruleParams.tiebreakerField,
      exceptionFilter
    });
    ruleExecutionLogger.debug(`EQL query request: ${JSON.stringify(request)}`);
    const exceptionsWarning = (0, _utils.getUnprocessedExceptionsWarnings)(unprocessedExceptions);
    if (exceptionsWarning) {
      result.warningMessages.push(exceptionsWarning);
    }
    const eqlSignalSearchStart = _perf_hooks.performance.now();
    const response = await services.scopedClusterClient.asCurrentUser.eql.search(request);
    const eqlSignalSearchEnd = _perf_hooks.performance.now();
    const eqlSearchDuration = (0, _utils.makeFloatString)(eqlSignalSearchEnd - eqlSignalSearchStart);
    result.searchAfterTimes = [eqlSearchDuration];
    let newSignals;
    if (response.hits.sequences !== undefined) {
      newSignals = wrapSequences(response.hits.sequences, _reason_formatters.buildReasonMessageForEqlAlert);
    } else if (response.hits.events !== undefined) {
      newSignals = wrapHits(response.hits.events, _reason_formatters.buildReasonMessageForEqlAlert);
    } else {
      throw new Error('eql query response should have either `sequences` or `events` but had neither');
    }
    if ((_newSignals = newSignals) !== null && _newSignals !== void 0 && _newSignals.length) {
      const createResult = await bulkCreate(newSignals, undefined, (0, _enrichments.createEnrichEventsFunction)({
        services,
        logger: ruleExecutionLogger
      }));
      (0, _utils.addToSearchAfterReturn)({
        current: result,
        next: createResult
      });
    }
    return result;
  });
};
exports.eqlExecutor = eqlExecutor;