"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformStateSchema = exports.transformIdsSchema = exports.transformIdParamSchema = exports.runtimeMappingsSchema = exports.dataViewTitleSchema = void 0;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _constants = require("../constants");
var _shared_imports = require("../shared_imports");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformIdsSchema = _configSchema.schema.arrayOf(_configSchema.schema.object({
  id: _configSchema.schema.string()
}));
exports.transformIdsSchema = transformIdsSchema;
// reflects https://github.com/elastic/elasticsearch/blob/master/x-pack/plugin/core/src/main/java/org/elasticsearch/xpack/core/transform/transforms/TransformStats.java#L250
const transformStateSchema = _configSchema.schema.oneOf([_configSchema.schema.literal(_constants.TRANSFORM_STATE.ABORTING), _configSchema.schema.literal(_constants.TRANSFORM_STATE.FAILED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.INDEXING), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STARTED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STOPPED), _configSchema.schema.literal(_constants.TRANSFORM_STATE.STOPPING), _configSchema.schema.literal(_constants.TRANSFORM_STATE.WAITING)]);
exports.transformStateSchema = transformStateSchema;
const dataViewTitleSchema = _configSchema.schema.object({
  /** Title of the data view for which to return stats. */
  dataViewTitle: _configSchema.schema.string()
});
exports.dataViewTitleSchema = dataViewTitleSchema;
const transformIdParamSchema = _configSchema.schema.object({
  transformId: _configSchema.schema.string()
});
exports.transformIdParamSchema = transformIdParamSchema;
const runtimeMappingsSchema = _configSchema.schema.maybe(_configSchema.schema.object({}, {
  unknowns: 'allow',
  validate: v => {
    if (Object.values(v).some(o => !(0, _shared_imports.isRuntimeField)(o))) {
      return _i18n.i18n.translate('xpack.transform.invalidRuntimeFieldMessage', {
        defaultMessage: 'Invalid runtime field'
      });
    }
  }
}));
exports.runtimeMappingsSchema = runtimeMappingsSchema;