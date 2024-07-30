"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspRuleTemplateSavedObjectMapping = exports.cspRuleSavedObjectMapping = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cspRuleSavedObjectMapping = {
  dynamic: false,
  properties: {
    metadata: {
      type: 'object',
      properties: {
        name: {
          type: 'keyword',
          fields: {
            text: {
              type: 'text'
            }
          }
        }
      }
    },
    package_policy_id: {
      type: 'keyword'
    },
    policy_id: {
      type: 'keyword'
    },
    enabled: {
      type: 'boolean',
      fields: {
        keyword: {
          type: 'keyword'
        }
      }
    }
  }
};
exports.cspRuleSavedObjectMapping = cspRuleSavedObjectMapping;
const cspRuleTemplateSavedObjectMapping = {
  dynamic: false,
  properties: {
    metadata: {
      type: 'object',
      properties: {
        benchmark: {
          type: 'object',
          properties: {
            id: {
              // Needed for filtering rule templates by benchmark.id
              type: 'keyword'
            }
          }
        }
      }
    }
  }
};
exports.cspRuleTemplateSavedObjectMapping = cspRuleTemplateSavedObjectMapping;