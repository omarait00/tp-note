"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importRuleExceptions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Util to call into exceptions list client import logic
 * @param exceptions {array} - exception lists and items to import
 * @param exceptionsClient {object}
 * @param overwrite {boolean} - user defined value whether or not to overwrite
 * any exception lists found to have an existing matching list
 * @param maxExceptionsImportSize {number} - max number of exception objects allowed to import
 * @returns {Promise} an object summarizing success and errors during import
 */
const importRuleExceptions = async ({
  exceptions,
  exceptionsClient,
  overwrite,
  maxExceptionsImportSize
}) => {
  if (exceptionsClient == null) {
    return {
      success: true,
      errors: [],
      successCount: 0
    };
  }
  const {
    errors,
    success,
    // return only count of exception list items, without count excpetions list
    // to be consistent with UI, and users shouldn't know about backend structure
    success_count_exception_list_items: successCount
  } = await exceptionsClient.importExceptionListAndItemsAsArray({
    exceptionsToImport: exceptions,
    overwrite,
    maxExceptionsImportSize
  });
  return {
    errors,
    success,
    successCount
  };
};
exports.importRuleExceptions = importRuleExceptions;