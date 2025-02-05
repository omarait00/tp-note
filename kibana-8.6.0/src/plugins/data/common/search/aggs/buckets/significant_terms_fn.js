"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggSignificantTermsFnName = exports.aggSignificantTerms = void 0;
var _i18n = require("@kbn/i18n");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const aggSignificantTermsFnName = 'aggSignificantTerms';
exports.aggSignificantTermsFnName = aggSignificantTermsFnName;
const aggSignificantTerms = () => ({
  name: aggSignificantTermsFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.significantTerms.help', {
    defaultMessage: 'Generates a serialized agg config for a Significant Terms agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    field: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.field.help', {
        defaultMessage: 'Field to use for this aggregation'
      })
    },
    size: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.size.help', {
        defaultMessage: 'Max number of buckets to retrieve'
      })
    },
    exclude: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.exclude.help', {
        defaultMessage: 'Specific bucket values to exclude from results'
      })
    },
    include: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.include.help', {
        defaultMessage: 'Specific bucket values to include in results'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.significantTerms.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _.BUCKET_TYPES.SIGNIFICANT_TERMS,
        params: {
          ...rest
        }
      }
    };
  }
});
exports.aggSignificantTerms = aggSignificantTerms;