"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndexCounts = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchIndexCounts = async (client, indicesNames) => {
  // TODO: is there way to batch this? Passing multiple index names or a pattern still returns a singular count
  const countPromises = indicesNames.map(async indexName => {
    const {
      count
    } = await client.asCurrentUser.count({
      index: indexName
    });
    return {
      [indexName]: count
    };
  });
  const indexCountArray = await Promise.all(countPromises);
  return indexCountArray.reduce((acc, current) => ({
    ...acc,
    ...current
  }), {});
};
exports.fetchIndexCounts = fetchIndexCounts;