"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPGRADE_ASSISTANT_TELEMETRY = exports.SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = exports.DEPRECATION_WARNING_UPPER_LIMIT = exports.DEPRECATION_LOGS_SOURCE_ID = exports.DEPRECATION_LOGS_ORIGIN_FIELD = exports.DEPRECATION_LOGS_INDEX_PATTERN = exports.DEPRECATION_LOGS_INDEX = exports.DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = exports.CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = exports.CLOUD_SNAPSHOT_REPOSITORY = exports.CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = exports.APPS_WITH_DEPRECATION_LOGS = exports.API_BASE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const API_BASE_PATH = '/api/upgrade_assistant';

// Telemetry constants
exports.API_BASE_PATH = API_BASE_PATH;
const UPGRADE_ASSISTANT_TELEMETRY = 'upgrade-assistant-telemetry';

/**
 * This is the repository where Cloud stores its backup snapshots.
 */
exports.UPGRADE_ASSISTANT_TELEMETRY = UPGRADE_ASSISTANT_TELEMETRY;
const CLOUD_SNAPSHOT_REPOSITORY = 'found-snapshots';
exports.CLOUD_SNAPSHOT_REPOSITORY = CLOUD_SNAPSHOT_REPOSITORY;
const DEPRECATION_WARNING_UPPER_LIMIT = 999999;
exports.DEPRECATION_WARNING_UPPER_LIMIT = DEPRECATION_WARNING_UPPER_LIMIT;
const DEPRECATION_LOGS_SOURCE_ID = 'deprecation_logs';
exports.DEPRECATION_LOGS_SOURCE_ID = DEPRECATION_LOGS_SOURCE_ID;
const DEPRECATION_LOGS_INDEX = '.logs-deprecation.elasticsearch-default';
exports.DEPRECATION_LOGS_INDEX = DEPRECATION_LOGS_INDEX;
const DEPRECATION_LOGS_INDEX_PATTERN = '.logs-deprecation.elasticsearch-default';
exports.DEPRECATION_LOGS_INDEX_PATTERN = DEPRECATION_LOGS_INDEX_PATTERN;
const CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = 45000;
exports.CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS = CLUSTER_UPGRADE_STATUS_POLL_INTERVAL_MS;
const CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = 60000;
exports.CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS = CLOUD_BACKUP_STATUS_POLL_INTERVAL_MS;
const DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = 15000;
exports.DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS = DEPRECATION_LOGS_COUNT_POLL_INTERVAL_MS;
const SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = 15000;

/**
 * List of Elastic apps that potentially can generate deprecation logs.
 * We want to filter those out for our users so they only see deprecation logs
 * that _they_ are generating.
 */
exports.SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS = SYSTEM_INDICES_MIGRATION_POLL_INTERVAL_MS;
const APPS_WITH_DEPRECATION_LOGS = ['kibana', 'cloud', 'logstash', 'beats', 'fleet', 'ml', 'security', 'observability', 'enterprise-search'];

// The field that will indicate which elastic product generated the deprecation log
exports.APPS_WITH_DEPRECATION_LOGS = APPS_WITH_DEPRECATION_LOGS;
const DEPRECATION_LOGS_ORIGIN_FIELD = 'elasticsearch.elastic_product_origin';
exports.DEPRECATION_LOGS_ORIGIN_FIELD = DEPRECATION_LOGS_ORIGIN_FIELD;