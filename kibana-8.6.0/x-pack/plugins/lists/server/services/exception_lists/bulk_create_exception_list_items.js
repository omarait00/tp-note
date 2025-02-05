"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateExceptionListItems = void 0;
var _uuid = _interopRequireDefault(require("uuid"));
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const bulkCreateExceptionListItems = async ({
  items,
  savedObjectsClient,
  tieBreaker,
  user
}) => {
  const formattedItems = items.map(item => {
    var _item$namespace_type;
    const savedObjectType = (0, _securitysolutionListUtils.getSavedObjectType)({
      namespaceType: (_item$namespace_type = item.namespace_type) !== null && _item$namespace_type !== void 0 ? _item$namespace_type : 'single'
    });
    const dateNow = new Date().toISOString();
    return {
      attributes: {
        comments: [],
        created_at: dateNow,
        created_by: user,
        description: item.description,
        entries: item.entries,
        immutable: false,
        item_id: item.item_id,
        list_id: item.list_id,
        list_type: 'item',
        meta: item.meta,
        name: item.name,
        os_types: item.os_types,
        tags: item.tags,
        tie_breaker_id: tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4(),
        type: item.type,
        updated_by: user,
        version: undefined
      },
      type: savedObjectType
    };
  });
  const {
    saved_objects: savedObjects
  } = await savedObjectsClient.bulkCreate(formattedItems);
  const result = savedObjects.map(so => (0, _utils.transformSavedObjectToExceptionListItem)({
    savedObject: so
  }));
  return result;
};
exports.bulkCreateExceptionListItems = bulkCreateExceptionListItems;