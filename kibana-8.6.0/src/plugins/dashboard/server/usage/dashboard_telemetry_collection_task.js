"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TASK_ID = void 0;
exports.dashboardTaskRunner = dashboardTaskRunner;
exports.initializeDashboardTelemetryTask = initializeDashboardTelemetryTask;
exports.scheduleDashboardTelemetry = scheduleDashboardTelemetry;
var _moment = _interopRequireDefault(require("moment"));
var _dashboard_telemetry = require("./dashboard_telemetry");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// This task is responsible for running daily and aggregating all the Dashboard telemerty data
// into a single document. This is an effort to make sure the load of fetching/parsing all of the
// dashboards will only occur once per day
const TELEMETRY_TASK_TYPE = 'dashboard_telemetry';
const TASK_ID = `Dashboard-${TELEMETRY_TASK_TYPE}`;
exports.TASK_ID = TASK_ID;
function initializeDashboardTelemetryTask(logger, core, taskManager, embeddable) {
  registerDashboardTelemetryTask(logger, core, taskManager, embeddable);
}
function scheduleDashboardTelemetry(logger, taskManager) {
  return scheduleTasks(logger, taskManager);
}
function registerDashboardTelemetryTask(logger, core, taskManager, embeddable) {
  taskManager.registerTaskDefinitions({
    [TELEMETRY_TASK_TYPE]: {
      title: 'Dashboard telemetry collection task',
      timeout: '2m',
      createTaskRunner: dashboardTaskRunner(logger, core, embeddable)
    }
  });
}
async function scheduleTasks(logger, taskManager) {
  try {
    return await taskManager.ensureScheduled({
      id: TASK_ID,
      taskType: TELEMETRY_TASK_TYPE,
      state: {
        byDate: {},
        suggestionsByDate: {},
        saved: {},
        runs: 0
      },
      params: {}
    });
  } catch (e) {
    logger.debug(`Error scheduling task, received ${e.message}`);
  }
}
function dashboardTaskRunner(logger, core, embeddable) {
  return ({
    taskInstance
  }) => {
    const {
      state
    } = taskInstance;
    const getEsClient = async () => {
      const [coreStart] = await core.getStartServices();
      return coreStart.elasticsearch.client.asInternalUser;
    };
    return {
      async run() {
        let dashboardData = (0, _dashboard_telemetry.getEmptyDashboardData)();
        const controlsCollector = (0, _dashboard_telemetry.controlsCollectorFactory)(embeddable);
        const processDashboards = dashboards => {
          for (const dashboard of dashboards) {
            const attributes = (0, _common.injectReferences)(dashboard, {
              embeddablePersistableStateService: embeddable
            });
            dashboardData = controlsCollector(attributes, dashboardData);
            try {
              const panels = JSON.parse(attributes.panelsJSON);
              (0, _dashboard_telemetry.collectPanelsByType)(panels, dashboardData, embeddable);
            } catch (e) {
              logger.warn('Unable to parse panelsJSON for telemetry collection');
            }
          }
          return dashboardData;
        };
        const kibanaIndex = core.savedObjects.getKibanaIndex();
        const pageSize = 50;
        const searchParams = {
          size: pageSize,
          index: kibanaIndex,
          ignore_unavailable: true,
          filter_path: ['hits.hits', '_scroll_id'],
          body: {
            query: {
              bool: {
                filter: {
                  term: {
                    type: 'dashboard'
                  }
                }
              }
            }
          },
          scroll: '30s'
        };

        // Get and process all of the dashboards
        try {
          const esClient = await getEsClient();
          let result = await esClient.search(searchParams);
          dashboardData = processDashboards(result.hits.hits.map(h => {
            if (h._source) {
              return {
                attributes: h._source.dashboard,
                references: h._source.references
              };
            }
            return undefined;
          }).filter(s => s !== undefined));
          while (result._scroll_id && result.hits.hits.length > 0) {
            result = await esClient.scroll({
              scroll_id: result._scroll_id,
              scroll: '30s'
            });
            dashboardData = processDashboards(result.hits.hits.map(h => {
              if (h._source) {
                return {
                  attributes: h._source.dashboard,
                  references: h._source.references
                };
              }
              return undefined;
            }).filter(s => s !== undefined));
          }
          return {
            state: {
              runs: (state.runs || 0) + 1,
              telemetry: dashboardData
            },
            runAt: getNextMidnight()
          };
        } catch (e) {
          return {
            state: {
              runs: state.runs + 1
            },
            runAt: getNextFailureRetry()
          };
        }
      },
      async cancel() {}
    };
  };
}
function getNextMidnight() {
  return (0, _moment.default)().add(1, 'day').startOf('day').toDate();
}
function getNextFailureRetry() {
  return (0, _moment.default)().add(1, 'hour').toDate();
}