"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceMetadataIcons = getServiceMetadataIcons;
exports.should = void 0;
var _server = require("../../../../observability/server");
var _common = require("../../../../observability/common");
var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");
var _transactions = require("../../lib/helpers/transactions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const should = [{
  exists: {
    field: _elasticsearch_fieldnames.CONTAINER_ID
  }
}, {
  exists: {
    field: _elasticsearch_fieldnames.KUBERNETES_POD_NAME
  }
}, {
  exists: {
    field: _elasticsearch_fieldnames.CLOUD_PROVIDER
  }
}, {
  exists: {
    field: _elasticsearch_fieldnames.HOST_OS_PLATFORM
  }
}, {
  exists: {
    field: _elasticsearch_fieldnames.AGENT_NAME
  }
}];
exports.should = should;
async function getServiceMetadataIcons({
  serviceName,
  apmEventClient,
  searchAggregatedTransactions,
  start,
  end
}) {
  var _cloud$service;
  const filter = [{
    term: {
      [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName
    }
  }, ...(0, _server.rangeQuery)(start, end)];
  const params = {
    apm: {
      events: [(0, _transactions.getProcessorEventForTransactions)(searchAggregatedTransactions), _common.ProcessorEvent.error, _common.ProcessorEvent.metric]
    },
    body: {
      track_total_hits: 1,
      size: 1,
      _source: [_elasticsearch_fieldnames.KUBERNETES, _elasticsearch_fieldnames.CLOUD_PROVIDER, _elasticsearch_fieldnames.CONTAINER_ID, _elasticsearch_fieldnames.AGENT_NAME, _elasticsearch_fieldnames.CLOUD_SERVICE_NAME],
      query: {
        bool: {
          filter,
          should
        }
      }
    }
  };
  const response = await apmEventClient.search('get_service_metadata_icons', params);
  if (response.hits.total.value === 0) {
    return {
      agentName: undefined,
      containerType: undefined,
      cloudProvider: undefined,
      serverlessType: undefined
    };
  }
  const {
    kubernetes,
    cloud,
    container,
    agent
  } = response.hits.hits[0]._source;
  let containerType;
  if (!!kubernetes) {
    containerType = 'Kubernetes';
  } else if (!!container) {
    containerType = 'Docker';
  }
  let serverlessType;
  if ((cloud === null || cloud === void 0 ? void 0 : cloud.provider) === 'aws' && (cloud === null || cloud === void 0 ? void 0 : (_cloud$service = cloud.service) === null || _cloud$service === void 0 ? void 0 : _cloud$service.name) === 'lambda') {
    serverlessType = 'lambda';
  }
  return {
    agentName: agent === null || agent === void 0 ? void 0 : agent.name,
    containerType,
    serverlessType,
    cloudProvider: cloud === null || cloud === void 0 ? void 0 : cloud.provider
  };
}