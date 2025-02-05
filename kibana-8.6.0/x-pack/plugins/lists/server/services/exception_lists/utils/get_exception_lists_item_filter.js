"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListsItemFilter = void 0;
var _escape_query = require("../../utils/escape_query");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExceptionListsItemFilter = ({
  filter,
  listId,
  savedObjectType
}) => {
  return listId.reduce((accum, singleListId, index) => {
    const escapedListId = (0, _escape_query.escapeQuotes)(singleListId);
    const listItemAppend = `(${savedObjectType[index]}.attributes.list_type: item AND ${savedObjectType[index]}.attributes.list_id: "${escapedListId}")`;
    const listItemAppendWithFilter = filter[index] != null ? `(${listItemAppend} AND ${filter[index]})` : listItemAppend;
    if (accum === '') {
      return listItemAppendWithFilter;
    } else {
      return `${accum} OR ${listItemAppendWithFilter}`;
    }
  }, '');
};
exports.getExceptionListsItemFilter = getExceptionListsItemFilter;