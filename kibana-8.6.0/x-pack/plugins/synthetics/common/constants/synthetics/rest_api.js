"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYNTHETICS_API_URLS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let SYNTHETICS_API_URLS;
exports.SYNTHETICS_API_URLS = SYNTHETICS_API_URLS;
(function (SYNTHETICS_API_URLS) {
  SYNTHETICS_API_URLS["SYNTHETICS_OVERVIEW"] = "/internal/synthetics/overview";
  SYNTHETICS_API_URLS["PINGS"] = "/internal/synthetics/pings";
  SYNTHETICS_API_URLS["PING_STATUSES"] = "/internal/synthetics/ping_statuses";
  SYNTHETICS_API_URLS["OVERVIEW_STATUS"] = "/internal/synthetics/overview/status";
  SYNTHETICS_API_URLS["INDEX_SIZE"] = "/internal/synthetics/index_size";
})(SYNTHETICS_API_URLS || (exports.SYNTHETICS_API_URLS = SYNTHETICS_API_URLS = {}));