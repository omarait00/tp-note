"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFieldsRequest = void 0;
var _fp = require("lodash/fp");
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildFieldsRequest = (fields, excludeEcsData) => (0, _fp.uniq)([...fields.filter(field => !field.startsWith('_')), ...(excludeEcsData ? [] : _constants.TIMELINE_EVENTS_FIELDS)]).map(field => ({
  field,
  include_unmapped: true
}));
exports.buildFieldsRequest = buildFieldsRequest;