"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorGroupDetailedStatistics = getErrorGroupDetailedStatistics;
exports.getErrorGroupPeriods = getErrorGroupPeriods;
var _lodash = require("lodash");
var _server = require("../../../../../observability/server");
var _common = require("../../../../../observability/common");
var _offset_previous_period_coordinate = require("../../../../common/utils/offset_previous_period_coordinate");
var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../common/utils/environment_query");
var _get_bucket_size = require("../../../lib/helpers/get_bucket_size");
var _get_offset_in_ms = require("../../../../common/utils/get_offset_in_ms");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getErrorGroupDetailedStatistics({
  kuery,
  serviceName,
  apmEventClient,
  numBuckets,
  groupIds,
  environment,
  start,
  end,
  offset
}) {
  const {
    startWithOffset,
    endWithOffset
  } = (0, _get_offset_in_ms.getOffsetInMs)({
    start,
    end,
    offset
  });
  const {
    intervalString
  } = (0, _get_bucket_size.getBucketSize)({
    start: startWithOffset,
    end: endWithOffset,
    numBuckets
  });
  const timeseriesResponse = await apmEventClient.search('get_service_error_group_detailed_statistics', {
    apm: {
      events: [_common.ProcessorEvent.error]
    },
    body: {
      track_total_hits: false,
      size: 0,
      query: {
        bool: {
          filter: [...(0, _server.termsQuery)(_elasticsearch_fieldnames.ERROR_GROUP_ID, ...groupIds), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, serviceName), ...(0, _server.rangeQuery)(startWithOffset, endWithOffset), ...(0, _environment_query.environmentQuery)(environment), ...(0, _server.kqlQuery)(kuery)]
        }
      },
      aggs: {
        error_groups: {
          terms: {
            field: _elasticsearch_fieldnames.ERROR_GROUP_ID,
            size: 500
          },
          aggs: {
            timeseries: {
              date_histogram: {
                field: '@timestamp',
                fixed_interval: intervalString,
                min_doc_count: 0,
                extended_bounds: {
                  min: startWithOffset,
                  max: endWithOffset
                }
              }
            }
          }
        }
      }
    }
  });
  if (!timeseriesResponse.aggregations) {
    return [];
  }
  return timeseriesResponse.aggregations.error_groups.buckets.map(bucket => {
    const groupId = bucket.key;
    return {
      groupId,
      timeseries: bucket.timeseries.buckets.map(timeseriesBucket => {
        return {
          x: timeseriesBucket.key,
          y: timeseriesBucket.doc_count
        };
      })
    };
  });
}
async function getErrorGroupPeriods({
  kuery,
  serviceName,
  apmEventClient,
  numBuckets,
  groupIds,
  environment,
  start,
  end,
  offset
}) {
  const commonProps = {
    environment,
    kuery,
    serviceName,
    apmEventClient,
    numBuckets,
    groupIds
  };
  const currentPeriodPromise = getErrorGroupDetailedStatistics({
    ...commonProps,
    start,
    end
  });
  const previousPeriodPromise = offset ? getErrorGroupDetailedStatistics({
    ...commonProps,
    start,
    end,
    offset
  }) : [];
  const [currentPeriod, previousPeriod] = await Promise.all([currentPeriodPromise, previousPeriodPromise]);
  const firstCurrentPeriod = currentPeriod === null || currentPeriod === void 0 ? void 0 : currentPeriod[0];
  return {
    currentPeriod: (0, _lodash.keyBy)(currentPeriod, 'groupId'),
    previousPeriod: (0, _lodash.keyBy)(previousPeriod.map(errorRateGroup => ({
      ...errorRateGroup,
      timeseries: (0, _offset_previous_period_coordinate.offsetPreviousPeriodCoordinates)({
        currentPeriodTimeseries: firstCurrentPeriod === null || firstCurrentPeriod === void 0 ? void 0 : firstCurrentPeriod.timeseries,
        previousPeriodTimeseries: errorRateGroup.timeseries
      })
    })), 'groupId')
  };
}