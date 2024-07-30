"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executor = executor;
exports.getChecksum = getChecksum;
exports.getContextConditionsDescription = getContextConditionsDescription;
exports.getInvalidComparatorError = getInvalidComparatorError;
exports.getSearchParams = getSearchParams;
exports.getValidTimefieldSort = getValidTimefieldSort;
exports.tryToParseAsDate = tryToParseAsDate;
var _jsSha = require("js-sha256");
var _i18n = require("@kbn/i18n");
var _server = require("../../../../alerting/server");
var _action_context = require("./action_context");
var _lib = require("../lib");
var _constants = require("./constants");
var _fetch_es_query = require("./lib/fetch_es_query");
var _fetch_search_source_query = require("./lib/fetch_search_source_query");
var _util = require("./util");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function executor(core, options) {
  var _core$http$basePath$p;
  const esQueryRule = (0, _util.isEsQueryRule)(options.params.searchType);
  const {
    rule: {
      id: ruleId,
      name
    },
    services,
    params,
    state,
    spaceId,
    logger
  } = options;
  const {
    alertFactory,
    scopedClusterClient,
    searchSourceClient
  } = services;
  const currentTimestamp = new Date().toISOString();
  const publicBaseUrl = (_core$http$basePath$p = core.http.basePath.publicBaseUrl) !== null && _core$http$basePath$p !== void 0 ? _core$http$basePath$p : '';
  const alertLimit = alertFactory.alertLimit.getValue();
  const compareFn = _lib.ComparatorFns.get(params.thresholdComparator);
  if (compareFn == null) {
    throw new Error(getInvalidComparatorError(params.thresholdComparator));
  }
  let latestTimestamp = tryToParseAsDate(state.latestTimestamp);

  // During each rule execution, we run the configured query, get a hit count
  // (hits.total) and retrieve up to params.size hits. We
  // evaluate the threshold condition using the value of hits.total. If the threshold
  // condition is met, the hits are counted toward the query match and we update
  // the rule state with the timestamp of the latest hit. In the next execution
  // of the rule, the latestTimestamp will be used to gate the query in order to
  // avoid counting a document multiple times.

  const {
    numMatches,
    searchResult,
    dateStart,
    dateEnd
  } = esQueryRule ? await (0, _fetch_es_query.fetchEsQuery)(ruleId, name, params, latestTimestamp, {
    scopedClusterClient,
    logger
  }) : await (0, _fetch_search_source_query.fetchSearchSourceQuery)(ruleId, params, latestTimestamp, {
    searchSourceClient,
    logger
  });

  // apply the rule condition
  const conditionMet = compareFn(numMatches, params.threshold);
  const base = publicBaseUrl;
  const spacePrefix = spaceId !== 'default' ? `/s/${spaceId}` : '';
  const link = esQueryRule ? `${base}${spacePrefix}/app/management/insightsAndAlerting/triggersActions/rule/${ruleId}` : `${base}${spacePrefix}/app/discover#/viewAlert/${ruleId}?from=${dateStart}&to=${dateEnd}&checksum=${getChecksum(params)}`;
  const baseContext = {
    title: name,
    date: currentTimestamp,
    value: numMatches,
    hits: searchResult.hits.hits,
    link
  };
  if (conditionMet) {
    var _searchResult$hits$hi;
    const baseActiveContext = {
      ...baseContext,
      conditions: getContextConditionsDescription(params.thresholdComparator, params.threshold)
    };
    const actionContext = (0, _action_context.addMessages)(name, baseActiveContext, params);
    const alertInstance = alertFactory.create(_constants.ConditionMetAlertInstanceId);
    alertInstance
    // store the params we would need to recreate the query that led to this alert instance
    .replaceState({
      latestTimestamp,
      dateStart,
      dateEnd
    }).scheduleActions(_constants.ActionGroupId, actionContext);

    // update the timestamp based on the current search results
    const firstValidTimefieldSort = getValidTimefieldSort((_searchResult$hits$hi = searchResult.hits.hits.find(hit => getValidTimefieldSort(hit.sort))) === null || _searchResult$hits$hi === void 0 ? void 0 : _searchResult$hits$hi.sort);
    if (firstValidTimefieldSort) {
      latestTimestamp = firstValidTimefieldSort;
    }

    // we only create one alert if the condition is met, so we would only ever
    // reach the alert limit if the limit is less than 1
    alertFactory.alertLimit.setLimitReached(alertLimit < 1);
  } else {
    alertFactory.alertLimit.setLimitReached(false);
  }
  const {
    getRecoveredAlerts
  } = alertFactory.done();
  for (const alert of getRecoveredAlerts()) {
    const baseRecoveryContext = {
      ...baseContext,
      conditions: getContextConditionsDescription(params.thresholdComparator, params.threshold, true)
    };
    const recoveryContext = (0, _action_context.addMessages)(name, baseRecoveryContext, params, true);
    alert.setContext(recoveryContext);
  }
  return {
    latestTimestamp
  };
}
function getInvalidWindowSizeError(windowValue) {
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidWindowSizeErrorMessage', {
    defaultMessage: 'invalid format for windowSize: "{windowValue}"',
    values: {
      windowValue
    }
  });
}
function getInvalidQueryError(query) {
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidQueryErrorMessage', {
    defaultMessage: 'invalid query specified: "{query}" - query must be JSON',
    values: {
      query
    }
  });
}
function getSearchParams(queryParams) {
  const date = Date.now();
  const {
    esQuery,
    timeWindowSize,
    timeWindowUnit
  } = queryParams;
  let parsedQuery;
  try {
    parsedQuery = JSON.parse(esQuery);
  } catch (err) {
    throw new Error(getInvalidQueryError(esQuery));
  }
  if (parsedQuery && !parsedQuery.query) {
    throw new Error(getInvalidQueryError(esQuery));
  }
  const window = `${timeWindowSize}${timeWindowUnit}`;
  let timeWindow;
  try {
    timeWindow = (0, _server.parseDuration)(window);
  } catch (err) {
    throw new Error(getInvalidWindowSizeError(window));
  }
  const dateStart = new Date(date - timeWindow).toISOString();
  const dateEnd = new Date(date).toISOString();
  return {
    parsedQuery,
    dateStart,
    dateEnd
  };
}
function getValidTimefieldSort(sortValues = []) {
  for (const sortValue of sortValues) {
    const sortDate = tryToParseAsDate(sortValue);
    if (sortDate) {
      return sortDate;
    }
  }
}
function tryToParseAsDate(sortValue) {
  const sortDate = typeof sortValue === 'string' ? Date.parse(sortValue) : sortValue;
  if (sortDate && !isNaN(sortDate)) {
    return new Date(sortDate).toISOString();
  }
}
function getChecksum(params) {
  return _jsSha.sha256.create().update(JSON.stringify(params));
}
function getInvalidComparatorError(comparator) {
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidComparatorErrorMessage', {
    defaultMessage: 'invalid thresholdComparator specified: {comparator}',
    values: {
      comparator
    }
  });
}
function getContextConditionsDescription(comparator, threshold, isRecovered = false) {
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.alertTypeContextConditionsDescription', {
    defaultMessage: 'Number of matching documents is {negation}{thresholdComparator} {threshold}',
    values: {
      thresholdComparator: (0, _lib.getHumanReadableComparator)(comparator),
      threshold: threshold.join(' and '),
      negation: isRecovered ? 'NOT ' : ''
    }
  });
}