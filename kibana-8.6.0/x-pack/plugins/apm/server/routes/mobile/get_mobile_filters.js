"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMobileFilters = getMobileFilters;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../common/utils/environment_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getMobileFilters({
  kuery,
  apmEventClient,
  serviceName,
  transactionType,
  environment,
  start,
  end
}) {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8, _response$aggregation9, _response$aggregation10, _response$aggregation11, _response$aggregation12;
  const response = await apmEventClient.search('get_mobile_filters', {
    apm: {
      events: [_common.ProcessorEvent.error, _common.ProcessorEvent.metric, _common.ProcessorEvent.transaction]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, transactionType), ...(0, _server.rangeQuery)(start, end), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        devices: {
          terms: {
            field: _elasticsearch_fieldnames.DEVICE_MODEL_NAME,
            size: 10
          }
        },
        osVersions: {
          terms: {
            field: _elasticsearch_fieldnames.HOST_OS_VERSION,
            size: 10
          }
        },
        appVersions: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_VERSION,
            size: 10
          }
        },
        netConnectionTypes: {
          terms: {
            field: _elasticsearch_fieldnames.NETWORK_CONNECTION_TYPE,
            size: 10
          }
        }
      }
    }
  });
  return [{
    key: 'device',
    label: _i18n.i18n.translate('xpack.apm.mobile.filters.device', {
      defaultMessage: 'Device'
    }),
    options: ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.devices) === null || _response$aggregation2 === void 0 ? void 0 : (_response$aggregation3 = _response$aggregation2.buckets) === null || _response$aggregation3 === void 0 ? void 0 : _response$aggregation3.map(({
      key
    }) => key)) || []
  }, {
    key: 'osVersion',
    label: _i18n.i18n.translate('xpack.apm.mobile.filters.osVersion', {
      defaultMessage: 'OS version'
    }),
    options: ((_response$aggregation4 = response.aggregations) === null || _response$aggregation4 === void 0 ? void 0 : (_response$aggregation5 = _response$aggregation4.osVersions) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.buckets) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.map(({
      key
    }) => key)) || []
  }, {
    key: 'appVersion',
    label: _i18n.i18n.translate('xpack.apm.mobile.filters.appVersion', {
      defaultMessage: 'App version'
    }),
    options: ((_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : (_response$aggregation8 = _response$aggregation7.appVersions) === null || _response$aggregation8 === void 0 ? void 0 : (_response$aggregation9 = _response$aggregation8.buckets) === null || _response$aggregation9 === void 0 ? void 0 : _response$aggregation9.map(({
      key
    }) => key)) || []
  }, {
    key: 'netConnectionType',
    label: _i18n.i18n.translate('xpack.apm.mobile.filters.nct', {
      defaultMessage: 'NCT'
    }),
    options: ((_response$aggregation10 = response.aggregations) === null || _response$aggregation10 === void 0 ? void 0 : (_response$aggregation11 = _response$aggregation10.netConnectionTypes) === null || _response$aggregation11 === void 0 ? void 0 : (_response$aggregation12 = _response$aggregation11.buckets) === null || _response$aggregation12 === void 0 ? void 0 : _response$aggregation12.map(({
      key
    }) => key)) || []
  }];
}