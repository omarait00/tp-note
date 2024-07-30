"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskExecutionFailureThresholdSchema = exports.configSchema = exports.MAX_WORKERS_LIMIT = exports.DEFAULT_VERSION_CONFLICT_THRESHOLD = exports.DEFAULT_POLL_INTERVAL = exports.DEFAULT_MONITORING_STATS_WARN_DELAYED_TASK_START_IN_SECONDS = exports.DEFAULT_MONITORING_STATS_RUNNING_AVERGAE_WINDOW = exports.DEFAULT_MONITORING_REFRESH_RATE = exports.DEFAULT_MAX_WORKERS = exports.DEFAULT_MAX_POLL_INACTIVITY_CYCLES = exports.DEFAULT_MAX_EPHEMERAL_REQUEST_CAPACITY = void 0;
var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_WORKERS_LIMIT = 100;
exports.MAX_WORKERS_LIMIT = MAX_WORKERS_LIMIT;
const DEFAULT_MAX_WORKERS = 10;
exports.DEFAULT_MAX_WORKERS = DEFAULT_MAX_WORKERS;
const DEFAULT_POLL_INTERVAL = 3000;
exports.DEFAULT_POLL_INTERVAL = DEFAULT_POLL_INTERVAL;
const DEFAULT_MAX_POLL_INACTIVITY_CYCLES = 10;
exports.DEFAULT_MAX_POLL_INACTIVITY_CYCLES = DEFAULT_MAX_POLL_INACTIVITY_CYCLES;
const DEFAULT_VERSION_CONFLICT_THRESHOLD = 80;
exports.DEFAULT_VERSION_CONFLICT_THRESHOLD = DEFAULT_VERSION_CONFLICT_THRESHOLD;
const DEFAULT_MAX_EPHEMERAL_REQUEST_CAPACITY = MAX_WORKERS_LIMIT;

// Monitoring Constants
// ===================
// Refresh aggregated monitored stats at a default rate of once a minute
exports.DEFAULT_MAX_EPHEMERAL_REQUEST_CAPACITY = DEFAULT_MAX_EPHEMERAL_REQUEST_CAPACITY;
const DEFAULT_MONITORING_REFRESH_RATE = 60 * 1000;
exports.DEFAULT_MONITORING_REFRESH_RATE = DEFAULT_MONITORING_REFRESH_RATE;
const DEFAULT_MONITORING_STATS_RUNNING_AVERGAE_WINDOW = 50;
exports.DEFAULT_MONITORING_STATS_RUNNING_AVERGAE_WINDOW = DEFAULT_MONITORING_STATS_RUNNING_AVERGAE_WINDOW;
const DEFAULT_MONITORING_STATS_WARN_DELAYED_TASK_START_IN_SECONDS = 60;
exports.DEFAULT_MONITORING_STATS_WARN_DELAYED_TASK_START_IN_SECONDS = DEFAULT_MONITORING_STATS_WARN_DELAYED_TASK_START_IN_SECONDS;
const taskExecutionFailureThresholdSchema = _configSchema.schema.object({
  error_threshold: _configSchema.schema.number({
    defaultValue: 90,
    min: 0
  }),
  warn_threshold: _configSchema.schema.number({
    defaultValue: 80,
    min: 0
  })
}, {
  validate(config) {
    if (config.error_threshold < config.warn_threshold) {
      return `warn_threshold (${config.warn_threshold}) must be less than, or equal to, error_threshold (${config.error_threshold})`;
    }
  }
});
exports.taskExecutionFailureThresholdSchema = taskExecutionFailureThresholdSchema;
const eventLoopDelaySchema = _configSchema.schema.object({
  monitor: _configSchema.schema.boolean({
    defaultValue: true
  }),
  warn_threshold: _configSchema.schema.number({
    defaultValue: 5000,
    min: 10
  })
});
const configSchema = _configSchema.schema.object({
  /* The maximum number of times a task will be attempted before being abandoned as failed */
  max_attempts: _configSchema.schema.number({
    defaultValue: 3,
    min: 1
  }),
  /* How often, in milliseconds, the task manager will look for more work. */
  poll_interval: _configSchema.schema.number({
    defaultValue: DEFAULT_POLL_INTERVAL,
    min: 100
  }),
  /* How many poll interval cycles can work take before it's timed out. */
  max_poll_inactivity_cycles: _configSchema.schema.number({
    defaultValue: DEFAULT_MAX_POLL_INACTIVITY_CYCLES,
    min: 1
  }),
  /* How many requests can Task Manager buffer before it rejects new requests. */
  request_capacity: _configSchema.schema.number({
    // a nice round contrived number, feel free to change as we learn how it behaves
    defaultValue: 1000,
    min: 1
  }),
  /* The maximum number of tasks that this Kibana instance will run simultaneously. */
  max_workers: _configSchema.schema.number({
    defaultValue: DEFAULT_MAX_WORKERS,
    // disable the task manager rather than trying to specify it with 0 workers
    min: 1
  }),
  /* The threshold percenatge for workers experiencing version conflicts for shifting the polling interval. */
  version_conflict_threshold: _configSchema.schema.number({
    defaultValue: DEFAULT_VERSION_CONFLICT_THRESHOLD,
    min: 50,
    max: 100
  }),
  /* The rate at which we emit fresh monitored stats. By default we'll use the poll_interval (+ a slight buffer) */
  monitored_stats_required_freshness: _configSchema.schema.number({
    defaultValue: config => {
      var _poll_interval;
      return ((_poll_interval = config === null || config === void 0 ? void 0 : config.poll_interval) !== null && _poll_interval !== void 0 ? _poll_interval : DEFAULT_POLL_INTERVAL) + 1000;
    },
    min: 100
  }),
  /* The rate at which we refresh monitored stats that require aggregation queries against ES. */
  monitored_aggregated_stats_refresh_rate: _configSchema.schema.number({
    defaultValue: DEFAULT_MONITORING_REFRESH_RATE,
    /* don't run monitored stat aggregations any faster than once every 5 seconds */
    min: 5000
  }),
  /* The size of the running average window for monitored stats. */
  monitored_stats_running_average_window: _configSchema.schema.number({
    defaultValue: DEFAULT_MONITORING_STATS_RUNNING_AVERGAE_WINDOW,
    max: 100,
    min: 10
  }),
  /* Task Execution result warn & error thresholds. */
  monitored_task_execution_thresholds: _configSchema.schema.object({
    default: taskExecutionFailureThresholdSchema,
    custom: _configSchema.schema.recordOf(_configSchema.schema.string(), taskExecutionFailureThresholdSchema, {
      defaultValue: {}
    })
  }),
  monitored_stats_health_verbose_log: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: false
    }),
    level: _configSchema.schema.oneOf([_configSchema.schema.literal('debug'), _configSchema.schema.literal('info')], {
      defaultValue: 'debug'
    }),
    /* The amount of seconds we allow a task to delay before printing a warning server log */
    warn_delayed_task_start_in_seconds: _configSchema.schema.number({
      defaultValue: DEFAULT_MONITORING_STATS_WARN_DELAYED_TASK_START_IN_SECONDS
    })
  }),
  ephemeral_tasks: _configSchema.schema.object({
    enabled: _configSchema.schema.boolean({
      defaultValue: false
    }),
    /* How many requests can Task Manager buffer before it rejects new requests. */
    request_capacity: _configSchema.schema.number({
      // a nice round contrived number, feel free to change as we learn how it behaves
      defaultValue: 10,
      min: 1,
      max: DEFAULT_MAX_EPHEMERAL_REQUEST_CAPACITY
    })
  }),
  event_loop_delay: eventLoopDelaySchema,
  /* These are not designed to be used by most users. Please use caution when changing these */
  unsafe: _configSchema.schema.object({
    exclude_task_types: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      defaultValue: []
    })
  })
}, {
  validate: config => {
    if (config.monitored_stats_required_freshness && config.poll_interval && config.monitored_stats_required_freshness < config.poll_interval) {
      return `The specified monitored_stats_required_freshness (${config.monitored_stats_required_freshness}) is invalid, as it is below the poll_interval (${config.poll_interval})`;
    }
  }
});
exports.configSchema = configSchema;