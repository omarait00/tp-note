"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDetectionRules = void 0;
var _securitysolutionRules = require("@kbn/securitysolution-rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getDetectionRules = async ({
  maxSize,
  maxPerPage,
  logger,
  savedObjectsClient
}) => {
  const filterAttribute = 'alert.attributes.alertTypeId';
  const filter = [`${filterAttribute}: ${_securitysolutionRules.SIGNALS_ID}`, `${filterAttribute}: ${_securitysolutionRules.EQL_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.ML_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.QUERY_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.SAVED_QUERY_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.THRESHOLD_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.INDICATOR_RULE_TYPE_ID}`, `${filterAttribute}: ${_securitysolutionRules.NEW_TERMS_RULE_TYPE_ID}`].join(' OR ');
  const query = {
    type: 'alert',
    perPage: maxPerPage,
    namespaces: ['*'],
    filter
  };
  logger.debug(`Getting detection rules with point in time (PIT) query:', ${JSON.stringify(query)}`);
  const finder = savedObjectsClient.createPointInTimeFinder(query);
  let responses = [];
  for await (const response of finder.find()) {
    const extra = responses.length + response.saved_objects.length - maxSize;
    if (extra > 0) {
      responses = [...responses, ...response.saved_objects.slice(-response.saved_objects.length, -extra)];
    } else {
      responses = [...responses, ...response.saved_objects];
    }
  }
  try {
    finder.close();
  } catch (exception) {
    // This is just a pre-caution in case the finder does a throw we don't want to blow up
    // the response. We have seen this within e2e test containers but nothing happen in normal
    // operational conditions which is why this try/catch is here.
  }
  logger.debug(`Returning cases response of length: "${responses.length}"`);
  return responses;
};
exports.getDetectionRules = getDetectionRules;