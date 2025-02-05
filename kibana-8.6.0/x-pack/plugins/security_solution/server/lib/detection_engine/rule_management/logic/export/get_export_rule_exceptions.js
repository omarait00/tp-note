"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleExceptionsForExport = exports.getExportableExceptions = exports.getDefaultExportDetails = exports.createPromises = exports.EXCEPTIONS_EXPORT_CHUNK_SIZE = void 0;
var _fp = require("lodash/fp");
var _securitysolutionListConstants = require("@kbn/securitysolution-list-constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const NON_EXPORTABLE_LIST_IDS = [_securitysolutionListConstants.ENDPOINT_LIST_ID];
const EXCEPTIONS_EXPORT_CHUNK_SIZE = 50;
exports.EXCEPTIONS_EXPORT_CHUNK_SIZE = EXCEPTIONS_EXPORT_CHUNK_SIZE;
const getRuleExceptionsForExport = async (exceptions, exceptionsListClient) => {
  const uniqueExceptionLists = new Set();
  if (exceptionsListClient != null) {
    const exceptionsWithoutUnexportableLists = exceptions.filter(list => {
      if (!uniqueExceptionLists.has(list.id)) {
        uniqueExceptionLists.add(list.id);
        return !NON_EXPORTABLE_LIST_IDS.includes(list.list_id);
      } else {
        return false;
      }
    });
    return getExportableExceptions(exceptionsWithoutUnexportableLists, exceptionsListClient);
  } else {
    return {
      exportData: '',
      exportDetails: getDefaultExportDetails()
    };
  }
};
exports.getRuleExceptionsForExport = getRuleExceptionsForExport;
const getExportableExceptions = async (exceptions, exceptionsListClient) => {
  let exportString = '';
  const exportDetails = getDefaultExportDetails();
  const exceptionChunks = (0, _fp.chunk)(EXCEPTIONS_EXPORT_CHUNK_SIZE, exceptions);
  for await (const exceptionChunk of exceptionChunks) {
    const promises = createPromises(exceptionsListClient, exceptionChunk);
    const responses = await Promise.all(promises);
    for (const res of responses) {
      if (res != null) {
        const {
          exportDetails: {
            exported_exception_list_count: exportedExceptionListCount,
            exported_exception_list_item_count: exportedExceptionListItemCount
          },
          exportData
        } = res;
        exportDetails.exported_exception_list_count = exportDetails.exported_exception_list_count + exportedExceptionListCount;
        exportDetails.exported_exception_list_item_count = exportDetails.exported_exception_list_item_count + exportedExceptionListItemCount;
        exportString = `${exportString}${exportData}`;
      }
    }
  }
  return {
    exportDetails,
    exportData: exportString
  };
};

/**
 * Creates promises of the exceptions to be exported and returns them.
 * @param exceptionsListClient Exception Lists client
 * @param exceptions The exceptions to be exported
 * @returns Promise of export ready exceptions.
 */
exports.getExportableExceptions = getExportableExceptions;
const createPromises = (exceptionsListClient, exceptions) => {
  return exceptions.map(async ({
    id,
    list_id: listId,
    namespace_type: namespaceType
  }) => {
    return exceptionsListClient.exportExceptionListAndItems({
      id,
      listId,
      namespaceType
    });
  });
};
exports.createPromises = createPromises;
const getDefaultExportDetails = () => ({
  exported_exception_list_count: 0,
  exported_exception_list_item_count: 0,
  missing_exception_list_item_count: 0,
  missing_exception_list_items: [],
  missing_exception_lists: [],
  missing_exception_lists_count: 0
});
exports.getDefaultExportDetails = getDefaultExportDetails;