"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupAnalyticsCollectionIndex = void 0;
var _ = require("../..");
var _identify_exceptions = require("../../utils/identify_exceptions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const analyticsCollectionMappingsProperties = {
  event_retention_day_length: {
    type: 'long'
  },
  name: {
    type: 'keyword'
  }
};
const defaultSettings = {
  auto_expand_replicas: '0-3',
  hidden: true,
  number_of_replicas: 0
};
const setupAnalyticsCollectionIndex = async client => {
  const indexConfiguration = {
    aliases: [_.ANALYTICS_COLLECTIONS_INDEX],
    mappings: {
      _meta: {
        version: _.ANALYTICS_VERSION
      },
      properties: analyticsCollectionMappingsProperties
    },
    name: `${_.ANALYTICS_COLLECTIONS_INDEX}-v${_.ANALYTICS_VERSION}`,
    settings: defaultSettings
  };
  try {
    const {
      mappings,
      aliases,
      name: index,
      settings
    } = indexConfiguration;
    await client.indices.create({
      index,
      mappings,
      settings
    });
    await client.indices.updateAliases({
      actions: [{
        add: {
          aliases,
          index,
          is_hidden: true,
          is_write_index: true
        }
      }]
    });
  } catch (error) {
    if ((0, _identify_exceptions.isResourceAlreadyExistsException)(error)) {
      // index already exists, swallow error
      return;
    }
    return error;
  }
};
exports.setupAnalyticsCollectionIndex = setupAnalyticsCollectionIndex;