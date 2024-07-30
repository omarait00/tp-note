"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldByName = exports.findIndexPatternById = void 0;
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @deprecated Use data views api instead
 */
const getFieldByName = (fieldName, indexPattern) => {
  const fields = indexPattern && JSON.parse(indexPattern.attributes.fields);
  const field = fields && fields.find(f => f.name === fieldName);
  return field;
};

/**
 * @deprecated Use data views api instead
 */
exports.getFieldByName = getFieldByName;
const findIndexPatternById = async (savedObjectsClient, index) => {
  const savedObjectsResponse = await savedObjectsClient.find({
    type: _common.DATA_VIEW_SAVED_OBJECT_TYPE,
    fields: ['fields'],
    search: `"${index}"`,
    searchFields: ['title']
  });
  if (savedObjectsResponse.total > 0) {
    return savedObjectsResponse.saved_objects[0];
  }
};
exports.findIndexPatternById = findIndexPatternById;