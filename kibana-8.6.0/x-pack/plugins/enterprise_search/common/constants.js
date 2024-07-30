"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WORKPLACE_SEARCH_URL = exports.WORKPLACE_SEARCH_PLUGIN = exports.SEARCH_EXPERIENCES_PLUGIN = exports.READ_ONLY_MODE_HEADER = exports.LICENSED_SUPPORT_URL = exports.JSON_HEADER = exports.ERROR_CONNECTING_HEADER = exports.ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = exports.ENTERPRISE_SEARCH_OVERVIEW_PLUGIN = exports.ENTERPRISE_SEARCH_KIBANA_COOKIE = exports.ENTERPRISE_SEARCH_ELASTICSEARCH_URL = exports.ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT = exports.ENTERPRISE_SEARCH_CONTENT_PLUGIN = exports.ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE = exports.ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = exports.ENTERPRISE_SEARCH_ANALYTICS_LOGS_SOURCE_ID = exports.ELASTICSEARCH_PLUGIN = exports.DEFAULT_PIPELINE_VALUES = exports.DEFAULT_PIPELINE_NAME = exports.APP_SEARCH_URL = exports.APP_SEARCH_PLUGIN = exports.ANALYTICS_PLUGIN = void 0;
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ENTERPRISE_SEARCH_OVERVIEW_PLUGIN = {
  ID: 'enterpriseSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.overview.productName', {
    defaultMessage: 'Enterprise Search'
  }),
  NAV_TITLE: _i18n.i18n.translate('xpack.enterpriseSearch.overview.navTitle', {
    defaultMessage: 'Overview'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.overview.description', {
    defaultMessage: 'Create search experiences with a refined set of APIs and tools.'
  }),
  URL: '/app/enterprise_search/overview',
  LOGO: 'logoEnterpriseSearch'
};
exports.ENTERPRISE_SEARCH_OVERVIEW_PLUGIN = ENTERPRISE_SEARCH_OVERVIEW_PLUGIN;
const ENTERPRISE_SEARCH_CONTENT_PLUGIN = {
  ID: 'enterpriseSearchContent',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.content.productName', {
    defaultMessage: 'Enterprise Search'
  }),
  NAV_TITLE: _i18n.i18n.translate('xpack.enterpriseSearch.content.navTitle', {
    defaultMessage: 'Content'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.content.description', {
    defaultMessage: 'Enterprise search offers a number of ways to easily make your data searchable. Choose from the web crawler, Elasticsearch indices, API, direct uploads, or thrid party connectors.' // TODO: Make sure this content is correct.
  }),

  URL: '/app/enterprise_search/content',
  LOGO: 'logoEnterpriseSearch',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/'
};
exports.ENTERPRISE_SEARCH_CONTENT_PLUGIN = ENTERPRISE_SEARCH_CONTENT_PLUGIN;
const ANALYTICS_PLUGIN = {
  ID: 'enterpriseSearchAnalytics',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.analytics.productName', {
    defaultMessage: 'Analytics'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.analytics.productDescription', {
    defaultMessage: 'Dashboards and tools for visualizing end-user behavior and measuring the performance of your search applications.'
  }),
  CARD_DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.analytics.productCardDescription', {
    defaultMessage: 'Dashboards and tools for visualizing end-user behavior and measuring the performance of your search applications.'
  }),
  URL: '/app/enterprise_search/analytics',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/'
};
exports.ANALYTICS_PLUGIN = ANALYTICS_PLUGIN;
const ELASTICSEARCH_PLUGIN = {
  ID: 'elasticsearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.elasticsearch.productName', {
    defaultMessage: 'Elasticsearch'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.elasticsearch.productDescription', {
    defaultMessage: 'Low-level tools for creating performant and relevant search experiences.'
  }),
  URL: '/app/enterprise_search/elasticsearch',
  SUPPORT_URL: 'https://discuss.elastic.co/c/elastic-stack/elasticsearch/'
};
exports.ELASTICSEARCH_PLUGIN = ELASTICSEARCH_PLUGIN;
const APP_SEARCH_PLUGIN = {
  ID: 'appSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productName', {
    defaultMessage: 'App Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.appSearch.productDescription', {
    defaultMessage: 'Leverage dashboards, analytics, and APIs for advanced application search made simple.'
  }),
  URL: '/app/enterprise_search/app_search',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/app-search/'
};
exports.APP_SEARCH_PLUGIN = APP_SEARCH_PLUGIN;
const WORKPLACE_SEARCH_PLUGIN = {
  ID: 'workplaceSearch',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productName', {
    defaultMessage: 'Workplace Search'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.workplaceSearch.productDescription', {
    defaultMessage: 'Search all documents, files, and sources available across your virtual workplace.'
  }),
  URL: '/app/enterprise_search/workplace_search',
  NON_ADMIN_URL: '/app/enterprise_search/workplace_search/p',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/workplace-search/'
};
exports.WORKPLACE_SEARCH_PLUGIN = WORKPLACE_SEARCH_PLUGIN;
const SEARCH_EXPERIENCES_PLUGIN = {
  ID: 'searchExperiences',
  NAME: _i18n.i18n.translate('xpack.enterpriseSearch.searchExperiences.productName', {
    defaultMessage: 'Enterprise Search'
  }),
  NAV_TITLE: _i18n.i18n.translate('xpack.enterpriseSearch.searchExperiences.navTitle', {
    defaultMessage: 'Search experiences'
  }),
  DESCRIPTION: _i18n.i18n.translate('xpack.enterpriseSearch.searchExperiences.productDescription', {
    defaultMessage: 'Build an intuitive, engaging search experience without reinventing the wheel.'
  }),
  URL: '/app/enterprise_search/search_experiences',
  SUPPORT_URL: 'https://discuss.elastic.co/c/enterprise-search/',
  GITHUB_URL: 'https://github.com/elastic/search-ui/',
  DOCUMENTATION_URL: 'https://docs.elastic.co/search-ui/',
  ELASTICSEARCH_TUTORIAL_URL: 'https://docs.elastic.co/search-ui/tutorials/elasticsearch',
  APP_SEARCH_TUTORIAL_URL: 'https://docs.elastic.co/search-ui/tutorials/app-search',
  WORKPLACE_SEARCH_TUTORIAL_URL: 'https://docs.elastic.co/search-ui/tutorials/workplace-search'
};
exports.SEARCH_EXPERIENCES_PLUGIN = SEARCH_EXPERIENCES_PLUGIN;
const LICENSED_SUPPORT_URL = 'https://support.elastic.co';
exports.LICENSED_SUPPORT_URL = LICENSED_SUPPORT_URL;
const JSON_HEADER = {
  'Content-Type': 'application/json',
  // This needs specific casing or Chrome throws a 415 error
  Accept: 'application/json' // Required for Enterprise Search APIs
};
exports.JSON_HEADER = JSON_HEADER;
const ERROR_CONNECTING_HEADER = 'x-ent-search-error-connecting';
exports.ERROR_CONNECTING_HEADER = ERROR_CONNECTING_HEADER;
const READ_ONLY_MODE_HEADER = 'x-ent-search-read-only-mode';
exports.READ_ONLY_MODE_HEADER = READ_ONLY_MODE_HEADER;
const ENTERPRISE_SEARCH_KIBANA_COOKIE = '_enterprise_search';
exports.ENTERPRISE_SEARCH_KIBANA_COOKIE = ENTERPRISE_SEARCH_KIBANA_COOKIE;
const ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = 'ent-search-logs';
exports.ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID = ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID;
const ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = 'ent-search-audit-logs';
exports.ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID = ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID;
const ENTERPRISE_SEARCH_ANALYTICS_LOGS_SOURCE_ID = 'ent-search-analytics-logs';
exports.ENTERPRISE_SEARCH_ANALYTICS_LOGS_SOURCE_ID = ENTERPRISE_SEARCH_ANALYTICS_LOGS_SOURCE_ID;
const APP_SEARCH_URL = '/app/enterprise_search/app_search';
exports.APP_SEARCH_URL = APP_SEARCH_URL;
const ENTERPRISE_SEARCH_ELASTICSEARCH_URL = '/app/enterprise_search/elasticsearch';
exports.ENTERPRISE_SEARCH_ELASTICSEARCH_URL = ENTERPRISE_SEARCH_ELASTICSEARCH_URL;
const WORKPLACE_SEARCH_URL = '/app/enterprise_search/workplace_search';
exports.WORKPLACE_SEARCH_URL = WORKPLACE_SEARCH_URL;
const ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT = 25;
exports.ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT = ENTERPRISE_SEARCH_DOCUMENTS_DEFAULT_DOC_COUNT;
const ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE = 'elastic-crawler';
exports.ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE = ENTERPRISE_SEARCH_CONNECTOR_CRAWLER_SERVICE_TYPE;
const DEFAULT_PIPELINE_NAME = 'ent-search-generic-ingestion';
exports.DEFAULT_PIPELINE_NAME = DEFAULT_PIPELINE_NAME;
const DEFAULT_PIPELINE_VALUES = {
  extract_binary_content: true,
  name: DEFAULT_PIPELINE_NAME,
  reduce_whitespace: true,
  run_ml_inference: false
};
exports.DEFAULT_PIPELINE_VALUES = DEFAULT_PIPELINE_VALUES;