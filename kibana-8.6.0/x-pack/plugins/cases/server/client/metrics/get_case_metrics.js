"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCaseMetrics = void 0;
var _lodash = require("lodash");
var _api = require("../../../common/api");
var _authorization = require("../../authorization");
var _error = require("../../common/error");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCaseMetrics = async (params, casesClient, clientArgs) => {
  const {
    logger
  } = clientArgs;
  try {
    await checkAuthorization(params, clientArgs);
    const handlers = (0, _utils.buildHandlers)(params, casesClient, clientArgs);
    const computedMetrics = await Promise.all(Array.from(handlers).map(async handler => {
      return handler.compute();
    }));
    const mergedResults = computedMetrics.reduce((acc, metric) => {
      return (0, _lodash.merge)(acc, metric);
    }, {});
    return _api.SingleCaseMetricsResponseRt.encode(mergedResults);
  } catch (error) {
    throw (0, _error.createCaseError)({
      logger,
      message: `Failed to retrieve metrics within client for case id: ${params.caseId}: ${error}`,
      error
    });
  }
};
exports.getCaseMetrics = getCaseMetrics;
const checkAuthorization = async (params, clientArgs) => {
  const {
    services: {
      caseService
    },
    authorization
  } = clientArgs;
  const caseInfo = await caseService.getCase({
    id: params.caseId
  });
  await authorization.ensureAuthorized({
    operation: _authorization.Operations.getCaseMetrics,
    entities: [{
      owner: caseInfo.attributes.owner,
      id: caseInfo.id
    }]
  });
};