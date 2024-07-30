"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAnalyticsCollectionByName = void 0;
var _ = require("../..");
var _error_codes = require("../../../common/types/error_codes");
var _fetch_analytics_collection = require("./fetch_analytics_collection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteAnalyticsCollectionByName = async (client, name) => {
  const analyticsCollection = await (0, _fetch_analytics_collection.fetchAnalyticsCollectionByName)(client, name);
  if (!analyticsCollection) {
    throw new Error(_error_codes.ErrorCode.ANALYTICS_COLLECTION_NOT_FOUND);
  }
  await client.asCurrentUser.delete({
    id: analyticsCollection.id,
    index: _.ANALYTICS_COLLECTIONS_INDEX
  });
};
exports.deleteAnalyticsCollectionByName = deleteAnalyticsCollectionByName;