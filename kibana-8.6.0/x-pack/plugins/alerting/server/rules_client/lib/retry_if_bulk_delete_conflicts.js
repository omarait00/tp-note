"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.retryIfBulkDeleteConflicts = void 0;
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

const MAX_RULES_IDS_IN_RETRY = 1000;
/**
 * Retries BulkDelete requests
 * If in response are presents conflicted savedObjects(409 statusCode), this util constructs filter with failed SO ids and retries bulkDelete operation until
 * all SO updated or number of retries exceeded
 * @param logger
 * @param bulkEditOperation
 * @param filter - KueryNode filter
 * @param retries - number of retries left
 * @param accApiKeysToInvalidate - accumulated apiKeys that need to be invalidated
 * @param accErrors - accumulated conflict errors
 * @param accTaskIdsToDelete - accumulated task ids
 * @returns Promise<ReturnRetry>
 */
const retryIfBulkDeleteConflicts = async (logger, bulkDeleteOperation, filter, retries = _wait_before_next_retry.RETRY_IF_CONFLICTS_ATTEMPTS, accApiKeysToInvalidate = [], accErrors = [], accTaskIdsToDelete = []) => {
  try {
    const {
      apiKeysToInvalidate: currentApiKeysToInvalidate,
      errors: currentErrors,
      taskIdsToDelete: currentTaskIdsToDelete
    } = await bulkDeleteOperation(filter);
    const apiKeysToInvalidate = [...accApiKeysToInvalidate, ...currentApiKeysToInvalidate];
    const taskIdsToDelete = [...accTaskIdsToDelete, ...currentTaskIdsToDelete];
    const errors = retries <= 0 ? [...accErrors, ...currentErrors] : [...accErrors, ...currentErrors.filter(error => error.status !== 409)];
    const ruleIdsWithConflictError = currentErrors.reduce((acc, error) => {
      if (error.status === 409) {
        return [...acc, error.rule.id];
      }
      return acc;
    }, []);
    if (ruleIdsWithConflictError.length === 0) {
      return {
        apiKeysToInvalidate,
        errors,
        taskIdsToDelete
      };
    }
    if (retries <= 0) {
      logger.warn('Bulk delete rules conflicts, exceeded retries');
      return {
        apiKeysToInvalidate,
        errors,
        taskIdsToDelete
      };
    }
    logger.debug(`Bulk delete rules conflicts, retrying ..., ${ruleIdsWithConflictError.length} saved objects conflicted`);
    await (0, _wait_before_next_retry.waitBeforeNextRetry)(retries);

    // here, we construct filter query with ids. But, due to a fact that number of conflicted saved objects can exceed few thousands we can encounter following error:
    // "all shards failed: search_phase_execution_exception: [query_shard_exception] Reason: failed to create query: maxClauseCount is set to 2621"
    // That's why we chunk processing ids into pieces by size equals to MAX_RULES_IDS_IN_RETRY
    return (await (0, _pMap.default)((0, _lodash.chunk)(ruleIdsWithConflictError, MAX_RULES_IDS_IN_RETRY), async queryIds => retryIfBulkDeleteConflicts(logger, bulkDeleteOperation, (0, _lib.convertRuleIdsToKueryNode)(queryIds), retries - 1, apiKeysToInvalidate, errors, taskIdsToDelete), {
      concurrency: 1
    })).reduce((acc, item) => {
      return {
        apiKeysToInvalidate: [...acc.apiKeysToInvalidate, ...item.apiKeysToInvalidate],
        errors: [...acc.errors, ...item.errors],
        taskIdsToDelete: [...acc.taskIdsToDelete, ...item.taskIdsToDelete]
      };
    }, {
      apiKeysToInvalidate: [],
      errors: [],
      taskIdsToDelete: []
    });
  } catch (err) {
    throw err;
  }
};
exports.retryIfBulkDeleteConflicts = retryIfBulkDeleteConflicts;