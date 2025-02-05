"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRawActionTaskParamsIdFromTask = getRawActionTaskParamsIdFromTask;
var _lib = require("../../lib");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getRawActionTaskParamsIdFromTask({
  task,
  spaces,
  savedObjectsSerializer
}) {
  const {
    spaceId,
    actionTaskParamsId
  } = task.attributes.params;
  const namespace = (0, _lib.spaceIdToNamespace)(spaces, spaceId);
  return savedObjectsSerializer.generateRawId(namespace, 'action_task_params', actionTaskParamsId);
}