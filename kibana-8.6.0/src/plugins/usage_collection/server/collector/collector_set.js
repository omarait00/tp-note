"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectorSet = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _std = require("@kbn/std");
var _lodash = require("lodash");
var _collector = require("./collector");
var _usage_collector = require("./usage_collector");
var _constants = require("../../common/constants");
var _measure_duration = require("./measure_duration");
var _collector_stats = require("./collector_stats");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const SECOND_IN_MS = 1000;
// Needed for the general array containing all the collectors. We don't really care about their types here
// eslint-disable-next-line @typescript-eslint/no-explicit-any

class CollectorSet {
  constructor({
    logger,
    executionContext: _executionContext,
    maximumWaitTimeForAllCollectorsInS = _constants.DEFAULT_MAXIMUM_WAIT_TIME_FOR_ALL_COLLECTORS_IN_S,
    collectors: _collectors = []
  }) {
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "executionContext", void 0);
    (0, _defineProperty2.default)(this, "maximumWaitTimeForAllCollectorsInS", void 0);
    (0, _defineProperty2.default)(this, "collectors", void 0);
    (0, _defineProperty2.default)(this, "makeStatsCollector", options => {
      return new _collector.Collector(this.logger, options);
    });
    (0, _defineProperty2.default)(this, "makeUsageCollector", options => {
      return new _usage_collector.UsageCollector(this.logger, options);
    });
    (0, _defineProperty2.default)(this, "registerCollector", collector => {
      // check instanceof
      if (!(collector instanceof _collector.Collector)) {
        throw new Error('CollectorSet can only have Collector instances registered');
      }
      if (this.collectors.get(collector.type)) {
        throw new Error(`Usage collector's type "${collector.type}" is duplicated.`);
      }
      this.collectors.set(collector.type, collector);
    });
    (0, _defineProperty2.default)(this, "getCollectorByType", type => {
      return [...this.collectors.values()].find(c => c.type === type);
    });
    (0, _defineProperty2.default)(this, "getReadyCollectors", async (collectors = this.collectors) => {
      if (!(collectors instanceof Map)) {
        throw new Error(`getReadyCollectors method given bad Map of collectors: ` + typeof collectors);
      }
      const timeoutMs = this.maximumWaitTimeForAllCollectorsInS * SECOND_IN_MS;
      const collectorsWithStatus = await Promise.all([...collectors.values()].map(async collector => {
        const wrappedPromise = (0, _measure_duration.perfTimerify)(`is_ready_${collector.type}`, async () => {
          try {
            return await collector.isReady();
          } catch (err) {
            this.logger.debug(`Collector ${collector.type} failed to get ready. ${err}`);
            return false;
          }
        });
        const isReadyWithTimeout = await (0, _std.withTimeout)({
          promise: wrappedPromise(),
          timeoutMs
        });
        if (isReadyWithTimeout.timedout) {
          return {
            isReadyWithTimeout,
            collector
          };
        }
        return {
          isReadyWithTimeout: {
            value: isReadyWithTimeout.value,
            timedout: isReadyWithTimeout.timedout
          },
          collector
        };
      }));
      const timedOutCollectorsTypes = collectorsWithStatus.filter(collectorWithStatus => collectorWithStatus.isReadyWithTimeout.timedout).map(({
        collector
      }) => collector.type);
      if (timedOutCollectorsTypes.length) {
        this.logger.debug(`Some collectors timedout getting ready (${timedOutCollectorsTypes.join(', ')}). ` + `Waited for ${this.maximumWaitTimeForAllCollectorsInS}s and will return data from collectors that are ready.`);
      }
      const nonTimedOutCollectors = collectorsWithStatus.filter(collectorWithStatus => collectorWithStatus.isReadyWithTimeout.timedout === false);
      const collectorsTypesNotReady = nonTimedOutCollectors.filter(({
        isReadyWithTimeout
      }) => isReadyWithTimeout.value === false).map(({
        collector
      }) => collector.type);
      if (collectorsTypesNotReady.length) {
        this.logger.debug(`Some collectors are not ready (${collectorsTypesNotReady.join(',')}). ` + `will return data from all collectors that are ready.`);
      }
      const readyCollectors = nonTimedOutCollectors.filter(({
        isReadyWithTimeout
      }) => isReadyWithTimeout.value === true).map(({
        collector
      }) => collector);
      return {
        readyCollectors,
        nonReadyCollectorTypes: collectorsTypesNotReady,
        timedOutCollectorsTypes
      };
    });
    (0, _defineProperty2.default)(this, "fetchCollector", async (collector, context) => {
      const {
        type
      } = collector;
      this.logger.debug(`Fetching data from ${type} collector`);
      const executionContext = {
        type: 'usage_collection',
        name: 'collector.fetch',
        id: type,
        description: `Fetch method in the Collector "${type}"`
      };
      try {
        const result = await this.executionContext.withContext(executionContext, () => collector.fetch(context));
        return {
          type,
          result,
          status: 'success'
        };
      } catch (err) {
        this.logger.warn(err);
        this.logger.warn(`Unable to fetch data from ${type} collector`);
        return {
          type,
          status: 'failed'
        };
      }
    });
    (0, _defineProperty2.default)(this, "bulkFetch", async (esClient, soClient, collectors = this.collectors) => {
      this.logger.debug(`Getting ready collectors`);
      const getMarks = (0, _measure_duration.createPerformanceObsHook)();
      const {
        readyCollectors,
        nonReadyCollectorTypes,
        timedOutCollectorsTypes
      } = await this.getReadyCollectors(collectors);

      // freeze object to prevent collectors from mutating it.
      const context = Object.freeze({
        esClient,
        soClient
      });
      const fetchExecutions = await Promise.all(readyCollectors.map(async collector => {
        const wrappedPromise = (0, _measure_duration.perfTimerify)(`fetch_${collector.type}`, async () => await this.fetchCollector(collector, context));
        return await wrappedPromise();
      }));
      const durationMarks = getMarks();
      const isReadyExecutionDurationByType = [...readyCollectors.map(({
        type
      }) => {
        // should always find a duration, fallback to 0 in case something unexpected happened
        const duration = durationMarks[`is_ready_${type}`] || 0;
        return {
          duration,
          type
        };
      }), ...nonReadyCollectorTypes.map(type => {
        // should always find a duration, fallback to 0 in case something unexpected happened
        const duration = durationMarks[`is_ready_${type}`] || 0;
        return {
          duration,
          type
        };
      }), ...timedOutCollectorsTypes.map(type => {
        const timeoutMs = this.maximumWaitTimeForAllCollectorsInS * SECOND_IN_MS;
        // if undefined default to timeoutMs since the collector timedout
        const duration = durationMarks[`is_ready_${type}`] || timeoutMs;
        return {
          duration,
          type
        };
      })];
      const fetchExecutionDurationByType = fetchExecutions.map(({
        type,
        status
      }) => {
        // should always find a duration, fallback to 0 in case something unexpected happened
        const duration = durationMarks[`fetch_${type}`] || 0;
        return {
          duration,
          type,
          status
        };
      });
      const usageCollectorStats = (0, _collector_stats.usageCollectorsStatsCollector)(
      // pass `this` as `usageCollection` to the collector to mimic
      // registering a collector via usageCollection.SetupContract
      this, {
        // isReady stats
        nonReadyCollectorTypes,
        timedOutCollectorsTypes,
        isReadyExecutionDurationByType,
        // fetch stats
        fetchExecutionDurationByType
      });
      return [...fetchExecutions
      // pluck type and result from collector object
      .map(({
        type,
        result
      }) => ({
        type,
        result
      }))
      // only keep data of collectors thar returned a result
      .filter(response => typeof (response === null || response === void 0 ? void 0 : response.result) !== 'undefined'),
      // Treat collector stats as just another "collector"
      {
        type: usageCollectorStats.type,
        result: usageCollectorStats.fetch(context)
      }];
    });
    (0, _defineProperty2.default)(this, "getFilteredCollectorSet", filter => {
      const filtered = [...this.collectors.values()].filter(filter);
      return this.makeCollectorSetFromArray(filtered);
    });
    (0, _defineProperty2.default)(this, "bulkFetchUsage", async (esClient, savedObjectsClient) => {
      const usageCollectors = this.getFilteredCollectorSet(c => c instanceof _usage_collector.UsageCollector);
      return await this.bulkFetch(esClient, savedObjectsClient, usageCollectors.collectors);
    });
    (0, _defineProperty2.default)(this, "toObject", (statsData = []) => {
      return Object.fromEntries(statsData.map(({
        type,
        result
      }) => [type, result]));
    });
    (0, _defineProperty2.default)(this, "toApiFieldNames", apiData => {
      // handle array and return early, or return a reduced object
      if (Array.isArray(apiData)) {
        return apiData.map(value => this.getValueOrRecurse(value));
      }
      return Object.fromEntries(Object.entries(apiData).map(([field, value]) => {
        let newName = field;
        newName = (0, _lodash.snakeCase)(newName);
        newName = newName.replace(/^(1|5|15)_m/, '$1m'); // os.load.15m, os.load.5m, os.load.1m
        newName = newName.replace('_in_bytes', '_bytes');
        newName = newName.replace('_in_millis', '_ms');
        return [newName, this.getValueOrRecurse(value)];
      }));
    });
    (0, _defineProperty2.default)(this, "getValueOrRecurse", value => {
      if (Array.isArray(value) || typeof value === 'object' && value !== null) {
        return this.toApiFieldNames(value); // recurse
      }

      return value;
    });
    (0, _defineProperty2.default)(this, "makeCollectorSetFromArray", collectors => {
      return new CollectorSet({
        logger: this.logger,
        executionContext: this.executionContext,
        maximumWaitTimeForAllCollectorsInS: this.maximumWaitTimeForAllCollectorsInS,
        collectors
      });
    });
    this.logger = logger;
    this.executionContext = _executionContext;
    this.collectors = new Map(_collectors.map(collector => [collector.type, collector]));
    this.maximumWaitTimeForAllCollectorsInS = maximumWaitTimeForAllCollectorsInS;
  }

  /**
   * Instantiates a stats collector with the definition provided in the options
   * @param options Definition of the collector {@link CollectorOptions}
   */
}
exports.CollectorSet = CollectorSet;