"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIlmPolicy = getIlmPolicy;
exports.getIndexTemplate = getIndexTemplate;
var _mappings = _interopRequireDefault(require("../../generated/mappings.json"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// returns the body of an index template used in an ES indices.putTemplate call
function getIndexTemplate(esNames) {
  const indexTemplateBody = {
    index_patterns: [esNames.indexPatternWithVersion],
    template: {
      settings: {
        number_of_shards: 1,
        auto_expand_replicas: '0-1',
        'index.lifecycle.name': esNames.ilmPolicy,
        'index.lifecycle.rollover_alias': esNames.alias,
        'index.hidden': true
      },
      mappings: _mappings.default
    }
  };
  return indexTemplateBody;
}

// returns the body of an ilm policy used in an ES PUT _ilm/policy call
function getIlmPolicy() {
  return {
    policy: {
      phases: {
        hot: {
          actions: {
            rollover: {
              max_size: '50GB',
              max_age: '30d'
              // max_docs: 1, // you know, for testing
            }
          }
        },

        delete: {
          min_age: '90d',
          actions: {
            delete: {}
          }
        }
      }
    }
  };
}