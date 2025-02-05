"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.syntheticsServiceApiKey = exports.syntheticsServiceAPIKeySavedObject = exports.syntheticsApiKeyObjectType = exports.syntheticsApiKeyID = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const syntheticsApiKeyID = 'ba997842-b0cf-4429-aa9d-578d9bf0d391';
exports.syntheticsApiKeyID = syntheticsApiKeyID;
const syntheticsApiKeyObjectType = 'uptime-synthetics-api-key';
exports.syntheticsApiKeyObjectType = syntheticsApiKeyObjectType;
const syntheticsServiceApiKey = {
  name: syntheticsApiKeyObjectType,
  hidden: true,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {
      apiKey: {
        type: 'binary'
      }
      /* Leaving these commented to make it clear that these fields exist, even though we don't want them indexed.
         When adding new fields please add them here. If they need to be searchable put them in the uncommented
         part of properties.
      id: {
        type: 'keyword',
      },
      name: {
        type: 'long',
      },
      */
    }
  },

  management: {
    importableAndExportable: false,
    icon: 'uptimeApp',
    getTitle: () => _i18n.i18n.translate('xpack.synthetics.synthetics.service.apiKey', {
      defaultMessage: 'Synthetics service api key'
    })
  }
};
exports.syntheticsServiceApiKey = syntheticsServiceApiKey;
const getEncryptedSOClient = server => {
  const encryptedClient = server.encryptedSavedObjects.getClient({
    includedHiddenTypes: [syntheticsServiceApiKey.name]
  });
  return encryptedClient;
};
const getSyntheticsServiceAPIKey = async server => {
  try {
    const soClient = getEncryptedSOClient(server);
    const obj = await soClient.getDecryptedAsInternalUser(syntheticsServiceApiKey.name, syntheticsApiKeyID);
    return obj === null || obj === void 0 ? void 0 : obj.attributes;
  } catch (getErr) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(getErr)) {
      return undefined;
    }
    throw getErr;
  }
};
const setSyntheticsServiceApiKey = async (soClient, apiKey) => {
  await soClient.create(syntheticsServiceApiKey.name, apiKey, {
    id: syntheticsApiKeyID,
    overwrite: true
  });
};
const deleteSyntheticsServiceApiKey = async soClient => {
  try {
    return await soClient.delete(syntheticsServiceApiKey.name, syntheticsApiKeyID);
  } catch (e) {
    throw e;
  }
};
const syntheticsServiceAPIKeySavedObject = {
  get: getSyntheticsServiceAPIKey,
  set: setSyntheticsServiceApiKey,
  delete: deleteSyntheticsServiceApiKey
};
exports.syntheticsServiceAPIKeySavedObject = syntheticsServiceAPIKeySavedObject;