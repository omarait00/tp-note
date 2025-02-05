"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsAll = void 0;
var _fp = require("lodash/fp");
var _constants = require("../../../../../../common/constants");
var _queryEvents_all = require("./query.events_all.dsl");
var _build_query = require("../../../../../utils/build_query");
var _build_fields_request = require("../../helpers/build_fields_request");
var _format_timeline_data = require("../../helpers/format_timeline_data");
var _constants2 = require("../../helpers/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const timelineEventsAll = {
  buildDsl: ({
    authFilter,
    ...options
  }) => {
    if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
      throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
    }
    const {
      fieldRequested,
      ...queryOptions
    } = (0, _fp.cloneDeep)(options);
    queryOptions.fields = (0, _build_fields_request.buildFieldsRequest)(fieldRequested, queryOptions.excludeEcsData);
    return (0, _queryEvents_all.buildTimelineEventsAllQuery)({
      ...queryOptions,
      authFilter
    });
  },
  parse: async (options, response) => {
    // eslint-disable-next-line prefer-const
    let {
      fieldRequested,
      ...queryOptions
    } = (0, _fp.cloneDeep)(options);
    queryOptions.fields = (0, _build_fields_request.buildFieldsRequest)(fieldRequested, queryOptions.excludeEcsData);
    const {
      activePage,
      querySize
    } = options.pagination;
    const producerBuckets = (0, _fp.getOr)([], 'aggregations.producers.buckets', response.rawResponse);
    const totalCount = response.rawResponse.hits.total || 0;
    const hits = response.rawResponse.hits.hits;
    if (fieldRequested.includes('*') && hits.length > 0) {
      const fieldsReturned = hits.flatMap(hit => {
        var _hit$fields;
        return Object.keys((_hit$fields = hit.fields) !== null && _hit$fields !== void 0 ? _hit$fields : {});
      });
      fieldRequested = fieldsReturned.reduce((acc, f) => {
        if (!acc.includes(f)) {
          return [...acc, f];
        }
        return acc;
      }, fieldRequested);
    }
    const edges = await Promise.all(hits.map(hit => (0, _format_timeline_data.formatTimelineData)(fieldRequested, options.excludeEcsData ? [] : _constants2.TIMELINE_EVENTS_FIELDS, hit)));
    const consumers = producerBuckets.reduce((acc, b) => ({
      ...acc,
      [b.key]: b.doc_count
    }), {});
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryEvents_all.buildTimelineEventsAllQuery)(queryOptions))]
    };
    return {
      ...response,
      consumers,
      inspect,
      edges,
      // @ts-expect-error code doesn't handle TotalHits
      totalCount,
      pageInfo: {
        activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
        querySize
      }
    };
  }
};
exports.timelineEventsAll = timelineEventsAll;