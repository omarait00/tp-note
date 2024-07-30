"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEqlAlertType = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../../../../../common/constants");
var _rule_schema = require("../../rule_schema");
var _eql = require("../../signals/executors/eql");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createEqlAlertType = createOptions => {
  const {
    version
  } = createOptions;
  return {
    id: _securitysolutionRules.EQL_RULE_TYPE_ID,
    name: 'Event Correlation Rule',
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schema.eqlRuleParams);
          if (errors != null) {
            throw new Error(errors);
          }
          if (validated == null) {
            throw new Error('Validation of rule params failed');
          }
          return validated;
        },
        /**
         * validate rule params when rule is bulk edited (update and created in future as well)
         * returned params can be modified (useful in case of version increment)
         * @param mutatedRuleParams
         * @returns mutatedRuleParams
         */
        validateMutatedParams: mutatedRuleParams => {
          (0, _utils.validateIndexPatterns)(mutatedRuleParams.index);
          return mutatedRuleParams;
        }
      }
    },
    actionGroups: [{
      id: 'default',
      name: 'Default'
    }],
    defaultActionGroupId: 'default',
    actionVariables: {
      context: [{
        name: 'server',
        description: 'the server'
      }]
    },
    minimumLicenseRequired: 'basic',
    isExportable: false,
    producer: _constants.SERVER_APP_ID,
    async executor(execOptions) {
      const {
        runOpts: {
          completeRule,
          tuple,
          inputIndex,
          runtimeMappings,
          ruleExecutionLogger,
          bulkCreate,
          wrapHits,
          wrapSequences,
          primaryTimestamp,
          secondaryTimestamp,
          exceptionFilter,
          unprocessedExceptions
        },
        services,
        state
      } = execOptions;
      const result = await (0, _eql.eqlExecutor)({
        completeRule,
        tuple,
        inputIndex,
        runtimeMappings,
        ruleExecutionLogger,
        services,
        version,
        bulkCreate,
        wrapHits,
        wrapSequences,
        primaryTimestamp,
        secondaryTimestamp,
        exceptionFilter,
        unprocessedExceptions
      });
      return {
        ...result,
        state
      };
    }
  };
};
exports.createEqlAlertType = createEqlAlertType;