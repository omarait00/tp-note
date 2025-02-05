"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMigrations820 = void 0;
var _mapped_params_utils = require("../../../rules_client/lib/mapped_params_utils");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function addMappedParams(doc) {
  const {
    attributes: {
      params
    }
  } = doc;
  const mappedParams = (0, _mapped_params_utils.getMappedParams)(params);
  if (Object.keys(mappedParams).length) {
    return {
      ...doc,
      attributes: {
        ...doc.attributes,
        mapped_params: mappedParams
      }
    };
  }
  return doc;
}
const getMigrations820 = encryptedSavedObjects => (0, _utils.createEsoMigration)(encryptedSavedObjects, doc => true, (0, _utils.pipeMigrations)(addMappedParams));
exports.getMigrations820 = getMigrations820;