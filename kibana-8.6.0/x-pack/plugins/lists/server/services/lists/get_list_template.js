"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListTemplate = void 0;
var _list_mappings = _interopRequireDefault(require("./list_mappings.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getListTemplate = index => ({
  index_patterns: [`${index}-*`],
  template: {
    mappings: _list_mappings.default,
    settings: {
      index: {
        lifecycle: {
          name: index,
          rollover_alias: index
        }
      },
      mapping: {
        total_fields: {
          limit: 10000
        }
      }
    }
  }
});
exports.getListTemplate = getListTemplate;