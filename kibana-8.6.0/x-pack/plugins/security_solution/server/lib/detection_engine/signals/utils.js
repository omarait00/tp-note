"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapBuildingBlocks = exports.racFieldMappings = exports.parseInterval = exports.mergeSearchResults = exports.mergeReturns = exports.makeFloatString = exports.lastValidDate = exports.isWrappedSignalHit = exports.isWrappedEventHit = exports.isWrappedDetectionAlert = exports.isThresholdParams = exports.isThreatParams = exports.isQueryParams = exports.isMachineLearningParams = exports.isEqlParams = exports.isDetectionAlert = exports.hasTimestampFields = exports.hasReadIndexPrivileges = exports.getValidDateFromDoc = exports.getUnprocessedExceptionsWarnings = exports.getTotalHitsValue = exports.getThresholdTermsHash = exports.getSafeSortIds = exports.getRuleRangeTuples = exports.getNumCatchupIntervals = exports.getListsClient = exports.getGapBetweenRuns = exports.getField = exports.getExceptions = exports.getCatchupTuples = exports.generateSignalId = exports.generateId = exports.generateBuildingBlockIds = exports.errorAggregator = exports.createSearchResultReturnType = exports.createSearchAfterReturnTypeFromResponse = exports.createSearchAfterReturnType = exports.createErrorsFromShard = exports.checkPrivilegesFromEsClient = exports.checkPrivileges = exports.calculateTotal = exports.calculateThresholdSignalUuid = exports.buildChunkedOrFilter = exports.addToSearchAfterReturn = exports.MAX_RULE_GAP_RATIO = void 0;
var _crypto = require("crypto");
var _lodash = require("lodash");
var _moment = _interopRequireDefault(require("moment"));
var _v = _interopRequireDefault(require("uuid/v5"));
var _datemath = _interopRequireDefault(require("@kbn/datemath"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _server = require("../../../../../alerting/server");
var _rule_monitoring = require("../../../../common/detection_engine/rule_monitoring");
var _with_security_span = require("../../../utils/with_security_span");
var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_RULE_GAP_RATIO = 4;
exports.MAX_RULE_GAP_RATIO = MAX_RULE_GAP_RATIO;
const hasReadIndexPrivileges = async args => {
  const {
    privileges,
    ruleExecutionLogger,
    uiSettingsClient
  } = args;
  const isCcsPermissionWarningEnabled = await uiSettingsClient.get(_constants.ENABLE_CCS_READ_WARNING_SETTING);
  const indexNames = Object.keys(privileges.index);
  const filteredIndexNames = isCcsPermissionWarningEnabled ? indexNames : indexNames.filter(indexName => !indexName.includes(':')); // Cross cluster indices uniquely contain `:` in their name

  const [, indexesWithNoReadPrivileges] = (0, _lodash.partition)(filteredIndexNames, indexName => privileges.index[indexName].read);

  // Some indices have read privileges others do not.
  if (indexesWithNoReadPrivileges.length > 0) {
    const indexesString = JSON.stringify(indexesWithNoReadPrivileges);
    await ruleExecutionLogger.logStatusChange({
      newStatus: _rule_monitoring.RuleExecutionStatus['partial failure'],
      message: `This rule may not have the required read privileges to the following indices/index patterns: ${indexesString}`
    });
    return true;
  }
  return false;
};
exports.hasReadIndexPrivileges = hasReadIndexPrivileges;
const hasTimestampFields = async args => {
  var _timestampFieldCapsRe, _timestampFieldCapsRe2;
  const {
    timestampField,
    timestampFieldCapsResponse,
    inputIndices,
    ruleExecutionLogger
  } = args;
  const {
    ruleName
  } = ruleExecutionLogger.context;
  if ((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.indices)) {
    const errorString = `This rule is attempting to query data from Elasticsearch indices listed in the "Index pattern" section of the rule definition, however no index matching: ${JSON.stringify(inputIndices)} was found. This warning will continue to appear until a matching index is created or this rule is disabled. ${ruleName === 'Endpoint Security' ? 'If you have recently enrolled agents enabled with Endpoint Security through Fleet, this warning should stop once an alert is sent from an agent.' : ''}`;
    await ruleExecutionLogger.logStatusChange({
      newStatus: _rule_monitoring.RuleExecutionStatus['partial failure'],
      message: errorString.trimEnd()
    });
    return {
      wroteWarningStatus: true,
      foundNoIndices: true
    };
  } else if ((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || timestampFieldCapsResponse.body.fields[timestampField] == null || ((_timestampFieldCapsRe = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe === void 0 ? void 0 : (_timestampFieldCapsRe2 = _timestampFieldCapsRe.unmapped) === null || _timestampFieldCapsRe2 === void 0 ? void 0 : _timestampFieldCapsRe2.indices) != null) {
    var _timestampFieldCapsRe3, _timestampFieldCapsRe4;
    // if there is a timestamp override and the unmapped array for the timestamp override key is not empty,
    // warning
    const errorString = `The following indices are missing the ${timestampField === '@timestamp' ? 'timestamp field "@timestamp"' : `timestamp override field "${timestampField}"`}: ${JSON.stringify((0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields) || (0, _lodash.isEmpty)(timestampFieldCapsResponse.body.fields[timestampField]) ? timestampFieldCapsResponse.body.indices : (_timestampFieldCapsRe3 = timestampFieldCapsResponse.body.fields[timestampField]) === null || _timestampFieldCapsRe3 === void 0 ? void 0 : (_timestampFieldCapsRe4 = _timestampFieldCapsRe3.unmapped) === null || _timestampFieldCapsRe4 === void 0 ? void 0 : _timestampFieldCapsRe4.indices)}`;
    await ruleExecutionLogger.logStatusChange({
      newStatus: _rule_monitoring.RuleExecutionStatus['partial failure'],
      message: errorString
    });
    return {
      wroteWarningStatus: true,
      foundNoIndices: false
    };
  }
  return {
    wroteWarningStatus: false,
    foundNoIndices: false
  };
};
exports.hasTimestampFields = hasTimestampFields;
const checkPrivileges = async (services, indices) => checkPrivilegesFromEsClient(services.scopedClusterClient.asCurrentUser, indices);
exports.checkPrivileges = checkPrivileges;
const checkPrivilegesFromEsClient = async (esClient, indices) => (0, _with_security_span.withSecuritySpan)('checkPrivilegesFromEsClient', async () => await esClient.transport.request({
  path: '/_security/user/_has_privileges',
  method: 'POST',
  body: {
    index: [{
      names: indices !== null && indices !== void 0 ? indices : [],
      allow_restricted_indices: true,
      privileges: ['read']
    }]
  }
}));
exports.checkPrivilegesFromEsClient = checkPrivilegesFromEsClient;
const getNumCatchupIntervals = ({
  gap,
  intervalDuration
}) => {
  if (gap.asMilliseconds() <= 0 || intervalDuration.asMilliseconds() <= 0) {
    return 0;
  }
  const ratio = Math.ceil(gap.asMilliseconds() / intervalDuration.asMilliseconds());
  // maxCatchup is to ensure we are not trying to catch up too far back.
  // This allows for a maximum of 4 consecutive rule execution misses
  // to be included in the number of signals generated.
  return ratio < MAX_RULE_GAP_RATIO ? ratio : MAX_RULE_GAP_RATIO;
};
exports.getNumCatchupIntervals = getNumCatchupIntervals;
const getListsClient = ({
  lists,
  spaceId,
  updatedByUser,
  services,
  savedObjectClient
}) => {
  if (lists == null) {
    throw new Error('lists plugin unavailable during rule execution');
  }
  const listClient = lists.getListClient(services.scopedClusterClient.asCurrentUser, spaceId, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  const exceptionsClient = lists.getExceptionListClient(savedObjectClient, updatedByUser !== null && updatedByUser !== void 0 ? updatedByUser : 'elastic');
  return {
    listClient,
    exceptionsClient
  };
};
exports.getListsClient = getListsClient;
const getExceptions = async ({
  client,
  lists
}) => {
  if (lists.length > 0) {
    try {
      const listIds = lists.map(({
        list_id: listId
      }) => listId);
      const namespaceTypes = lists.map(({
        namespace_type: namespaceType
      }) => namespaceType);

      // Stream the results from the Point In Time (PIT) finder into this array
      let items = [];
      const executeFunctionOnStream = response => {
        items = [...items, ...response.data];
      };
      await client.findExceptionListsItemPointInTimeFinder({
        executeFunctionOnStream,
        listId: listIds,
        namespaceType: namespaceTypes,
        perPage: 1_000,
        // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
        filter: [],
        maxSize: undefined,
        // NOTE: This is unbounded when it is "undefined"
        sortOrder: undefined,
        sortField: undefined
      });
      return items;
    } catch (e) {
      throw new Error(`unable to fetch exception list items, message: "${e.message}" full error: "${e}"`);
    }
  } else {
    return [];
  }
};
exports.getExceptions = getExceptions;
const generateId = (docIndex, docId, version, ruleId) => (0, _crypto.createHash)('sha256').update(docIndex.concat(docId, version, ruleId)).digest('hex');

// TODO: do we need to include version in the id? If it does matter then we should include it in signal.parents as well
exports.generateId = generateId;
const generateSignalId = signal => (0, _crypto.createHash)('sha256').update(signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '').concat(signal.rule.id)).digest('hex');

/**
 * Generates unique doc ids for each building block signal within a sequence. The id of each building block
 * depends on the parents of every building block, so that a signal which appears in multiple different sequences
 * (e.g. if multiple rules build sequences that share a common event/signal) will get a unique id per sequence.
 * @param buildingBlocks The full list of building blocks in the sequence.
 */
exports.generateSignalId = generateSignalId;
const generateBuildingBlockIds = buildingBlocks => {
  const baseHashString = buildingBlocks.reduce((baseString, block) => baseString.concat(block.signal.parents.reduce((acc, parent) => acc.concat(parent.id, parent.index), '')).concat(block.signal.rule.id), '');
  return buildingBlocks.map((block, idx) => (0, _crypto.createHash)('sha256').update(baseHashString).update(String(idx)).digest('hex'));
};
exports.generateBuildingBlockIds = generateBuildingBlockIds;
const wrapBuildingBlocks = (buildingBlocks, index) => {
  const blockIds = generateBuildingBlockIds(buildingBlocks);
  return buildingBlocks.map((block, idx) => {
    return {
      _id: blockIds[idx],
      _index: index,
      _source: {
        ...block
      }
    };
  });
};
exports.wrapBuildingBlocks = wrapBuildingBlocks;
const parseInterval = intervalString => {
  try {
    return _moment.default.duration((0, _server.parseDuration)(intervalString));
  } catch (err) {
    return null;
  }
};
exports.parseInterval = parseInterval;
const getGapBetweenRuns = ({
  previousStartedAt,
  originalFrom,
  originalTo,
  startedAt
}) => {
  if (previousStartedAt == null) {
    return _moment.default.duration(0);
  }
  const driftTolerance = _moment.default.duration(originalTo.diff(originalFrom));
  const currentDuration = _moment.default.duration((0, _moment.default)(startedAt).diff(previousStartedAt));
  return currentDuration.subtract(driftTolerance);
};
exports.getGapBetweenRuns = getGapBetweenRuns;
const makeFloatString = num => Number(num).toFixed(2);

/**
 * Given a BulkResponse this will return an aggregation based on the errors if any exist
 * from the BulkResponse. Errors are aggregated on the reason as the unique key.
 *
 * Example would be:
 * {
 *   'Parse Error': {
 *      count: 100,
 *      statusCode: 400,
 *   },
 *   'Internal server error': {
 *       count: 3,
 *       statusCode: 500,
 *   }
 * }
 * If this does not return any errors then you will get an empty object like so: {}
 * @param response The bulk response to aggregate based on the error message
 * @param ignoreStatusCodes Optional array of status codes to ignore when creating aggregate error messages
 * @returns The aggregated example as shown above.
 */
exports.makeFloatString = makeFloatString;
const errorAggregator = (response, ignoreStatusCodes) => {
  return response.items.reduce((accum, item) => {
    var _item$create;
    if (((_item$create = item.create) === null || _item$create === void 0 ? void 0 : _item$create.error) != null && !ignoreStatusCodes.includes(item.create.status)) {
      if (accum[item.create.error.reason] == null) {
        accum[item.create.error.reason] = {
          count: 1,
          statusCode: item.create.status
        };
      } else {
        accum[item.create.error.reason] = {
          count: accum[item.create.error.reason].count + 1,
          statusCode: item.create.status
        };
      }
    }
    return accum;
  }, Object.create(null));
};
exports.errorAggregator = errorAggregator;
const getRuleRangeTuples = ({
  startedAt,
  previousStartedAt,
  from,
  to,
  interval,
  maxSignals,
  ruleExecutionLogger
}) => {
  const originalFrom = _datemath.default.parse(from, {
    forceNow: startedAt
  });
  const originalTo = _datemath.default.parse(to, {
    forceNow: startedAt
  });
  if (originalFrom == null || originalTo == null) {
    throw new Error('Failed to parse date math of rule.from or rule.to');
  }
  const tuples = [{
    to: originalTo,
    from: originalFrom,
    maxSignals
  }];
  const intervalDuration = parseInterval(interval);
  if (intervalDuration == null) {
    ruleExecutionLogger.error('Failed to compute gap between rule runs: could not parse rule interval');
    return {
      tuples,
      remainingGap: _moment.default.duration(0)
    };
  }
  const gap = getGapBetweenRuns({
    previousStartedAt,
    originalTo,
    originalFrom,
    startedAt
  });
  const catchup = getNumCatchupIntervals({
    gap,
    intervalDuration
  });
  const catchupTuples = getCatchupTuples({
    originalTo,
    originalFrom,
    ruleParamsMaxSignals: maxSignals,
    catchup,
    intervalDuration
  });
  tuples.push(...catchupTuples);

  // Each extra tuple adds one extra intervalDuration to the time range this rule will cover.
  const remainingGapMilliseconds = Math.max(gap.asMilliseconds() - catchup * intervalDuration.asMilliseconds(), 0);
  return {
    tuples: tuples.reverse(),
    remainingGap: _moment.default.duration(remainingGapMilliseconds)
  };
};

/**
 * Creates rule range tuples needed to cover gaps since the last rule run.
 * @param to moment.Moment representing the rules 'to' property
 * @param from moment.Moment representing the rules 'from' property
 * @param ruleParamsMaxSignals int representing the maxSignals property on the rule (usually unmodified at 100)
 * @param catchup number the number of additional rule run intervals to add
 * @param intervalDuration moment.Duration the interval which the rule runs
 */
exports.getRuleRangeTuples = getRuleRangeTuples;
const getCatchupTuples = ({
  originalTo,
  originalFrom,
  ruleParamsMaxSignals,
  catchup,
  intervalDuration
}) => {
  const catchupTuples = [];
  const intervalInMilliseconds = intervalDuration.asMilliseconds();
  let currentTo = originalTo;
  let currentFrom = originalFrom;
  // This loop will create tuples with overlapping time ranges, the same way rule runs have overlapping time
  // ranges due to the additional lookback. We could choose to create tuples that don't overlap here by using the
  // "from" value from one tuple as "to" in the next one, however, the overlap matters for rule types like EQL and
  // threshold rules that look for sets of documents within the query. Thus we keep the overlap so that these
  // extra tuples behave as similarly to the regular rule runs as possible.
  while (catchupTuples.length < catchup) {
    const nextTo = currentTo.clone().subtract(intervalInMilliseconds);
    const nextFrom = currentFrom.clone().subtract(intervalInMilliseconds);
    catchupTuples.push({
      to: nextTo,
      from: nextFrom,
      maxSignals: ruleParamsMaxSignals
    });
    currentTo = nextTo;
    currentFrom = nextFrom;
  }
  return catchupTuples;
};

/**
 * Given errors from a search query this will return an array of strings derived from the errors.
 * @param errors The errors to derive the strings from
 */
exports.getCatchupTuples = getCatchupTuples;
const createErrorsFromShard = ({
  errors
}) => {
  return errors.map(error => {
    const {
      index,
      reason: {
        reason,
        type,
        caused_by: {
          reason: causedByReason,
          type: causedByType
        } = {
          reason: undefined,
          type: undefined
        }
      } = {}
    } = error;
    return [...(index != null ? [`index: "${index}"`] : []), ...(reason != null ? [`reason: "${reason}"`] : []), ...(type != null ? [`type: "${type}"`] : []), ...(causedByReason != null ? [`caused by reason: "${causedByReason}"`] : []), ...(causedByType != null ? [`caused by type: "${causedByType}"`] : [])].join(' ');
  });
};

/**
 * Given a SignalSearchResponse this will return a valid last date if it can find one, otherwise it
 * will return undefined. This tries the "fields" first to get a formatted date time if it can, but if
 * it cannot it will resort to using the "_source" fields second which can be problematic if the date time
 * is not correctly ISO8601 or epoch milliseconds formatted.
 * @param searchResult The result to try and parse out the timestamp.
 * @param primaryTimestamp The primary timestamp to use.
 */
exports.createErrorsFromShard = createErrorsFromShard;
const lastValidDate = ({
  searchResult,
  primaryTimestamp
}) => {
  if (searchResult.hits.hits.length === 0) {
    return undefined;
  } else {
    const lastRecord = searchResult.hits.hits[searchResult.hits.hits.length - 1];
    return getValidDateFromDoc({
      doc: lastRecord,
      primaryTimestamp
    });
  }
};

/**
 * Given a search hit this will return a valid last date if it can find one, otherwise it
 * will return undefined. This tries the "fields" first to get a formatted date time if it can, but if
 * it cannot it will resort to using the "_source" fields second which can be problematic if the date time
 * is not correctly ISO8601 or epoch milliseconds formatted.
 * @param searchResult The result to try and parse out the timestamp.
 * @param primaryTimestamp The primary timestamp to use.
 */
exports.lastValidDate = lastValidDate;
const getValidDateFromDoc = ({
  doc,
  primaryTimestamp
}) => {
  const timestampValue = doc.fields != null && doc.fields[primaryTimestamp] != null ? doc.fields[primaryTimestamp][0] : doc._source != null ? doc._source[primaryTimestamp] : undefined;
  const lastTimestamp = typeof timestampValue === 'string' || typeof timestampValue === 'number' ? timestampValue : undefined;
  if (lastTimestamp != null) {
    const tempMoment = (0, _moment.default)(lastTimestamp);
    if (tempMoment.isValid()) {
      return tempMoment.toDate();
    } else if (typeof timestampValue === 'string') {
      // worst case we have a string from fields API or other areas of Elasticsearch that have given us a number as a string,
      // so we try one last time to parse this best we can by converting from string to a number
      const maybeDate = (0, _moment.default)(+lastTimestamp);
      if (maybeDate.isValid()) {
        return maybeDate.toDate();
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }
};
exports.getValidDateFromDoc = getValidDateFromDoc;
const createSearchAfterReturnTypeFromResponse = ({
  searchResult,
  primaryTimestamp
}) => {
  var _searchResult$_shards;
  return createSearchAfterReturnType({
    success: searchResult._shards.failed === 0 || ((_searchResult$_shards = searchResult._shards.failures) === null || _searchResult$_shards === void 0 ? void 0 : _searchResult$_shards.every(failure => {
      var _failure$reason, _failure$reason$reaso, _failure$reason2, _failure$reason2$reas;
      return ((_failure$reason = failure.reason) === null || _failure$reason === void 0 ? void 0 : (_failure$reason$reaso = _failure$reason.reason) === null || _failure$reason$reaso === void 0 ? void 0 : _failure$reason$reaso.includes('No mapping found for [@timestamp] in order to sort on')) || ((_failure$reason2 = failure.reason) === null || _failure$reason2 === void 0 ? void 0 : (_failure$reason2$reas = _failure$reason2.reason) === null || _failure$reason2$reas === void 0 ? void 0 : _failure$reason2$reas.includes(`No mapping found for [${primaryTimestamp}] in order to sort on`));
    })),
    lastLookBackDate: lastValidDate({
      searchResult,
      primaryTimestamp
    })
  });
};
exports.createSearchAfterReturnTypeFromResponse = createSearchAfterReturnTypeFromResponse;
const createSearchAfterReturnType = ({
  success,
  warning,
  searchAfterTimes,
  enrichmentTimes,
  bulkCreateTimes,
  lastLookBackDate,
  createdSignalsCount,
  createdSignals,
  errors,
  warningMessages
} = {}) => {
  return {
    success: success !== null && success !== void 0 ? success : true,
    warning: warning !== null && warning !== void 0 ? warning : false,
    searchAfterTimes: searchAfterTimes !== null && searchAfterTimes !== void 0 ? searchAfterTimes : [],
    enrichmentTimes: enrichmentTimes !== null && enrichmentTimes !== void 0 ? enrichmentTimes : [],
    bulkCreateTimes: bulkCreateTimes !== null && bulkCreateTimes !== void 0 ? bulkCreateTimes : [],
    lastLookBackDate: lastLookBackDate !== null && lastLookBackDate !== void 0 ? lastLookBackDate : null,
    createdSignalsCount: createdSignalsCount !== null && createdSignalsCount !== void 0 ? createdSignalsCount : 0,
    createdSignals: createdSignals !== null && createdSignals !== void 0 ? createdSignals : [],
    errors: errors !== null && errors !== void 0 ? errors : [],
    warningMessages: warningMessages !== null && warningMessages !== void 0 ? warningMessages : []
  };
};
exports.createSearchAfterReturnType = createSearchAfterReturnType;
const createSearchResultReturnType = () => {
  const hits = [];
  return {
    took: 0,
    timed_out: false,
    _shards: {
      total: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      failures: []
    },
    hits: {
      total: 0,
      max_score: 0,
      hits
    }
  };
};

/**
 * Merges the return values from bulk creating alerts into the appropriate fields in the combined return object.
 */
exports.createSearchResultReturnType = createSearchResultReturnType;
const addToSearchAfterReturn = ({
  current,
  next
}) => {
  current.success = current.success && next.success;
  current.createdSignalsCount += next.createdItemsCount;
  current.createdSignals.push(...next.createdItems);
  current.bulkCreateTimes.push(next.bulkCreateDuration);
  current.enrichmentTimes.push(next.enrichmentDuration);
  current.errors = [...new Set([...current.errors, ...next.errors])];
};
exports.addToSearchAfterReturn = addToSearchAfterReturn;
const mergeReturns = searchAfters => {
  return searchAfters.reduce((prev, next) => {
    const {
      success: existingSuccess,
      warning: existingWarning,
      searchAfterTimes: existingSearchAfterTimes,
      bulkCreateTimes: existingBulkCreateTimes,
      enrichmentTimes: existingEnrichmentTimes,
      lastLookBackDate: existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount,
      createdSignals: existingCreatedSignals,
      errors: existingErrors,
      warningMessages: existingWarningMessages
    } = prev;
    const {
      success: newSuccess,
      warning: newWarning,
      searchAfterTimes: newSearchAfterTimes,
      enrichmentTimes: newEnrichmentTimes,
      bulkCreateTimes: newBulkCreateTimes,
      lastLookBackDate: newLastLookBackDate,
      createdSignalsCount: newCreatedSignalsCount,
      createdSignals: newCreatedSignals,
      errors: newErrors,
      warningMessages: newWarningMessages
    } = next;
    return {
      success: existingSuccess && newSuccess,
      warning: existingWarning || newWarning,
      searchAfterTimes: [...existingSearchAfterTimes, ...newSearchAfterTimes],
      enrichmentTimes: [...existingEnrichmentTimes, ...newEnrichmentTimes],
      bulkCreateTimes: [...existingBulkCreateTimes, ...newBulkCreateTimes],
      lastLookBackDate: newLastLookBackDate !== null && newLastLookBackDate !== void 0 ? newLastLookBackDate : existingLastLookBackDate,
      createdSignalsCount: existingCreatedSignalsCount + newCreatedSignalsCount,
      createdSignals: [...existingCreatedSignals, ...newCreatedSignals],
      errors: [...new Set([...existingErrors, ...newErrors])],
      warningMessages: [...existingWarningMessages, ...newWarningMessages]
    };
  });
};
exports.mergeReturns = mergeReturns;
const mergeSearchResults = searchResults => {
  return searchResults.reduce((prev, next) => {
    const {
      took: existingTook,
      timed_out: existingTimedOut,
      _shards: existingShards,
      hits: existingHits
    } = prev;
    const {
      took: newTook,
      timed_out: newTimedOut,
      _scroll_id: newScrollId,
      _shards: newShards,
      aggregations: newAggregations,
      hits: newHits
    } = next;
    return {
      took: Math.max(newTook, existingTook),
      timed_out: newTimedOut && existingTimedOut,
      _scroll_id: newScrollId,
      _shards: {
        total: newShards.total + existingShards.total,
        successful: newShards.successful + existingShards.successful,
        failed: newShards.failed + existingShards.failed,
        // @ts-expect-error @elastic/elaticsearch skipped is optional in ShardStatistics
        skipped: newShards.skipped + existingShards.skipped,
        failures: [...(existingShards.failures != null ? existingShards.failures : []), ...(newShards.failures != null ? newShards.failures : [])]
      },
      aggregations: newAggregations,
      hits: {
        total: calculateTotal(prev.hits.total, next.hits.total),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        max_score: Math.max(newHits.max_score, existingHits.max_score),
        hits: [...existingHits.hits, ...newHits.hits]
      }
    };
  });
};
exports.mergeSearchResults = mergeSearchResults;
const getTotalHitsValue = totalHits => typeof totalHits === 'undefined' ? -1 : typeof totalHits === 'number' ? totalHits : totalHits.value;
exports.getTotalHitsValue = getTotalHitsValue;
const calculateTotal = (prevTotal, nextTotal) => {
  const prevTotalHits = getTotalHitsValue(prevTotal);
  const nextTotalHits = getTotalHitsValue(nextTotal);
  if (prevTotalHits === -1 || nextTotalHits === -1) {
    return -1;
  }
  return prevTotalHits + nextTotalHits;
};
exports.calculateTotal = calculateTotal;
const calculateThresholdSignalUuid = (ruleId, startedAt, thresholdFields, key) => {
  // used to generate stable Threshold Signals ID when run with the same params
  const NAMESPACE_ID = '0684ec03-7201-4ee0-8ee0-3a3f6b2479b2';
  const startedAtString = startedAt.toISOString();
  const keyString = key !== null && key !== void 0 ? key : '';
  const baseString = `${ruleId}${startedAtString}${thresholdFields.join(',')}${keyString}`;
  return (0, _v.default)(baseString, NAMESPACE_ID);
};
exports.calculateThresholdSignalUuid = calculateThresholdSignalUuid;
const getThresholdTermsHash = terms => {
  return (0, _crypto.createHash)('sha256').update(terms.sort((term1, term2) => term1.field > term2.field ? 1 : -1).map(term => {
    return `${term.field}:${term.value}`;
  }).join(',')).digest('hex');
};
exports.getThresholdTermsHash = getThresholdTermsHash;
const isEqlParams = params => params.type === 'eql';
exports.isEqlParams = isEqlParams;
const isThresholdParams = params => params.type === 'threshold';
exports.isThresholdParams = isThresholdParams;
const isQueryParams = params => params.type === 'query';
exports.isQueryParams = isQueryParams;
const isThreatParams = params => params.type === 'threat_match';
exports.isThreatParams = isThreatParams;
const isMachineLearningParams = params => params.type === 'machine_learning';

/**
 * Prevent javascript from returning Number.MAX_SAFE_INTEGER when Elasticsearch expects
 * Java's Long.MAX_VALUE. This happens when sorting fields by date which are
 * unmapped in the provided index
 *
 * Ref: https://github.com/elastic/elasticsearch/issues/28806#issuecomment-369303620
 *
 * return stringified Long.MAX_VALUE if we receive Number.MAX_SAFE_INTEGER
 * @param sortIds estypes.SortResults | undefined
 * @returns SortResults
 */
exports.isMachineLearningParams = isMachineLearningParams;
const getSafeSortIds = sortIds => {
  return sortIds === null || sortIds === void 0 ? void 0 : sortIds.map(sortId => {
    // haven't determined when we would receive a null value for a sort id
    // but in case we do, default to sending the stringified Java max_int
    if (sortId == null || sortId === '' || sortId >= Number.MAX_SAFE_INTEGER) {
      return '9223372036854775807';
    }
    return sortId;
  });
};
exports.getSafeSortIds = getSafeSortIds;
const buildChunkedOrFilter = (field, values, chunkSize = 1024) => {
  if (values.length === 0) {
    return undefined;
  }
  const chunkedValues = (0, _lodash.chunk)(values, chunkSize);
  return chunkedValues.map(subArray => {
    const joinedValues = subArray.map(value => `"${value}"`).join(' OR ');
    return `${field}: (${joinedValues})`;
  }).join(' OR ');
};
exports.buildChunkedOrFilter = buildChunkedOrFilter;
const isWrappedEventHit = event => {
  return !isWrappedSignalHit(event) && !isWrappedDetectionAlert(event);
};
exports.isWrappedEventHit = isWrappedEventHit;
const isWrappedSignalHit = event => {
  var _source;
  return (event === null || event === void 0 ? void 0 : (_source = event._source) === null || _source === void 0 ? void 0 : _source.signal) != null;
};
exports.isWrappedSignalHit = isWrappedSignalHit;
const isWrappedDetectionAlert = event => {
  var _source2;
  return (event === null || event === void 0 ? void 0 : (_source2 = event._source) === null || _source2 === void 0 ? void 0 : _source2[_ruleDataUtils.ALERT_UUID]) != null;
};
exports.isWrappedDetectionAlert = isWrappedDetectionAlert;
const isDetectionAlert = event => {
  return (0, _lodash.get)(event, _ruleDataUtils.ALERT_UUID) != null;
};
exports.isDetectionAlert = isDetectionAlert;
const racFieldMappings = {
  'signal.rule.id': _ruleDataUtils.ALERT_RULE_UUID,
  'signal.rule.description': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.description`,
  'signal.rule.filters': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.filters`,
  'signal.rule.language': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.language`,
  'signal.rule.query': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.query`,
  'signal.rule.risk_score': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.riskScore`,
  'signal.rule.severity': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.severity`,
  'signal.rule.building_block_type': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.buildingBlockType`,
  'signal.rule.namespace': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.namespace`,
  'signal.rule.note': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.note`,
  'signal.rule.license': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.license`,
  'signal.rule.output_index': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.outputIndex`,
  'signal.rule.timeline_id': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.timelineId`,
  'signal.rule.timeline_title': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.timelineTitle`,
  'signal.rule.meta': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.meta`,
  'signal.rule.rule_name_override': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.ruleNameOverride`,
  'signal.rule.timestamp_override': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.timestampOverride`,
  'signal.rule.author': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.author`,
  'signal.rule.false_positives': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.falsePositives`,
  'signal.rule.from': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.from`,
  'signal.rule.rule_id': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.ruleId`,
  'signal.rule.max_signals': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.maxSignals`,
  'signal.rule.risk_score_mapping': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.riskScoreMapping`,
  'signal.rule.severity_mapping': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.severityMapping`,
  'signal.rule.threat': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.threat`,
  'signal.rule.to': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.to`,
  'signal.rule.references': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.references`,
  'signal.rule.version': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.version`,
  'signal.rule.exceptions_list': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.exceptionsList`,
  'signal.rule.immutable': `${_ruleDataUtils.ALERT_RULE_PARAMETERS}.immutable`
};
exports.racFieldMappings = racFieldMappings;
const getField = (event, field) => {
  if (isWrappedDetectionAlert(event)) {
    var _racFieldMappings$fie;
    const mappedField = (_racFieldMappings$fie = racFieldMappings[field]) !== null && _racFieldMappings$fie !== void 0 ? _racFieldMappings$fie : field.replace('signal', 'kibana.alert');
    const parts = mappedField.split('.');
    if (mappedField.includes(_ruleDataUtils.ALERT_RULE_PARAMETERS) && parts[parts.length - 1] !== 'parameters') {
      const params = (0, _lodash.get)(event._source, _ruleDataUtils.ALERT_RULE_PARAMETERS);
      return (0, _lodash.get)(params, parts[parts.length - 1]);
    }
    return (0, _lodash.get)(event._source, mappedField);
  } else if (isWrappedSignalHit(event)) {
    var _invert$field;
    const mappedField = (_invert$field = (0, _lodash.invert)(racFieldMappings)[field]) !== null && _invert$field !== void 0 ? _invert$field : field.replace('kibana.alert', 'signal');
    return (0, _lodash.get)(event._source, mappedField);
  } else if (isWrappedEventHit(event)) {
    return (0, _lodash.get)(event._source, field);
  }
};
exports.getField = getField;
const getUnprocessedExceptionsWarnings = unprocessedExceptions => {
  if (unprocessedExceptions.length > 0) {
    const exceptionNames = unprocessedExceptions.map(exception => exception.name);
    return `The following exceptions won't be applied to rule execution: ${exceptionNames.join(', ')}`;
  }
};
exports.getUnprocessedExceptionsWarnings = getUnprocessedExceptionsWarnings;