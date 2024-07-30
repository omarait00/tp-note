"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchSearchSourceQuery = fetchSearchSourceQuery;
exports.updateSearchSource = updateSearchSource;
var _esQuery = require("@kbn/es-query");
var _common = require("../../../../../../../src/plugins/data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchSearchSourceQuery(ruleId, params, latestTimestamp, services) {
  const {
    logger,
    searchSourceClient
  } = services;
  const initialSearchSource = await searchSourceClient.create(params.searchConfiguration);
  const {
    searchSource,
    dateStart,
    dateEnd
  } = updateSearchSource(initialSearchSource, params, latestTimestamp);
  logger.debug(`search source query rule (${ruleId}) query: ${JSON.stringify(searchSource.getSearchRequestBody())}`);
  const searchResult = await searchSource.fetch();
  return {
    numMatches: Number(searchResult.hits.total),
    searchResult,
    dateStart,
    dateEnd
  };
}
function updateSearchSource(searchSource, params, latestTimestamp) {
  const index = searchSource.getField('index');
  const timeFieldName = index === null || index === void 0 ? void 0 : index.timeFieldName;
  if (!timeFieldName) {
    throw new Error('Invalid data view without timeFieldName.');
  }
  searchSource.setField('size', params.size);
  const timerangeFilter = (0, _common.getTime)(index, {
    from: `now-${params.timeWindowSize}${params.timeWindowUnit}`,
    to: 'now'
  });
  const dateStart = timerangeFilter === null || timerangeFilter === void 0 ? void 0 : timerangeFilter.query.range[timeFieldName].gte;
  const dateEnd = timerangeFilter === null || timerangeFilter === void 0 ? void 0 : timerangeFilter.query.range[timeFieldName].lte;
  const filters = [timerangeFilter];
  if (params.excludeHitsFromPreviousRun) {
    if (latestTimestamp && latestTimestamp > dateStart) {
      // add additional filter for documents with a timestamp greater then
      // the timestamp of the previous run, so that those documents are not counted twice
      const field = index.fields.find(f => f.name === timeFieldName);
      const addTimeRangeField = (0, _esQuery.buildRangeFilter)(field, {
        gt: latestTimestamp
      }, index);
      filters.push(addTimeRangeField);
    }
  }
  const searchSourceChild = searchSource.createChild();
  searchSourceChild.setField('filter', filters);
  searchSourceChild.setField('sort', [{
    [timeFieldName]: _common.SortDirection.desc
  }]);
  return {
    searchSource: searchSourceChild,
    dateStart,
    dateEnd
  };
}