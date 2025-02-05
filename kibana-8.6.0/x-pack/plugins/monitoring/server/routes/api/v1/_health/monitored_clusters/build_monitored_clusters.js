"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildMonitoredClusters = void 0;
var _lodash = require("lodash");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
var CollectionMode;
(function (CollectionMode) {
  CollectionMode["Internal"] = "internal-monitoring";
  CollectionMode["Metricbeat7"] = "metricbeat-7";
  CollectionMode["Metricbeat8"] = "metricbeat-8";
  CollectionMode["Package"] = "package";
  CollectionMode["Unknown"] = "unknown";
})(CollectionMode || (CollectionMode = {}));
const internalMonitoringPattern = /(.*:)?\.monitoring-(es|kibana|beats|logstash)-7-[0-9]{4}\..*/;
const metricbeatMonitoring7Pattern = /(.*:)?\.monitoring-(es|kibana|beats|logstash|ent-search)-7.*-mb.*/;
const metricbeatMonitoring8Pattern = /(.*:)?\.ds-\.monitoring-(es|kibana|beats|logstash|ent-search)-8-mb.*/;
const packagePattern = /(.*:)?\.ds-metrics-(elasticsearch|kibana|logstash)\..*/;
const getCollectionMode = index => {
  if (internalMonitoringPattern.test(index)) return CollectionMode.Internal;
  if (metricbeatMonitoring7Pattern.test(index)) return CollectionMode.Metricbeat7;
  if (metricbeatMonitoring8Pattern.test(index)) return CollectionMode.Metricbeat8;
  if (packagePattern.test(index)) return CollectionMode.Package;
  return CollectionMode.Unknown;
};

/**
 * builds a normalized representation of the monitoring state from the provided
 * query buckets with a cluster->product->entity->metricset hierarchy where
 *  cluster: the monitored cluster identifier
 *  product: the monitored products (eg elasticsearch)
 *  entity: the product unit of work (eg node)
 *  metricset: the collected metricsets for a given entity
 *
 * example:
 * {
 *   "f-05NylTQg2G7rQXHnvYbA": {
 *     "elasticsearch": {
 *       "9NXA8Ov5QCeWAalKIHWFJg": {
 *         "shard": {
 *           "metricbeat-8": {
 *             "index": ".ds-.monitoring-es-8-mb-2022.05.17-000001",
 *             "lastSeen": "2022-05-17T16:56:52.929Z"
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
const buildMonitoredClusters = (clustersBuckets, logger) => {
  return clustersBuckets.reduce((clusters, {
    key,
    doc_count: _,
    ...products
  }) => {
    clusters[key] = buildMonitoredProducts(products, logger);
    return clusters;
  }, {});
};

/**
 * some products may not have a common identifier for their entities across the
 * metricsets and can create multiple aggregations. we make sure to merge these
 * so the output only includes a single product entry
 * we assume each aggregation is named as /productname(_aggsuffix)?/
 */
exports.buildMonitoredClusters = buildMonitoredClusters;
const buildMonitoredProducts = (rawProducts, logger) => {
  const validProducts = Object.values(_types.MonitoredProduct);
  const products = (0, _lodash.mapValues)(rawProducts, (value, key) => {
    if (!validProducts.some(product => key.startsWith(product))) {
      logger.warn(`buildMonitoredProducts: ignoring unknown product aggregation key (${key})`);
      return {};
    }
    return buildMonitoredEntities(value.buckets);
  });
  return (0, _lodash.reduce)(products, (uniqProducts, entities, aggregationKey) => {
    if ((0, _lodash.isEmpty)(entities)) return uniqProducts;
    const product = aggregationKey.split('_')[0];
    uniqProducts[product] = (0, _lodash.merge)(uniqProducts[product], entities);
    return uniqProducts;
  }, {});
};
const buildMonitoredEntities = entitiesBuckets => {
  return entitiesBuckets.reduce((entities, {
    key,
    key_as_string: keyAsString,
    doc_count: _,
    ...metricsets
  }) => {
    entities[keyAsString || key] = buildMonitoredMetricsets(metricsets);
    return entities;
  }, {});
};
const buildMonitoredMetricsets = rawMetricsets => {
  const monitoredMetricsets = (0, _lodash.mapValues)(rawMetricsets, ({
    by_index: byIndex
  }) => {
    return byIndex.buckets.reduce((metricsets, {
      key,
      last_seen: lastSeen
    }) => {
      metricsets[getCollectionMode(key)] = {
        index: key,
        lastSeen: lastSeen.value_as_string
      };
      return metricsets;
    }, {});
  });
  return (0, _lodash.omitBy)(monitoredMetricsets, _lodash.isEmpty);
};