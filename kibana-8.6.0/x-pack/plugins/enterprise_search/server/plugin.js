"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EnterpriseSearchPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../src/core/server");
var _constants = require("../common/constants");
var _telemetry = require("./collectors/app_search/telemetry");
var _telemetry2 = require("./collectors/enterprise_search/telemetry");
var _telemetry3 = require("./collectors/workplace_search/telemetry");
var _integrations = require("./integrations");
var _check_access = require("./lib/check_access");
var _enterprise_search_http_agent = require("./lib/enterprise_search_http_agent");
var _enterprise_search_request_handler = require("./lib/enterprise_search_request_handler");
var _app_search = require("./routes/app_search");
var _enterprise_search = require("./routes/enterprise_search");
var _analytics = require("./routes/enterprise_search/analytics");
var _config_data = require("./routes/enterprise_search/config_data");
var _connectors = require("./routes/enterprise_search/connectors");
var _crawler = require("./routes/enterprise_search/crawler/crawler");
var _create_api_key = require("./routes/enterprise_search/create_api_key");
var _stats = require("./routes/enterprise_search/stats");
var _telemetry4 = require("./routes/enterprise_search/telemetry");
var _workplace_search = require("./routes/workplace_search");
var _telemetry5 = require("./saved_objects/app_search/telemetry");
var _telemetry6 = require("./saved_objects/enterprise_search/telemetry");
var _telemetry7 = require("./saved_objects/workplace_search/telemetry");
var _ui_settings = require("./ui_settings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class EnterpriseSearchPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.config = initializerContext.config.get();
    this.logger = initializerContext.logger.get();
  }
  setup({
    capabilities,
    http,
    savedObjects,
    getStartServices,
    uiSettings
  }, {
    usageCollection,
    security,
    features,
    infra,
    customIntegrations,
    ml
  }) {
    const config = this.config;
    const log = this.logger;
    const PLUGIN_IDS = [_constants.ENTERPRISE_SEARCH_OVERVIEW_PLUGIN.ID, _constants.ENTERPRISE_SEARCH_CONTENT_PLUGIN.ID, _constants.ELASTICSEARCH_PLUGIN.ID, _constants.ANALYTICS_PLUGIN.ID, _constants.APP_SEARCH_PLUGIN.ID, _constants.WORKPLACE_SEARCH_PLUGIN.ID, _constants.SEARCH_EXPERIENCES_PLUGIN.ID];
    if (customIntegrations) {
      (0, _integrations.registerEnterpriseSearchIntegrations)(http, customIntegrations);
    }

    /*
     * Initialize config.ssl.certificateAuthorities file(s) - required for all API calls (+ access checks)
     */
    _enterprise_search_http_agent.entSearchHttpAgent.initializeHttpAgent(config);

    /**
     * Register space/feature control
     */
    features.registerKibanaFeature({
      id: _constants.ENTERPRISE_SEARCH_OVERVIEW_PLUGIN.ID,
      name: _constants.ENTERPRISE_SEARCH_OVERVIEW_PLUGIN.NAME,
      order: 0,
      category: _server.DEFAULT_APP_CATEGORIES.enterpriseSearch,
      app: ['kibana', ...PLUGIN_IDS],
      catalogue: PLUGIN_IDS,
      privileges: null
    });

    /**
     * Register Enterprise Search UI Settings
     */
    uiSettings.register(_ui_settings.uiSettings);

    /**
     * Register user access to the Enterprise Search plugins
     */
    capabilities.registerSwitcher(async request => {
      const [, {
        spaces
      }] = await getStartServices();
      const dependencies = {
        config,
        security,
        spaces,
        request,
        log,
        ml
      };
      const {
        hasAppSearchAccess,
        hasWorkplaceSearchAccess
      } = await (0, _check_access.checkAccess)(dependencies);
      const showEnterpriseSearch = hasAppSearchAccess || hasWorkplaceSearchAccess;
      return {
        navLinks: {
          enterpriseSearch: showEnterpriseSearch,
          enterpriseSearchContent: showEnterpriseSearch,
          enterpriseSearchAnalytics: showEnterpriseSearch,
          elasticsearch: showEnterpriseSearch,
          appSearch: hasAppSearchAccess,
          workplaceSearch: hasWorkplaceSearchAccess,
          searchExperiences: showEnterpriseSearch
        },
        catalogue: {
          enterpriseSearch: showEnterpriseSearch,
          enterpriseSearchContent: showEnterpriseSearch,
          enterpriseSearchAnalytics: showEnterpriseSearch,
          elasticsearch: showEnterpriseSearch,
          appSearch: hasAppSearchAccess,
          workplaceSearch: hasWorkplaceSearchAccess,
          searchExperiences: showEnterpriseSearch
        }
      };
    });

    /**
     * Register routes
     */
    const router = http.createRouter();
    const enterpriseSearchRequestHandler = new _enterprise_search_request_handler.EnterpriseSearchRequestHandler({
      config,
      log
    });
    const dependencies = {
      router,
      config,
      log,
      enterpriseSearchRequestHandler,
      ml
    };
    (0, _config_data.registerConfigDataRoute)(dependencies);
    (0, _app_search.registerAppSearchRoutes)(dependencies);
    (0, _enterprise_search.registerEnterpriseSearchRoutes)(dependencies);
    (0, _workplace_search.registerWorkplaceSearchRoutes)(dependencies);
    // Enterprise Search Routes
    (0, _connectors.registerConnectorRoutes)(dependencies);
    (0, _crawler.registerCrawlerRoutes)(dependencies);
    (0, _analytics.registerAnalyticsRoutes)(dependencies);
    (0, _stats.registerStatsRoutes)(dependencies);
    getStartServices().then(([, {
      security: securityStart
    }]) => {
      (0, _create_api_key.registerCreateAPIKeyRoute)(dependencies, securityStart);
    });

    /**
     * Bootstrap the routes, saved objects, and collector for telemetry
     */
    savedObjects.registerType(_telemetry6.enterpriseSearchTelemetryType);
    savedObjects.registerType(_telemetry5.appSearchTelemetryType);
    savedObjects.registerType(_telemetry7.workplaceSearchTelemetryType);
    let savedObjectsStarted;
    getStartServices().then(([coreStart]) => {
      savedObjectsStarted = coreStart.savedObjects;
      if (usageCollection) {
        (0, _telemetry2.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
        (0, _telemetry.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
        (0, _telemetry3.registerTelemetryUsageCollector)(usageCollection, savedObjectsStarted, this.logger);
      }
    });
    (0, _telemetry4.registerTelemetryRoute)({
      ...dependencies,
      getSavedObjectsService: () => savedObjectsStarted
    });

    /*
     * Register logs source configuration, used by LogStream components
     * @see https://github.com/elastic/kibana/blob/main/x-pack/plugins/infra/public/components/log_stream/log_stream.stories.mdx#with-a-source-configuration
     */
    infra.defineInternalSourceConfiguration(_constants.ENTERPRISE_SEARCH_RELEVANCE_LOGS_SOURCE_ID, {
      name: 'Enterprise Search Search Relevance Logs',
      logIndices: {
        type: 'index_name',
        indexName: 'logs-app_search.search_relevance_suggestions-*'
      }
    });
    infra.defineInternalSourceConfiguration(_constants.ENTERPRISE_SEARCH_AUDIT_LOGS_SOURCE_ID, {
      name: 'Enterprise Search Audit Logs',
      logIndices: {
        type: 'index_name',
        indexName: 'logs-enterprise_search*'
      }
    });
    infra.defineInternalSourceConfiguration(_constants.ENTERPRISE_SEARCH_ANALYTICS_LOGS_SOURCE_ID, {
      name: 'Enterprise Search Behaviorial Analytics Logs',
      logIndices: {
        type: 'index_name',
        indexName: 'logs-elastic_analytics.events-*'
      }
    });
  }
  start() {}
  stop() {}
}
exports.EnterpriseSearchPlugin = EnterpriseSearchPlugin;