"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteServiceGroup = deleteServiceGroup;
var _service_groups = require("../../../common/service_groups");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function deleteServiceGroup({
  savedObjectsClient,
  serviceGroupId
}) {
  return savedObjectsClient.delete(_service_groups.APM_SERVICE_GROUP_SAVED_OBJECT_TYPE, serviceGroupId);
}