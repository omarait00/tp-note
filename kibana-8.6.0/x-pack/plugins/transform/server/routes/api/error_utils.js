"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillResultsWithTimeouts = fillResultsWithTimeouts;
exports.isRequestTimeout = isRequestTimeout;
exports.wrapError = wrapError;
exports.wrapEsError = wrapEsError;
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REQUEST_TIMEOUT = 'RequestTimeout';
function isRequestTimeout(error) {
  return error.displayName === REQUEST_TIMEOUT;
}
// populate a results object with timeout errors for the ids which haven't already been set
function fillResultsWithTimeouts({
  results,
  id,
  items,
  action
}) {
  const extra = items.length - Object.keys(results).length > 1 ? _i18n.i18n.translate('xpack.transform.models.transformService.allOtherRequestsCancelledDescription', {
    defaultMessage: 'All other requests cancelled.'
  }) : '';
  const reason = _i18n.i18n.translate('xpack.transform.models.transformService.requestToActionTimedOutErrorMessage', {
    defaultMessage: `Request to {action} '{id}' timed out. {extra}`,
    values: {
      id,
      action,
      extra
    }
  });
  const error = {
    reason,
    root_cause: [{
      reason
    }]
  };
  const newResults = {};
  return items.reduce((accumResults, currentVal) => {
    if (results[currentVal.id] === undefined) {
      accumResults[currentVal.id] = {
        success: false,
        // @ts-ignore
        error
      };
    } else {
      accumResults[currentVal.id] = results[currentVal.id];
    }
    return accumResults;
  }, newResults);
}
function wrapError(error) {
  const boom = _boom.default.isBoom(error) ? error : _boom.default.boomify(error, {
    statusCode: error.statusCode
  });
  return {
    body: boom,
    headers: boom.output.headers,
    statusCode: boom.output.statusCode
  };
}
function extractCausedByChain(causedBy = {}, accumulator = []) {
  const {
    reason,
    caused_by
  } = causedBy; // eslint-disable-line @typescript-eslint/naming-convention

  if (reason) {
    accumulator.push(reason);
  }
  if (caused_by) {
    return extractCausedByChain(caused_by, accumulator);
  }
  return accumulator;
}

/**
 * Wraps an error thrown by the ES JS client into a Boom error response and returns it
 *
 * @param err Object Error thrown by ES JS client
 * @param statusCodeToMessageMap Object Optional map of HTTP status codes => error messages
 * @return Object Boom error response
 */
function wrapEsError(err, statusCodeToMessageMap = {}) {
  const {
    meta: {
      body,
      statusCode
    }
  } = err;
  const {
    error: {
      root_cause = [],
      // eslint-disable-line @typescript-eslint/naming-convention
      caused_by = {} // eslint-disable-line @typescript-eslint/naming-convention
    } = {}
  } = body;

  // If no custom message if specified for the error's status code, just
  // wrap the error as a Boom error response, include the additional information from ES, and return it
  if (!statusCodeToMessageMap[statusCode]) {
    const boomError = _boom.default.boomify(err, {
      statusCode
    });

    // The caused_by chain has the most information so use that if it's available. If not then
    // settle for the root_cause.
    const causedByChain = extractCausedByChain(caused_by);
    const defaultCause = root_cause.length ? extractCausedByChain(root_cause[0]) : undefined;
    boomError.output.payload.cause = causedByChain.length ? causedByChain : defaultCause;

    // Set error message based on the root cause
    if (root_cause !== null && root_cause !== void 0 && root_cause[0]) {
      boomError.message = extractErrorMessage(root_cause[0]);
    }
    return boomError;
  }

  // Otherwise, use the custom message to create a Boom error response and
  // return it
  const message = statusCodeToMessageMap[statusCode];
  return new _boom.default.Boom(message, {
    statusCode
  });
}
/**
 * Returns an error message based on the root cause
 */
function extractErrorMessage({
  type,
  reason,
  script,
  line,
  col
}) {
  let message = `[${type}] ${reason}`;
  if (line !== undefined && col !== undefined) {
    message += `, with line=${line} & col=${col}`;
  }
  if (script !== undefined) {
    message += ` '${script}'`;
  }
  return message;
}