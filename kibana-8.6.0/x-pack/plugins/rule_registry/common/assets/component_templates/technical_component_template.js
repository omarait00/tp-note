"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.technicalComponentTemplate = void 0;
var _mapping_from_field_map = require("../../mapping_from_field_map");
var _technical_rule_field_map = require("../field_maps/technical_rule_field_map");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const technicalComponentTemplate = {
  template: {
    settings: {
      number_of_shards: 1
    },
    mappings: (0, _mapping_from_field_map.mappingFromFieldMap)(_technical_rule_field_map.technicalRuleFieldMap, 'strict')
  }
};
exports.technicalComponentTemplate = technicalComponentTemplate;