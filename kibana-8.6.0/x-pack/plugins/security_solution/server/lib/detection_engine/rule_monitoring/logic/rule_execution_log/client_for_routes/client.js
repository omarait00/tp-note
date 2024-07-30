"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createClientForRoutes = void 0;
var _lodash = require("lodash");
var _promise_pool = require("../../../../../../utils/promise_pool");
var _with_security_span = require("../../../../../../utils/with_security_span");
var _normalization = require("../utils/normalization");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RULES_PER_CHUNK = 1000;
const createClientForRoutes = (soClient, eventLog, logger) => {
  return {
    getExecutionSummariesBulk: ruleIds => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForRoutes.getExecutionSummariesBulk', async () => {
        try {
          // This method splits work into chunks so not to overwhelm Elasticsearch
          // when fetching statuses for a big number of rules.
          const ruleIdsChunks = (0, _lodash.chunk)(ruleIds, RULES_PER_CHUNK);
          const {
            results,
            errors
          } = await (0, _promise_pool.initPromisePool)({
            concurrency: 1,
            items: ruleIdsChunks,
            executor: async ruleIdsChunk => {
              try {
                const savedObjectsByRuleId = await soClient.getManyByRuleIds(ruleIdsChunk);
                return (0, _lodash.mapValues)(savedObjectsByRuleId, so => {
                  var _so$attributes;
                  return (_so$attributes = so === null || so === void 0 ? void 0 : so.attributes) !== null && _so$attributes !== void 0 ? _so$attributes : null;
                });
              } catch (e) {
                var _e$stack;
                const ruleIdsString = `[${(0, _normalization.truncateList)(ruleIdsChunk).join(', ')}]`;
                const logMessage = 'Error fetching a chunk of rule execution saved objects';
                const logReason = e instanceof Error ? (_e$stack = e.stack) !== null && _e$stack !== void 0 ? _e$stack : e.message : String(e);
                const logSuffix = `[${ruleIdsChunk.length} rules][rule ids: ${ruleIdsString}]`;
                logger.error(`${logMessage}: ${logReason} ${logSuffix}`);
                throw e;
              }
            }
          });
          if (errors.length) {
            const numAllChunks = ruleIdsChunks.length;
            const numFailedChunks = errors.length;
            const message = `Error fetching rule execution saved objects in chunks: ${numFailedChunks}/${numAllChunks} chunks failed`;
            throw new AggregateError(errors, message);
          }

          // Merge all rule statuses into a single dict
          return Object.assign({}, ...results.map(({
            result
          }) => result));
        } catch (e) {
          const ruleIdsString = `[${(0, _normalization.truncateList)(ruleIds).join(', ')}]`;
          const logMessage = 'Error bulk getting rule execution summaries';
          const logReason = e instanceof Error ? e.message : String(e);
          const logSuffix = `[${ruleIds.length} rules][rule ids: ${ruleIdsString}]`;
          logger.error(`${logMessage}: ${logReason} ${logSuffix}`);
          throw e;
        }
      });
    },
    getExecutionSummary: ruleId => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForRoutes.getExecutionSummary', async () => {
        try {
          const savedObject = await soClient.getOneByRuleId(ruleId);
          return savedObject ? savedObject.attributes : null;
        } catch (e) {
          const logMessage = 'Error getting rule execution summary';
          const logReason = e instanceof Error ? e.message : String(e);
          const logSuffix = `[rule id ${ruleId}]`;
          const logMeta = {
            rule: {
              id: ruleId
            }
          };
          logger.error(`${logMessage}: ${logReason} ${logSuffix}`, logMeta);
          throw e;
        }
      });
    },
    clearExecutionSummary: ruleId => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForRoutes.clearExecutionSummary', async () => {
        try {
          await soClient.delete(ruleId);
        } catch (e) {
          const logMessage = 'Error clearing rule execution summary';
          const logReason = e instanceof Error ? e.message : String(e);
          const logSuffix = `[rule id ${ruleId}]`;
          const logMeta = {
            rule: {
              id: ruleId
            }
          };
          logger.error(`${logMessage}: ${logReason} ${logSuffix}`, logMeta);
          throw e;
        }
      });
    },
    getExecutionEvents: args => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForRoutes.getExecutionEvents', async () => {
        const {
          ruleId
        } = args;
        try {
          return await eventLog.getExecutionEvents(args);
        } catch (e) {
          const logMessage = 'Error getting plain execution events from event log';
          const logReason = e instanceof Error ? e.message : String(e);
          const logSuffix = `[rule id ${ruleId}]`;
          const logMeta = {
            rule: {
              id: ruleId
            }
          };
          logger.error(`${logMessage}: ${logReason} ${logSuffix}`, logMeta);
          throw e;
        }
      });
    },
    getExecutionResults: args => {
      return (0, _with_security_span.withSecuritySpan)('IRuleExecutionLogForRoutes.getExecutionResults', async () => {
        const {
          ruleId
        } = args;
        try {
          return await eventLog.getExecutionResults(args);
        } catch (e) {
          const logMessage = 'Error getting aggregate execution results from event log';
          const logReason = e instanceof Error ? e.message : String(e);
          const logSuffix = `[rule id ${ruleId}]`;
          const logMeta = {
            rule: {
              id: ruleId
            }
          };
          logger.error(`${logMessage}: ${logReason} ${logSuffix}`, logMeta);
          throw e;
        }
      });
    }
  };
};
exports.createClientForRoutes = createClientForRoutes;