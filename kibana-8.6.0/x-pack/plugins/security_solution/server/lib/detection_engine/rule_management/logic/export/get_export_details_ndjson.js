"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportDetailsNdjson = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExportDetailsNdjson = (rules, missingRules = [], exceptionDetails) => {
  const stringified = {
    exported_count: exceptionDetails == null ? rules.length : rules.length + exceptionDetails.exported_exception_list_count + exceptionDetails.exported_exception_list_item_count,
    exported_rules_count: rules.length,
    missing_rules: missingRules,
    missing_rules_count: missingRules.length,
    ...exceptionDetails
  };
  return `${JSON.stringify(stringified)}\n`;
};
exports.getExportDetailsNdjson = getExportDetailsNdjson;