"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cspRuleTemplateMigrations = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function migrateCspRuleMetadata(doc, context) {
  const {
    enabled,
    muted,
    benchmark,
    ...metadata
  } = doc.attributes;
  return {
    ...doc,
    attributes: {
      enabled,
      muted,
      metadata: {
        ...metadata,
        benchmark: {
          ...benchmark,
          id: 'cis_k8s'
        },
        impact: metadata.impact || undefined,
        default_value: metadata.default_value || undefined,
        references: metadata.references || undefined
      }
    }
  };
}
const cspRuleTemplateMigrations = {
  '8.4.0': migrateCspRuleMetadata
};
exports.cspRuleTemplateMigrations = cspRuleTemplateMigrations;