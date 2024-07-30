"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchParams = getSearchParams;
var _i18n = require("@kbn/i18n");
var _common = require("../../../../../alerting/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

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
    timeWindow = (0, _common.parseDuration)(window);
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