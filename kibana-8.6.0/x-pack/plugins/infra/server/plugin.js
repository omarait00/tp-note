"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.config = exports.InfraServerPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _configSchema = require("@kbn/config-schema");
var _server = require("../../../../src/plugins/es_ui_shared/server");
var _i18n = require("@kbn/i18n");
var _constants = require("../common/constants");
var _log_views = require("../common/log_views");
var _plugin_config_types = require("../common/plugin_config_types");
var _inventory_view = require("../common/saved_objects/inventory_view");
var _metrics_explorer_view = require("../common/saved_objects/metrics_explorer_view");
var _deprecations = require("./deprecations");
var _features = require("./features");
var _infra_server = require("./infra_server");
var _framework_fields_adapter = require("./lib/adapters/fields/framework_fields_adapter");
var _kibana_framework_adapter = require("./lib/adapters/framework/kibana_framework_adapter");
var _kibana_log_entries_adapter = require("./lib/adapters/log_entries/kibana_log_entries_adapter");
var _kibana_metrics_adapter = require("./lib/adapters/metrics/kibana_metrics_adapter");
var _source_status = require("./lib/adapters/source_status");
var _alerting = require("./lib/alerting");
var _fields_domain = require("./lib/domains/fields_domain");
var _log_entries_domain = require("./lib/domains/log_entries_domain");
var _metrics_domain = require("./lib/domains/metrics_domain");
var _make_get_metric_indices = require("./lib/metrics/make_get_metric_indices");
var _sources = require("./lib/sources");
var _source_status2 = require("./lib/source_status");
var _saved_objects = require("./saved_objects");
var _log_entries = require("./services/log_entries");
var _log_views2 = require("./services/log_views");
var _rules = require("./services/rules");
var _usage_collector = require("./usage/usage_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const config = {
  schema: _configSchema.schema.object({
    alerting: _configSchema.schema.object({
      inventory_threshold: _configSchema.schema.object({
        group_by_page_size: _configSchema.schema.number({
          defaultValue: 5_000
        })
      }),
      metric_threshold: _configSchema.schema.object({
        group_by_page_size: _configSchema.schema.number({
          defaultValue: 10_000
        })
      })
    }),
    inventory: _configSchema.schema.object({
      compositeSize: _configSchema.schema.number({
        defaultValue: 2000
      })
    }),
    sources: _configSchema.schema.maybe(_configSchema.schema.object({
      default: _configSchema.schema.maybe(_configSchema.schema.object({
        fields: _configSchema.schema.maybe(_configSchema.schema.object({
          message: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string()))
        }))
      }))
    }))
  }),
  deprecations: _deprecations.configDeprecations,
  exposeToBrowser: _plugin_config_types.publicConfigKeys
};
exports.config = config;
const logsSampleDataLinkLabel = _i18n.i18n.translate('xpack.infra.sampleDataLinkLabel', {
  defaultMessage: 'Logs'
});
class InfraServerPlugin {
  constructor(context) {
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "libs", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "logsRules", void 0);
    (0, _defineProperty2.default)(this, "metricsRules", void 0);
    (0, _defineProperty2.default)(this, "logViews", void 0);
    this.config = context.config.get();
    this.logger = context.logger.get();
    this.logsRules = new _rules.RulesService(_constants.LOGS_FEATURE_ID, 'observability.logs', this.logger.get('logsRules'));
    this.metricsRules = new _rules.RulesService(_constants.METRICS_FEATURE_ID, 'observability.metrics', this.logger.get('metricsRules'));
    this.logViews = new _log_views2.LogViewsService(this.logger.get('logViews'));
  }
  setup(core, plugins) {
    const framework = new _kibana_framework_adapter.KibanaFramework(core, this.config, plugins);
    const sources = new _sources.InfraSources({
      config: this.config
    });
    const sourceStatus = new _source_status2.InfraSourceStatus(new _source_status.InfraElasticsearchSourceStatusAdapter(framework), {
      sources
    });
    const logViews = this.logViews.setup();

    // register saved object types
    core.savedObjects.registerType(_sources.infraSourceConfigurationSavedObjectType);
    core.savedObjects.registerType(_metrics_explorer_view.metricsExplorerViewSavedObjectType);
    core.savedObjects.registerType(_inventory_view.inventoryViewSavedObjectType);
    core.savedObjects.registerType(_saved_objects.logViewSavedObjectType);

    // TODO: separate these out individually and do away with "domains" as a temporary group
    // and make them available via the request context so we can do away with
    // the wrapper classes
    const domainLibs = {
      fields: new _fields_domain.InfraFieldsDomain(new _framework_fields_adapter.FrameworkFieldsAdapter(framework), {
        sources
      }),
      logEntries: new _log_entries_domain.InfraLogEntriesDomain(new _kibana_log_entries_adapter.InfraKibanaLogEntriesAdapter(framework), {
        framework,
        getStartServices: () => core.getStartServices()
      }),
      metrics: new _metrics_domain.InfraMetricsDomain(new _kibana_metrics_adapter.KibanaMetricsAdapter(framework))
    };
    this.libs = {
      configuration: this.config,
      framework,
      sources,
      sourceStatus,
      ...domainLibs,
      handleEsError: _server.handleEsError,
      logsRules: this.logsRules.setup(core, plugins),
      metricsRules: this.metricsRules.setup(core, plugins),
      getStartServices: () => core.getStartServices(),
      getAlertDetailsConfig: () => plugins.observability.getAlertDetailsConfig(),
      logger: this.logger,
      basePath: core.http.basePath
    };
    plugins.features.registerKibanaFeature(_features.METRICS_FEATURE);
    plugins.features.registerKibanaFeature(_features.LOGS_FEATURE);
    plugins.home.sampleData.addAppLinksToSampleDataset('logs', [{
      sampleObject: null,
      // indicates that there is no sample object associated with this app link's path
      getPath: () => `/app/logs`,
      label: logsSampleDataLinkLabel,
      icon: 'logsApp'
    }]);
    (0, _infra_server.initInfraServer)(this.libs);
    (0, _alerting.registerRuleTypes)(plugins.alerting, this.libs, plugins.ml);
    core.http.registerRouteHandlerContext('infra', async (context, request) => {
      var _plugins$ml, _plugins$ml2, _plugins$spaces;
      const soClient = (await context.core).savedObjects.client;
      const mlSystem = (_plugins$ml = plugins.ml) === null || _plugins$ml === void 0 ? void 0 : _plugins$ml.mlSystemProvider(request, soClient);
      const mlAnomalyDetectors = (_plugins$ml2 = plugins.ml) === null || _plugins$ml2 === void 0 ? void 0 : _plugins$ml2.anomalyDetectorsProvider(request, soClient);
      const spaceId = ((_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService.getSpaceId(request)) || 'default';
      return {
        mlAnomalyDetectors,
        mlSystem,
        spaceId
      };
    });

    // Telemetry
    _usage_collector.UsageCollector.registerUsageCollector(plugins.usageCollection);
    const logEntriesService = new _log_entries.LogEntriesService();
    logEntriesService.setup(core, plugins);

    // register deprecated source configuration fields
    core.deprecations.registerDeprecations({
      getDeprecations: (0, _deprecations.getInfraDeprecationsFactory)(sources)
    });
    return {
      defineInternalSourceConfiguration: sources.defineInternalSourceConfiguration.bind(sources),
      logViews
    };
  }
  start(core, plugins) {
    var _this$config$sources$, _this$config$sources, _this$config$sources$2, _this$config$sources$3;
    const logViews = this.logViews.start({
      infraSources: this.libs.sources,
      savedObjects: core.savedObjects,
      dataViews: plugins.dataViews,
      elasticsearch: core.elasticsearch,
      config: {
        messageFields: (_this$config$sources$ = (_this$config$sources = this.config.sources) === null || _this$config$sources === void 0 ? void 0 : (_this$config$sources$2 = _this$config$sources.default) === null || _this$config$sources$2 === void 0 ? void 0 : (_this$config$sources$3 = _this$config$sources$2.fields) === null || _this$config$sources$3 === void 0 ? void 0 : _this$config$sources$3.message) !== null && _this$config$sources$ !== void 0 ? _this$config$sources$ : _log_views.defaultLogViewsStaticConfig.messageFields
      }
    });
    return {
      logViews,
      getMetricIndices: (0, _make_get_metric_indices.makeGetMetricIndices)(this.libs.sources)
    };
  }
  stop() {}
}
exports.InfraServerPlugin = InfraServerPlugin;