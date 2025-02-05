"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.translateLegacySchemaPaths = translateLegacySchemaPaths;
var _fleet = require("../../../common/fleet");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function translateLegacySchemaPaths(apmServerSchema) {
  return Object.keys(apmServerSchema).reduce((acc, apmServerSchemaKey) => {
    const currentSchemaPath = _fleet.LEGACY_TO_CURRENT_SCHEMA_PATHS[apmServerSchemaKey] || apmServerSchemaKey;
    return {
      ...acc,
      [currentSchemaPath]: apmServerSchema[apmServerSchemaKey]
    };
  }, {});
}