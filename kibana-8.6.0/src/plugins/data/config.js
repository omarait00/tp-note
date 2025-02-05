"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchSessionsConfigSchema = exports.searchConfigSchema = exports.configSchema = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const searchSessionsConfigSchema = _configSchema.schema.object({
  /**
   * Turns the feature on \ off (incl. removing indicator and management screens)
   */
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  /**
   * notTouchedTimeout controls how long user can save a session after all searches completed.
   * The client continues to poll searches to keep the alive until this timeout hits
   */
  notTouchedTimeout: _configSchema.schema.duration({
    defaultValue: '5m'
  }),
  /**
   * maxUpdateRetries controls how many retries we perform while attempting to save a search session
   */
  maxUpdateRetries: _configSchema.schema.number({
    defaultValue: 10
  }),
  /**
   * defaultExpiration controls how long search sessions are valid for, until they are expired.
   */
  defaultExpiration: _configSchema.schema.duration({
    defaultValue: '7d'
  }),
  management: _configSchema.schema.object({
    /**
     * maxSessions controls how many saved search sessions we load on the management screen.
     */
    maxSessions: _configSchema.schema.number({
      defaultValue: 100
    }),
    /**
     * refreshInterval controls how often we refresh the management screen. 0s as duration means that auto-refresh is turned off.
     */
    refreshInterval: _configSchema.schema.duration({
      defaultValue: '0s'
    }),
    /**
     * refreshTimeout controls the timeout for loading search sessions on mgmt screen
     */
    refreshTimeout: _configSchema.schema.duration({
      defaultValue: '1m'
    }),
    expiresSoonWarning: _configSchema.schema.duration({
      defaultValue: '1d'
    })
  })
});
exports.searchSessionsConfigSchema = searchSessionsConfigSchema;
const searchConfigSchema = _configSchema.schema.object({
  /**
   * Config for search strategies that use async search based API underneath
   */
  asyncSearch: _configSchema.schema.object({
    /**
     *  Block and wait until the search is completed up to the timeout (see es async_search's `wait_for_completion_timeout`)
     *  TODO: we should optimize this as 100ms is likely not optimal (https://github.com/elastic/kibana/issues/143277)
     */
    waitForCompletion: _configSchema.schema.duration({
      defaultValue: '100ms'
    }),
    /**
     *  How long the async search needs to be available after each search poll. Ongoing async searches and any saved search results are deleted after this period.
     *  (see es async_search's `keep_alive`)
     *  Note: This is applicable to the searches before the search session is saved.
     *  After search session is saved `keep_alive` is extended using `data.search.sessions.defaultExpiration` config
     */
    keepAlive: _configSchema.schema.duration({
      defaultValue: '1m'
    }),
    /**
     * Affects how often partial results become available, which happens whenever shard results are reduced (see es async_search's `batched_reduce_size`)
     */
    batchedReduceSize: _configSchema.schema.number({
      defaultValue: 64
    }),
    /**
     * How long to wait before polling the async_search after the previous poll response.
     * If not provided, then default dynamic interval with backoff is used.
     */
    pollInterval: _configSchema.schema.maybe(_configSchema.schema.number({
      min: 1000
    }))
  }),
  aggs: _configSchema.schema.object({
    shardDelay: _configSchema.schema.object({
      // Whether or not to register the shard_delay (which is only available in snapshot versions
      // of Elasticsearch) agg type/expression function to make it available in the UI for either
      // functional or manual testing
      enabled: _configSchema.schema.boolean({
        defaultValue: false
      })
    })
  }),
  sessions: searchSessionsConfigSchema
});
exports.searchConfigSchema = searchConfigSchema;
const configSchema = _configSchema.schema.object({
  search: searchConfigSchema
});
exports.configSchema = configSchema;