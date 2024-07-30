"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.duplicateExceptionListAndItems = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _find_exception_list_items_point_in_time_finder = require("./find_exception_list_items_point_in_time_finder");
var _bulk_create_exception_list_items = require("./bulk_create_exception_list_items");
var _get_exception_list = require("./get_exception_list");
var _create_exception_list = require("./create_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const LISTS_ABLE_TO_DUPLICATE = [_securitysolutionIoTsListTypes.ExceptionListTypeEnum.DETECTION.toString(), _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT.toString()];
const duplicateExceptionListAndItems = async ({
  listId,
  savedObjectsClient,
  namespaceType,
  user
}) => {
  // Generate a new static listId
  const newListId = _uuid.default.v4();

  // fetch list container
  const listToDuplicate = await (0, _get_exception_list.getExceptionList)({
    id: undefined,
    listId,
    namespaceType,
    savedObjectsClient
  });
  if (listToDuplicate == null) {
    throw new Error(`Exception list to duplicat of list_id:${listId} not found.`);
  }
  if (!LISTS_ABLE_TO_DUPLICATE.includes(listToDuplicate.type)) {
    throw new Error(`Exception list of type:${listToDuplicate.type} cannot be duplicated.`);
  }
  const newlyCreatedList = await (0, _create_exception_list.createExceptionList)({
    description: listToDuplicate.description,
    immutable: listToDuplicate.immutable,
    listId: newListId,
    meta: listToDuplicate.meta,
    name: listToDuplicate.name,
    namespaceType: listToDuplicate.namespace_type,
    savedObjectsClient,
    tags: listToDuplicate.tags,
    type: listToDuplicate.type,
    user,
    version: 1
  });

  // fetch associated items
  let itemsToBeDuplicated = [];
  const executeFunctionOnStream = response => {
    const transformedItems = response.data.map(item => {
      // Generate a new static listId
      const newItemId = _uuid.default.v4();
      return {
        comments: [],
        description: item.description,
        entries: item.entries,
        item_id: newItemId,
        list_id: newlyCreatedList.list_id,
        meta: item.meta,
        name: item.name,
        namespace_type: item.namespace_type,
        os_types: item.os_types,
        tags: item.tags,
        type: item.type
      };
    });
    itemsToBeDuplicated = [...itemsToBeDuplicated, ...transformedItems];
  };
  await (0, _find_exception_list_items_point_in_time_finder.findExceptionListsItemPointInTimeFinder)({
    executeFunctionOnStream,
    filter: [],
    listId: [listId],
    maxSize: 10000,
    namespaceType: [namespaceType],
    perPage: undefined,
    savedObjectsClient,
    sortField: undefined,
    sortOrder: undefined
  });
  await (0, _bulk_create_exception_list_items.bulkCreateExceptionListItems)({
    items: itemsToBeDuplicated,
    savedObjectsClient,
    user
  });
  return newlyCreatedList;
};
exports.duplicateExceptionListAndItems = duplicateExceptionListAndItems;