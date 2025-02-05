"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metrics = exports.containerSnapshotMetricTypes = void 0;
var _cpu = require("./snapshot/cpu");
var _memory = require("./snapshot/memory");
var _rx = require("./snapshot/rx");
var _tx = require("./snapshot/tx");
var _container_overview = require("./tsvb/container_overview");
var _container_cpu_usage = require("./tsvb/container_cpu_usage");
var _container_cpu_kernel = require("./tsvb/container_cpu_kernel");
var _container_diskio_ops = require("./tsvb/container_diskio_ops");
var _container_disk_io_bytes = require("./tsvb/container_disk_io_bytes");
var _container_memory = require("./tsvb/container_memory");
var _container_network_traffic = require("./tsvb/container_network_traffic");
var _container_k8s_overview = require("./tsvb/container_k8s_overview");
var _container_k8s_cpu_usage = require("./tsvb/container_k8s_cpu_usage");
var _container_k8s_memory_usage = require("./tsvb/container_k8s_memory_usage");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const containerSnapshotMetrics = {
  cpu: _cpu.cpu,
  memory: _memory.memory,
  rx: _rx.rx,
  tx: _tx.tx
};
const containerSnapshotMetricTypes = Object.keys(containerSnapshotMetrics);
exports.containerSnapshotMetricTypes = containerSnapshotMetricTypes;
const metrics = {
  tsvb: {
    containerOverview: _container_overview.containerOverview,
    containerCpuUsage: _container_cpu_usage.containerCpuUsage,
    containerCpuKernel: _container_cpu_kernel.containerCpuKernel,
    containerDiskIOOps: _container_diskio_ops.containerDiskIOOps,
    containerDiskIOBytes: _container_disk_io_bytes.containerDiskIOBytes,
    containerNetworkTraffic: _container_network_traffic.containerNetworkTraffic,
    containerMemory: _container_memory.containerMemory,
    containerK8sCpuUsage: _container_k8s_cpu_usage.containerK8sCpuUsage,
    containerK8sOverview: _container_k8s_overview.containerK8sOverview,
    containerK8sMemoryUsage: _container_k8s_memory_usage.containerK8sMemoryUsage
  },
  snapshot: containerSnapshotMetrics,
  defaultSnapshot: 'cpu',
  defaultTimeRangeInSeconds: 3600 // 1 hour
};
exports.metrics = metrics;