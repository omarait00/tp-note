"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceGroupFieldsForAnomaly = getServiceGroupFieldsForAnomaly;
var _rxjs = require("rxjs");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _alerting_es_client = require("../../alerting_es_client");
var _get_service_group_fields = require("../get_service_group_fields");
var _get_apm_indices = require("../../../settings/apm_indices/get_apm_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getServiceGroupFieldsForAnomaly({
  config$,
  scopedClusterClient,
  savedObjectsClient,
  serviceName,
  environment,
  transactionType,
  timestamp,
  bucketSpan
}) {
  const config = await (0, _rxjs.firstValueFrom)(config$);
  const indices = await (0, _get_apm_indices.getApmIndices)({
    config,
    savedObjectsClient
  });
  const {
    transaction: index
  } = indices;
  const params = {
    index,
    body: {
      size: 0,
      track_total_hits: false,
      query: {
        bool: {
          filter: [{
            term: {
              [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType
            }
          }, {
            term: {
              [_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]: environment
            }
          }, {
            range: {
              '@timestamp': {
                gte: timestamp,
                lte: timestamp + bucketSpan * 1000,
                format: 'epoch_millis'
              }
            }
          }]
        }
      },
      aggs: {
        ...(0, _get_service_group_fields.getServiceGroupFieldsAgg)({
          sort: [{
            [_elasticsearch_fieldnames.TRANSACTION_DURATION]: {
              order: 'desc'
            }
          }]
        })
      }
    }
  };
  const response = await (0, _alerting_es_client.alertingEsClient)({
    scopedClusterClient,
    params
  });
  if (!response.aggregations) {
    return {};
  }
  return (0, _get_service_group_fields.getServiceGroupFields)(response.aggregations);
}