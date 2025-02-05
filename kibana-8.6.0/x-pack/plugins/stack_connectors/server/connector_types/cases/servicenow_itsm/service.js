"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYS_DICTIONARY_ENDPOINT = void 0;
Object.defineProperty(exports, "createExternalService", {
  enumerable: true,
  get: function () {
    return _service.createExternalService;
  }
});
var _service = require("../../lib/servicenow/service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const SYS_DICTIONARY_ENDPOINT = `api/now/table/sys_dictionary`;
exports.SYS_DICTIONARY_ENDPOINT = SYS_DICTIONARY_ENDPOINT;