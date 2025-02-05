"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetUsageSender = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _server = require("../../../../task_manager/server");
var _apmUtils = require("@kbn/apm-utils");
var _app_context = require("../app_context");
var _fleet_usages_schema = require("./fleet_usages_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FLEET_USAGES_EVENT_TYPE = 'fleet_usage';
const FLEET_AGENTS_EVENT_TYPE = 'fleet_agents';
class FleetUsageSender {
  constructor(taskManager, _core, _fetchUsage) {
    (0, _defineProperty2.default)(this, "taskManager", void 0);
    (0, _defineProperty2.default)(this, "taskVersion", '1.1.0');
    (0, _defineProperty2.default)(this, "taskType", 'Fleet-Usage-Sender');
    (0, _defineProperty2.default)(this, "wasStarted", false);
    (0, _defineProperty2.default)(this, "interval", '1h');
    (0, _defineProperty2.default)(this, "timeout", '1m');
    (0, _defineProperty2.default)(this, "abortController", new AbortController());
    (0, _defineProperty2.default)(this, "runTask", async (taskInstance, core, fetchUsage) => {
      if (!this.wasStarted) {
        _app_context.appContextService.getLogger().debug('[runTask()] Aborted. Task not started yet');
        return;
      }
      // Check that this task is current
      if (taskInstance.id !== this.taskId) {
        (0, _server.throwUnrecoverableError)(new Error('Outdated task version for task: ' + taskInstance.id));
        return;
      }
      _app_context.appContextService.getLogger().info('Running Fleet Usage telemetry send task');
      try {
        const usageData = await fetchUsage();
        if (!usageData) {
          return;
        }
        const {
          agents_per_version: agentsPerVersion,
          ...fleetUsageData
        } = usageData;
        _app_context.appContextService.getLogger().debug('Fleet usage telemetry: ' + JSON.stringify(fleetUsageData));
        core.analytics.reportEvent(FLEET_USAGES_EVENT_TYPE, fleetUsageData);
        _app_context.appContextService.getLogger().debug('Agents per version telemetry: ' + JSON.stringify(agentsPerVersion));
        agentsPerVersion.forEach(byVersion => {
          core.analytics.reportEvent(FLEET_AGENTS_EVENT_TYPE, {
            agents_per_version: byVersion
          });
        });
      } catch (error) {
        _app_context.appContextService.getLogger().error('Error occurred while sending Fleet Usage telemetry: ' + error);
      }
    });
    taskManager.registerTaskDefinitions({
      [this.taskType]: {
        title: 'Fleet Usage Sender',
        timeout: this.timeout,
        maxAttempts: 1,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            run: async () => {
              return (0, _apmUtils.withSpan)({
                name: this.taskType,
                type: 'telemetry'
              }, () => this.runTask(taskInstance, _core, () => _fetchUsage(this.abortController)));
            },
            cancel: async () => {
              this.abortController.abort('task timed out');
            }
          };
        }
      }
    });
    this.registerTelemetryEventType(_core);
  }
  get taskId() {
    return `${this.taskType}-${this.taskVersion}`;
  }
  async start(taskManager) {
    this.taskManager = taskManager;
    if (!taskManager) {
      _app_context.appContextService.getLogger().error('missing required service during start');
      return;
    }
    this.wasStarted = true;
    try {
      _app_context.appContextService.getLogger().info(`Task ${this.taskId} scheduled with interval 1h`);
      await this.taskManager.ensureScheduled({
        id: this.taskId,
        taskType: this.taskType,
        schedule: {
          interval: this.interval
        },
        scope: ['fleet'],
        state: {},
        params: {}
      });
    } catch (e) {
      _app_context.appContextService.getLogger().error(`Error scheduling task, received error: ${e}`);
    }
  }

  /**
   *  took schema from [here](https://github.com/elastic/kibana/blob/main/x-pack/plugins/fleet/server/collectors/register.ts#L53) and adapted to EBT format
   */
  registerTelemetryEventType(core) {
    core.analytics.registerEventType({
      eventType: FLEET_USAGES_EVENT_TYPE,
      schema: _fleet_usages_schema.fleetUsagesSchema
    });
    core.analytics.registerEventType({
      eventType: FLEET_AGENTS_EVENT_TYPE,
      schema: _fleet_usages_schema.fleetAgentsSchema
    });
  }
}
exports.FleetUsageSender = FleetUsageSender;