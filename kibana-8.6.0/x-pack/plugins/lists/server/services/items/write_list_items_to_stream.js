"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeResponseHitsToStream = exports.writeNextResponse = exports.getSearchAfterFromResponse = exports.getResponse = exports.exportListItemsToStream = exports.SIZE = void 0;
var _error_with_status_code = require("../../error_with_status_code");
var _find_source_value = require("../utils/find_source_value");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * How many results to page through from the network at a time
 * using search_after
 */
const SIZE = 100;
exports.SIZE = SIZE;
const exportListItemsToStream = ({
  listId,
  esClient,
  stream,
  listItemIndex,
  stringToAppend
}) => {
  // Use a timeout to start the reading process on the next tick.
  // and prevent the async await from bubbling up to the caller
  setTimeout(async () => {
    let searchAfter = await writeNextResponse({
      esClient,
      listId,
      listItemIndex,
      searchAfter: undefined,
      stream,
      stringToAppend
    });
    while (searchAfter != null) {
      searchAfter = await writeNextResponse({
        esClient,
        listId,
        listItemIndex,
        searchAfter,
        stream,
        stringToAppend
      });
    }
    stream.end();
  });
};
exports.exportListItemsToStream = exportListItemsToStream;
const writeNextResponse = async ({
  listId,
  esClient,
  stream,
  listItemIndex,
  searchAfter,
  stringToAppend
}) => {
  const response = await getResponse({
    esClient,
    listId,
    listItemIndex,
    searchAfter
  });
  if (response.hits.hits.length) {
    writeResponseHitsToStream({
      response,
      stream,
      stringToAppend
    });
    return getSearchAfterFromResponse({
      response
    });
  } else {
    return undefined;
  }
};
exports.writeNextResponse = writeNextResponse;
const getSearchAfterFromResponse = ({
  response
}) =>
// @ts-expect-error @elastic/elasticsearch SortResults contains null
response.hits.hits.length > 0 ? response.hits.hits[response.hits.hits.length - 1].sort : undefined;
exports.getSearchAfterFromResponse = getSearchAfterFromResponse;
const getResponse = async ({
  esClient,
  searchAfter,
  listId,
  listItemIndex,
  size = SIZE
}) => {
  return await esClient.search({
    body: {
      query: {
        term: {
          list_id: listId
        }
      },
      search_after: searchAfter,
      sort: [{
        tie_breaker_id: 'asc'
      }]
    },
    ignore_unavailable: true,
    index: listItemIndex,
    size
  });
};
exports.getResponse = getResponse;
const writeResponseHitsToStream = ({
  response,
  stream,
  stringToAppend
}) => {
  const stringToAppendOrEmpty = stringToAppend !== null && stringToAppend !== void 0 ? stringToAppend : '';
  response.hits.hits.forEach(hit => {
    // @ts-expect-error @elastic/elasticsearch _source is optional
    const value = (0, _find_source_value.findSourceValue)(hit._source);
    if (value != null) {
      stream.push(`${value}${stringToAppendOrEmpty}`);
    } else {
      throw new _error_with_status_code.ErrorWithStatusCode(`Encountered an error where hit._source was an unexpected type: ${JSON.stringify(hit._source)}`, 400);
    }
  });
};
exports.writeResponseHitsToStream = writeResponseHitsToStream;