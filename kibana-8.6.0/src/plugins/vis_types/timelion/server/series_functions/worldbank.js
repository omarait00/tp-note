"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _i18n = require("@kbn/i18n");
var _lodash = _interopRequireDefault(require("lodash"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _moment = _interopRequireDefault(require("moment"));
var _datasource = _interopRequireDefault(require("../lib/classes/datasource"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _datasource.default('worldbank', {
  args: [{
    name: 'code',
    // countries/all/indicators/SP.POP.TOTL
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.worldbank.args.codeHelpText', {
      defaultMessage: 'Worldbank API path. This is usually everything after the domain, before the querystring. E.g.: {apiPathExample}.',
      values: {
        apiPathExample: '/en/countries/ind;chn/indicators/DPANUSSPF'
      }
    })
  }],
  aliases: ['wb'],
  help: _i18n.i18n.translate('timelion.help.functions.worldbankHelpText', {
    defaultMessage: `
    [experimental]
    Pull data from {worldbankUrl} using path to series.
    The worldbank provides mostly yearly data, and often has no data for the current year.
    Try {offsetQuery} if you get no data for recent time ranges.`,
    values: {
      worldbankUrl: 'https://api.worldbank.org/v2/',
      offsetQuery: 'offset=-1y'
    }
  }),
  fn: function worldbank(args, tlConfig) {
    // http://api.worldbank.org/en/countries/ind;chn/indicators/DPANUSSPF?date=2000:2006&MRV=5

    const config = _lodash.default.defaults(args.byName, {
      code: 'country/all/indicator/SP.POP.TOTL'
    });
    const time = {
      min: (0, _moment.default)(tlConfig.time.from).format('YYYY'),
      max: (0, _moment.default)(tlConfig.time.to).format('YYYY')
    };
    const URL = 'https://api.worldbank.org/v2/' + config.code + '?date=' + time.min + ':' + time.max + '&format=json' + '&per_page=1000';
    return (0, _nodeFetch.default)(URL).then(function (resp) {
      return resp.json();
    }).then(function (resp) {
      let hasData = false;
      const respSeries = resp[1];
      const deduped = {};
      let description;
      _lodash.default.each(respSeries, function (bucket) {
        if (bucket.value != null) hasData = true;
        description = bucket.country.value + ' ' + bucket.indicator.value;
        deduped[bucket.date] = bucket.value;
      });
      const data = _lodash.default.compact(_lodash.default.map(deduped, function (val, date) {
        // Discard nulls
        if (val == null) return;
        return [(0, _moment.default)(date, 'YYYY').valueOf(), Number(val)];
      }));
      if (!hasData) {
        throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.worldbankFunction.noDataErrorMessage', {
          defaultMessage: 'Worldbank request succeeded, but there was no data for {code}',
          values: {
            code: config.code
          }
        }));
      }
      return {
        type: 'seriesList',
        list: [{
          data: data,
          type: 'series',
          label: description,
          _meta: {
            worldbank_request: URL
          }
        }]
      };
    }).catch(function (e) {
      throw e;
    });
  }
});
exports.default = _default;
module.exports = exports.default;