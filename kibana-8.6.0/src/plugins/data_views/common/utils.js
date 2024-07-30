"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findByName = findByName;
var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns an object matching a given name
 *
 * @param client {SavedObjectsClientCommon}
 * @param name {string}
 * @returns {SavedObject|undefined}
 */
async function findByName(client, name) {
  if (name) {
    const savedObjects = await client.find({
      type: _constants.DATA_VIEW_SAVED_OBJECT_TYPE,
      perPage: 10,
      search: `"${name}"`,
      searchFields: ['name.keyword'],
      fields: ['name']
    });
    return savedObjects ? savedObjects[0] : undefined;
  }
}