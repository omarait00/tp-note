"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataViewMissingIndices = void 0;
var _common = require("../../../kibana_utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable @kbn/imports/uniform_imports */

/**
 * Tried to call a method that relies on SearchSource having an indexPattern assigned
 */
class DataViewMissingIndices extends _common.KbnError {
  constructor(message) {
    const defaultMessage = "Data view's title does not match any indices";
    super(message && message.length ? `No matching indices found: ${message}` : defaultMessage);
  }
}
exports.DataViewMissingIndices = DataViewMissingIndices;