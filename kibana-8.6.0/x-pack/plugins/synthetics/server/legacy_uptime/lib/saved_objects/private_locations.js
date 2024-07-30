"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSyntheticsPrivateLocations = exports.privateLocationsSavedObjectId = exports.privateLocationsSavedObject = exports.getSyntheticsPrivateLocations = void 0;
var _server = require("../../../../../../../src/core/server");
var _private_locations = require("../../../../common/saved_objects/private_locations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const privateLocationsSavedObjectId = 'synthetics-privates-locations-singleton';
exports.privateLocationsSavedObjectId = privateLocationsSavedObjectId;
const privateLocationsSavedObject = {
  name: _private_locations.privateLocationsSavedObjectName,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    properties: {
      /* Leaving these commented to make it clear that these fields exist, even though we don't want them indexed.
         When adding new fields please add them here. If they need to be searchable put them in the uncommented
         part of properties.
      */
    }
  },
  management: {
    importableAndExportable: true
  }
};
exports.privateLocationsSavedObject = privateLocationsSavedObject;
const getSyntheticsPrivateLocations = async client => {
  try {
    var _obj$attributes$locat;
    const obj = await client.get(privateLocationsSavedObject.name, privateLocationsSavedObjectId);
    return (_obj$attributes$locat = obj === null || obj === void 0 ? void 0 : obj.attributes.locations) !== null && _obj$attributes$locat !== void 0 ? _obj$attributes$locat : [];
  } catch (getErr) {
    if (_server.SavedObjectsErrorHelpers.isNotFoundError(getErr)) {
      return [];
    }
    throw getErr;
  }
};
exports.getSyntheticsPrivateLocations = getSyntheticsPrivateLocations;
const setSyntheticsPrivateLocations = async (client, privateLocations) => {
  await client.create(privateLocationsSavedObject.name, privateLocations, {
    id: privateLocationsSavedObjectId,
    overwrite: true
  });
};
exports.setSyntheticsPrivateLocations = setSyntheticsPrivateLocations;