"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortExceptionItemsToUpdateOrCreate = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const sortExceptionItemsToUpdateOrCreate = ({
  items,
  existingLists,
  existingItems,
  isOverwrite,
  user
}) => {
  const results = {
    errors: [],
    itemsToCreate: [],
    itemsToUpdate: []
  };
  for (const chunk of items) {
    const {
      comments,
      description,
      entries,
      item_id: itemId,
      meta,
      list_id: listId,
      name,
      namespace_type: namespaceType,
      os_types: osTypes,
      tags,
      type
    } = chunk;
    const dateNow = new Date().toISOString();
    const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
      namespaceType
    });
    if (existingLists[listId] == null) {
      results.errors = [...results.errors, {
        error: {
          message: `Exception list with list_id: "${listId}", not found for exception list item with item_id: "${itemId}"`,
          status_code: 409
        },
        item_id: itemId,
        list_id: listId
      }];
    } else if (existingItems[itemId] == null) {
      const transformedComments = (0, _.transformCreateCommentsToComments)({
        incomingComments: comments,
        user
      });
      results.itemsToCreate = [...results.itemsToCreate, {
        attributes: {
          comments: transformedComments,
          created_at: dateNow,
          created_by: user,
          description,
          entries,
          immutable: undefined,
          item_id: itemId,
          list_id: listId,
          list_type: 'item',
          meta,
          name,
          os_types: osTypes,
          tags,
          tie_breaker_id: _uuid.default.v4(),
          type,
          updated_by: user,
          version: undefined
        },
        type: savedObjectType
      }];
    } else if (existingItems[itemId] != null && isOverwrite) {
      if (existingItems[itemId].list_id === listId) {
        const transformedComments = (0, _.transformUpdateCommentsToComments)({
          comments,
          existingComments: existingItems[itemId].comments,
          user
        });
        results.itemsToUpdate = [...results.itemsToUpdate, {
          attributes: {
            comments: transformedComments,
            description,
            entries,
            meta,
            name,
            os_types: osTypes,
            tags,
            type,
            updated_by: user
          },
          id: existingItems[itemId].id,
          type: savedObjectType
        }];
      }
    } else if (existingItems[itemId] != null) {
      results.errors = [...results.errors, {
        error: {
          message: `Found that item_id: "${itemId}" already exists. Import of item_id: "${itemId}" skipped.`,
          status_code: 409
        },
        item_id: itemId,
        list_id: listId
      }];
    }
  }
  return results;
};
exports.sortExceptionItemsToUpdateOrCreate = sortExceptionItemsToUpdateOrCreate;