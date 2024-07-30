"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCasesMetrics = void 0;
var _lodash = require("lodash");
var _boom = _interopRequireDefault(require("@hapi/boom"));
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _api = require("../../../common/api");
var _error = require("../../common/error");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCasesMetrics = async (params, casesClient, clientArgs) => {
  const {
    logger
  } = clientArgs;
  const queryParams = (0, _pipeable.pipe)(_api.CasesMetricsRequestRt.decode(params), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
  try {
    const handlers = (0, _utils.buildHandlers)(queryParams, casesClient, clientArgs);
    const computedMetrics = await Promise.all(Array.from(handlers).map(async handler => {
      return handler.compute();
    }));
    const mergedResults = computedMetrics.reduce((acc, metric) => {
      return (0, _lodash.merge)(acc, metric);
    }, {});
    return _api.CasesMetricsResponseRt.encode(mergedResults);
  } catch (error) {
    throw (0, _error.createCaseError)({
      logger,
      message: `Failed to retrieve metrics within client for cases: ${error}`,
      error
    });
  }
};
exports.getCasesMetrics = getCasesMetrics;