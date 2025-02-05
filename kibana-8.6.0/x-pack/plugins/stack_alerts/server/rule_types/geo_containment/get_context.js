"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertId = getAlertId;
exports.getContainedAlertContext = getContainedAlertContext;
exports.getRecoveredAlertContext = getRecoveredAlertContext;
var _lodash = _interopRequireDefault(require("lodash"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getAlertId(entityName, boundaryName) {
  return `${entityName}-${boundaryName}`;
}
function splitAlertId(alertId) {
  const split = alertId.split('-');

  // entityName and boundaryName values are "user provided data" from elasticsearch
  // Values may contain '-', breaking alertId parsing
  // In these cases, recovered alert context cannot be obtained
  if (split.length !== 2) {
    throw new Error(`Can not split alertId '${alertId}' into entity name and boundary name. This can happen when entity name and boundary name contain '-' character.`);
  }
  return {
    entityName: split[0],
    boundaryName: split[1]
  };
}
function getAlertContext({
  entityName,
  containment,
  shapesIdsNamesMap,
  windowEnd,
  isRecovered
}) {
  const context = {
    entityId: entityName,
    entityDateTime: containment.dateInShape || null,
    entityDocumentId: containment.docId,
    entityLocation: `POINT (${containment.location[0]} ${containment.location[1]})`,
    detectionDateTime: new Date(windowEnd).toISOString()
  };
  if (!isRecovered) {
    context.containingBoundaryId = containment.shapeLocationId;
    context.containingBoundaryName = shapesIdsNamesMap && shapesIdsNamesMap[containment.shapeLocationId] || containment.shapeLocationId;
  }
  return context;
}
function getContainedAlertContext(args) {
  return getAlertContext({
    ...args,
    isRecovered: false
  });
}
function getRecoveredAlertContext({
  alertId,
  activeEntities,
  inactiveEntities,
  windowEnd
}) {
  var _activeEntities$get, _inactiveEntities$get;
  const {
    entityName
  } = splitAlertId(alertId);

  // recovered alert's latest entity location is either:
  // 1) activeEntities - entity moved from one boundary to another boundary
  // 2) inactiveEntities - entity moved from one boundary to outside all boundaries
  let containment;
  if (activeEntities.has(entityName) && (_activeEntities$get = activeEntities.get(entityName)) !== null && _activeEntities$get !== void 0 && _activeEntities$get.length) {
    containment = _lodash.default.orderBy(activeEntities.get(entityName), ['dateInShape'], ['desc'])[0];
  } else if (inactiveEntities.has(entityName) && (_inactiveEntities$get = inactiveEntities.get(entityName)) !== null && _inactiveEntities$get !== void 0 && _inactiveEntities$get.length) {
    containment = inactiveEntities.get(entityName)[0];
  }
  return containment ? getAlertContext({
    entityName,
    containment,
    windowEnd,
    isRecovered: true
  }) : null;
}