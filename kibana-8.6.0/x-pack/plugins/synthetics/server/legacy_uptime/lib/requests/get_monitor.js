"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSyntheticsMonitor = void 0;
var _synthetics_monitor = require("../saved_objects/synthetics_monitor");
var _secrets = require("../../../synthetics_service/utils/secrets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSyntheticsMonitor = async ({
  monitorId,
  encryptedSavedObjectsClient,
  savedObjectsClient
}) => {
  try {
    var _encryptedMonitor$nam;
    const encryptedMonitor = await savedObjectsClient.get(_synthetics_monitor.syntheticsMonitorType, monitorId);
    const decryptedMonitor = await encryptedSavedObjectsClient.getDecryptedAsInternalUser(_synthetics_monitor.syntheticsMonitorType, monitorId, {
      namespace: (_encryptedMonitor$nam = encryptedMonitor.namespaces) === null || _encryptedMonitor$nam === void 0 ? void 0 : _encryptedMonitor$nam[0]
    });
    return (0, _secrets.normalizeSecrets)(decryptedMonitor);
  } catch (e) {
    throw e;
  }
};
exports.getSyntheticsMonitor = getSyntheticsMonitor;