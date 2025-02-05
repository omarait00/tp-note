"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllCompositeData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getAllCompositeData = async (esClientSearch, options, bucketSelector, onAfterKey, previousBuckets = []) => {
  var _response$hits;
  const {
    body: response
  } = await esClientSearch(options);

  // Nothing available, return the previous buckets.
  if (((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.total.value) === 0) {
    return previousBuckets;
  }

  // if ES doesn't return an aggregations key, something went seriously wrong.
  if (!response.aggregations) {
    throw new Error('Whoops!, `aggregations` key must always be returned.');
  }
  const currentBuckets = bucketSelector(response);

  // if there are no currentBuckets then we are finished paginating through the results
  if (currentBuckets.length === 0) {
    return previousBuckets;
  }

  // There is possibly more data, concat previous and current buckets and call ourselves recursively.
  const newOptions = onAfterKey(options, response);
  return getAllCompositeData(esClientSearch, newOptions, bucketSelector, onAfterKey, previousBuckets.concat(currentBuckets));
};
exports.getAllCompositeData = getAllCompositeData;