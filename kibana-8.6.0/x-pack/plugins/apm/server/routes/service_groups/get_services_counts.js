"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServicesCounts = getServicesCounts;
var _common = require("../../../../observability/common");
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServicesCounts({
  apmEventClient,
  start,
  end,
  serviceGroups
}) {
  var _response$aggregation, _response$aggregation2;
  const serviceGroupsKueryMap = serviceGroups.reduce((acc, sg) => {
    return {
      ...acc,
      [sg.id]: (0, _server.kqlQuery)(sg.kuery)[0]
    };
  }, {});
  const params = {
    apm: {
      // We're limiting the service count to only metrics documents. If a user
      // actively disables system/app metrics and a service only ingests error
      // events, that service will not be included in the service groups count.
      // This is an edge case that only effects the count preview label.
      events: [_common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 0,
      size: 0,
      query: {
        bool: {
          filter: (0, _server.rangeQuery)(start, end)
        }
      },
      aggs: {
        service_groups: {
          filters: {
            filters: serviceGroupsKueryMap
          },
          aggs: {
            services_count: {
              cardinality: {
                field: _elasticsearch_fieldnames.SERVICE_NAME
              }
            }
          }
        }
      }
    }
  };
  const response = await apmEventClient.search('get_services_count', params);
  const buckets = (_response$aggregation = response === null || response === void 0 ? void 0 : (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.service_groups.buckets) !== null && _response$aggregation !== void 0 ? _response$aggregation : {};
  return Object.keys(buckets).reduce((acc, key) => {
    return {
      ...acc,
      [key]: buckets[key].services_count.value
    };
  }, {});
}