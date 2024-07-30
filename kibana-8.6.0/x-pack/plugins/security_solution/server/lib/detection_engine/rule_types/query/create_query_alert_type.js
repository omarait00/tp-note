"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQueryAlertType = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../common/constants");
var _rule_schema = require("../../rule_schema");
var _query = require("../../signals/executors/query");
var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createQueryAlertType = createOptions => {
  const {
    eventsTelemetry,
    experimentalFeatures,
    version,
    osqueryCreateAction,
    licensing,
    id,
    name
  } = createOptions;
  return {
    id,
    name,
    validate: {
      params: {
        validate: object => {
          const [validated, errors] = (0, _securitysolutionIoTsUtils.validateNonExact)(object, _rule_schema.unifiedQueryRuleParams);
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
        runOpts,
        services,
        spaceId,
        state
      } = execOptions;
      return (0, _query.queryExecutor)({
        runOpts,
        experimentalFeatures,
        eventsTelemetry,
        services,
        version,
        spaceId,
        bucketHistory: state.suppressionGroupHistory,
        osqueryCreateAction,
        licensing
      });
    }
  };
};
exports.createQueryAlertType = createQueryAlertType;