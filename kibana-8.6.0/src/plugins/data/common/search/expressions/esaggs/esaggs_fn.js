"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsaggsMeta = void 0;
Object.defineProperty(exports, "handleEsaggsRequest", {
  enumerable: true,
  get: function () {
    return _request_handler.handleRequest;
  }
});
var _i18n = require("@kbn/i18n");
var _common = require("../../../../../expressions/common");
var _aggs = require("../../aggs");
var _request_handler = require("./request_handler");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const name = 'esaggs';
/** @internal */
const getEsaggsMeta = () => ({
  name,
  type: 'datatable',
  inputTypes: ['kibana_context', 'null'],
  help: _i18n.i18n.translate('data.functions.esaggs.help', {
    defaultMessage: 'Run AggConfig aggregation'
  }),
  args: {
    index: {
      types: ['index_pattern'],
      required: true,
      help: _i18n.i18n.translate('data.search.functions.esaggs.index.help', {
        defaultMessage: 'Data view retrieved with indexPatternLoad'
      })
    },
    aggs: {
      types: ['agg_type'],
      multi: true,
      default: `{${(0, _common.buildExpressionFunction)(_aggs.aggCountFnName, {}).toString()}}`,
      help: _i18n.i18n.translate('data.search.functions.esaggs.aggConfigs.help', {
        defaultMessage: 'List of aggs configured with agg_type functions'
      })
    },
    metricsAtAllLevels: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.esaggs.metricsAtAllLevels.help', {
        defaultMessage: 'Whether to include columns with metrics for each bucket level'
      })
    },
    partialRows: {
      types: ['boolean'],
      default: false,
      help: _i18n.i18n.translate('data.search.functions.esaggs.partialRows.help', {
        defaultMessage: 'Whether to return rows that only contain partial data'
      })
    },
    timeFields: {
      types: ['string'],
      multi: true,
      help: _i18n.i18n.translate('data.search.functions.esaggs.timeFields.help', {
        defaultMessage: 'Provide time fields to get the resolved time ranges for the query'
      })
    },
    probability: {
      types: ['number'],
      default: 1,
      help: _i18n.i18n.translate('data.search.functions.esaggs.probability.help', {
        defaultMessage: 'The probability that a document will be included in the aggregated data. Uses random sampler.'
      })
    },
    samplerSeed: {
      types: ['number'],
      help: _i18n.i18n.translate('data.search.functions.esaggs.samplerSeed.help', {
        defaultMessage: 'The seed to generate the random sampling of documents. Uses random sampler.'
      })
    }
  }
});
exports.getEsaggsMeta = getEsaggsMeta;