"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertAuditAction = void 0;
exports.alertAuditEvent = alertAuditEvent;
exports.operationAlertAuditActionMap = void 0;
var _server = require("../../../alerting/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let AlertAuditAction;
exports.AlertAuditAction = AlertAuditAction;
(function (AlertAuditAction) {
  AlertAuditAction["GET"] = "alert_get";
  AlertAuditAction["UPDATE"] = "alert_update";
  AlertAuditAction["FIND"] = "alert_find";
})(AlertAuditAction || (exports.AlertAuditAction = AlertAuditAction = {}));
const operationAlertAuditActionMap = {
  [_server.WriteOperations.Update]: AlertAuditAction.UPDATE,
  [_server.ReadOperations.Find]: AlertAuditAction.FIND,
  [_server.ReadOperations.Get]: AlertAuditAction.GET
};
exports.operationAlertAuditActionMap = operationAlertAuditActionMap;
const eventVerbs = {
  alert_get: ['access', 'accessing', 'accessed'],
  alert_update: ['update', 'updating', 'updated'],
  alert_find: ['access', 'accessing', 'accessed']
};
const eventTypes = {
  alert_get: 'access',
  alert_update: 'change',
  alert_find: 'access'
};
function alertAuditEvent({
  action,
  id,
  outcome,
  error
}) {
  const doc = id ? `alert [id=${id}]` : 'an alert';
  const [present, progressive, past] = eventVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === 'unknown' ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = eventTypes[action];
  return {
    message,
    event: {
      action,
      category: ['database'],
      type: type ? [type] : undefined,
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? 'failure' : 'success'
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}