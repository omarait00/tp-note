"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExport = exports.exportExceptionListAndItems = void 0;
var _securitysolutionUtils = require("@kbn/securitysolution-utils");
var _find_exception_list_item_point_in_time_finder = require("./find_exception_list_item_point_in_time_finder");
var _get_exception_list = require("./get_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const exportExceptionListAndItems = async ({
  id,
  listId,
  namespaceType,
  savedObjectsClient
}) => {
  const exceptionList = await (0, _get_exception_list.getExceptionList)({
    id,
    listId,
    namespaceType,
    savedObjectsClient
  });
  if (exceptionList == null) {
    return null;
  } else {
    // Stream the results from the Point In Time (PIT) finder into this array
    let exceptionItems = [];
    const executeFunctionOnStream = response => {
      exceptionItems = [...exceptionItems, ...response.data];
    };
    await (0, _find_exception_list_item_point_in_time_finder.findExceptionListItemPointInTimeFinder)({
      executeFunctionOnStream,
      filter: undefined,
      listId: exceptionList.list_id,
      maxSize: undefined,
      // NOTE: This is unbounded when it is "undefined"
      namespaceType: exceptionList.namespace_type,
      perPage: 1_000,
      // See https://github.com/elastic/kibana/issues/93770 for choice of 1k
      savedObjectsClient,
      sortField: 'exception-list.created_at',
      sortOrder: 'desc'
    });
    const {
      exportData
    } = getExport([exceptionList, ...exceptionItems]);

    // TODO: Add logic for missing lists and items on errors
    return {
      exportData: `${exportData}`,
      exportDetails: {
        exported_exception_list_count: 1,
        exported_exception_list_item_count: exceptionItems.length,
        missing_exception_list_item_count: 0,
        missing_exception_list_items: [],
        missing_exception_lists: [],
        missing_exception_lists_count: 0
      }
    };
  }
};
exports.exportExceptionListAndItems = exportExceptionListAndItems;
const getExport = data => {
  const ndjson = (0, _securitysolutionUtils.transformDataToNdjson)(data);
  return {
    exportData: ndjson
  };
};
exports.getExport = getExport;