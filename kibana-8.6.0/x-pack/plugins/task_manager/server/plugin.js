"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskManagerPlugin = void 0;
exports.getElasticsearchAndSOAvailability = getElasticsearchAndSOAvailability;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var _server = require("../../../../src/core/server");
var _polling_lifecycle = require("./polling_lifecycle");
var _middleware = require("./lib/middleware");
var _remove_if_exists = require("./lib/remove_if_exists");
var _bulk_remove_if_exist = require("./lib/bulk_remove_if_exist");
var _saved_objects = require("./saved_objects");
var _task_type_dictionary = require("./task_type_dictionary");
var _task_store = require("./task_store");
var _create_managed_configuration = require("./lib/create_managed_configuration");
var _task_scheduling = require("./task_scheduling");
var _routes = require("./routes");
var _monitoring = require("./monitoring");
var _ephemeral_task_lifecycle = require("./ephemeral_task_lifecycle");
var _usage = require("./usage");
var _constants = require("./constants");
var _adhoc_task_counter = require("./lib/adhoc_task_counter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TaskManagerPlugin {
  constructor(initContext) {
    (0, _defineProperty2.default)(this, "taskPollingLifecycle", void 0);
    (0, _defineProperty2.default)(this, "ephemeralTaskLifecycle", void 0);
    (0, _defineProperty2.default)(this, "taskManagerId", void 0);
    (0, _defineProperty2.default)(this, "usageCounter", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "definitions", void 0);
    (0, _defineProperty2.default)(this, "middleware", (0, _middleware.createInitialMiddleware)());
    (0, _defineProperty2.default)(this, "elasticsearchAndSOAvailability$", void 0);
    (0, _defineProperty2.default)(this, "monitoringStats$", new _rxjs.Subject());
    (0, _defineProperty2.default)(this, "shouldRunBackgroundTasks", void 0);
    (0, _defineProperty2.default)(this, "kibanaVersion", void 0);
    (0, _defineProperty2.default)(this, "adHocTaskCounter", void 0);
    this.initContext = initContext;
    this.initContext = initContext;
    this.logger = initContext.logger.get();
    this.config = initContext.config.get();
    this.definitions = new _task_type_dictionary.TaskTypeDictionary(this.logger);
    this.kibanaVersion = initContext.env.packageInfo.version;
    this.shouldRunBackgroundTasks = initContext.node.roles.backgroundTasks;
    this.adHocTaskCounter = new _adhoc_task_counter.AdHocTaskCounter();
  }
  setup(core, plugins) {
    var _plugins$usageCollect;
    this.elasticsearchAndSOAvailability$ = getElasticsearchAndSOAvailability(core.status.core$);
    (0, _saved_objects.setupSavedObjects)(core.savedObjects, this.config);
    this.taskManagerId = this.initContext.env.instanceUuid;
    if (!this.taskManagerId) {
      this.logger.error(`TaskManager is unable to start as there the Kibana UUID is invalid (value of the "server.uuid" configuration is ${this.taskManagerId})`);
      throw new Error(`TaskManager is unable to start as Kibana has no valid UUID assigned to it.`);
    } else {
      this.logger.info(`TaskManager is identified by the Kibana UUID: ${this.taskManagerId}`);
    }
    const startServicesPromise = core.getStartServices().then(([coreServices]) => ({
      elasticsearch: coreServices.elasticsearch
    }));
    this.usageCounter = (_plugins$usageCollect = plugins.usageCollection) === null || _plugins$usageCollect === void 0 ? void 0 : _plugins$usageCollect.createUsageCounter(`taskManager`);

    // Routes
    const router = core.http.createRouter();
    const {
      serviceStatus$,
      monitoredHealth$
    } = (0, _routes.healthRoute)({
      router,
      monitoringStats$: this.monitoringStats$,
      logger: this.logger,
      taskManagerId: this.taskManagerId,
      config: this.config,
      usageCounter: this.usageCounter,
      kibanaVersion: this.kibanaVersion,
      kibanaIndexName: core.savedObjects.getKibanaIndex(),
      getClusterClient: () => startServicesPromise.then(({
        elasticsearch
      }) => elasticsearch.client),
      shouldRunTasks: this.shouldRunBackgroundTasks
    });
    const monitoredUtilization$ = (0, _routes.backgroundTaskUtilizationRoute)({
      router,
      monitoringStats$: this.monitoringStats$,
      logger: this.logger,
      taskManagerId: this.taskManagerId,
      config: this.config,
      usageCounter: this.usageCounter,
      kibanaVersion: this.kibanaVersion,
      kibanaIndexName: core.savedObjects.getKibanaIndex(),
      getClusterClient: () => startServicesPromise.then(({
        elasticsearch
      }) => elasticsearch.client)
    });
    core.status.derivedStatus$.subscribe(status => this.logger.debug(`status core.status.derivedStatus now set to ${status.level}`));
    serviceStatus$.subscribe(status => this.logger.debug(`status serviceStatus now set to ${status.level}`));

    // here is where the system status is updated
    core.status.set((0, _rxjs.combineLatest)([core.status.derivedStatus$, serviceStatus$]).pipe((0, _operators.map)(([derivedStatus, serviceStatus]) => serviceStatus.level > derivedStatus.level ? serviceStatus : derivedStatus)));
    const usageCollection = plugins.usageCollection;
    if (usageCollection) {
      (0, _usage.registerTaskManagerUsageCollector)(usageCollection, monitoredHealth$, monitoredUtilization$, this.config.ephemeral_tasks.enabled, this.config.ephemeral_tasks.request_capacity, this.config.unsafe.exclude_task_types);
    }
    if (this.config.unsafe.exclude_task_types.length) {
      this.logger.warn(`Excluding task types from execution: ${this.config.unsafe.exclude_task_types.join(', ')}`);
    }
    return {
      index: _constants.TASK_MANAGER_INDEX,
      addMiddleware: middleware => {
        this.assertStillInSetup('add Middleware');
        this.middleware = (0, _middleware.addMiddlewareToChain)(this.middleware, middleware);
      },
      registerTaskDefinitions: taskDefinition => {
        this.assertStillInSetup('register task definitions');
        this.definitions.registerTaskDefinitions(taskDefinition);
      }
    };
  }
  start({
    savedObjects,
    elasticsearch,
    executionContext
  }) {
    const savedObjectsRepository = savedObjects.createInternalRepository(['task']);
    const serializer = savedObjects.createSerializer();
    const taskStore = new _task_store.TaskStore({
      serializer,
      savedObjectsRepository,
      esClient: elasticsearch.client.asInternalUser,
      index: _constants.TASK_MANAGER_INDEX,
      definitions: this.definitions,
      taskManagerId: `kibana:${this.taskManagerId}`,
      adHocTaskCounter: this.adHocTaskCounter
    });
    const managedConfiguration = (0, _create_managed_configuration.createManagedConfiguration)({
      logger: this.logger,
      errors$: taskStore.errors$,
      startingMaxWorkers: this.config.max_workers,
      startingPollInterval: this.config.poll_interval
    });

    // Only poll for tasks if configured to run tasks
    if (this.shouldRunBackgroundTasks) {
      this.taskPollingLifecycle = new _polling_lifecycle.TaskPollingLifecycle({
        config: this.config,
        definitions: this.definitions,
        unusedTypes: _task_type_dictionary.REMOVED_TYPES,
        logger: this.logger,
        executionContext,
        taskStore,
        usageCounter: this.usageCounter,
        middleware: this.middleware,
        elasticsearchAndSOAvailability$: this.elasticsearchAndSOAvailability$,
        ...managedConfiguration
      });
      this.ephemeralTaskLifecycle = new _ephemeral_task_lifecycle.EphemeralTaskLifecycle({
        config: this.config,
        definitions: this.definitions,
        logger: this.logger,
        executionContext,
        middleware: this.middleware,
        elasticsearchAndSOAvailability$: this.elasticsearchAndSOAvailability$,
        pool: this.taskPollingLifecycle.pool,
        lifecycleEvent: this.taskPollingLifecycle.events
      });
    }
    (0, _monitoring.createMonitoringStats)(taskStore, this.elasticsearchAndSOAvailability$, this.config, managedConfiguration, this.logger, this.adHocTaskCounter, this.taskPollingLifecycle, this.ephemeralTaskLifecycle).subscribe(stat => this.monitoringStats$.next(stat));
    const taskScheduling = new _task_scheduling.TaskScheduling({
      logger: this.logger,
      taskStore,
      middleware: this.middleware,
      ephemeralTaskLifecycle: this.ephemeralTaskLifecycle,
      taskManagerId: taskStore.taskManagerId
    });
    return {
      fetch: opts => taskStore.fetch(opts),
      aggregate: opts => taskStore.aggregate(opts),
      get: id => taskStore.get(id),
      remove: id => taskStore.remove(id),
      bulkRemoveIfExist: ids => (0, _bulk_remove_if_exist.bulkRemoveIfExist)(taskStore, ids),
      removeIfExists: id => (0, _remove_if_exists.removeIfExists)(taskStore, id),
      schedule: (...args) => taskScheduling.schedule(...args),
      bulkSchedule: (...args) => taskScheduling.bulkSchedule(...args),
      ensureScheduled: (...args) => taskScheduling.ensureScheduled(...args),
      runSoon: (...args) => taskScheduling.runSoon(...args),
      bulkEnable: (...args) => taskScheduling.bulkEnable(...args),
      bulkDisable: (...args) => taskScheduling.bulkDisable(...args),
      bulkUpdateSchedules: (...args) => taskScheduling.bulkUpdateSchedules(...args),
      ephemeralRunNow: task => taskScheduling.ephemeralRunNow(task),
      supportsEphemeralTasks: () => this.config.ephemeral_tasks.enabled && this.shouldRunBackgroundTasks,
      getRegisteredTypes: () => this.definitions.getAllTypes()
    };
  }

  /**
   * Ensures task manager hasn't started
   *
   * @param {string} the name of the operation being executed
   * @returns void
   */
  assertStillInSetup(operation) {
    var _this$taskPollingLife;
    if ((_this$taskPollingLife = this.taskPollingLifecycle) !== null && _this$taskPollingLife !== void 0 && _this$taskPollingLife.isStarted) {
      throw new Error(`Cannot ${operation} after the task manager has started`);
    }
  }
}
exports.TaskManagerPlugin = TaskManagerPlugin;
function getElasticsearchAndSOAvailability(core$) {
  return core$.pipe((0, _operators.map)(({
    elasticsearch,
    savedObjects
  }) => elasticsearch.level === _server.ServiceStatusLevels.available && savedObjects.level === _server.ServiceStatusLevels.available), (0, _operators.distinctUntilChanged)());
}