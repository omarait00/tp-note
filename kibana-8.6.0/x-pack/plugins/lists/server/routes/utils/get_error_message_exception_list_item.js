"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessageExceptionListItem = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getErrorMessageExceptionListItem = ({
  id,
  itemId
}) => {
  if (id != null) {
    return `exception list item id: "${id}" does not exist`;
  } else if (itemId != null) {
    return `exception list item item_id: "${itemId}" does not exist`;
  } else {
    return 'exception list item does not exist';
  }
};
exports.getErrorMessageExceptionListItem = getErrorMessageExceptionListItem;