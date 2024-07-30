"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addAnalyticsCollection = void 0;
var _ = require("../..");
var _error_codes = require("../../../common/types/error_codes");
var _is_alphanumeric_underscore = require("../../../common/utils/is_alphanumeric_underscore");
var _fetch_analytics_collection = require("./fetch_analytics_collection");
var _setup_indices = require("./setup_indices");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createAnalyticsCollection = async (client, document) => {
  const analyticsCollection = await (0, _fetch_analytics_collection.fetchAnalyticsCollectionByName)(client, document.name);
  if (analyticsCollection) {
    throw new Error(_error_codes.ErrorCode.ANALYTICS_COLLECTION_ALREADY_EXISTS);
  }
  if (!(0, _is_alphanumeric_underscore.isAlphaNumericOrUnderscore)(document.name)) {
    throw new Error(_error_codes.ErrorCode.ANALYTICS_COLLECTION_NAME_INVALID);
  }

  // index the document
  const result = await client.asCurrentUser.index({
    document,
    index: _.ANALYTICS_COLLECTIONS_INDEX
  });
  await client.asCurrentUser.indices.refresh({
    index: _.ANALYTICS_COLLECTIONS_INDEX
  });
  return {
    id: result._id,
    ...document
  };
};
const addAnalyticsCollection = async (client, input) => {
  const document = {
    event_retention_day_length: 180,
    name: input.name
  };
  const analyticsCollectionIndexExists = await client.asCurrentUser.indices.exists({
    index: _.ANALYTICS_COLLECTIONS_INDEX
  });
  if (!analyticsCollectionIndexExists) {
    await (0, _setup_indices.setupAnalyticsCollectionIndex)(client.asCurrentUser);
  }
  return await createAnalyticsCollection(client, document);
};
exports.addAnalyticsCollection = addAnalyticsCollection;