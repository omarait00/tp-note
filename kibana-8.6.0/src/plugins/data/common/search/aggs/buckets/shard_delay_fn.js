"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggShardDelayFnName = exports.aggShardDelay = void 0;
var _i18n = require("@kbn/i18n");
var _shard_delay = require("./shard_delay");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const aggShardDelayFnName = 'aggShardDelay';
exports.aggShardDelayFnName = aggShardDelayFnName;
const aggShardDelay = () => ({
  name: aggShardDelayFnName,
  help: _i18n.i18n.translate('data.search.aggs.function.buckets.shardDelay.help', {
    defaultMessage: 'Generates a serialized agg config for a Shard Delay agg'
  }),
  type: 'agg_type',
  args: {
    id: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.id.help', {
        defaultMessage: 'ID for this aggregation'
      })
    },
    enabled: {
      types: ['boolean'],
      default: true,
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.enabled.help', {
        defaultMessage: 'Specifies whether this aggregation should be enabled'
      })
    },
    schema: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.schema.help', {
        defaultMessage: 'Schema to use for this aggregation'
      })
    },
    delay: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.delay.help', {
        defaultMessage: 'Delay between shards to process. Example: "5s".'
      })
    },
    json: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.json.help', {
        defaultMessage: 'Advanced json to include when the agg is sent to Elasticsearch'
      })
    },
    customLabel: {
      types: ['string'],
      help: _i18n.i18n.translate('data.search.aggs.buckets.shardDelay.customLabel.help', {
        defaultMessage: 'Represents a custom label for this aggregation'
      })
    }
  },
  fn: (input, args) => {
    const {
      id,
      enabled,
      schema,
      ...rest
    } = args;
    return {
      type: 'agg_type',
      value: {
        id,
        enabled,
        schema,
        type: _shard_delay.SHARD_DELAY_AGG_NAME,
        params: {
          ...rest
        }
      }
    };
  }
});
exports.aggShardDelay = aggShardDelay;