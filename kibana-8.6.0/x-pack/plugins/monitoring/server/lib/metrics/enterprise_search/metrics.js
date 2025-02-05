"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = void 0;
var _i18n = require("@kbn/i18n");
var _classes = require("./classes");
var _formatting = require("../../../../common/formatting");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const perSecondUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.perSecondUnitLabel', {
  defaultMessage: '/s'
});
const msTimeUnitLabel = _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.msTimeUnitLabel', {
  defaultMessage: 'ms'
});
const metrics = {
  app_search_total_engines: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.product_usage.app_search.total_engines',
    metricAgg: 'avg',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.app_search_engines', {
      defaultMessage: 'App Search Engines'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.app_search_engines.description', {
      defaultMessage: 'Current number of App Search engines within the Enterprise Search deployment.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  workplace_search_total_org_sources: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.product_usage.workplace_search.total_org_sources',
    metricAgg: 'avg',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.workplace_search_content_sources', {
      defaultMessage: 'Workpace Search Content Sources'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.workplace_search_org_sources', {
      defaultMessage: 'Org Sources'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.workplace_search_org_sources.description', {
      defaultMessage: 'Current number of Workplace Search org-wide content sources within the Enterprise Search deployment.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  workplace_search_total_private_sources: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.product_usage.workplace_search.total_private_sources',
    metricAgg: 'avg',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.workplace_search_private_sources', {
      defaultMessage: 'Private Sources'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.workplace_search_private_sources.description', {
      defaultMessage: 'Current number of Workplace Search private content sources within the Enterprise Search deployment.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_heap_total: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.memory_usage.heap_max.bytes',
    metricAgg: 'max',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.jvm_heap_usage', {
      defaultMessage: 'JVM Heap Usage'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.heap_total', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.enterpriseSearch.heap_total.description', {
      defaultMessage: 'Maximum amount of JVM heap memory available to the application.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'bytes'
  }),
  enterprise_search_heap_committed: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.memory_usage.heap_committed.bytes',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.heap_committed', {
      defaultMessage: 'Committed'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.heap_committed.description', {
      defaultMessage: 'The amount of memory JVM has allocated from the OS and is available to the application.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'bytes'
  }),
  enterprise_search_heap_used: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.memory_usage.heap_used.bytes',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.heap_used', {
      defaultMessage: 'Used'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.heap_used.description', {
      defaultMessage: 'Current amount of JVM Heam memory used by the application.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'bytes'
  }),
  enterprise_search_gc_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.gc.collection_count',
    derivative: true,
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.gc_rate', {
      defaultMessage: 'JVM GC Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.gc_rate.description', {
      defaultMessage: 'The rate of JVM garbage collector invocations across the fleet.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_gc_time: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.gc.collection_time.ms',
    derivative: true,
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.gc_time', {
      defaultMessage: 'Time spent on JVM garbage collection'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.gc_time.description', {
      defaultMessage: 'Time spent performing JVM garbage collections.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: msTimeUnitLabel
  }),
  enterprise_search_threads_current: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.threads.current',
    metricAgg: 'max',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads', {
      defaultMessage: 'JVM Threads'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.current', {
      defaultMessage: 'Active Threads'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.current.description', {
      defaultMessage: 'Currently running JVM threads used by the application.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_daemon_threads_current: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.threads.daemon',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.daemon', {
      defaultMessage: 'Daemon Threads'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.daemon.description', {
      defaultMessage: 'Currently running JVM daemon threads used by the application.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_jvm_finalizer_queue: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.memory_usage.object_pending_finalization_count',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.finalizer_objects', {
      defaultMessage: 'JVM Objects Pending Finalization'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.finalizer_objects.description', {
      defaultMessage: 'Number of objects within the JVM heap waiting for the finalizer thread.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_threads_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.jvm.threads.total_started',
    metricAgg: 'max',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.rate', {
      defaultMessage: 'Thread Creation Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.threads.rate.description', {
      defaultMessage: 'Currently running JVM threads used by the application.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: perSecondUnitLabel
  }),
  crawler_workers_total: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.crawler.workers.pool_size',
    metricAgg: 'max',
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.crawler_workers', {
      defaultMessage: 'Crawler Workers'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.total_crawler_workers', {
      defaultMessage: 'Total'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.total_crawler_workers.description', {
      defaultMessage: 'The number of crawler workers configured across all instances of App Search.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  crawler_workers_active: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.health.crawler.workers.active',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.active_crawler_workers', {
      defaultMessage: 'Active'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.active_crawler_workers.description', {
      defaultMessage: 'Currently active App Search crawler workers.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_http_connections_current: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.connections.current',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_connections.current', {
      defaultMessage: 'Open HTTP Connections'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_connections.current.description', {
      defaultMessage: 'Currently open incoming HTTP connections across all instances.'
    }),
    format: _formatting.SMALL_FLOAT,
    units: ''
  }),
  enterprise_search_http_connections_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.connections.total',
    metricAgg: 'max',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_connections.rate', {
      defaultMessage: 'HTTP Connections Rate'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.current_http_connections.description', {
      defaultMessage: 'The rate of incoming HTTP connections across all instances.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_bytes_received_total: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.network.received.bytes',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_received.total', {
      defaultMessage: 'HTTP Bytes Received'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_received.total.description', {
      defaultMessage: 'Total number of bytes received by all instances in the deployment.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'bytes'
  }),
  enterprise_search_http_bytes_received_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.network.received.bytes',
    metricAgg: 'max',
    derivative: true,
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_traffic', {
      defaultMessage: 'HTTP Traffic'
    }),
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_received.rate', {
      defaultMessage: 'Received'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_received.rate.description', {
      defaultMessage: 'Incoming HTTP traffic rate across all instances in the deployment.'
    }),
    format: _formatting.LARGE_BYTES,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_bytes_sent_total: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.network.sent.bytes',
    metricAgg: 'max',
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_sent.total', {
      defaultMessage: 'HTTP Bytes Sent'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_sent.total.description', {
      defaultMessage: 'Total number of bytes sent by all instances in the deployment.'
    }),
    format: _formatting.LARGE_BYTES,
    units: 'bytes'
  }),
  enterprise_search_http_bytes_sent_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.network.sent.bytes',
    metricAgg: 'max',
    derivative: true,
    label: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_sent.rate', {
      defaultMessage: 'Sent'
    }),
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_bytes_sent.rate.description', {
      defaultMessage: 'Outgoing HTTP traffic across all instances in the deployment.'
    }),
    format: _formatting.LARGE_BYTES,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_1xx_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.responses.1xx',
    metricAgg: 'max',
    derivative: true,
    title: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_response_rate', {
      defaultMessage: 'HTTP Responses'
    }),
    label: '1xx',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_1xx.rate.description', {
      defaultMessage: 'Outgoing HTTP 1xx responses across all instances in the deployment.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_2xx_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.responses.2xx',
    metricAgg: 'max',
    derivative: true,
    label: '2xx',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_2xx.rate.description', {
      defaultMessage: 'Outgoing HTTP 2xx responses across all instances in the deployment.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_3xx_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.responses.3xx',
    metricAgg: 'max',
    derivative: true,
    label: '3xx',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_3xx.rate.description', {
      defaultMessage: 'Outgoing HTTP 3xx responses across all instances in the deployment.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_4xx_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.responses.4xx',
    metricAgg: 'max',
    derivative: true,
    label: '4xx',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_4xx.rate.description', {
      defaultMessage: 'Outgoing HTTP 4xx responses across all instances in the deployment.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  }),
  enterprise_search_http_5xx_rate: new _classes.EnterpriseSearchMetric({
    field: 'enterprisesearch.stats.http.responses.5xx',
    metricAgg: 'max',
    derivative: true,
    label: '5xx',
    description: _i18n.i18n.translate('xpack.monitoring.metrics.entSearch.http_5xx.rate.description', {
      defaultMessage: 'Outgoing HTTP 5xx responses across all instances in the deployment.'
    }),
    format: _formatting.LARGE_FLOAT,
    units: perSecondUnitLabel
  })
};
exports.metrics = metrics;