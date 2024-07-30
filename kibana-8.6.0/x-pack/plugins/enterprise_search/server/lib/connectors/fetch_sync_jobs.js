"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSyncJobsByConnectorId = void 0;
var _ = require("../..");
var _is_not_nullish = require("../../../common/utils/is_not_nullish");
var _setup_indices = require("../../index_management/setup_indices");
var _identify_exceptions = require("../../utils/identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchSyncJobsByConnectorId = async (client, connectorId, pageIndex, size) => {
  try {
    var _result$hits$hits$map;
    if (size === 0) {
      // prevent some divide by zero errors below
      return {
        data: [],
        has_more_hits_than_total: false,
        pageIndex: 0,
        pageSize: size,
        size: 0,
        total: 0
      };
    }
    const result = await client.asCurrentUser.search({
      from: pageIndex * size,
      index: _.CONNECTORS_JOBS_INDEX,
      query: {
        term: {
          'connector.id': connectorId
        }
      },
      size,
      // @ts-ignore Elasticsearch-js has the wrong internal typing for this field
      sort: {
        created_at: {
          order: 'desc'
        }
      }
    });
    const total = totalToPaginateTotal(result.hits.total);
    // If we get fewer results than the target page, make sure we return correct page we're on
    const resultPageIndex = Math.min(pageIndex, Math.trunc(total.total / size));
    const data = (_result$hits$hits$map = result.hits.hits.map(hit => hit._source ? {
      ...hit._source,
      id: hit._id
    } : null).filter(_is_not_nullish.isNotNullish)) !== null && _result$hits$hits$map !== void 0 ? _result$hits$hits$map : [];
    return {
      data,
      pageIndex: resultPageIndex,
      pageSize: size,
      size: data.length,
      ...total
    };
  } catch (error) {
    if ((0, _identify_exceptions.isIndexNotFoundException)(error)) {
      await (0, _setup_indices.setupConnectorsIndices)(client.asCurrentUser);
    }
    return {
      data: [],
      has_more_hits_than_total: false,
      pageIndex: 0,
      pageSize: size,
      size: 0,
      total: 0
    };
  }
};
exports.fetchSyncJobsByConnectorId = fetchSyncJobsByConnectorId;
function totalToPaginateTotal(input) {
  if (typeof input === 'number') {
    return {
      has_more_hits_than_total: false,
      total: input
    };
  }
  return input ? {
    has_more_hits_than_total: input.relation === 'gte' ? true : false,
    total: input.value
  } : {
    has_more_hits_than_total: false,
    total: 0
  };
}