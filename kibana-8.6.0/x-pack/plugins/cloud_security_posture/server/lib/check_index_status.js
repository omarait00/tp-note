"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkIndexStatus = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkIndexStatus = async (esClient, index, logger) => {
  try {
    const queryResult = await esClient.search({
      index,
      query: {
        match_all: {}
      },
      size: 1
    });
    return queryResult.hits.hits.length ? 'not-empty' : 'empty';
  } catch (e) {
    var _e$meta, _e$meta$body, _e$meta$body$error;
    logger.debug(e);
    if ((e === null || e === void 0 ? void 0 : (_e$meta = e.meta) === null || _e$meta === void 0 ? void 0 : (_e$meta$body = _e$meta.body) === null || _e$meta$body === void 0 ? void 0 : (_e$meta$body$error = _e$meta$body.error) === null || _e$meta$body$error === void 0 ? void 0 : _e$meta$body$error.type) === 'security_exception') {
      return 'unprivileged';
    }

    // Assuming index doesn't exist
    return 'empty';
  }
};
exports.checkIndexStatus = checkIndexStatus;