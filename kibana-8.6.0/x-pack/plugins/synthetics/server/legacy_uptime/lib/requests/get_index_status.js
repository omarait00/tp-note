"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexStatus = async ({
  uptimeEsClient
}) => {
  try {
    const {
      indices,
      result: {
        body: {
          _shards: {
            total
          }
        }
      }
    } = await uptimeEsClient.count({
      terminate_after: 1
    });
    return {
      indices,
      indexExists: total > 0
    };
  } catch (e) {
    if (e.meta.statusCode === 404) {
      // we don't throw an error for index not found
      return {
        indices: '',
        indexExists: false
      };
    }
    throw e;
  }
};
exports.getIndexStatus = getIndexStatus;