"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsHosts = getEsHosts;
var _common = require("../../../fleet/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getEsHosts({
  cloud,
  config
}) {
  var _decodeCloudId;
  const cloudId = (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) && cloud.cloudId;
  const cloudUrl = cloudId && ((_decodeCloudId = (0, _common.decodeCloudId)(cloudId)) === null || _decodeCloudId === void 0 ? void 0 : _decodeCloudId.elasticsearchUrl);
  const cloudHosts = cloudUrl ? [cloudUrl] : undefined;
  if (cloudHosts && cloudHosts.length > 0) {
    return cloudHosts;
  }
  const flagHosts = config.hosts;
  if (flagHosts && flagHosts.length > 0) {
    return flagHosts;
  }
  return [];
}