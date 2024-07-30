"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QUERY_KEY_PROCESS_EVENTS = exports.QUERY_KEY_PERCENT_WIDGET = exports.QUERY_KEY_COUNT_WIDGET = exports.QUERY_KEY_CONTAINER_NAME_WIDGET = exports.ORCHESTRATOR_RESOURCE_ID = exports.ORCHESTRATOR_NAMESPACE = exports.ORCHESTRATOR_CLUSTER_NAME = exports.ORCHESTRATOR_CLUSTER_ID = exports.MULTI_TERMS_AGGREGATE_ROUTE = exports.LOCAL_STORAGE_HIDE_WIDGETS_KEY = exports.KUBERNETES_TITLE = exports.KUBERNETES_PATH = exports.ENTRY_LEADER_USER_ID = exports.ENTRY_LEADER_INTERACTIVE = exports.ENTRY_LEADER_ENTITY_ID = exports.DEFAULT_QUERY = exports.DEFAULT_KUBERNETES_FILTER_QUERY = exports.DEFAULT_FILTER_QUERY = exports.DEFAULT_FILTER = exports.COUNT_WIDGET_KEY_PODS = exports.COUNT_WIDGET_KEY_NODES = exports.COUNT_WIDGET_KEY_NAMESPACE = exports.COUNT_WIDGET_KEY_CONTAINER_IMAGES = exports.COUNT_WIDGET_KEY_CLUSTERS = exports.COUNT_ROUTE = exports.CONTAINER_IMAGE_NAME = exports.CLOUD_INSTANCE_NAME = exports.AGGREGATE_ROUTE = exports.AGGREGATE_PAGE_SIZE = exports.AGGREGATE_MAX_BUCKETS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const KUBERNETES_PATH = '/kubernetes';
exports.KUBERNETES_PATH = KUBERNETES_PATH;
const KUBERNETES_TITLE = 'Kubernetes';
exports.KUBERNETES_TITLE = KUBERNETES_TITLE;
const LOCAL_STORAGE_HIDE_WIDGETS_KEY = 'kubernetesSecurity:shouldHideWidgets';
exports.LOCAL_STORAGE_HIDE_WIDGETS_KEY = LOCAL_STORAGE_HIDE_WIDGETS_KEY;
const AGGREGATE_ROUTE = '/internal/kubernetes_security/aggregate';
exports.AGGREGATE_ROUTE = AGGREGATE_ROUTE;
const COUNT_ROUTE = '/internal/kubernetes_security/count';
exports.COUNT_ROUTE = COUNT_ROUTE;
const MULTI_TERMS_AGGREGATE_ROUTE = '/internal/kubernetes_security/multi_terms_aggregate';
exports.MULTI_TERMS_AGGREGATE_ROUTE = MULTI_TERMS_AGGREGATE_ROUTE;
const AGGREGATE_PAGE_SIZE = 10;

// so, bucket sort can only page through what we request at the top level agg, which means there is a ceiling to how many aggs we can page through.
// we should also test this approach at scale.
exports.AGGREGATE_PAGE_SIZE = AGGREGATE_PAGE_SIZE;
const AGGREGATE_MAX_BUCKETS = 2000;

// react-query caching keys
exports.AGGREGATE_MAX_BUCKETS = AGGREGATE_MAX_BUCKETS;
const QUERY_KEY_PERCENT_WIDGET = 'kubernetesSecurityPercentWidget';
exports.QUERY_KEY_PERCENT_WIDGET = QUERY_KEY_PERCENT_WIDGET;
const QUERY_KEY_COUNT_WIDGET = 'kubernetesSecurityCountWidget';
exports.QUERY_KEY_COUNT_WIDGET = QUERY_KEY_COUNT_WIDGET;
const QUERY_KEY_CONTAINER_NAME_WIDGET = 'kubernetesSecurityContainerNameWidget';
exports.QUERY_KEY_CONTAINER_NAME_WIDGET = QUERY_KEY_CONTAINER_NAME_WIDGET;
const QUERY_KEY_PROCESS_EVENTS = 'kubernetesSecurityProcessEvents';

// ECS fields
exports.QUERY_KEY_PROCESS_EVENTS = QUERY_KEY_PROCESS_EVENTS;
const ENTRY_LEADER_INTERACTIVE = 'process.entry_leader.interactive';
exports.ENTRY_LEADER_INTERACTIVE = ENTRY_LEADER_INTERACTIVE;
const ENTRY_LEADER_USER_ID = 'process.entry_leader.user.id';
exports.ENTRY_LEADER_USER_ID = ENTRY_LEADER_USER_ID;
const ENTRY_LEADER_ENTITY_ID = 'process.entry_leader.entity_id';
exports.ENTRY_LEADER_ENTITY_ID = ENTRY_LEADER_ENTITY_ID;
const ORCHESTRATOR_CLUSTER_ID = 'orchestrator.cluster.id';
exports.ORCHESTRATOR_CLUSTER_ID = ORCHESTRATOR_CLUSTER_ID;
const ORCHESTRATOR_CLUSTER_NAME = 'orchestrator.cluster.name';
exports.ORCHESTRATOR_CLUSTER_NAME = ORCHESTRATOR_CLUSTER_NAME;
const ORCHESTRATOR_NAMESPACE = 'orchestrator.namespace';
exports.ORCHESTRATOR_NAMESPACE = ORCHESTRATOR_NAMESPACE;
const CLOUD_INSTANCE_NAME = 'cloud.instance.name';
exports.CLOUD_INSTANCE_NAME = CLOUD_INSTANCE_NAME;
const ORCHESTRATOR_RESOURCE_ID = 'orchestrator.resource.name';
exports.ORCHESTRATOR_RESOURCE_ID = ORCHESTRATOR_RESOURCE_ID;
const CONTAINER_IMAGE_NAME = 'container.image.name';
exports.CONTAINER_IMAGE_NAME = CONTAINER_IMAGE_NAME;
const COUNT_WIDGET_KEY_CLUSTERS = 'CountClustersWidget';
exports.COUNT_WIDGET_KEY_CLUSTERS = COUNT_WIDGET_KEY_CLUSTERS;
const COUNT_WIDGET_KEY_NAMESPACE = 'CountNamespaceWidgets';
exports.COUNT_WIDGET_KEY_NAMESPACE = COUNT_WIDGET_KEY_NAMESPACE;
const COUNT_WIDGET_KEY_NODES = 'CountNodesWidgets';
exports.COUNT_WIDGET_KEY_NODES = COUNT_WIDGET_KEY_NODES;
const COUNT_WIDGET_KEY_PODS = 'CountPodsWidgets';
exports.COUNT_WIDGET_KEY_PODS = COUNT_WIDGET_KEY_PODS;
const COUNT_WIDGET_KEY_CONTAINER_IMAGES = 'CountContainerImagesWidgets';
exports.COUNT_WIDGET_KEY_CONTAINER_IMAGES = COUNT_WIDGET_KEY_CONTAINER_IMAGES;
const DEFAULT_QUERY = '{"bool":{"must":[],"filter":[],"should":[],"must_not":[]}}';
exports.DEFAULT_QUERY = DEFAULT_QUERY;
const DEFAULT_KUBERNETES_FILTER_QUERY = '{"bool":{"must":[],"filter":[{"bool": {"should": [{"exists": {"field": "orchestrator.cluster.id"}}]}}],"should":[],"must_not":[]}}';
exports.DEFAULT_KUBERNETES_FILTER_QUERY = DEFAULT_KUBERNETES_FILTER_QUERY;
const DEFAULT_FILTER_QUERY = '{"bool":{"must":[],"filter":[{"bool": {"should": [{"exists": {"field": "process.entry_leader.entity_id"}}]}}],"should":[],"must_not":[]}}';
exports.DEFAULT_FILTER_QUERY = DEFAULT_FILTER_QUERY;
const DEFAULT_FILTER = {
  bool: {
    should: [{
      exists: {
        field: ENTRY_LEADER_ENTITY_ID
      }
    }],
    minimum_should_match: 1
  }
};
exports.DEFAULT_FILTER = DEFAULT_FILTER;