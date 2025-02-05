"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCorrelationIds = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCorrelationIds = executionContext => {
  return createBuilder({
    context: executionContext,
    status: null
  });
};
exports.getCorrelationIds = getCorrelationIds;
const createBuilder = state => {
  const builder = {
    withContext: context => {
      return createBuilder({
        ...state,
        context
      });
    },
    withStatus: status => {
      return createBuilder({
        ...state,
        status
      });
    },
    getLogSuffix: () => {
      const {
        executionId,
        ruleId,
        ruleUuid,
        ruleName,
        ruleType,
        spaceId
      } = state.context;
      return `[${ruleType}][${ruleName}][rule id ${ruleId}][rule uuid ${ruleUuid}][exec id ${executionId}][space ${spaceId}]`;
    },
    getLogMeta: () => {
      const {
        context,
        status
      } = state;
      const logMeta = {
        rule: {
          id: context.ruleId,
          uuid: context.ruleUuid,
          name: context.ruleName,
          type: context.ruleType,
          execution: {
            uuid: context.executionId
          }
        },
        kibana: {
          spaceId: context.spaceId
        }
      };
      if (status != null && logMeta.rule.execution != null) {
        logMeta.rule.execution.status = status;
      }
      return logMeta;
    }
  };
  return builder;
};