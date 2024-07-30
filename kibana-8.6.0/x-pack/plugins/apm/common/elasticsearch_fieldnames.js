"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SPAN_TYPE = exports.SPAN_SUBTYPE = exports.SPAN_SELF_TIME_SUM = exports.SPAN_NAME = exports.SPAN_LINKS_TRACE_ID = exports.SPAN_LINKS_SPAN_ID = exports.SPAN_LINKS = exports.SPAN_ID = exports.SPAN_DURATION = exports.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM = exports.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT = exports.SPAN_DESTINATION_SERVICE_RESOURCE = exports.SPAN_ACTION = exports.SERVICE_VERSION = exports.SERVICE_RUNTIME_VERSION = exports.SERVICE_RUNTIME_NAME = exports.SERVICE_NODE_NAME = exports.SERVICE_NAME = exports.SERVICE_LANGUAGE_VERSION = exports.SERVICE_LANGUAGE_NAME = exports.SERVICE_FRAMEWORK_VERSION = exports.SERVICE_FRAMEWORK_NAME = exports.SERVICE_ENVIRONMENT = exports.SERVICE = exports.PROCESSOR_EVENT = exports.PARENT_ID = exports.OBSERVER_LISTENING = exports.OBSERVER_HOSTNAME = exports.NETWORK_CONNECTION_TYPE = exports.METRIC_SYSTEM_TOTAL_MEMORY = exports.METRIC_SYSTEM_FREE_MEMORY = exports.METRIC_SYSTEM_CPU_PERCENT = exports.METRIC_PROCESS_CPU_PERCENT = exports.METRIC_JAVA_THREAD_COUNT = exports.METRIC_JAVA_NON_HEAP_MEMORY_USED = exports.METRIC_JAVA_NON_HEAP_MEMORY_MAX = exports.METRIC_JAVA_NON_HEAP_MEMORY_COMMITTED = exports.METRIC_JAVA_HEAP_MEMORY_USED = exports.METRIC_JAVA_HEAP_MEMORY_MAX = exports.METRIC_JAVA_HEAP_MEMORY_COMMITTED = exports.METRIC_JAVA_GC_TIME = exports.METRIC_JAVA_GC_COUNT = exports.METRIC_CGROUP_MEMORY_USAGE_BYTES = exports.METRIC_CGROUP_MEMORY_LIMIT_BYTES = exports.METRICSET_NAME = exports.LABEL_NAME = exports.KUBERNETES_REPLICASET_NAME = exports.KUBERNETES_REPLICASET = exports.KUBERNETES_POD_UID = exports.KUBERNETES_POD_NAME = exports.KUBERNETES_NAMESPACE_NAME = exports.KUBERNETES_NAMESPACE = exports.KUBERNETES_DEPLOYMENT_NAME = exports.KUBERNETES_DEPLOYMENT = exports.KUBERNETES_CONTAINER_NAME = exports.KUBERNETES = exports.INDEX = exports.HTTP_RESPONSE_STATUS_CODE = exports.HTTP_REQUEST_METHOD = exports.HOST_OS_VERSION = exports.HOST_OS_PLATFORM = exports.HOST_NAME = exports.HOST_HOSTNAME = exports.HOST_ARCHITECTURE = exports.HOST = exports.FAAS_TRIGGER_TYPE = exports.FAAS_NAME = exports.FAAS_ID = exports.FAAS_DURATION = exports.FAAS_COLDSTART_DURATION = exports.FAAS_COLDSTART = exports.FAAS_BILLED_DURATION = exports.EVENT_OUTCOME = exports.ERROR_PAGE_URL = exports.ERROR_LOG_MESSAGE = exports.ERROR_LOG_LEVEL = exports.ERROR_ID = exports.ERROR_GROUP_ID = exports.ERROR_EXC_TYPE = exports.ERROR_EXC_MESSAGE = exports.ERROR_EXC_HANDLED = exports.ERROR_CULPRIT = exports.DEVICE_MODEL_NAME = exports.DESTINATION_ADDRESS = exports.CONTAINER_IMAGE = exports.CONTAINER_ID = exports.CONTAINER = exports.CLOUD_SERVICE_NAME = exports.CLOUD_REGION = exports.CLOUD_PROVIDER = exports.CLOUD_MACHINE_TYPE = exports.CLOUD_INSTANCE_NAME = exports.CLOUD_INSTANCE_ID = exports.CLOUD_AVAILABILITY_ZONE = exports.CLOUD_ACCOUNT_ID = exports.CLOUD = exports.CLIENT_GEO_COUNTRY_ISO_CODE = exports.AGENT_VERSION = exports.AGENT_NAME = exports.AGENT = void 0;
exports.USER_ID = exports.USER_AGENT_OS = exports.USER_AGENT_ORIGINAL = exports.USER_AGENT_NAME = exports.USER_AGENT_DEVICE = exports.URL_FULL = exports.TRANSACTION_URL = exports.TRANSACTION_TYPE = exports.TRANSACTION_SUCCESS_COUNT = exports.TRANSACTION_SAMPLED = exports.TRANSACTION_ROOT = exports.TRANSACTION_RESULT = exports.TRANSACTION_PAGE_URL = exports.TRANSACTION_NAME = exports.TRANSACTION_ID = exports.TRANSACTION_FAILURE_COUNT = exports.TRANSACTION_DURATION_SUMMARY = exports.TRANSACTION_DURATION_HISTOGRAM = exports.TRANSACTION_DURATION = exports.TRACE_ID = exports.TIER = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const CLOUD = 'cloud';
exports.CLOUD = CLOUD;
const CLOUD_AVAILABILITY_ZONE = 'cloud.availability_zone';
exports.CLOUD_AVAILABILITY_ZONE = CLOUD_AVAILABILITY_ZONE;
const CLOUD_PROVIDER = 'cloud.provider';
exports.CLOUD_PROVIDER = CLOUD_PROVIDER;
const CLOUD_REGION = 'cloud.region';
exports.CLOUD_REGION = CLOUD_REGION;
const CLOUD_MACHINE_TYPE = 'cloud.machine.type';
exports.CLOUD_MACHINE_TYPE = CLOUD_MACHINE_TYPE;
const CLOUD_ACCOUNT_ID = 'cloud.account.id';
exports.CLOUD_ACCOUNT_ID = CLOUD_ACCOUNT_ID;
const CLOUD_INSTANCE_ID = 'cloud.instance.id';
exports.CLOUD_INSTANCE_ID = CLOUD_INSTANCE_ID;
const CLOUD_INSTANCE_NAME = 'cloud.instance.name';
exports.CLOUD_INSTANCE_NAME = CLOUD_INSTANCE_NAME;
const CLOUD_SERVICE_NAME = 'cloud.service.name';
exports.CLOUD_SERVICE_NAME = CLOUD_SERVICE_NAME;
const SERVICE = 'service';
exports.SERVICE = SERVICE;
const SERVICE_NAME = 'service.name';
exports.SERVICE_NAME = SERVICE_NAME;
const SERVICE_ENVIRONMENT = 'service.environment';
exports.SERVICE_ENVIRONMENT = SERVICE_ENVIRONMENT;
const SERVICE_FRAMEWORK_NAME = 'service.framework.name';
exports.SERVICE_FRAMEWORK_NAME = SERVICE_FRAMEWORK_NAME;
const SERVICE_FRAMEWORK_VERSION = 'service.framework.version';
exports.SERVICE_FRAMEWORK_VERSION = SERVICE_FRAMEWORK_VERSION;
const SERVICE_LANGUAGE_NAME = 'service.language.name';
exports.SERVICE_LANGUAGE_NAME = SERVICE_LANGUAGE_NAME;
const SERVICE_LANGUAGE_VERSION = 'service.language.version';
exports.SERVICE_LANGUAGE_VERSION = SERVICE_LANGUAGE_VERSION;
const SERVICE_RUNTIME_NAME = 'service.runtime.name';
exports.SERVICE_RUNTIME_NAME = SERVICE_RUNTIME_NAME;
const SERVICE_RUNTIME_VERSION = 'service.runtime.version';
exports.SERVICE_RUNTIME_VERSION = SERVICE_RUNTIME_VERSION;
const SERVICE_NODE_NAME = 'service.node.name';
exports.SERVICE_NODE_NAME = SERVICE_NODE_NAME;
const SERVICE_VERSION = 'service.version';
exports.SERVICE_VERSION = SERVICE_VERSION;
const AGENT = 'agent';
exports.AGENT = AGENT;
const AGENT_NAME = 'agent.name';
exports.AGENT_NAME = AGENT_NAME;
const AGENT_VERSION = 'agent.version';
exports.AGENT_VERSION = AGENT_VERSION;
const URL_FULL = 'url.full';
exports.URL_FULL = URL_FULL;
const HTTP_REQUEST_METHOD = 'http.request.method';
exports.HTTP_REQUEST_METHOD = HTTP_REQUEST_METHOD;
const HTTP_RESPONSE_STATUS_CODE = 'http.response.status_code';
exports.HTTP_RESPONSE_STATUS_CODE = HTTP_RESPONSE_STATUS_CODE;
const USER_ID = 'user.id';
exports.USER_ID = USER_ID;
const USER_AGENT_ORIGINAL = 'user_agent.original';
exports.USER_AGENT_ORIGINAL = USER_AGENT_ORIGINAL;
const USER_AGENT_NAME = 'user_agent.name';
exports.USER_AGENT_NAME = USER_AGENT_NAME;
const DESTINATION_ADDRESS = 'destination.address';
exports.DESTINATION_ADDRESS = DESTINATION_ADDRESS;
const OBSERVER_HOSTNAME = 'observer.hostname';
exports.OBSERVER_HOSTNAME = OBSERVER_HOSTNAME;
const OBSERVER_LISTENING = 'observer.listening';
exports.OBSERVER_LISTENING = OBSERVER_LISTENING;
const PROCESSOR_EVENT = 'processor.event';
exports.PROCESSOR_EVENT = PROCESSOR_EVENT;
const TRANSACTION_DURATION = 'transaction.duration.us';
exports.TRANSACTION_DURATION = TRANSACTION_DURATION;
const TRANSACTION_DURATION_HISTOGRAM = 'transaction.duration.histogram';
exports.TRANSACTION_DURATION_HISTOGRAM = TRANSACTION_DURATION_HISTOGRAM;
const TRANSACTION_DURATION_SUMMARY = 'transaction.duration.summary';
exports.TRANSACTION_DURATION_SUMMARY = TRANSACTION_DURATION_SUMMARY;
const TRANSACTION_TYPE = 'transaction.type';
exports.TRANSACTION_TYPE = TRANSACTION_TYPE;
const TRANSACTION_RESULT = 'transaction.result';
exports.TRANSACTION_RESULT = TRANSACTION_RESULT;
const TRANSACTION_NAME = 'transaction.name';
exports.TRANSACTION_NAME = TRANSACTION_NAME;
const TRANSACTION_ID = 'transaction.id';
exports.TRANSACTION_ID = TRANSACTION_ID;
const TRANSACTION_SAMPLED = 'transaction.sampled';
exports.TRANSACTION_SAMPLED = TRANSACTION_SAMPLED;
const TRANSACTION_PAGE_URL = 'transaction.page.url';
exports.TRANSACTION_PAGE_URL = TRANSACTION_PAGE_URL;
const TRANSACTION_FAILURE_COUNT = 'transaction.failure_count';
exports.TRANSACTION_FAILURE_COUNT = TRANSACTION_FAILURE_COUNT;
const TRANSACTION_SUCCESS_COUNT = 'transaction.success_count';
// for transaction metrics
exports.TRANSACTION_SUCCESS_COUNT = TRANSACTION_SUCCESS_COUNT;
const TRANSACTION_ROOT = 'transaction.root';
exports.TRANSACTION_ROOT = TRANSACTION_ROOT;
const EVENT_OUTCOME = 'event.outcome';
exports.EVENT_OUTCOME = EVENT_OUTCOME;
const TRACE_ID = 'trace.id';
exports.TRACE_ID = TRACE_ID;
const SPAN_DURATION = 'span.duration.us';
exports.SPAN_DURATION = SPAN_DURATION;
const SPAN_TYPE = 'span.type';
exports.SPAN_TYPE = SPAN_TYPE;
const SPAN_SUBTYPE = 'span.subtype';
exports.SPAN_SUBTYPE = SPAN_SUBTYPE;
const SPAN_SELF_TIME_SUM = 'span.self_time.sum.us';
exports.SPAN_SELF_TIME_SUM = SPAN_SELF_TIME_SUM;
const SPAN_ACTION = 'span.action';
exports.SPAN_ACTION = SPAN_ACTION;
const SPAN_NAME = 'span.name';
exports.SPAN_NAME = SPAN_NAME;
const SPAN_ID = 'span.id';
exports.SPAN_ID = SPAN_ID;
const SPAN_DESTINATION_SERVICE_RESOURCE = 'span.destination.service.resource';
exports.SPAN_DESTINATION_SERVICE_RESOURCE = SPAN_DESTINATION_SERVICE_RESOURCE;
const SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT = 'span.destination.service.response_time.count';
exports.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT = SPAN_DESTINATION_SERVICE_RESPONSE_TIME_COUNT;
const SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM = 'span.destination.service.response_time.sum.us';
exports.SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM = SPAN_DESTINATION_SERVICE_RESPONSE_TIME_SUM;
const SPAN_LINKS = 'span.links';
exports.SPAN_LINKS = SPAN_LINKS;
const SPAN_LINKS_TRACE_ID = 'span.links.trace.id';
exports.SPAN_LINKS_TRACE_ID = SPAN_LINKS_TRACE_ID;
const SPAN_LINKS_SPAN_ID = 'span.links.span.id';

// Parent ID for a transaction or span
exports.SPAN_LINKS_SPAN_ID = SPAN_LINKS_SPAN_ID;
const PARENT_ID = 'parent.id';
exports.PARENT_ID = PARENT_ID;
const ERROR_ID = 'error.id';
exports.ERROR_ID = ERROR_ID;
const ERROR_GROUP_ID = 'error.grouping_key';
exports.ERROR_GROUP_ID = ERROR_GROUP_ID;
const ERROR_CULPRIT = 'error.culprit';
exports.ERROR_CULPRIT = ERROR_CULPRIT;
const ERROR_LOG_LEVEL = 'error.log.level';
exports.ERROR_LOG_LEVEL = ERROR_LOG_LEVEL;
const ERROR_LOG_MESSAGE = 'error.log.message';
exports.ERROR_LOG_MESSAGE = ERROR_LOG_MESSAGE;
const ERROR_EXC_MESSAGE = 'error.exception.message'; // only to be used in es queries, since error.exception is now an array
exports.ERROR_EXC_MESSAGE = ERROR_EXC_MESSAGE;
const ERROR_EXC_HANDLED = 'error.exception.handled'; // only to be used in es queries, since error.exception is now an array
exports.ERROR_EXC_HANDLED = ERROR_EXC_HANDLED;
const ERROR_EXC_TYPE = 'error.exception.type';
exports.ERROR_EXC_TYPE = ERROR_EXC_TYPE;
const ERROR_PAGE_URL = 'error.page.url';

// METRICS
exports.ERROR_PAGE_URL = ERROR_PAGE_URL;
const METRIC_SYSTEM_FREE_MEMORY = 'system.memory.actual.free';
exports.METRIC_SYSTEM_FREE_MEMORY = METRIC_SYSTEM_FREE_MEMORY;
const METRIC_SYSTEM_TOTAL_MEMORY = 'system.memory.total';
exports.METRIC_SYSTEM_TOTAL_MEMORY = METRIC_SYSTEM_TOTAL_MEMORY;
const METRIC_SYSTEM_CPU_PERCENT = 'system.cpu.total.norm.pct';
exports.METRIC_SYSTEM_CPU_PERCENT = METRIC_SYSTEM_CPU_PERCENT;
const METRIC_PROCESS_CPU_PERCENT = 'system.process.cpu.total.norm.pct';
exports.METRIC_PROCESS_CPU_PERCENT = METRIC_PROCESS_CPU_PERCENT;
const METRIC_CGROUP_MEMORY_LIMIT_BYTES = 'system.process.cgroup.memory.mem.limit.bytes';
exports.METRIC_CGROUP_MEMORY_LIMIT_BYTES = METRIC_CGROUP_MEMORY_LIMIT_BYTES;
const METRIC_CGROUP_MEMORY_USAGE_BYTES = 'system.process.cgroup.memory.mem.usage.bytes';
exports.METRIC_CGROUP_MEMORY_USAGE_BYTES = METRIC_CGROUP_MEMORY_USAGE_BYTES;
const METRIC_JAVA_HEAP_MEMORY_MAX = 'jvm.memory.heap.max';
exports.METRIC_JAVA_HEAP_MEMORY_MAX = METRIC_JAVA_HEAP_MEMORY_MAX;
const METRIC_JAVA_HEAP_MEMORY_COMMITTED = 'jvm.memory.heap.committed';
exports.METRIC_JAVA_HEAP_MEMORY_COMMITTED = METRIC_JAVA_HEAP_MEMORY_COMMITTED;
const METRIC_JAVA_HEAP_MEMORY_USED = 'jvm.memory.heap.used';
exports.METRIC_JAVA_HEAP_MEMORY_USED = METRIC_JAVA_HEAP_MEMORY_USED;
const METRIC_JAVA_NON_HEAP_MEMORY_MAX = 'jvm.memory.non_heap.max';
exports.METRIC_JAVA_NON_HEAP_MEMORY_MAX = METRIC_JAVA_NON_HEAP_MEMORY_MAX;
const METRIC_JAVA_NON_HEAP_MEMORY_COMMITTED = 'jvm.memory.non_heap.committed';
exports.METRIC_JAVA_NON_HEAP_MEMORY_COMMITTED = METRIC_JAVA_NON_HEAP_MEMORY_COMMITTED;
const METRIC_JAVA_NON_HEAP_MEMORY_USED = 'jvm.memory.non_heap.used';
exports.METRIC_JAVA_NON_HEAP_MEMORY_USED = METRIC_JAVA_NON_HEAP_MEMORY_USED;
const METRIC_JAVA_THREAD_COUNT = 'jvm.thread.count';
exports.METRIC_JAVA_THREAD_COUNT = METRIC_JAVA_THREAD_COUNT;
const METRIC_JAVA_GC_COUNT = 'jvm.gc.count';
exports.METRIC_JAVA_GC_COUNT = METRIC_JAVA_GC_COUNT;
const METRIC_JAVA_GC_TIME = 'jvm.gc.time';
exports.METRIC_JAVA_GC_TIME = METRIC_JAVA_GC_TIME;
const METRICSET_NAME = 'metricset.name';
exports.METRICSET_NAME = METRICSET_NAME;
const LABEL_NAME = 'labels.name';
exports.LABEL_NAME = LABEL_NAME;
const HOST = 'host';
exports.HOST = HOST;
const HOST_HOSTNAME = 'host.hostname'; // Do not use. Please use `HOST_NAME` instead.
exports.HOST_HOSTNAME = HOST_HOSTNAME;
const HOST_NAME = 'host.name';
exports.HOST_NAME = HOST_NAME;
const HOST_OS_PLATFORM = 'host.os.platform';
exports.HOST_OS_PLATFORM = HOST_OS_PLATFORM;
const HOST_ARCHITECTURE = 'host.architecture';
exports.HOST_ARCHITECTURE = HOST_ARCHITECTURE;
const HOST_OS_VERSION = 'host.os.version';
exports.HOST_OS_VERSION = HOST_OS_VERSION;
const CONTAINER_ID = 'container.id';
exports.CONTAINER_ID = CONTAINER_ID;
const CONTAINER = 'container';
exports.CONTAINER = CONTAINER;
const CONTAINER_IMAGE = 'container.image.name';

// Kubernetes
exports.CONTAINER_IMAGE = CONTAINER_IMAGE;
const KUBERNETES = 'kubernetes';
exports.KUBERNETES = KUBERNETES;
const KUBERNETES_CONTAINER_NAME = 'kubernetes.container.name';
exports.KUBERNETES_CONTAINER_NAME = KUBERNETES_CONTAINER_NAME;
const KUBERNETES_DEPLOYMENT = 'kubernetes.deployment';
exports.KUBERNETES_DEPLOYMENT = KUBERNETES_DEPLOYMENT;
const KUBERNETES_DEPLOYMENT_NAME = 'kubernetes.deployment.name';
exports.KUBERNETES_DEPLOYMENT_NAME = KUBERNETES_DEPLOYMENT_NAME;
const KUBERNETES_NAMESPACE_NAME = 'kubernetes.namespace.name';
exports.KUBERNETES_NAMESPACE_NAME = KUBERNETES_NAMESPACE_NAME;
const KUBERNETES_NAMESPACE = 'kubernetes.namespace';
exports.KUBERNETES_NAMESPACE = KUBERNETES_NAMESPACE;
const KUBERNETES_POD_NAME = 'kubernetes.pod.name';
exports.KUBERNETES_POD_NAME = KUBERNETES_POD_NAME;
const KUBERNETES_POD_UID = 'kubernetes.pod.uid';
exports.KUBERNETES_POD_UID = KUBERNETES_POD_UID;
const KUBERNETES_REPLICASET = 'kubernetes.replicaset';
exports.KUBERNETES_REPLICASET = KUBERNETES_REPLICASET;
const KUBERNETES_REPLICASET_NAME = 'kubernetes.replicaset.name';
exports.KUBERNETES_REPLICASET_NAME = KUBERNETES_REPLICASET_NAME;
const CLIENT_GEO_COUNTRY_ISO_CODE = 'client.geo.country_iso_code';

// RUM Labels
exports.CLIENT_GEO_COUNTRY_ISO_CODE = CLIENT_GEO_COUNTRY_ISO_CODE;
const TRANSACTION_URL = 'url.full';
exports.TRANSACTION_URL = TRANSACTION_URL;
const USER_AGENT_DEVICE = 'user_agent.device.name';
exports.USER_AGENT_DEVICE = USER_AGENT_DEVICE;
const USER_AGENT_OS = 'user_agent.os.name';
exports.USER_AGENT_OS = USER_AGENT_OS;
const FAAS_ID = 'faas.id';
exports.FAAS_ID = FAAS_ID;
const FAAS_NAME = 'faas.name';
exports.FAAS_NAME = FAAS_NAME;
const FAAS_COLDSTART = 'faas.coldstart';
exports.FAAS_COLDSTART = FAAS_COLDSTART;
const FAAS_TRIGGER_TYPE = 'faas.trigger.type';
exports.FAAS_TRIGGER_TYPE = FAAS_TRIGGER_TYPE;
const FAAS_DURATION = 'faas.duration';
exports.FAAS_DURATION = FAAS_DURATION;
const FAAS_COLDSTART_DURATION = 'faas.coldstart_duration';
exports.FAAS_COLDSTART_DURATION = FAAS_COLDSTART_DURATION;
const FAAS_BILLED_DURATION = 'faas.billed_duration';

// Metadata
exports.FAAS_BILLED_DURATION = FAAS_BILLED_DURATION;
const TIER = '_tier';
exports.TIER = TIER;
const INDEX = '_index';

// Mobile
exports.INDEX = INDEX;
const NETWORK_CONNECTION_TYPE = 'network.connection.type';
exports.NETWORK_CONNECTION_TYPE = NETWORK_CONNECTION_TYPE;
const DEVICE_MODEL_NAME = 'device.model.name';
exports.DEVICE_MODEL_NAME = DEVICE_MODEL_NAME;