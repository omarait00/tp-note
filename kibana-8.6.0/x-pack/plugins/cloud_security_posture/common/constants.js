"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STATUS_ROUTE_PATH = exports.STATS_ROUTE_PATH = exports.RULE_PASSED = exports.RULE_FAILED = exports.LOCAL_STORAGE_PAGE_SIZE_RULES_KEY = exports.LOCAL_STORAGE_PAGE_SIZE_RESOURCE_FINDINGS_KEY = exports.LOCAL_STORAGE_PAGE_SIZE_LATEST_FINDINGS_KEY = exports.LOCAL_STORAGE_PAGE_SIZE_FINDINGS_BY_RESOURCE_KEY = exports.LOCAL_STORAGE_PAGE_SIZE_BENCHMARK_KEY = exports.LATEST_FINDINGS_INDEX_TEMPLATE_NAME = exports.LATEST_FINDINGS_INDEX_PATTERN = exports.LATEST_FINDINGS_INDEX_DEFAULT_NS = exports.INTERNAL_FEATURE_FLAGS = exports.FINDINGS_INDEX_PATTERN = exports.FINDINGS_INDEX_NAME = exports.FINDINGS_INDEX_DEFAULT_NS = exports.ES_PIT_ROUTE_PATH = exports.CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE = exports.CSP_RULE_SAVED_OBJECT_TYPE = exports.CSP_LATEST_FINDINGS_INGEST_TIMESTAMP_PIPELINE = exports.CSP_LATEST_FINDINGS_DATA_VIEW = exports.CSP_INGEST_TIMESTAMP_PIPELINE = exports.CLOUD_SECURITY_POSTURE_PACKAGE_NAME = exports.CLOUDBEAT_VANILLA = exports.CLOUDBEAT_EKS = exports.BENCHMARK_SCORE_INDEX_TEMPLATE_NAME = exports.BENCHMARK_SCORE_INDEX_PATTERN = exports.BENCHMARK_SCORE_INDEX_DEFAULT_NS = exports.BENCHMARKS_ROUTE_PATH = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const STATUS_ROUTE_PATH = '/internal/cloud_security_posture/status';
exports.STATUS_ROUTE_PATH = STATUS_ROUTE_PATH;
const STATS_ROUTE_PATH = '/internal/cloud_security_posture/stats';
exports.STATS_ROUTE_PATH = STATS_ROUTE_PATH;
const BENCHMARKS_ROUTE_PATH = '/internal/cloud_security_posture/benchmarks';
exports.BENCHMARKS_ROUTE_PATH = BENCHMARKS_ROUTE_PATH;
const ES_PIT_ROUTE_PATH = '/internal/cloud_security_posture/es_pit';
exports.ES_PIT_ROUTE_PATH = ES_PIT_ROUTE_PATH;
const CLOUD_SECURITY_POSTURE_PACKAGE_NAME = 'cloud_security_posture';
exports.CLOUD_SECURITY_POSTURE_PACKAGE_NAME = CLOUD_SECURITY_POSTURE_PACKAGE_NAME;
const CSP_LATEST_FINDINGS_DATA_VIEW = 'logs-cloud_security_posture.findings_latest-*';
exports.CSP_LATEST_FINDINGS_DATA_VIEW = CSP_LATEST_FINDINGS_DATA_VIEW;
const FINDINGS_INDEX_NAME = 'logs-cloud_security_posture.findings';
exports.FINDINGS_INDEX_NAME = FINDINGS_INDEX_NAME;
const FINDINGS_INDEX_PATTERN = 'logs-cloud_security_posture.findings-default*';
exports.FINDINGS_INDEX_PATTERN = FINDINGS_INDEX_PATTERN;
const FINDINGS_INDEX_DEFAULT_NS = 'logs-cloud_security_posture.findings-default';
exports.FINDINGS_INDEX_DEFAULT_NS = FINDINGS_INDEX_DEFAULT_NS;
const LATEST_FINDINGS_INDEX_TEMPLATE_NAME = 'logs-cloud_security_posture.findings_latest';
exports.LATEST_FINDINGS_INDEX_TEMPLATE_NAME = LATEST_FINDINGS_INDEX_TEMPLATE_NAME;
const LATEST_FINDINGS_INDEX_PATTERN = 'logs-cloud_security_posture.findings_latest-*';
exports.LATEST_FINDINGS_INDEX_PATTERN = LATEST_FINDINGS_INDEX_PATTERN;
const LATEST_FINDINGS_INDEX_DEFAULT_NS = 'logs-cloud_security_posture.findings_latest-default';
exports.LATEST_FINDINGS_INDEX_DEFAULT_NS = LATEST_FINDINGS_INDEX_DEFAULT_NS;
const BENCHMARK_SCORE_INDEX_TEMPLATE_NAME = 'logs-cloud_security_posture.scores';
exports.BENCHMARK_SCORE_INDEX_TEMPLATE_NAME = BENCHMARK_SCORE_INDEX_TEMPLATE_NAME;
const BENCHMARK_SCORE_INDEX_PATTERN = 'logs-cloud_security_posture.scores-*';
exports.BENCHMARK_SCORE_INDEX_PATTERN = BENCHMARK_SCORE_INDEX_PATTERN;
const BENCHMARK_SCORE_INDEX_DEFAULT_NS = 'logs-cloud_security_posture.scores-default';
exports.BENCHMARK_SCORE_INDEX_DEFAULT_NS = BENCHMARK_SCORE_INDEX_DEFAULT_NS;
const CSP_INGEST_TIMESTAMP_PIPELINE = 'cloud_security_posture_add_ingest_timestamp_pipeline';
exports.CSP_INGEST_TIMESTAMP_PIPELINE = CSP_INGEST_TIMESTAMP_PIPELINE;
const CSP_LATEST_FINDINGS_INGEST_TIMESTAMP_PIPELINE = 'cloud_security_posture_latest_index_add_ingest_timestamp_pipeline';
exports.CSP_LATEST_FINDINGS_INGEST_TIMESTAMP_PIPELINE = CSP_LATEST_FINDINGS_INGEST_TIMESTAMP_PIPELINE;
const RULE_PASSED = `passed`;
exports.RULE_PASSED = RULE_PASSED;
const RULE_FAILED = `failed`;

// A mapping of in-development features to their status. These features should be hidden from users but can be easily
// activated via a simple code change in a single location.
exports.RULE_FAILED = RULE_FAILED;
const INTERNAL_FEATURE_FLAGS = {
  showManageRulesMock: false,
  showFindingFlyoutEvidence: false,
  showFindingsGroupBy: true
};
exports.INTERNAL_FEATURE_FLAGS = INTERNAL_FEATURE_FLAGS;
const CSP_RULE_SAVED_OBJECT_TYPE = 'csp_rule';
exports.CSP_RULE_SAVED_OBJECT_TYPE = CSP_RULE_SAVED_OBJECT_TYPE;
const CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE = 'csp-rule-template';
exports.CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE = CSP_RULE_TEMPLATE_SAVED_OBJECT_TYPE;
const CLOUDBEAT_VANILLA = 'cloudbeat/cis_k8s'; // Integration input
exports.CLOUDBEAT_VANILLA = CLOUDBEAT_VANILLA;
const CLOUDBEAT_EKS = 'cloudbeat/cis_eks'; // Integration input
exports.CLOUDBEAT_EKS = CLOUDBEAT_EKS;
const LOCAL_STORAGE_PAGE_SIZE_LATEST_FINDINGS_KEY = 'cloudPosture:latestFindings:pageSize';
exports.LOCAL_STORAGE_PAGE_SIZE_LATEST_FINDINGS_KEY = LOCAL_STORAGE_PAGE_SIZE_LATEST_FINDINGS_KEY;
const LOCAL_STORAGE_PAGE_SIZE_RESOURCE_FINDINGS_KEY = 'cloudPosture:resourceFindings:pageSize';
exports.LOCAL_STORAGE_PAGE_SIZE_RESOURCE_FINDINGS_KEY = LOCAL_STORAGE_PAGE_SIZE_RESOURCE_FINDINGS_KEY;
const LOCAL_STORAGE_PAGE_SIZE_FINDINGS_BY_RESOURCE_KEY = 'cloudPosture:findingsByResource:pageSize';
exports.LOCAL_STORAGE_PAGE_SIZE_FINDINGS_BY_RESOURCE_KEY = LOCAL_STORAGE_PAGE_SIZE_FINDINGS_BY_RESOURCE_KEY;
const LOCAL_STORAGE_PAGE_SIZE_BENCHMARK_KEY = 'cloudPosture:benchmark:pageSize';
exports.LOCAL_STORAGE_PAGE_SIZE_BENCHMARK_KEY = LOCAL_STORAGE_PAGE_SIZE_BENCHMARK_KEY;
const LOCAL_STORAGE_PAGE_SIZE_RULES_KEY = 'cloudPosture:rules:pageSize';
exports.LOCAL_STORAGE_PAGE_SIZE_RULES_KEY = LOCAL_STORAGE_PAGE_SIZE_RULES_KEY;