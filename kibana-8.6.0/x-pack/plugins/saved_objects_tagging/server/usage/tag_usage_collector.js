"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTagUsageCollector = void 0;
var _fetch_tag_usage_data = require("./fetch_tag_usage_data");
var _schema = require("./schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createTagUsageCollector = ({
  usageCollection,
  kibanaIndex
}) => {
  return usageCollection.makeUsageCollector({
    type: 'saved_objects_tagging',
    isReady: () => true,
    schema: _schema.tagUsageCollectorSchema,
    fetch: ({
      esClient
    }) => {
      return (0, _fetch_tag_usage_data.fetchTagUsageData)({
        esClient,
        kibanaIndex
      });
    }
  });
};
exports.createTagUsageCollector = createTagUsageCollector;