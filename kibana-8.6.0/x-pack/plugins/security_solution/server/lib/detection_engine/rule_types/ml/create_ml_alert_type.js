"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMlAlertType = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _securitysolutionRules = require("@kbn/securitysolution-rules");
var _constants = require("../../../../../common/constants");
var _rule_schema = require("../../rule_schema");
var _ml = require("../../signals/executors/ml");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createMlAlertType = createOptions => {
  const {
    ml
  } = createOptions;
  return {
    id: _securitysolutionRules.ML_RULE_TYPE_ID,
    name: 'Machine Learning Rule',
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schema.machineLearningRuleParams);
          if (errors != null) {
            throw new Error(errors);
          }
          if (validated == null) {
            throw new Error('Validation of rule params failed');
          }
          return validated;
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
          bulkCreate,
          completeRule,
          listClient,
          ruleExecutionLogger,
          tuple,
          wrapHits,
          exceptionFilter,
          unprocessedExceptions
        },
        services,
        state
      } = execOptions;
      const result = await (0, _ml.mlExecutor)({
        completeRule,
        tuple,
        ml,
        listClient,
        services,
        ruleExecutionLogger,
        bulkCreate,
        wrapHits,
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
exports.createMlAlertType = createMlAlertType;