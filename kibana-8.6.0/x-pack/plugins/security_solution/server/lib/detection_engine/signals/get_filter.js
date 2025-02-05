"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilter = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _utility_types = require("../../../../common/utility_types");
var _with_security_span = require("../../../utils/with_security_span");
var _get_query_filter = require("./get_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getFilter = async ({
  filters,
  index,
  language,
  savedId,
  services,
  type,
  query,
  exceptionFilter
}) => {
  const queryFilter = () => {
    if (query != null && language != null && index != null) {
      return (0, _get_query_filter.getQueryFilter)({
        query,
        language,
        filters: filters || [],
        index,
        exceptionFilter
      });
    } else {
      throw new _securitysolutionEsUtils.BadRequestError('query, filters, and index parameter should be defined');
    }
  };
  const savedQueryFilter = async () => {
    if (savedId != null && index != null) {
      try {
        // try to get the saved object first
        const savedObject = await (0, _with_security_span.withSecuritySpan)('getSavedFilter', () => services.savedObjectsClient.get('query', savedId));
        return (0, _get_query_filter.getQueryFilter)({
          query: savedObject.attributes.query.query,
          language: savedObject.attributes.query.language,
          filters: savedObject.attributes.filters,
          index,
          exceptionFilter
        });
      } catch (err) {
        // saved object does not exist, so try and fall back if the user pushed
        // any additional language, query, filters, etc...
        if (query != null && language != null && index != null) {
          return (0, _get_query_filter.getQueryFilter)({
            query,
            language,
            filters: filters || [],
            index,
            exceptionFilter
          });
        } else {
          // user did not give any additional fall back mechanism for generating a rule
          // rethrow error for activity monitoring
          err.message = `Failed to fetch saved query. "${err.message}"`;
          throw err;
        }
      }
    } else {
      throw new _securitysolutionEsUtils.BadRequestError('savedId parameter should be defined');
    }
  };
  switch (type) {
    case 'threat_match':
    case 'threshold':
    case 'new_terms':
    case 'query':
      {
        return queryFilter();
      }
    case 'saved_query':
      {
        return savedQueryFilter();
      }
    case 'machine_learning':
      {
        throw new _securitysolutionEsUtils.BadRequestError('Unsupported Rule of type "machine_learning" supplied to getFilter');
      }
    case 'eql':
      {
        throw new _securitysolutionEsUtils.BadRequestError('Unsupported Rule of type "eql" supplied to getFilter');
      }
    default:
      {
        return (0, _utility_types.assertUnreachable)(type);
      }
  }
};
exports.getFilter = getFilter;