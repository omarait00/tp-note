"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildMetricbeatErrors = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * builds a normalized representation of the metricbeat errors from the provided
 * query buckets with a product->metricset hierarchy where
 *  product: the monitored products (eg elasticsearch)
 *  metricset: the collected metricsets for a given entity
 *
 * example:
 * {
 *   "product": {
 *     "logstash": {
 *        "node": {
 *          "message": "some error message",
 *          "lastSeen": "2022-05-17T16:56:52.929Z"
 *        }
 *     }
 *   }
 * }
 */
const buildMetricbeatErrors = modulesBucket => {
  return (modulesBucket !== null && modulesBucket !== void 0 ? modulesBucket : []).reduce((module, {
    key,
    errors_by_dataset: errorsByDataset
  }) => {
    const datasets = buildMetricsets(errorsByDataset.buckets);
    if (Object.keys(datasets).length === 0) {
      return {
        ...module
      };
    }
    return {
      ...module,
      [key]: datasets
    };
  }, {});
};
exports.buildMetricbeatErrors = buildMetricbeatErrors;
const buildMetricsets = errorsByDataset => {
  return (errorsByDataset !== null && errorsByDataset !== void 0 ? errorsByDataset : []).reduce((dataset, {
    key,
    latest_docs: latestDocs
  }) => {
    var _latestDocs$hits$hits;
    const errors = buildErrorMessages((_latestDocs$hits$hits = latestDocs.hits.hits) !== null && _latestDocs$hits$hits !== void 0 ? _latestDocs$hits$hits : []);
    if (errors.length === 0) {
      return {
        ...dataset
      };
    }
    return {
      ...dataset,
      [key]: errors
    };
  }, {});
};
const getErrorMessage = doc => {
  var _doc$_source, _doc$_source$error;
  return (_doc$_source = doc._source) === null || _doc$_source === void 0 ? void 0 : (_doc$_source$error = _doc$_source.error) === null || _doc$_source$error === void 0 ? void 0 : _doc$_source$error.message;
};
const buildErrorMessages = errorDocs => {
  const seenErrorMessages = new Set();
  return errorDocs.filter(doc => {
    const message = getErrorMessage(doc);
    if (seenErrorMessages.has(message)) {
      return false;
    } else {
      seenErrorMessages.add(message);
      return true;
    }
  }).map(uniqueDoc => {
    const source = uniqueDoc._source;
    return {
      message: getErrorMessage(uniqueDoc),
      lastSeen: source['@timestamp']
    };
  });
};