"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SyntheticsService = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _monitor_upgrade_sender = require("../routes/telemetry/monitor_upgrade_sender");
var _install_index_templates = require("../routes/synthetics_service/install_index_templates");
var _get_api_key = require("./get_api_key");
var _synthetics_monitor = require("../legacy_uptime/lib/saved_objects/synthetics_monitor");
var _get_es_hosts = require("./get_es_hosts");
var _service_api_client = require("./service_api_client");
var _format_configs = require("./formatters/format_configs");
var _runtime_types = require("../../common/runtime_types");
var _get_service_locations = require("./get_service_locations");
var _secrets = require("./utils/secrets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

const SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_TYPE = 'UPTIME:SyntheticsService:Sync-Saved-Monitor-Objects';
const SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID = 'UPTIME:SyntheticsService:sync-task';
const SYNTHETICS_SERVICE_SYNC_INTERVAL_DEFAULT = '5m';
class SyntheticsService {
  constructor(server) {
    var _server$config$servic;
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "server", void 0);
    (0, _defineProperty2.default)(this, "apiClient", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "esHosts", void 0);
    (0, _defineProperty2.default)(this, "locations", void 0);
    (0, _defineProperty2.default)(this, "throttling", void 0);
    (0, _defineProperty2.default)(this, "indexTemplateExists", void 0);
    (0, _defineProperty2.default)(this, "indexTemplateInstalling", void 0);
    (0, _defineProperty2.default)(this, "isAllowed", void 0);
    (0, _defineProperty2.default)(this, "signupUrl", void 0);
    (0, _defineProperty2.default)(this, "syncErrors", []);
    (0, _defineProperty2.default)(this, "invalidApiKeyError", void 0);
    this.logger = server.logger;
    this.server = server;
    this.config = (_server$config$servic = server.config.service) !== null && _server$config$servic !== void 0 ? _server$config$servic : {};
    this.isAllowed = false;
    this.signupUrl = null;
    this.apiClient = new _service_api_client.ServiceAPIClient(server.logger, this.config, this.server);
    this.esHosts = (0, _get_es_hosts.getEsHosts)({
      config: this.config,
      cloud: server.cloud
    });
    this.locations = [];
  }
  async setup(taskManager) {
    this.registerSyncTask(taskManager);
    await this.registerServiceLocations();
    const {
      allowed,
      signupUrl
    } = await this.apiClient.checkAccountAccessStatus();
    this.isAllowed = allowed;
    this.signupUrl = signupUrl;
  }
  start(taskManager) {
    var _this$config;
    if ((_this$config = this.config) !== null && _this$config !== void 0 && _this$config.manifestUrl) {
      this.scheduleSyncTask(taskManager);
    }
    this.setupIndexTemplates();
  }
  async setupIndexTemplates() {
    if (this.indexTemplateExists) {
      // if already installed, don't need to reinstall
      return;
    }
    try {
      if (!this.indexTemplateInstalling) {
        this.indexTemplateInstalling = true;
        const installedPackage = await (0, _install_index_templates.installSyntheticsIndexTemplates)(this.server);
        this.indexTemplateInstalling = false;
        if (installedPackage.name === 'synthetics' && installedPackage.install_status === 'installed') {
          this.logger.info('Installed synthetics index templates');
          this.indexTemplateExists = true;
        } else if (installedPackage.name === 'synthetics' && installedPackage.install_status === 'install_failed') {
          this.logger.warn(new IndexTemplateInstallationError());
          this.indexTemplateExists = false;
        }
      }
    } catch (e) {
      this.logger.error(e);
      this.indexTemplateInstalling = false;
      this.logger.warn(new IndexTemplateInstallationError());
    }
  }
  async registerServiceLocations() {
    const service = this;
    try {
      const result = await (0, _get_service_locations.getServiceLocations)(service.server);
      service.throttling = result.throttling;
      service.locations = result.locations;
      service.apiClient.locations = result.locations;
    } catch (e) {
      this.logger.error(e);
    }
  }
  registerSyncTask(taskManager) {
    const service = this;
    taskManager.registerTaskDefinitions({
      [SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_TYPE]: {
        title: 'Synthetics Service - Sync Saved Monitors',
        description: 'This task periodically pushes saved monitors to Synthetics Service.',
        timeout: '1m',
        maxAttempts: 3,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            // Perform the work of the task. The return value should fit the TaskResult interface.
            async run() {
              const {
                state
              } = taskInstance;
              try {
                await service.registerServiceLocations();
                const {
                  allowed,
                  signupUrl
                } = await service.apiClient.checkAccountAccessStatus();
                service.isAllowed = allowed;
                service.signupUrl = signupUrl;
                if (service.isAllowed) {
                  service.setupIndexTemplates();
                  await service.pushConfigs();
                }
              } catch (e) {
                (0, _monitor_upgrade_sender.sendErrorTelemetryEvents)(service.logger, service.server.telemetry, {
                  reason: 'Failed to run scheduled sync task',
                  message: e === null || e === void 0 ? void 0 : e.message,
                  type: 'runTaskError',
                  code: e === null || e === void 0 ? void 0 : e.code,
                  status: e.status,
                  stackVersion: service.server.stackVersion
                });
                service.logger.error(e);
              }
              return {
                state
              };
            },
            async cancel() {
              var _service$logger;
              (_service$logger = service.logger) === null || _service$logger === void 0 ? void 0 : _service$logger.warn(`Task ${SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID} timed out`);
            }
          };
        }
      }
    });
  }
  async scheduleSyncTask(taskManager) {
    var _this$config$syncInte;
    const interval = (_this$config$syncInte = this.config.syncInterval) !== null && _this$config$syncInte !== void 0 ? _this$config$syncInte : SYNTHETICS_SERVICE_SYNC_INTERVAL_DEFAULT;
    try {
      var _this$logger, _taskInstance$schedul;
      await taskManager.removeIfExists(SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID);
      const taskInstance = await taskManager.ensureScheduled({
        id: SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID,
        taskType: SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_TYPE,
        schedule: {
          interval
        },
        params: {},
        state: {},
        scope: ['uptime']
      });
      (_this$logger = this.logger) === null || _this$logger === void 0 ? void 0 : _this$logger.info(`Task ${SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID} scheduled with interval ${(_taskInstance$schedul = taskInstance.schedule) === null || _taskInstance$schedul === void 0 ? void 0 : _taskInstance$schedul.interval}.`);
      return taskInstance;
    } catch (e) {
      var _e$message, _this$logger2, _e$message2;
      (0, _monitor_upgrade_sender.sendErrorTelemetryEvents)(this.logger, this.server.telemetry, {
        reason: 'Failed to schedule sync task',
        message: (_e$message = e === null || e === void 0 ? void 0 : e.message) !== null && _e$message !== void 0 ? _e$message : e,
        type: 'scheduleTaskError',
        code: e === null || e === void 0 ? void 0 : e.code,
        status: e.status,
        stackVersion: this.server.stackVersion
      });
      (_this$logger2 = this.logger) === null || _this$logger2 === void 0 ? void 0 : _this$logger2.error(`Error running task: ${SYNTHETICS_SERVICE_SYNC_MONITORS_TASK_ID}, `, (_e$message2 = e === null || e === void 0 ? void 0 : e.message) !== null && _e$message2 !== void 0 ? _e$message2 : e);
      return null;
    }
  }
  async getApiKey() {
    const {
      apiKey,
      isValid
    } = await (0, _get_api_key.getAPIKeyForSyntheticsService)({
      server: this.server
    });
    if (!isValid) {
      throw new Error('API key is not valid. Cannot push monitor configuration to synthetics public testing locations');
    }
    return apiKey;
  }
  async getOutput() {
    const apiKey = await this.getApiKey();
    return {
      hosts: this.esHosts,
      api_key: `${apiKey === null || apiKey === void 0 ? void 0 : apiKey.id}:${apiKey === null || apiKey === void 0 ? void 0 : apiKey.apiKey}`
    };
  }
  async addConfig(config) {
    const monitors = this.formatConfigs(Array.isArray(config) ? config : [config]);
    const output = await this.getOutput();
    this.logger.debug(`1 monitor will be pushed to synthetics service.`);
    try {
      this.syncErrors = await this.apiClient.post({
        monitors,
        output
      });
      return this.syncErrors;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async editConfig(monitorConfig) {
    const monitors = this.formatConfigs(Array.isArray(monitorConfig) ? monitorConfig : [monitorConfig]);
    const output = await this.getOutput();
    const data = {
      monitors,
      output,
      isEdit: true
    };
    try {
      this.syncErrors = await this.apiClient.put(data);
      return this.syncErrors;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async pushConfigs() {
    const service = this;
    const subject = new _rxjs.Subject();
    subject.subscribe(async monitorConfigs => {
      try {
        const monitors = this.formatConfigs(monitorConfigs);
        if (monitors.length === 0) {
          this.logger.debug('No monitor found which can be pushed to service.');
          return null;
        }
        const output = await this.getOutput();
        this.logger.debug(`${monitors.length} monitors will be pushed to synthetics service.`);
        service.syncErrors = await this.apiClient.put({
          monitors,
          output
        });
      } catch (e) {
        (0, _monitor_upgrade_sender.sendErrorTelemetryEvents)(service.logger, service.server.telemetry, {
          reason: 'Failed to push configs to service',
          message: e === null || e === void 0 ? void 0 : e.message,
          type: 'pushConfigsError',
          code: e === null || e === void 0 ? void 0 : e.code,
          status: e.status,
          stackVersion: service.server.stackVersion
        });
        this.logger.error(e);
      }
    });
    await this.getMonitorConfigs(subject);
  }
  async runOnceConfigs(configs) {
    const monitors = this.formatConfigs(configs);
    if (monitors.length === 0) {
      return;
    }
    const output = await this.getOutput();
    try {
      return await this.apiClient.runOnce({
        monitors,
        output
      });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  async deleteConfigs(configs) {
    const output = await this.getOutput();
    const data = {
      output,
      monitors: this.formatConfigs(configs)
    };
    return await this.apiClient.delete(data);
  }
  async deleteAllConfigs() {
    const subject = new _rxjs.Subject();
    subject.subscribe(async monitors => {
      await this.deleteConfigs(monitors);
    });
    await this.getMonitorConfigs(subject);
  }
  async getMonitorConfigs(subject) {
    const soClient = this.server.savedObjectsClient;
    const encryptedClient = this.server.encryptedSavedObjects.getClient();
    if (!(soClient !== null && soClient !== void 0 && soClient.find)) {
      return [];
    }
    const finder = soClient.createPointInTimeFinder({
      type: _synthetics_monitor.syntheticsMonitorType,
      perPage: 500,
      namespaces: ['*']
    });
    const start = performance.now();
    for await (const result of finder.find()) {
      const encryptedMonitors = result.saved_objects;
      const monitors = (await Promise.all(encryptedMonitors.map(monitor => new Promise(resolve => {
        var _monitor$namespaces;
        encryptedClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitor.id, {
          namespace: (_monitor$namespaces = monitor.namespaces) === null || _monitor$namespaces === void 0 ? void 0 : _monitor$namespaces[0]
        }).then(decryptedMonitor => resolve(decryptedMonitor)).catch(e => {
          this.logger.error(e);
          (0, _monitor_upgrade_sender.sendErrorTelemetryEvents)(this.logger, this.server.telemetry, {
            reason: 'Failed to decrypt monitor',
            message: e === null || e === void 0 ? void 0 : e.message,
            type: 'runTaskError',
            code: e === null || e === void 0 ? void 0 : e.code,
            status: e.status,
            stackVersion: this.server.stackVersion
          });
          resolve(null);
        });
      })))).filter(monitor => monitor !== null);
      const end = performance.now();
      const duration = end - start;
      this.logger.debug(`Decrypted ${monitors.length} monitors. Took ${duration} milliseconds`, {
        event: {
          duration
        },
        monitors: monitors.length
      });
      subject.next((monitors !== null && monitors !== void 0 ? monitors : []).map(monitor => {
        const attributes = monitor.attributes;
        return (0, _format_configs.formatHeartbeatRequest)({
          monitor: (0, _secrets.normalizeSecrets)(monitor).attributes,
          monitorId: monitor.id,
          heartbeatId: attributes[_runtime_types.ConfigKey.MONITOR_QUERY_ID]
        });
      }));
    }
  }
  formatConfigs(configs) {
    return configs.map(config => (0, _format_configs.formatMonitorConfig)(Object.keys(config), config));
  }
}
exports.SyntheticsService = SyntheticsService;
class IndexTemplateInstallationError extends Error {
  constructor() {
    super();
    this.message = 'Failed to install synthetics index templates.';
    this.name = 'IndexTemplateInstallationError';
  }
}