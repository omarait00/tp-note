"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceInstanceContainerMetadata = void 0;
var _server = require("../../../../observability/server");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _maybe2 = require("../../../common/utils/maybe");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getServiceInstanceContainerMetadata = async ({
  infraMetricsClient,
  containerId,
  start,
  end
}) => {
  var _maybe, _sample$kubernetes, _sample$kubernetes$po, _sample$kubernetes2, _sample$kubernetes2$p, _sample$kubernetes3, _sample$kubernetes3$d, _sample$kubernetes4, _sample$kubernetes4$r, _sample$kubernetes5, _sample$kubernetes6, _sample$kubernetes6$c, _sample$kubernetes7, _sample$kubernetes7$c;
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
    size: 1,
    track_total_hits: false,
    query: {
      bool: {
        filter: [{
          term: {
            [_elasticsearch_fieldnames.CONTAINER_ID]: containerId
          }
        }, ...(0, _server.rangeQuery)(start, end)],
        should
      }
    }
  });
  const sample = (_maybe = (0, _maybe2.maybe)(response.hits.hits[0])) === null || _maybe === void 0 ? void 0 : _maybe._source;
  return {
    kubernetes: {
      pod: {
        name: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes = sample.kubernetes) === null || _sample$kubernetes === void 0 ? void 0 : (_sample$kubernetes$po = _sample$kubernetes.pod) === null || _sample$kubernetes$po === void 0 ? void 0 : _sample$kubernetes$po.name,
        uid: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes2 = sample.kubernetes) === null || _sample$kubernetes2 === void 0 ? void 0 : (_sample$kubernetes2$p = _sample$kubernetes2.pod) === null || _sample$kubernetes2$p === void 0 ? void 0 : _sample$kubernetes2$p.uid
      },
      deployment: {
        name: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes3 = sample.kubernetes) === null || _sample$kubernetes3 === void 0 ? void 0 : (_sample$kubernetes3$d = _sample$kubernetes3.deployment) === null || _sample$kubernetes3$d === void 0 ? void 0 : _sample$kubernetes3$d.name
      },
      replicaset: {
        name: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes4 = sample.kubernetes) === null || _sample$kubernetes4 === void 0 ? void 0 : (_sample$kubernetes4$r = _sample$kubernetes4.replicaset) === null || _sample$kubernetes4$r === void 0 ? void 0 : _sample$kubernetes4$r.name
      },
      namespace: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes5 = sample.kubernetes) === null || _sample$kubernetes5 === void 0 ? void 0 : _sample$kubernetes5.namespace,
      container: {
        name: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes6 = sample.kubernetes) === null || _sample$kubernetes6 === void 0 ? void 0 : (_sample$kubernetes6$c = _sample$kubernetes6.container) === null || _sample$kubernetes6$c === void 0 ? void 0 : _sample$kubernetes6$c.name,
        id: sample === null || sample === void 0 ? void 0 : (_sample$kubernetes7 = sample.kubernetes) === null || _sample$kubernetes7 === void 0 ? void 0 : (_sample$kubernetes7$c = _sample$kubernetes7.container) === null || _sample$kubernetes7$c === void 0 ? void 0 : _sample$kubernetes7$c.id
      }
    }
  };
};
exports.getServiceInstanceContainerMetadata = getServiceInstanceContainerMetadata;