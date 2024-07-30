"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMVTRoutes = initMVTRoutes;
exports.sendResponse = sendResponse;
var _configSchema = require("@kbn/config-schema");
var _elasticsearch = require("@elastic/elasticsearch");
var _constants = require("../../common/constants");
var _execution_context = require("../../common/execution_context");
var _mvt_request_body = require("../../common/mvt_request_body");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CACHE_TIMEOUT_SECONDS = 60 * 60;
function initMVTRoutes({
  router,
  logger,
  core
}) {
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        hasLabels: _configSchema.schema.boolean(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        token: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const x = parseInt(params.x, 10);
    const y = parseInt(params.y, 10);
    const z = parseInt(params.z, 10);
    let tileRequest;
    try {
      tileRequest = (0, _mvt_request_body.getHitsTileRequest)({
        encodedRequestBody: query.requestBody,
        geometryFieldName: query.geometryFieldName,
        hasLabels: query.hasLabels,
        index: query.index,
        x,
        y,
        z
      });
    } catch (e) {
      return response.badRequest();
    }
    const {
      stream,
      headers,
      statusCode
    } = await getTile({
      abortController: makeAbortController(request),
      body: tileRequest.body,
      context,
      core,
      executionContext: (0, _execution_context.makeExecutionContext)({
        description: 'mvt:get_hits_tile',
        url: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETTILE_API_PATH}/${z}/${x}/${y}.pbf`
      }),
      logger,
      path: tileRequest.path
    });
    return sendResponse(response, stream, headers, statusCode);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}/{z}/{x}/{y}.pbf`,
    validate: {
      params: _configSchema.schema.object({
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number()
      }),
      query: _configSchema.schema.object({
        geometryFieldName: _configSchema.schema.string(),
        hasLabels: _configSchema.schema.boolean(),
        requestBody: _configSchema.schema.string(),
        index: _configSchema.schema.string(),
        renderAs: _configSchema.schema.string(),
        token: _configSchema.schema.maybe(_configSchema.schema.string()),
        gridPrecision: _configSchema.schema.number()
      })
    }
  }, async (context, request, response) => {
    const {
      query,
      params
    } = request;
    const x = parseInt(params.x, 10);
    const y = parseInt(params.y, 10);
    const z = parseInt(params.z, 10);
    let tileRequest;
    try {
      tileRequest = (0, _mvt_request_body.getAggsTileRequest)({
        encodedRequestBody: query.requestBody,
        geometryFieldName: query.geometryFieldName,
        gridPrecision: parseInt(query.gridPrecision, 10),
        hasLabels: query.hasLabels,
        index: query.index,
        renderAs: query.renderAs,
        x,
        y,
        z
      });
    } catch (e) {
      return response.badRequest();
    }
    const {
      stream,
      headers,
      statusCode
    } = await getTile({
      abortController: makeAbortController(request),
      body: tileRequest.body,
      context,
      core,
      executionContext: (0, _execution_context.makeExecutionContext)({
        description: 'mvt:get_aggs_tile',
        url: `${_constants.API_ROOT_PATH}/${_constants.MVT_GETGRIDTILE_API_PATH}/${z}/${x}/${y}.pbf`
      }),
      logger,
      path: tileRequest.path
    });
    return sendResponse(response, stream, headers, statusCode);
  });
}
async function getTile({
  abortController,
  body,
  context,
  core,
  executionContext,
  logger,
  path
}) {
  try {
    const esClient = (await context.core).elasticsearch.client;
    const tile = await core.executionContext.withContext(executionContext, async () => {
      return await esClient.asCurrentUser.transport.request({
        method: 'POST',
        path,
        body
      }, {
        signal: abortController.signal,
        headers: {
          'Accept-Encoding': 'gzip'
        },
        asStream: true,
        meta: true
      });
    });
    return {
      stream: tile.body,
      headers: tile.headers,
      statusCode: tile.statusCode
    };
  } catch (e) {
    if (e instanceof _elasticsearch.errors.RequestAbortedError) {
      return {
        stream: null,
        headers: {},
        statusCode: 200
      };
    }

    // These are often circuit breaking exceptions
    // Should return a tile with some error message
    logger.warn(`Cannot generate tile for ${executionContext.url}: ${e.message}`);
    return {
      stream: null,
      headers: {},
      statusCode: 500
    };
  }
}
function sendResponse(response, tileStream, headers, statusCode) {
  if (statusCode >= 400) {
    return response.customError({
      statusCode,
      body: tileStream ? tileStream : statusCode.toString()
    });
  }
  const cacheControl = `public, max-age=${CACHE_TIMEOUT_SECONDS}`;
  const lastModified = `${new Date().toUTCString()}`;
  if (tileStream) {
    // use the content-encoding and content-length headers from elasticsearch if they exist
    const {
      'content-length': contentLength,
      'content-encoding': contentEncoding
    } = headers;
    return response.ok({
      body: tileStream,
      headers: {
        'content-disposition': 'inline',
        ...(contentLength && {
          'content-length': contentLength
        }),
        ...(contentEncoding && {
          'content-encoding': contentEncoding
        }),
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': cacheControl,
        'Last-Modified': lastModified
      }
    });
  } else {
    return response.ok({
      headers: {
        'content-length': `0`,
        'content-disposition': 'inline',
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': cacheControl,
        'Last-Modified': lastModified
      }
    });
  }
}
function makeAbortController(request) {
  const abortController = new AbortController();
  request.events.aborted$.subscribe(() => {
    abortController.abort();
  });
  return abortController;
}