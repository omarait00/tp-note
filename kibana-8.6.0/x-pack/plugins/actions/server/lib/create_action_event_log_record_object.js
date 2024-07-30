"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createActionEventLogRecordObject = createActionEventLogRecordObject;
var _lodash = require("lodash");
var _server = require("../../../event_log/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createActionEventLogRecordObject(params) {
  const {
    action,
    message,
    task,
    namespace,
    executionId,
    spaceId,
    consumer,
    relatedSavedObjects
  } = params;
  const kibanaAlertRule = {
    ...(consumer ? {
      consumer
    } : {}),
    ...(executionId ? {
      execution: {
        uuid: executionId
      }
    } : {})
  };
  const event = {
    ...(params.timestamp ? {
      '@timestamp': params.timestamp
    } : {}),
    event: {
      action,
      kind: 'action'
    },
    kibana: {
      ...(!(0, _lodash.isEmpty)(kibanaAlertRule) ? {
        alert: {
          rule: kibanaAlertRule
        }
      } : {}),
      saved_objects: params.savedObjects.map(so => ({
        ...(so.relation ? {
          rel: so.relation
        } : {}),
        type: so.type,
        id: so.id,
        type_id: so.typeId,
        ...(namespace ? {
          namespace
        } : {})
      })),
      ...(spaceId ? {
        space_ids: [spaceId]
      } : {}),
      ...(task ? {
        task: {
          scheduled: task.scheduled,
          schedule_delay: task.scheduleDelay
        }
      } : {})
    },
    ...(message ? {
      message
    } : {})
  };
  for (const relatedSavedObject of relatedSavedObjects || []) {
    var _event$kibana, _event$kibana$saved_o;
    const ruleTypeId = relatedSavedObject.type === 'alert' ? relatedSavedObject.typeId : null;
    if (ruleTypeId) {
      (0, _lodash.set)(event, 'kibana.alert.rule.rule_type_id', ruleTypeId);
    }
    (_event$kibana = event.kibana) === null || _event$kibana === void 0 ? void 0 : (_event$kibana$saved_o = _event$kibana.saved_objects) === null || _event$kibana$saved_o === void 0 ? void 0 : _event$kibana$saved_o.push({
      rel: _server.SAVED_OBJECT_REL_PRIMARY,
      type: relatedSavedObject.type,
      id: relatedSavedObject.id,
      type_id: relatedSavedObject.typeId,
      namespace: relatedSavedObject.namespace
    });
  }
  return event;
}