"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAssetsStatus = void 0;
var _reactQuery = require("@tanstack/react-query");
var _kibana = require("../common/lib/kibana");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const useAssetsStatus = () => {
  const {
    http
  } = (0, _kibana.useKibana)().services;
  return (0, _reactQuery.useQuery)([_constants.INTEGRATION_ASSETS_STATUS_ID], () => http.get('/internal/osquery/assets'), {
    keepPreviousData: true,
    retry: false
  });
};
exports.useAssetsStatus = useAssetsStatus;