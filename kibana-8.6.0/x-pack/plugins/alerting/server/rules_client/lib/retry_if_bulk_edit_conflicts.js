"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryIfBulkEditConflicts = void 0;
var _pMap = _interopRequireDefault(require("p-map"));
var _lodash = require("lodash");
var _lib = require("../../lib");
var _wait_before_next_retry = require("./wait_before_next_retry");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// max number of failed SO ids in one retry filter
const MaxIdsNumberInRetryFilter = 1000;
/**
 * Retries BulkEdit requests
 * If in response are presents conflicted savedObjects(409 statusCode), this util constructs filter with failed SO ids and retries bulkEdit operation until
 * all SO updated or number of retries exceeded
 * @param logger
 * @param name
 * @param bulkEditOperation
 * @param filter - KueryNode filter
 * @param retries - number of retries left
 * @param accApiKeysToInvalidate - accumulated apiKeys that need to be invalidated
 * @param accResults - accumulated updated savedObjects
 * @param accErrors - accumulated conflict errors
 * @returns Promise<ReturnRetry>
 */
const retryIfBulkEditConflicts = async (logger, name, bulkEditOperation, filter, retries = _wait_before_next_retry.RETRY_IF_CONFLICTS_ATTEMPTS, accApiKeysToInvalidate = [], accResults = [], accErrors = []) => {
  // run the operation, return if no errors or throw if not a conflict error
  try {
    const {
      apiKeysToInvalidate: localApiKeysToInvalidate,
      resultSavedObjects,
      errors: localErrors,
      rules: localRules
    } = await bulkEditOperation(filter);
    const conflictErrorMap = resultSavedObjects.reduce((acc, item) => {
      var _item$error;
      if (item.type === 'alert' && (item === null || item === void 0 ? void 0 : (_item$error = item.error) === null || _item$error === void 0 ? void 0 : _item$error.statusCode) === 409) {
        return acc.set(item.id, {
          message: item.error.message
        });
      }
      return acc;
    }, new Map());
    const results = [...accResults, ...resultSavedObjects.filter(res => res.error === undefined)];
    const apiKeysToInvalidate = [...accApiKeysToInvalidate, ...localApiKeysToInvalidate];
    const errors = [...accErrors, ...localErrors];
    if (conflictErrorMap.size === 0) {
      return {
        apiKeysToInvalidate,
        results,
        errors
      };
    }
    if (retries <= 0) {
      logger.warn(`${name} conflicts, exceeded retries`);
      const conflictErrors = localRules.filter(obj => conflictErrorMap.has(obj.id)).map(obj => {
        var _conflictErrorMap$get, _conflictErrorMap$get2, _obj$attributes$name, _obj$attributes;
        return {
          message: (_conflictErrorMap$get = (_conflictErrorMap$get2 = conflictErrorMap.get(obj.id)) === null || _conflictErrorMap$get2 === void 0 ? void 0 : _conflictErrorMap$get2.message) !== null && _conflictErrorMap$get !== void 0 ? _conflictErrorMap$get : 'n/a',
          rule: {
            id: obj.id,
            name: (_obj$attributes$name = (_obj$attributes = obj.attributes) === null || _obj$attributes === void 0 ? void 0 : _obj$attributes.name) !== null && _obj$attributes$name !== void 0 ? _obj$attributes$name : 'n/a'
          }
        };
      });
      return {
        apiKeysToInvalidate,
        results,
        errors: [...errors, ...conflictErrors]
      };
    }
    const ids = Array.from(conflictErrorMap.keys());
    logger.debug(`${name} conflicts, retrying ..., ${ids.length} saved objects conflicted`);

    // delay before retry
    await (0, _wait_before_next_retry.waitBeforeNextRetry)(retries);

    // here, we construct filter query with ids. But, due to a fact that number of conflicted saved objects can exceed few thousands we can encounter following error:
    // "all shards failed: search_phase_execution_exception: [query_shard_exception] Reason: failed to create query: maxClauseCount is set to 2621"
    // That's why we chunk processing ids into pieces by size equals to MaxIdsNumberInRetryFilter
    return (await (0, _pMap.default)((0, _lodash.chunk)(ids, MaxIdsNumberInRetryFilter), async queryIds => retryIfBulkEditConflicts(logger, name, bulkEditOperation, (0, _lib.convertRuleIdsToKueryNode)(queryIds), retries - 1, apiKeysToInvalidate, results, errors), {
      concurrency: 1
    })).reduce((acc, item) => {
      return {
        results: [...acc.results, ...item.results],
        apiKeysToInvalidate: [...acc.apiKeysToInvalidate, ...item.apiKeysToInvalidate],
        errors: [...acc.errors, ...item.errors]
      };
    }, {
      results: [],
      apiKeysToInvalidate: [],
      errors: []
    });
  } catch (err) {
    throw err;
  }
};
exports.retryIfBulkEditConflicts = retryIfBulkEditConflicts;