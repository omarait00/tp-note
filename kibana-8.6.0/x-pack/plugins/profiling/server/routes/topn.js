"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryTopNCommon = queryTopNCommon;
exports.registerTraceEventsTopNContainersSearchRoute = registerTraceEventsTopNContainersSearchRoute;
exports.registerTraceEventsTopNDeploymentsSearchRoute = registerTraceEventsTopNDeploymentsSearchRoute;
exports.registerTraceEventsTopNHostsSearchRoute = registerTraceEventsTopNHostsSearchRoute;
exports.registerTraceEventsTopNStackTracesSearchRoute = registerTraceEventsTopNStackTracesSearchRoute;
exports.registerTraceEventsTopNThreadsSearchRoute = registerTraceEventsTopNThreadsSearchRoute;
exports.topNElasticSearchQuery = topNElasticSearchQuery;
var _configSchema = require("@kbn/config-schema");
var _common = require("../../common");
var _elasticsearch = require("../../common/elasticsearch");
var _histogram = require("../../common/histogram");
var _profiling = require("../../common/profiling");
var _stack_traces = require("../../common/stack_traces");
var _topn = require("../../common/topn");
var _handle_route_error_handler = require("../utils/handle_route_error_handler");
var _create_profiling_es_client = require("../utils/create_profiling_es_client");
var _with_profiling_span = require("../utils/with_profiling_span");
var _compat = require("./compat");
var _downsampling = require("./downsampling");
var _query = require("./query");
var _stacktrace = require("./stacktrace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function topNElasticSearchQuery({
  client,
  logger,
  timeFrom,
  timeTo,
  searchField,
  highCardinality,
  kuery
}) {
  var _aggregations$group_b, _aggregations$total_c;
  const filter = (0, _query.createCommonFilter)({
    timeFrom,
    timeTo,
    kuery
  });
  const targetSampleSize = 20000; // minimum number of samples to get statistically sound results

  const bucketWidth = (0, _histogram.computeBucketWidthFromTimeRangeAndBucketCount)(timeFrom, timeTo, 50);
  const eventsIndex = await (0, _downsampling.findDownsampledIndex)({
    logger,
    client,
    index: _common.INDEX_EVENTS,
    filter,
    sampleSize: targetSampleSize
  });
  const resEvents = await client.search('get_topn_histogram', {
    index: eventsIndex.name,
    size: 0,
    query: filter,
    aggs: (0, _topn.getTopNAggregationRequest)({
      searchField,
      highCardinality,
      fixedInterval: `${bucketWidth}s`
    }),
    // Adrien and Dario found out this is a work-around for some bug in 8.1.
    // It reduces the query time by avoiding unneeded searches.
    pre_filter_shard_size: 1
  });
  const {
    aggregations
  } = resEvents;
  if (!aggregations) {
    return {
      TotalCount: 0,
      TopN: [],
      Metadata: {},
      Labels: {}
    };
  }

  // Creating top N samples requires the time range and bucket width to
  // be in milliseconds, not seconds
  const topN = (0, _topn.createTopNSamples)(aggregations, timeFrom * 1000, timeTo * 1000, bucketWidth * 1000);
  for (let i = 0; i < topN.length; i++) {
    var _topN$i$Count;
    topN[i].Count = ((_topN$i$Count = topN[i].Count) !== null && _topN$i$Count !== void 0 ? _topN$i$Count : 0) / eventsIndex.sampleRate;
  }
  const groupByBuckets = (_aggregations$group_b = aggregations.group_by.buckets) !== null && _aggregations$group_b !== void 0 ? _aggregations$group_b : [];
  const labels = {};
  for (const bucket of groupByBuckets) {
    var _bucket$sample;
    if ((_bucket$sample = bucket.sample) !== null && _bucket$sample !== void 0 && _bucket$sample.top[0]) {
      labels[String(bucket.key)] = String(bucket.sample.top[0].metrics[_elasticsearch.ProfilingESField.HostName] || bucket.sample.top[0].metrics[_elasticsearch.ProfilingESField.HostIP] || '');
    }
  }
  let totalSampledStackTraces = (_aggregations$total_c = aggregations.total_count.value) !== null && _aggregations$total_c !== void 0 ? _aggregations$total_c : 0;
  logger.info('total sampled stacktraces: ' + totalSampledStackTraces);
  totalSampledStackTraces = Math.floor(totalSampledStackTraces / eventsIndex.sampleRate);
  if (searchField !== _elasticsearch.ProfilingESField.StacktraceID) {
    return {
      TotalCount: totalSampledStackTraces,
      TopN: topN,
      Metadata: {},
      Labels: labels
    };
  }
  const stackTraceEvents = new Map();
  let totalAggregatedStackTraces = 0;
  for (let i = 0; i < groupByBuckets.length; i++) {
    var _groupByBuckets$i$cou;
    const stackTraceID = String(groupByBuckets[i].key);
    const count = Math.floor(((_groupByBuckets$i$cou = groupByBuckets[i].count.value) !== null && _groupByBuckets$i$cou !== void 0 ? _groupByBuckets$i$cou : 0) / eventsIndex.sampleRate);
    totalAggregatedStackTraces += count;
    stackTraceEvents.set(stackTraceID, count);
  }
  logger.info('total aggregated stacktraces: ' + totalAggregatedStackTraces);
  logger.info('unique aggregated stacktraces: ' + stackTraceEvents.size);
  const {
    stackTraces,
    stackFrameDocIDs,
    executableDocIDs
  } = await (0, _stacktrace.mgetStackTraces)({
    logger,
    client,
    events: stackTraceEvents
  });
  const [stackFrames, executables] = await (0, _with_profiling_span.withProfilingSpan)('get_stackframes_and_executables', () => {
    return Promise.all([(0, _stacktrace.mgetStackFrames)({
      logger,
      client,
      stackFrameIDs: stackFrameDocIDs
    }), (0, _stacktrace.mgetExecutables)({
      logger,
      client,
      executableIDs: executableDocIDs
    })]);
  });
  const metadata = await (0, _with_profiling_span.withProfilingSpan)('collect_stackframe_metadata', async () => {
    return (0, _profiling.groupStackFrameMetadataByStackTrace)(stackTraces, stackFrames, executables);
  });
  logger.info('returning payload response to client');
  return {
    TotalCount: totalSampledStackTraces,
    TopN: topN,
    Metadata: metadata,
    Labels: labels
  };
}
function queryTopNCommon(router, logger, pathName, searchField, highCardinality) {
  router.get({
    path: pathName,
    validate: {
      query: _configSchema.schema.object({
        timeFrom: _configSchema.schema.number(),
        timeTo: _configSchema.schema.number(),
        kuery: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const {
      timeFrom,
      timeTo,
      kuery
    } = request.query;
    const client = await (0, _compat.getClient)(context);
    try {
      return response.ok({
        body: await topNElasticSearchQuery({
          client: (0, _create_profiling_es_client.createProfilingEsClient)({
            request,
            esClient: client
          }),
          logger,
          timeFrom,
          timeTo,
          searchField,
          highCardinality,
          kuery
        })
      });
    } catch (error) {
      return (0, _handle_route_error_handler.handleRouteHandlerError)({
        error,
        logger,
        response
      });
    }
  });
}
function registerTraceEventsTopNContainersSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  return queryTopNCommon(router, logger, paths.TopNContainers, (0, _stack_traces.getFieldNameForTopNType)(_stack_traces.TopNType.Containers), false);
}
function registerTraceEventsTopNDeploymentsSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  return queryTopNCommon(router, logger, paths.TopNDeployments, (0, _stack_traces.getFieldNameForTopNType)(_stack_traces.TopNType.Deployments), false);
}
function registerTraceEventsTopNHostsSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  return queryTopNCommon(router, logger, paths.TopNHosts, (0, _stack_traces.getFieldNameForTopNType)(_stack_traces.TopNType.Hosts), false);
}
function registerTraceEventsTopNStackTracesSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  return queryTopNCommon(router, logger, paths.TopNTraces, (0, _stack_traces.getFieldNameForTopNType)(_stack_traces.TopNType.Traces), false);
}
function registerTraceEventsTopNThreadsSearchRoute({
  router,
  logger
}) {
  const paths = (0, _common.getRoutePaths)();
  return queryTopNCommon(router, logger, paths.TopNThreads, (0, _stack_traces.getFieldNameForTopNType)(_stack_traces.TopNType.Threads), true);
}