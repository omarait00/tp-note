"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorAggregator = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a BulkResponse this will return an aggregation based on the errors if any exist
 * from the BulkResponse. Errors are aggregated on the reason as the unique key.
 *
 * Example would be:
 * {
 *   'Parse Error': {
 *      count: 100,
 *      statusCode: 400,
 *   },
 *   'Internal server error': {
 *       count: 3,
 *       statusCode: 500,
 *   }
 * }
 * If this does not return any errors then you will get an empty object like so: {}
 * @param response The bulk response to aggregate based on the error message
 * @param ignoreStatusCodes Optional array of status codes to ignore when creating aggregate error messages
 * @returns The aggregated example as shown above.
 */
const errorAggregator = (response, ignoreStatusCodes) => {
  return response.items.reduce((accum, item) => {
    var _item$create;
    if (((_item$create = item.create) === null || _item$create === void 0 ? void 0 : _item$create.error) != null && !ignoreStatusCodes.includes(item.create.status)) {
      if (accum[item.create.error.reason] == null) {
        accum[item.create.error.reason] = {
          count: 1,
          statusCode: item.create.status
        };
      } else {
        accum[item.create.error.reason] = {
          count: accum[item.create.error.reason].count + 1,
          statusCode: item.create.status
        };
      }
    }
    return accum;
  }, {});
};
exports.errorAggregator = errorAggregator;