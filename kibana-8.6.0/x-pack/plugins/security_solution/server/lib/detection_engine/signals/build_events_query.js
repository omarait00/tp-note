"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimeRangeFilter = exports.buildEventsSearchQuery = exports.buildEqlSearchRequest = void 0;
var _lodash = require("lodash");
var _get_query_filter = require("./get_query_filter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildTimeRangeFilter = ({
  to,
  from,
  primaryTimestamp,
  secondaryTimestamp
}) => {
  // The primaryTimestamp is always provided and will contain either the timestamp override field or `@timestamp` otherwise.
  // The secondaryTimestamp is `undefined` if
  //   1. timestamp override field is not specified
  //   2. timestamp override field is set and timestamp fallback is disabled
  //   3. timestamp override field is set to `@timestamp`
  // or `@timestamp` otherwise.
  //
  // If the secondaryTimestamp is provided, documents must either populate primaryTimestamp with a timestamp in the range
  // or must NOT populate the primaryTimestamp field at all and secondaryTimestamp must fall in the range.
  // If secondaryTimestamp is not provided, we simply use primaryTimestamp
  return secondaryTimestamp != null ? {
    bool: {
      minimum_should_match: 1,
      should: [{
        range: {
          [primaryTimestamp]: {
            lte: to,
            gte: from,
            format: 'strict_date_optional_time'
          }
        }
      }, {
        bool: {
          filter: [{
            range: {
              [secondaryTimestamp]: {
                lte: to,
                gte: from,
                format: 'strict_date_optional_time'
              }
            }
          }, {
            bool: {
              must_not: {
                exists: {
                  field: primaryTimestamp
                }
              }
            }
          }]
        }
      }]
    }
  } : {
    range: {
      [primaryTimestamp]: {
        lte: to,
        gte: from,
        format: 'strict_date_optional_time'
      }
    }
  };
};
exports.buildTimeRangeFilter = buildTimeRangeFilter;
const buildEventsSearchQuery = ({
  aggregations,
  index,
  from,
  to,
  filter,
  size,
  runtimeMappings,
  searchAfterSortIds,
  sortOrder,
  primaryTimestamp,
  secondaryTimestamp,
  trackTotalHits,
  additionalFilters
}) => {
  const timestamps = secondaryTimestamp ? [primaryTimestamp, secondaryTimestamp] : [primaryTimestamp];
  const docFields = timestamps.map(tstamp => ({
    field: tstamp,
    format: 'strict_date_optional_time'
  }));
  const rangeFilter = buildTimeRangeFilter({
    to,
    from,
    primaryTimestamp,
    secondaryTimestamp
  });
  const filterWithTime = [filter, rangeFilter, ...(additionalFilters ? additionalFilters : [])];
  const sort = [];
  sort.push({
    [primaryTimestamp]: {
      order: sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc',
      unmapped_type: 'date'
    }
  });
  if (secondaryTimestamp) {
    sort.push({
      [secondaryTimestamp]: {
        order: sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc',
        unmapped_type: 'date'
      }
    });
  }
  const searchQuery = {
    allow_no_indices: true,
    runtime_mappings: runtimeMappings,
    index,
    size,
    ignore_unavailable: true,
    track_total_hits: trackTotalHits,
    body: {
      query: {
        bool: {
          filter: [...filterWithTime, {
            match_all: {}
          }]
        }
      },
      fields: [{
        field: '*',
        include_unmapped: true
      }, ...docFields],
      ...(aggregations ? {
        aggregations
      } : {}),
      runtime_mappings: runtimeMappings,
      sort
    }
  };
  if (searchAfterSortIds != null && !(0, _lodash.isEmpty)(searchAfterSortIds)) {
    return {
      ...searchQuery,
      body: {
        ...searchQuery.body,
        search_after: searchAfterSortIds
      }
    };
  }
  return searchQuery;
};
exports.buildEventsSearchQuery = buildEventsSearchQuery;
const buildEqlSearchRequest = ({
  query,
  index,
  from,
  to,
  size,
  filters,
  primaryTimestamp,
  secondaryTimestamp,
  runtimeMappings,
  eventCategoryOverride,
  timestampField,
  tiebreakerField,
  exceptionFilter
}) => {
  const timestamps = secondaryTimestamp ? [primaryTimestamp, secondaryTimestamp] : [primaryTimestamp];
  const docFields = timestamps.map(tstamp => ({
    field: tstamp,
    format: 'strict_date_optional_time'
  }));
  const esFilter = (0, _get_query_filter.getQueryFilter)({
    query: '',
    language: 'eql',
    filters: filters || [],
    index,
    exceptionFilter
  });
  const rangeFilter = buildTimeRangeFilter({
    to,
    from,
    primaryTimestamp,
    secondaryTimestamp
  });
  const requestFilter = [rangeFilter, esFilter];
  const fields = [{
    field: '*',
    include_unmapped: true
  }, ...docFields];
  return {
    index,
    allow_no_indices: true,
    body: {
      size,
      query,
      filter: {
        bool: {
          filter: requestFilter
        }
      },
      runtime_mappings: runtimeMappings,
      timestamp_field: timestampField,
      event_category_field: eventCategoryOverride,
      tiebreaker_field: tiebreakerField,
      fields
    }
  };
};
exports.buildEqlSearchRequest = buildEqlSearchRequest;