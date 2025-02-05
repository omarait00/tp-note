"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateTimelines = exports.decodeOrThrow = exports.createTimelinesStreamFromNdJson = exports.createPlainError = void 0;
var _pipeable = require("fp-ts/lib/pipeable");
var _Either = require("fp-ts/lib/Either");
var _function = require("fp-ts/lib/function");
var _utils = require("@kbn/utils");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _create_stream_from_ndjson = require("../../../../../utils/read_stream/create_stream_from_ndjson");
var _import_timelines_schema = require("../../../schemas/timelines/import_timelines_schema");
var _common = require("../../../utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createPlainError = message => new Error(message);
exports.createPlainError = createPlainError;
const decodeOrThrow = (runtimeType, createError = createPlainError) => inputValue => (0, _pipeable.pipe)(runtimeType.decode(inputValue), (0, _Either.fold)((0, _common.throwErrors)(createError), _function.identity));
exports.decodeOrThrow = decodeOrThrow;
const validateTimelines = () => (0, _utils.createMapStream)(obj => obj instanceof Error ? new _securitysolutionEsUtils.BadRequestError(obj.message) : decodeOrThrow(_import_timelines_schema.ImportTimelinesSchemaRt)(obj));
exports.validateTimelines = validateTimelines;
const createTimelinesStreamFromNdJson = ruleLimit => {
  return [(0, _utils.createSplitStream)('\n'), (0, _create_stream_from_ndjson.parseNdjsonStrings)(), (0, _create_stream_from_ndjson.filterExportedCounts)(), validateTimelines(), (0, _create_stream_from_ndjson.createLimitStream)(ruleLimit), (0, _utils.createConcatStream)([])];
};
exports.createTimelinesStreamFromNdJson = createTimelinesStreamFromNdJson;