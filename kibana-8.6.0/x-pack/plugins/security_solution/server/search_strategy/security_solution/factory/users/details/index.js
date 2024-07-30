"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userDetails = void 0;
var _build_query = require("../../../../../utils/build_query");
var _queryUser_details = require("./query.user_details.dsl");
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const userDetails = {
  buildDsl: options => (0, _queryUser_details.buildUserDetailsQuery)(options),
  parse: async (options, response) => {
    const aggregations = response.rawResponse.aggregations;
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryUser_details.buildUserDetailsQuery)(options))]
    };
    if (aggregations == null) {
      return {
        ...response,
        inspect,
        userDetails: {}
      };
    }
    return {
      ...response,
      inspect,
      userDetails: (0, _helpers.formatUserItem)(aggregations)
    };
  }
};
exports.userDetails = userDetails;