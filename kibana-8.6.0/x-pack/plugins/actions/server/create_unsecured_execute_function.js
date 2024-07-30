"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBulkUnsecuredExecutionEnqueuerFunction = createBulkUnsecuredExecutionEnqueuerFunction;
var _saved_objects = require("./constants/saved_objects");
var _lib = require("./lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// This allowlist should only contain connector types that don't require API keys for
// execution.
const ALLOWED_CONNECTOR_TYPE_IDS = ['.email'];
function createBulkUnsecuredExecutionEnqueuerFunction({
  taskManager,
  connectorTypeRegistry,
  preconfiguredConnectors
}) {
  return async function execute(internalSavedObjectsRepository, actionsToExecute) {
    const connectorTypeIds = {};
    const connectorIds = [...new Set(actionsToExecute.map(action => action.id))];
    const notPreconfiguredConnectors = connectorIds.filter(connectorId => preconfiguredConnectors.find(connector => connector.id === connectorId) == null);
    if (notPreconfiguredConnectors.length > 0) {
      throw new Error(`${notPreconfiguredConnectors.join(',')} are not preconfigured connectors and can't be scheduled for unsecured actions execution`);
    }
    const connectors = connectorIds.map(connectorId => preconfiguredConnectors.find(pConnector => pConnector.id === connectorId)).filter(Boolean);
    connectors.forEach(connector => {
      const {
        id,
        actionTypeId
      } = connector;
      if (!connectorTypeRegistry.isActionExecutable(id, actionTypeId, {
        notifyUsage: true
      })) {
        connectorTypeRegistry.ensureActionTypeEnabled(actionTypeId);
      }
      if (!ALLOWED_CONNECTOR_TYPE_IDS.includes(actionTypeId)) {
        throw new Error(`${actionTypeId} actions cannot be scheduled for unsecured actions execution`);
      }
      connectorTypeIds[id] = actionTypeId;
    });
    const actions = actionsToExecute.map(actionToExecute => {
      // Get saved object references from action ID and relatedSavedObjects
      const {
        references,
        relatedSavedObjectWithRefs
      } = (0, _lib.extractSavedObjectReferences)(actionToExecute.id, true, actionToExecute.relatedSavedObjects);
      const executionSourceReference = executionSourceAsSavedObjectReferences(actionToExecute.source);
      const taskReferences = [];
      if (executionSourceReference.references) {
        taskReferences.push(...executionSourceReference.references);
      }
      if (references) {
        taskReferences.push(...references);
      }
      return {
        type: _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE,
        attributes: {
          actionId: actionToExecute.id,
          params: actionToExecute.params,
          apiKey: null,
          relatedSavedObjects: relatedSavedObjectWithRefs
        },
        references: taskReferences
      };
    });
    const actionTaskParamsRecords = await internalSavedObjectsRepository.bulkCreate(actions);
    const taskInstances = actionTaskParamsRecords.saved_objects.map(so => {
      const actionId = so.attributes.actionId;
      return {
        taskType: `actions:${connectorTypeIds[actionId]}`,
        params: {
          spaceId: 'default',
          actionTaskParamsId: so.id
        },
        state: {},
        scope: ['actions']
      };
    });
    await taskManager.bulkSchedule(taskInstances);
  };
}
function executionSourceAsSavedObjectReferences(executionSource) {
  return (0, _lib.isSavedObjectExecutionSource)(executionSource) ? {
    references: [{
      name: 'source',
      ...executionSource.source
    }]
  } : {};
}