"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteConnectorById = void 0;
var _ = require("../..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const deleteConnectorById = async (client, id) => {
  return await client.asCurrentUser.delete({
    id,
    index: _.CONNECTORS_INDEX
  });
};
exports.deleteConnectorById = deleteConnectorById;