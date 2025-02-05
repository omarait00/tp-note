"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabifyAggResponse = tabifyAggResponse;
var _lodash = require("lodash");
var _response_writer = require("./response_writer");
var _buckets = require("./buckets");
var _aggs = require("../aggs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Sets up the ResponseWriter and kicks off bucket collection.
 */
function tabifyAggResponse(aggConfigs, esResponse, respOpts) {
  var _esResponse$aggregati, _esResponse$aggregati2, _esResponse$hits, _esResponse$hits2;
  /**
   * read an aggregation from a bucket, which *might* be found at key (if
   * the response came in object form), and will recurse down the aggregation
   * tree and will pass the read values to the ResponseWriter.
   */
  function collectBucket(aggs, write, bucket, key, aggScale) {
    var _agg$type$hasPrecisio, _agg$type;
    const column = write.columns.shift();
    if (column) {
      const agg = column.aggConfig;
      if (agg.getParam('scaleMetricValues')) {
        const aggInfo = agg.write(aggs);
        aggScale *= aggInfo.metricScale || 1;
      }
      switch (agg.type.type) {
        case _aggs.AggGroupNames.Buckets:
          const aggBucket = (0, _lodash.get)(bucket, agg.id);
          const tabifyBuckets = new _buckets.TabifyBuckets(aggBucket, agg, respOpts === null || respOpts === void 0 ? void 0 : respOpts.timeRange);
          const precisionError = (_agg$type$hasPrecisio = (_agg$type = agg.type).hasPrecisionError) === null || _agg$type$hasPrecisio === void 0 ? void 0 : _agg$type$hasPrecisio.call(_agg$type, aggBucket);
          if (precisionError) {
            // "сolumn" mutation, we have to do this here as this value is filled in based on aggBucket value
            column.hasPrecisionError = true;
          }
          if (tabifyBuckets.length) {
            tabifyBuckets.forEach((subBucket, tabifyBucketKey) => {
              // if the bucket doesn't have value don't add it to the row
              // we don't want rows like: { column1: undefined, column2: 10 }
              const bucketValue = agg.getKey(subBucket, tabifyBucketKey);
              const hasBucketValue = typeof bucketValue !== 'undefined';
              if (hasBucketValue) {
                write.bucketBuffer.push({
                  id: column.id,
                  value: bucketValue
                });
              }
              collectBucket(aggs, write, subBucket, agg.getKey(subBucket, tabifyBucketKey), aggScale);
              if (hasBucketValue) {
                write.bucketBuffer.pop();
              }
            });
          } else if (respOpts !== null && respOpts !== void 0 && respOpts.partialRows) {
            // we don't have any buckets, but we do have metrics at this
            // level, then pass all the empty buckets and jump back in for
            // the metrics.
            write.columns.unshift(column);
            passEmptyBuckets(aggs, write, bucket, key, aggScale);
            write.columns.shift();
          } else {
            // we don't have any buckets, and we don't have isHierarchical
            // data, so no metrics, just try to write the row
            write.row();
          }
          break;
        case _aggs.AggGroupNames.Metrics:
          let value = agg.getValue(bucket);
          // since the aggregation could be a non integer (such as a max date)
          // only do the scaling calculation if it is needed.
          if (aggScale !== 1) {
            value *= aggScale;
          }
          write.metricBuffer.push({
            id: column.id,
            value
          });
          if (!write.columns.length) {
            // row complete
            write.row();
          } else {
            // process the next agg at this same level
            collectBucket(aggs, write, bucket, key, aggScale);
          }
          write.metricBuffer.pop();
          break;
      }
      write.columns.unshift(column);
    }
  }

  // write empty values for each bucket agg, then write
  // the metrics from the initial bucket using collectBucket()
  function passEmptyBuckets(aggs, write, bucket, key, aggScale) {
    const column = write.columns.shift();
    if (column) {
      const agg = column.aggConfig;
      switch (agg.type.type) {
        case _aggs.AggGroupNames.Metrics:
          // pass control back to collectBucket()
          write.columns.unshift(column);
          collectBucket(aggs, write, bucket, key, aggScale);
          return;
        case _aggs.AggGroupNames.Buckets:
          passEmptyBuckets(aggs, write, bucket, key, aggScale);
      }
      write.columns.unshift(column);
    }
  }
  const write = new _response_writer.TabbedAggResponseWriter(aggConfigs, respOpts || {});
  const topLevelBucket = {
    ...(aggConfigs.isSamplingEnabled() ? (_esResponse$aggregati = esResponse.aggregations) === null || _esResponse$aggregati === void 0 ? void 0 : _esResponse$aggregati.sampling : esResponse.aggregations),
    doc_count: ((_esResponse$aggregati2 = esResponse.aggregations) === null || _esResponse$aggregati2 === void 0 ? void 0 : _esResponse$aggregati2.doc_count) || ((_esResponse$hits = esResponse.hits) === null || _esResponse$hits === void 0 ? void 0 : _esResponse$hits.total)
  };
  collectBucket(aggConfigs, write, topLevelBucket, '', 1);
  return {
    ...write.response(),
    meta: {
      type: 'esaggs',
      source: aggConfigs.indexPattern.id,
      statistics: {
        totalCount: (_esResponse$hits2 = esResponse.hits) === null || _esResponse$hits2 === void 0 ? void 0 : _esResponse$hits2.total
      }
    }
  };
}