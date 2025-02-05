"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logDeprecatedBulkEndpoint = exports.getDeprecatedBulkEndpointHeader = exports.buildDeprecatedBulkEndpointMessage = void 0;
var _docLinks = require("@kbn/doc-links");
var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helper method for building deprecation messages
 *
 * @param path Deprecated endpoint path
 * @returns string
 */
const buildDeprecatedBulkEndpointMessage = path => {
  const docsLink = (0, _docLinks.getDocLinks)({
    kibanaBranch: 'main'
  }).siem.ruleApiOverview;
  return `Deprecated endpoint: ${path} API is deprecated since v8.2. Please use the ${_constants.DETECTION_ENGINE_RULES_BULK_ACTION} API instead. See ${docsLink} for more detail.`;
};

/**
 * Logs usages of a deprecated bulk endpoint
 *
 * @param logger System logger
 * @param path Deprecated endpoint path
 */
exports.buildDeprecatedBulkEndpointMessage = buildDeprecatedBulkEndpointMessage;
const logDeprecatedBulkEndpoint = (logger, path) => {
  logger.warn(buildDeprecatedBulkEndpointMessage(path), {
    tags: ['deprecation']
  });
};

/**
 * Creates a warning header with a message formatted according to RFC7234.
 * We follow the same formatting as Elasticsearch
 * https://github.com/elastic/elasticsearch/blob/5baabff6670a8ed49297488ca8cac8ec12a2078d/server/src/main/java/org/elasticsearch/common/logging/HeaderWarning.java#L55
 *
 * @param path Deprecated endpoint path
 */
exports.logDeprecatedBulkEndpoint = logDeprecatedBulkEndpoint;
const getDeprecatedBulkEndpointHeader = path => ({
  warning: `299 Kibana "${buildDeprecatedBulkEndpointMessage(path)}"`
});
exports.getDeprecatedBulkEndpointHeader = getDeprecatedBulkEndpointHeader;