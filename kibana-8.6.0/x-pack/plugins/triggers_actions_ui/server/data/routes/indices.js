"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndicesRoute = createIndicesRoute;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// the business logic of this code is from watcher, in:
//   x-pack/plugins/watcher/server/routes/api/indices/register_get_route.ts

const MAX_INDICES = 20;
const bodySchema = _configSchema.schema.object({
  pattern: _configSchema.schema.string()
});
function createIndicesRoute(logger, router, baseRoute) {
  const path = `${baseRoute}/_indices`;
  logger.debug(`registering indexThreshold route POST ${path}`);
  router.post({
    path,
    validate: {
      body: bodySchema
    }
  }, handler);
  async function handler(ctx, req, res) {
    const pattern = req.body.pattern;
    const esClient = (await ctx.core).elasticsearch.client.asCurrentUser;
    logger.debug(`route ${path} request: ${JSON.stringify(req.body)}`);
    if (pattern.trim() === '') {
      return res.ok({
        body: {
          indices: []
        }
      });
    }
    let aliases = [];
    try {
      aliases = await getAliasesFromPattern(esClient, pattern);
    } catch (err) {
      logger.warn(`route ${path} error getting aliases from pattern "${pattern}": ${err.message}`);
    }
    let indices = [];
    try {
      indices = await getIndicesFromPattern(esClient, pattern);
    } catch (err) {
      logger.warn(`route ${path} error getting indices from pattern "${pattern}": ${err.message}`);
    }
    let dataStreams = [];
    try {
      dataStreams = await getDataStreamsFromPattern(esClient, pattern);
    } catch (err) {
      logger.warn(`route ${path} error getting data streams from pattern "${pattern}": ${err.message}`);
    }
    const result = {
      indices: uniqueCombined(aliases, indices, dataStreams, MAX_INDICES)
    };
    logger.debug(`route ${path} response: ${JSON.stringify(result)}`);
    return res.ok({
      body: result
    });
  }
}
function uniqueCombined(list1, list2, list3, limit) {
  const set = new Set(list1.concat(list2).concat(list3));
  const result = Array.from(set);
  result.sort((string1, string2) => string1.localeCompare(string2));
  return result.slice(0, limit);
}
async function getIndicesFromPattern(esClient, pattern) {
  const params = {
    index: pattern,
    ignore_unavailable: true,
    body: {
      size: 0,
      // no hits
      aggs: {
        indices: {
          terms: {
            field: '_index',
            size: MAX_INDICES
          }
        }
      }
    }
  };
  const response = await esClient.search(params);
  // TODO: Investigate when the status field might appear here, type suggests it shouldn't ever happen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (response.status === 404 || !response.aggregations) {
    return [];
  }
  return response.aggregations.indices.buckets.map(bucket => bucket.key);
}
async function getAliasesFromPattern(esClient, pattern) {
  const params = {
    index: pattern,
    ignore_unavailable: true
  };
  const result = [];
  const response = await esClient.indices.getAlias(params, {
    meta: true
  });
  const responseBody = response.body;
  if (response.statusCode === 404) {
    return result;
  }
  for (const index of Object.keys(responseBody)) {
    const aliasRecord = responseBody[index];
    if (aliasRecord.aliases) {
      const aliases = Object.keys(aliasRecord.aliases);
      result.push(...aliases);
    }
  }
  return result;
}
async function getDataStreamsFromPattern(esClient, pattern) {
  const params = {
    name: pattern
  };
  const {
    data_streams: response
  } = await esClient.indices.getDataStream(params);
  return response.map(r => r.name);
}