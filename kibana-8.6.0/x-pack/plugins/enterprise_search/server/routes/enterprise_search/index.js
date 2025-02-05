"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerEnterpriseSearchRoutes = void 0;
var _documents = require("./documents");
var _indices = require("./indices");
var _mapping = require("./mapping");
var _search = require("./search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerEnterpriseSearchRoutes = dependencies => {
  (0, _indices.registerIndexRoutes)(dependencies);
  (0, _mapping.registerMappingRoute)(dependencies);
  (0, _search.registerSearchRoute)(dependencies);
  (0, _documents.registerDocumentRoute)(dependencies);
};
exports.registerEnterpriseSearchRoutes = registerEnterpriseSearchRoutes;