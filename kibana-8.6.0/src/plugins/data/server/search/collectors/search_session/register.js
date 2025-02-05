"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUsageCollector = registerUsageCollector;
var _fetch = require("./fetch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerUsageCollector(usageCollection, kibanaIndex, logger) {
  try {
    const collector = usageCollection.makeUsageCollector({
      type: 'search-session',
      isReady: () => true,
      fetch: (0, _fetch.fetchProvider)(kibanaIndex, logger),
      schema: {
        transientCount: {
          type: 'long'
        },
        persistedCount: {
          type: 'long'
        },
        totalCount: {
          type: 'long'
        }
      }
    });
    usageCollection.registerCollector(collector);
  } catch (err) {
    return; // kibana plugin is not enabled (test environment)
  }
}