"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstOrLastSeen = exports.firstLastSeenFactory = void 0;
var _fp = require("lodash/fp");
var _security_solution = require("../../../../../common/search_strategy/security_solution");
var _build_query = require("../../../../utils/build_query");
var _queryFirst_or_last_seen = require("./query.first_or_last_seen.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const firstOrLastSeen = {
  buildDsl: options => (0, _queryFirst_or_last_seen.buildFirstOrLastSeenQuery)(options),
  parse: async (options, response) => {
    // First try to get the formatted field if it exists or not.
    const formattedField = (0, _fp.getOr)(null, 'hits.hits[0].fields.@timestamp[0]', response.rawResponse);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryFirst_or_last_seen.buildFirstOrLastSeenQuery)(options))]
    };
    if (options.order === 'asc') {
      return {
        ...response,
        inspect,
        firstSeen: formattedField
      };
    } else {
      return {
        ...response,
        inspect,
        lastSeen: formattedField
      };
    }
  }
};
exports.firstOrLastSeen = firstOrLastSeen;
const firstLastSeenFactory = {
  [_security_solution.FirstLastSeenQuery]: firstOrLastSeen
};
exports.firstLastSeenFactory = firstLastSeenFactory;