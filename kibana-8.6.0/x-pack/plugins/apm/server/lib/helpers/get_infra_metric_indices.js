"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInfraMetricIndices = getInfraMetricIndices;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getInfraMetricIndices({
  infraPlugin,
  savedObjectsClient
}) {
  const infra = await infraPlugin.start();
  const infraMetricIndices = await infra.getMetricIndices(savedObjectsClient);
  return infraMetricIndices;
}