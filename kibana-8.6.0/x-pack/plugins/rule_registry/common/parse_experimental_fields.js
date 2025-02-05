"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExperimentalFields = void 0;
var _Either = require("fp-ts/lib/Either");
var _PathReporter = require("io-ts/lib/PathReporter");
var _lodash = require("lodash");
var _experimental_rule_field_map = require("./assets/field_maps/experimental_rule_field_map");
var _field_map = require("./field_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const experimentalFieldRuntimeType = (0, _field_map.runtimeTypeFromFieldMap)(_experimental_rule_field_map.experimentalRuleFieldMap);
const parseExperimentalFields = (input, partial = false) => {
  const decodePartial = alert => {
    const limitedFields = (0, _lodash.pick)(_experimental_rule_field_map.experimentalRuleFieldMap, Object.keys(alert));
    const partialTechnicalFieldRuntimeType = (0, _field_map.runtimeTypeFromFieldMap)(limitedFields);
    return partialTechnicalFieldRuntimeType.decode(alert);
  };
  const validate = partial ? decodePartial(input) : experimentalFieldRuntimeType.decode(input);
  if ((0, _Either.isLeft)(validate)) {
    throw new Error(_PathReporter.PathReporter.report(validate).join('\n'));
  }
  return experimentalFieldRuntimeType.encode(validate.right);
};
exports.parseExperimentalFields = parseExperimentalFields;