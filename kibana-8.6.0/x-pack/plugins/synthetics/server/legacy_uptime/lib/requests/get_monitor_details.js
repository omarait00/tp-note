"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMonitorDetails = exports.getMonitorAlerts = void 0;
var _alerts = require("../../../../common/constants/alerts");
var _status_check = require("../alerts/status_check");
var _es_search = require("../../../../common/utils/es_search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getMonitorAlerts = async ({
  uptimeEsClient,
  rulesClient,
  monitorId
}) => {
  const options = {
    page: 1,
    perPage: 500,
    filter: `alert.attributes.alertTypeId:(${_alerts.CLIENT_ALERT_TYPES.MONITOR_STATUS})`,
    defaultSearchOperator: 'AND',
    sortField: 'name.keyword'
  };
  const {
    data
  } = await rulesClient.find({
    options
  });
  const monitorAlerts = [];
  for (let i = 0; i < data.length; i++) {
    var _currAlert$params$sea;
    const currAlert = data[i];
    if ((_currAlert$params$sea = currAlert.params.search) !== null && _currAlert$params$sea !== void 0 && _currAlert$params$sea.includes(monitorId)) {
      monitorAlerts.push(currAlert);
      continue;
    }
    const parsedFilters = await (0, _status_check.formatFilterString)(uptimeEsClient, currAlert.params.filters, currAlert.params.search);
    const esParams = (0, _es_search.createEsQuery)({
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                'monitor.id': monitorId
              }
            }]
          }
        },
        size: 0,
        aggs: {
          monitors: {
            terms: {
              field: 'monitor.id',
              size: 1000
            }
          }
        }
      }
    });
    if (parsedFilters) {
      esParams.body.query.bool.filter.push(parsedFilters);
    }
    const {
      body: result
    } = await uptimeEsClient.search(esParams, `getMonitorsForAlert-${currAlert.name}`);
    if ((result === null || result === void 0 ? void 0 : result.hits.total.value) > 0) {
      monitorAlerts.push(currAlert);
    }
  }
  return monitorAlerts;
};
exports.getMonitorAlerts = getMonitorAlerts;
const getMonitorDetails = async ({
  uptimeEsClient,
  monitorId,
  dateStart,
  dateEnd,
  rulesClient
}) => {
  var _result$hits$hits$;
  const queryFilters = [{
    range: {
      '@timestamp': {
        gte: dateStart,
        lte: dateEnd
      }
    }
  }, {
    term: {
      'monitor.id': monitorId
    }
  }];
  const params = {
    size: 1,
    _source: ['error', '@timestamp'],
    query: {
      bool: {
        must: [{
          exists: {
            field: 'error'
          }
        }],
        filter: queryFilters
      }
    },
    sort: [{
      '@timestamp': {
        order: 'desc'
      }
    }]
  };
  const {
    body: result
  } = await uptimeEsClient.search({
    body: params
  }, 'getMonitorDetails');
  const data = (_result$hits$hits$ = result.hits.hits[0]) === null || _result$hits$hits$ === void 0 ? void 0 : _result$hits$hits$._source;
  const errorTimestamp = data === null || data === void 0 ? void 0 : data['@timestamp'];
  const monAlerts = await getMonitorAlerts({
    uptimeEsClient,
    rulesClient,
    monitorId
  });
  return {
    monitorId,
    error: data === null || data === void 0 ? void 0 : data.error,
    timestamp: errorTimestamp,
    alerts: monAlerts
  };
};
exports.getMonitorDetails = getMonitorDetails;