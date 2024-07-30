"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EsQueryRuleParamsSchema = exports.ES_QUERY_MAX_HITS_PER_EXECUTION = void 0;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../triggers_actions_ui/server");
var _lib = require("../lib");
var _comparator = require("../lib/comparator");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ES_QUERY_MAX_HITS_PER_EXECUTION = 10000;

// rule type parameters
exports.ES_QUERY_MAX_HITS_PER_EXECUTION = ES_QUERY_MAX_HITS_PER_EXECUTION;
const EsQueryRuleParamsSchemaProperties = {
  size: _configSchema.schema.number({
    min: 0,
    max: ES_QUERY_MAX_HITS_PER_EXECUTION
  }),
  timeWindowSize: _configSchema.schema.number({
    min: 1
  }),
  excludeHitsFromPreviousRun: _configSchema.schema.boolean({
    defaultValue: true
  }),
  timeWindowUnit: _configSchema.schema.string({
    validate: _server.validateTimeWindowUnits
  }),
  threshold: _configSchema.schema.arrayOf(_configSchema.schema.number(), {
    minSize: 1,
    maxSize: 2
  }),
  thresholdComparator: (0, _comparator.getComparatorSchemaType)(validateComparator),
  searchType: _configSchema.schema.oneOf([_configSchema.schema.literal('searchSource'), _configSchema.schema.literal('esQuery')], {
    defaultValue: 'esQuery'
  }),
  // searchSource rule param only
  searchConfiguration: _configSchema.schema.conditional(_configSchema.schema.siblingRef('searchType'), _configSchema.schema.literal('searchSource'), _configSchema.schema.object({}, {
    unknowns: 'allow'
  }), _configSchema.schema.never()),
  // esQuery rule params only
  esQuery: _configSchema.schema.conditional(_configSchema.schema.siblingRef('searchType'), _configSchema.schema.literal('esQuery'), _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.never()),
  index: _configSchema.schema.conditional(_configSchema.schema.siblingRef('searchType'), _configSchema.schema.literal('esQuery'), _configSchema.schema.arrayOf(_configSchema.schema.string({
    minLength: 1
  }), {
    minSize: 1
  }), _configSchema.schema.never()),
  timeField: _configSchema.schema.conditional(_configSchema.schema.siblingRef('searchType'), _configSchema.schema.literal('esQuery'), _configSchema.schema.string({
    minLength: 1
  }), _configSchema.schema.never())
};
const EsQueryRuleParamsSchema = _configSchema.schema.object(EsQueryRuleParamsSchemaProperties, {
  validate: validateParams
});
exports.EsQueryRuleParamsSchema = EsQueryRuleParamsSchema;
const betweenComparators = new Set(['between', 'notBetween']);

// using direct type not allowed, circular reference, so body is typed to any
function validateParams(anyParams) {
  const {
    esQuery,
    thresholdComparator,
    threshold,
    searchType
  } = anyParams;
  if (betweenComparators.has(thresholdComparator) && threshold.length === 1) {
    return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidThreshold2ErrorMessage', {
      defaultMessage: '[threshold]: must have two elements for the "{thresholdComparator}" comparator',
      values: {
        thresholdComparator
      }
    });
  }
  if (searchType === 'searchSource') {
    return;
  }
  try {
    const parsedQuery = JSON.parse(esQuery);
    if (parsedQuery && !parsedQuery.query) {
      return _i18n.i18n.translate('xpack.stackAlerts.esQuery.missingEsQueryErrorMessage', {
        defaultMessage: '[esQuery]: must contain "query"'
      });
    }
  } catch (err) {
    return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidEsQueryErrorMessage', {
      defaultMessage: '[esQuery]: must be valid JSON'
    });
  }
}
function validateComparator(comparator) {
  if (_lib.ComparatorFnNames.has(comparator)) return;
  return _i18n.i18n.translate('xpack.stackAlerts.esQuery.invalidComparatorErrorMessage', {
    defaultMessage: 'invalid thresholdComparator specified: {comparator}',
    values: {
      comparator
    }
  });
}