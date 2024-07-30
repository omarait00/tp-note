"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetMetadataListRequestSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _constants = require("../constants");
var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const GetMetadataListRequestSchema = {
  query: _configSchema.schema.object({
    page: _configSchema.schema.number({
      defaultValue: _constants.ENDPOINT_DEFAULT_PAGE,
      min: 0
    }),
    pageSize: _configSchema.schema.number({
      defaultValue: _constants.ENDPOINT_DEFAULT_PAGE_SIZE,
      min: 1,
      max: 10000
    }),
    kuery: _configSchema.schema.maybe(_configSchema.schema.string()),
    hostStatuses: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.literal(_types.HostStatus.HEALTHY.toString()), _configSchema.schema.literal(_types.HostStatus.OFFLINE.toString()), _configSchema.schema.literal(_types.HostStatus.UPDATING.toString()), _configSchema.schema.literal(_types.HostStatus.UNHEALTHY.toString()), _configSchema.schema.literal(_types.HostStatus.INACTIVE.toString())])))
  }, {
    defaultValue: {
      page: _constants.ENDPOINT_DEFAULT_PAGE,
      pageSize: _constants.ENDPOINT_DEFAULT_PAGE_SIZE
    }
  })
};
exports.GetMetadataListRequestSchema = GetMetadataListRequestSchema;