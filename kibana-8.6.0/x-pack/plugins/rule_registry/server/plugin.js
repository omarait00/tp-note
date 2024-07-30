"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleRegistryPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _rule_data_plugin_service = require("./rule_data_plugin_service");
var _alerts_client_factory = require("./alert_data_client/alerts_client_factory");
var _routes = require("./routes");
var _search_strategy = require("./search_strategy");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class RuleRegistryPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "alertsClientFactory", void 0);
    (0, _defineProperty2.default)(this, "ruleDataService", void 0);
    (0, _defineProperty2.default)(this, "security", void 0);
    (0, _defineProperty2.default)(this, "pluginStop$", void 0);
    (0, _defineProperty2.default)(this, "createRouteHandlerContext", () => {
      const {
        alertsClientFactory
      } = this;
      return function alertsRouteHandlerContext(context, request) {
        return {
          getAlertsClient: async () => {
            const createdClient = alertsClientFactory.create(request);
            return createdClient;
          }
        };
      };
    });
    this.config = initContext.config.get();
    this.logger = initContext.logger.get();
    this.kibanaVersion = initContext.env.packageInfo.version;
    this.ruleDataService = null;
    this.alertsClientFactory = new _alerts_client_factory.AlertsClientFactory();
    this.pluginStop$ = new _rxjs.ReplaySubject(1);
  }
  setup(core, plugins) {
    const {
      logger,
      kibanaVersion
    } = this;
    const startDependencies = core.getStartServices().then(([coreStart, pluginStart]) => {
      return {
        core: coreStart,
        ...pluginStart
      };
    });
    this.security = plugins.security;
    this.ruleDataService = new _rule_data_plugin_service.RuleDataService({
      logger,
      kibanaVersion,
      disabledRegistrationContexts: this.config.write.disabledRegistrationContexts,
      isWriteEnabled: this.config.write.enabled,
      isWriterCacheEnabled: this.config.write.cache.enabled,
      getClusterClient: async () => {
        const deps = await startDependencies;
        return deps.core.elasticsearch.client.asInternalUser;
      },
      pluginStop$: this.pluginStop$
    });
    this.ruleDataService.initializeService();
    core.getStartServices().then(([_, depsStart]) => {
      const ruleRegistrySearchStrategy = (0, _search_strategy.ruleRegistrySearchStrategyProvider)(depsStart.data, this.ruleDataService, depsStart.alerting, logger, plugins.security, depsStart.spaces);
      plugins.data.search.registerSearchStrategy(_search_strategy.RULE_SEARCH_STRATEGY_NAME, ruleRegistrySearchStrategy);
    });

    // ALERTS ROUTES
    const router = core.http.createRouter();
    core.http.registerRouteHandlerContext('rac', this.createRouteHandlerContext());
    (0, _routes.defineRoutes)(router);
    return {
      ruleDataService: this.ruleDataService
    };
  }
  start(core, plugins) {
    const {
      logger,
      alertsClientFactory,
      ruleDataService,
      security
    } = this;
    alertsClientFactory.initialize({
      logger,
      esClient: core.elasticsearch.client.asInternalUser,
      // NOTE: Alerts share the authorization client with the alerting plugin
      getAlertingAuthorization(request) {
        return plugins.alerting.getAlertingAuthorizationWithRequest(request);
      },
      securityPluginSetup: security,
      ruleDataService
    });
    const getRacClientWithRequest = request => {
      return alertsClientFactory.create(request);
    };
    return {
      getRacClientWithRequest,
      alerting: plugins.alerting
    };
  }
  stop() {
    this.pluginStop$.next();
    this.pluginStop$.complete();
  }
}
exports.RuleRegistryPlugin = RuleRegistryPlugin;