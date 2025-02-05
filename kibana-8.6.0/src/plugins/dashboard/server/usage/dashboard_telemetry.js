"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collectDashboardTelemetry = collectDashboardTelemetry;
exports.getEmptyPanelTypeData = exports.getEmptyDashboardData = exports.controlsCollectorFactory = exports.collectPanelsByType = void 0;
var _lodash = require("lodash");
var _common = require("../../../controls/common");
var _server = require("../../../controls/server");
var _dashboard_telemetry_collection_task = require("./dashboard_telemetry_collection_task");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getEmptyDashboardData = () => ({
  panels: {
    total: 0,
    by_reference: 0,
    by_value: 0,
    by_type: {}
  },
  controls: (0, _server.initializeControlGroupTelemetry)({})
});
exports.getEmptyDashboardData = getEmptyDashboardData;
const getEmptyPanelTypeData = () => ({
  total: 0,
  by_reference: 0,
  by_value: 0,
  details: {}
});
exports.getEmptyPanelTypeData = getEmptyPanelTypeData;
const collectPanelsByType = (panels, collectorData, embeddableService) => {
  collectorData.panels.total += panels.length;
  for (const panel of panels) {
    const type = panel.type;
    if (!collectorData.panels.by_type[type]) {
      collectorData.panels.by_type[type] = getEmptyPanelTypeData();
    }
    collectorData.panels.by_type[type].total += 1;
    if (panel.id === undefined) {
      collectorData.panels.by_value += 1;
      collectorData.panels.by_type[type].by_value += 1;
    } else {
      collectorData.panels.by_reference += 1;
      collectorData.panels.by_type[type].by_reference += 1;
    }
    // the following "details" need a follow-up that will actually properly consolidate
    // the data from all embeddables - right now, the only data that is kept is the
    // telemetry for the **final** embeddable of that type
    collectorData.panels.by_type[type].details = embeddableService.telemetry({
      ...panel.embeddableConfig,
      id: panel.id || '',
      type: panel.type
    }, collectorData.panels.by_type[type].details);
  }
};
exports.collectPanelsByType = collectPanelsByType;
const controlsCollectorFactory = embeddableService => (attributes, collectorData) => {
  const controlGroupAttributes = attributes.controlGroupInput;
  if (!(0, _lodash.isEmpty)(controlGroupAttributes)) {
    collectorData.controls = embeddableService.telemetry({
      ...controlGroupAttributes,
      type: _common.CONTROL_GROUP_TYPE,
      id: `DASHBOARD_${_common.CONTROL_GROUP_TYPE}`
    }, collectorData.controls);
  }
  return collectorData;
};
exports.controlsCollectorFactory = controlsCollectorFactory;
async function getLatestTaskState(taskManager) {
  try {
    const result = await taskManager.fetch({
      query: {
        bool: {
          filter: {
            term: {
              _id: `task:${_dashboard_telemetry_collection_task.TASK_ID}`
            }
          }
        }
      }
    });
    return result.docs;
  } catch (err) {
    const errMessage = err && err.message ? err.message : err.toString();
    /*
        The usage service WILL to try to fetch from this collector before the task manager has been initialized, because the
        task manager has to wait for all plugins to initialize first. It's fine to ignore it as next time around it will be
        initialized (or it will throw a different type of error)
      */
    if (!errMessage.includes('NotInitialized')) {
      throw err;
    }
  }
  return null;
}
async function collectDashboardTelemetry(taskManager) {
  const latestTaskState = await getLatestTaskState(taskManager);
  if (latestTaskState !== null) {
    const state = latestTaskState[0].state;
    return state.telemetry;
  }
  return getEmptyDashboardData();
}