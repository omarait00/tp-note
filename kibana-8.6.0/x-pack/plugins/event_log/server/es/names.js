"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsNames = getEsNames;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const EVENT_LOG_NAME_SUFFIX = `-event-log`;
function getEsNames(baseName, kibanaVersion) {
  const EVENT_LOG_VERSION_SUFFIX = `-${kibanaVersion.toLocaleLowerCase()}`;
  const eventLogName = `${baseName}${EVENT_LOG_NAME_SUFFIX}`;
  const eventLogNameWithVersion = `${eventLogName}${EVENT_LOG_VERSION_SUFFIX}`;
  const eventLogPolicyName = `${baseName.startsWith('.') ? baseName.substring(1) : baseName}${EVENT_LOG_NAME_SUFFIX}-policy`;
  return {
    base: baseName,
    alias: eventLogNameWithVersion,
    ilmPolicy: `${eventLogPolicyName}`,
    indexPattern: `${eventLogName}-*`,
    indexPatternWithVersion: `${eventLogNameWithVersion}-*`,
    initialIndex: `${eventLogNameWithVersion}-000001`,
    indexTemplate: `${eventLogNameWithVersion}-template`
  };
}