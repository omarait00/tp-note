"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourceUriForAgentPolicy = void 0;
var _services = require("../../services");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSourceUriForAgentPolicy = async (soClient, agentPolicy) => {
  const defaultDownloadSourceId = await _services.downloadSourceService.getDefaultDownloadSourceId(soClient);
  if (!defaultDownloadSourceId) {
    throw new Error('Default download source host is not setup');
  }
  const downloadSourceId = agentPolicy.download_source_id || defaultDownloadSourceId;
  const downloadSource = await _services.downloadSourceService.get(soClient, downloadSourceId);
  if (!downloadSource) {
    throw new Error(`Download source host not found ${downloadSourceId}`);
  }
  return downloadSource.host;
};
exports.getSourceUriForAgentPolicy = getSourceUriForAgentPolicy;