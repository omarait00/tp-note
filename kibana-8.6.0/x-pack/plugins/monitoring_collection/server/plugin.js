"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringCollectionPlugin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _apiMetrics = require("@opentelemetry/api-metrics");
var _exporterMetricsOtlpGrpc = require("@opentelemetry/exporter-metrics-otlp-grpc");
var _sdkMetricsBase = require("@opentelemetry/sdk-metrics-base");
var _resources = require("@opentelemetry/resources");
var _api = require("@opentelemetry/api");
var _semanticConventions = require("@opentelemetry/semantic-conventions");
var grpc = _interopRequireWildcard(require("@grpc/grpc-js"));
var _prometheus_exporter = require("./lib/prometheus_exporter");
var _routes = require("./routes");
var _constants = require("./constants");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class MonitoringCollectionPlugin {
  constructor(initializerContext) {
    (0, _defineProperty2.default)(this, "initializerContext", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "otlpLogger", void 0);
    (0, _defineProperty2.default)(this, "metrics", {});
    (0, _defineProperty2.default)(this, "prometheusExporter", void 0);
    this.initializerContext = initializerContext;
    this.logger = initializerContext.logger.get();
    this.config = initializerContext.config.get();
    this.otlpLogger = {
      debug: message => this.logger.debug(message),
      error: message => this.logger.error(message),
      info: message => this.logger.info(message),
      warn: message => this.logger.warn(message),
      verbose: message => this.logger.trace(message)
    };
  }
  async getMetric(type) {
    if (this.metrics.hasOwnProperty(type)) {
      return await this.metrics[type].fetch();
    }
    this.logger.warn(`Call to 'getMetric' failed because type '${type}' does not exist.`);
    return undefined;
  }
  setup(core) {
    const router = core.http.createRouter();
    const kibanaIndex = core.savedObjects.getKibanaIndex();
    const server = core.http.getServerInfo();
    const uuid = this.initializerContext.env.instanceUuid;
    const kibanaVersion = this.initializerContext.env.packageInfo.version;
    this.configureOpentelemetryMetrics(server.name, uuid, kibanaVersion);
    let status;
    core.status.overall$.subscribe(newStatus => {
      status = newStatus;
    });
    if (this.prometheusExporter) {
      (0, _routes.registerV1PrometheusRoute)({
        router,
        prometheusExporter: this.prometheusExporter
      });
    }
    (0, _routes.registerDynamicRoute)({
      router,
      config: {
        kibanaIndex,
        kibanaVersion,
        server,
        uuid
      },
      getStatus: () => status,
      getMetric: async type => {
        return await this.getMetric(type);
      }
    });
    return {
      registerMetric: metric => {
        if (this.metrics.hasOwnProperty(metric.type)) {
          this.logger.warn(`Skipping registration of metric type '${metric.type}'. This type has already been registered.`);
          return;
        }
        if (!_constants.TYPE_ALLOWLIST.includes(metric.type)) {
          this.logger.warn(`Skipping registration of metric type '${metric.type}'. This type is not supported in the allowlist.`);
          return;
        }
        this.metrics[metric.type] = metric;
      }
    };
  }
  configureOpentelemetryMetrics(serviceName, serviceInstanceId, serviceVersion) {
    var _this$config$opentele, _ref, _otlpConfig$url, _this$config$opentele2;
    const meterProvider = new _sdkMetricsBase.MeterProvider({
      resource: new _resources.Resource({
        [_semanticConventions.SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        [_semanticConventions.SemanticResourceAttributes.SERVICE_INSTANCE_ID]: serviceInstanceId,
        [_semanticConventions.SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion
      })
    });
    _apiMetrics.metrics.setGlobalMeterProvider(meterProvider);
    const otlpConfig = (_this$config$opentele = this.config.opentelemetry) === null || _this$config$opentele === void 0 ? void 0 : _this$config$opentele.metrics.otlp;
    const url = (_ref = (_otlpConfig$url = otlpConfig === null || otlpConfig === void 0 ? void 0 : otlpConfig.url) !== null && _otlpConfig$url !== void 0 ? _otlpConfig$url : process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT) !== null && _ref !== void 0 ? _ref : process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    if (url) {
      // Add OTLP exporter
      // Set Authorization headers
      // OTLPMetricExporter internally will look at OTEL_EXPORTER_OTLP_METRICS_HEADERS env variable
      // if `headers` is not present in the kibana config file
      const metadata = new grpc.Metadata();
      if (otlpConfig.headers) {
        for (const [key, value] of Object.entries(otlpConfig.headers)) {
          metadata.add(key, value);
        }
      }
      const otlpLogLevel = otlpConfig.logLevel.toUpperCase();
      _api.diag.setLogger(this.otlpLogger, _api.DiagLogLevel[otlpLogLevel]);
      this.logger.debug(`Registering OpenTelemetry metrics exporter to ${url}`);
      meterProvider.addMetricReader(new _sdkMetricsBase.PeriodicExportingMetricReader({
        exporter: new _exporterMetricsOtlpGrpc.OTLPMetricExporter({
          url,
          metadata
        }),
        exportIntervalMillis: otlpConfig.exportIntervalMillis
      }));
    }
    if ((_this$config$opentele2 = this.config.opentelemetry) !== null && _this$config$opentele2 !== void 0 && _this$config$opentele2.metrics.prometheus.enabled) {
      // Add Prometheus exporter
      this.logger.debug(`Starting prometheus exporter at ${_routes.PROMETHEUS_PATH}`);
      this.prometheusExporter = new _prometheus_exporter.PrometheusExporter();
      meterProvider.addMetricReader(this.prometheusExporter);
    }
  }
  start() {}
  stop() {}
}
exports.MonitoringCollectionPlugin = MonitoringCollectionPlugin;