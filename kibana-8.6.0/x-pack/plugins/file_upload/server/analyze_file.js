"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyzeFile = analyzeFile;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function analyzeFile(client, data, overrides) {
  overrides.explain = overrides.explain === undefined ? 'true' : overrides.explain;
  const body = await client.asInternalUser.textStructure.findStructure({
    body: data,
    // @ts-expect-error TextStructureFindStructureRequest type is out of date and doesn't include ecs_compatibility
    ecs_compatibility: 'v1',
    ...overrides
  }, {
    maxRetries: 0
  });
  const {
    hasOverrides,
    reducedOverrides
  } = formatOverrides(overrides);
  return {
    ...(hasOverrides && {
      overrides: reducedOverrides
    }),
    // @ts-expect-error type incompatible with FindFileStructureResponse
    results: body
  };
}
function formatOverrides(overrides) {
  let hasOverrides = false;
  const reducedOverrides = Object.keys(overrides).reduce((acc, overrideKey) => {
    const overrideValue = overrides[overrideKey];
    if (overrideValue !== undefined && overrideValue !== '') {
      if (overrideKey === 'column_names') {
        acc.column_names = overrideValue.split(',');
      } else if (overrideKey === 'has_header_row') {
        acc.has_header_row = overrideValue === 'true';
      } else if (overrideKey === 'should_trim_fields') {
        acc.should_trim_fields = overrideValue === 'true';
      } else {
        acc[overrideKey] = overrideValue;
      }
      hasOverrides = true;
    }
    return acc;
  }, {});
  return {
    reducedOverrides,
    hasOverrides
  };
}