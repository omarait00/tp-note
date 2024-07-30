"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceOverviewContainerMetadata = void 0;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getServiceOverviewContainerMetadata = async ({
  infraMetricsClient,
  containerIds,
  start,
  end
}) => {
  var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4, _response$aggregation5, _response$aggregation6, _response$aggregation7, _response$aggregation8;
  const should = [{
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.CONTAINER_IMAGE
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_CONTAINER_NAME
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_NAMESPACE
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_POD_NAME
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_POD_UID
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_REPLICASET_NAME
    }
  }, {
    exists: {
      field: _elasticsearch_fieldnames.KUBERNETES_DEPLOYMENT_NAME
    }
  }];
  const response = await infraMetricsClient.search({
    size: 0,
    track_total_hits: false,
    query: {
      bool: {
        filter: [{
          terms: {
            [_elasticsearch_fieldnames.CONTAINER_ID]: containerIds
          }
        }, ...(0, _server.rangeQuery)(start, end)],
        should
      }
    },
    aggs: {
      deployments: {
        terms: {
          field: _elasticsearch_fieldnames.KUBERNETES_DEPLOYMENT_NAME,
          size: 10
        }
      },
      namespaces: {
        terms: {
          field: _elasticsearch_fieldnames.KUBERNETES_NAMESPACE,
          size: 10
        }
      },
      replicasets: {
        terms: {
          field: _elasticsearch_fieldnames.KUBERNETES_REPLICASET_NAME,
          size: 10
        }
      },
      containerImages: {
        terms: {
          field: _elasticsearch_fieldnames.CONTAINER_IMAGE,
          size: 10
        }
      }
    }
  });
  return {
    kubernetes: {
      deployments: (_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.deployments) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.buckets.map(bucket => bucket.key),
      replicasets: (_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.replicasets) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.buckets.map(bucket => bucket.key),
      namespaces: (_response$aggregation5 = response.aggregations) === null || _response$aggregation5 === void 0 ? void 0 : (_response$aggregation6 = _response$aggregation5.namespaces) === null || _response$aggregation6 === void 0 ? void 0 : _response$aggregation6.buckets.map(bucket => bucket.key),
      containerImages: (_response$aggregation7 = response.aggregations) === null || _response$aggregation7 === void 0 ? void 0 : (_response$aggregation8 = _response$aggregation7.containerImages) === null || _response$aggregation8 === void 0 ? void 0 : _response$aggregation8.buckets.map(bucket => bucket.key)
    }
  };
};
exports.getServiceOverviewContainerMetadata = getServiceOverviewContainerMetadata;