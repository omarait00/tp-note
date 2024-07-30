"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleExecutionSavedObjectsClient = void 0;
var _server = require("../../../../../../../../../../src/core/server");
var _with_security_span = require("../../../../../../utils/with_security_span");
var _saved_objects_type = require("./saved_objects_type");
var _saved_objects_utils = require("./saved_objects_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRuleExecutionSavedObjectsClient = (soClient, logger) => {
  return {
    async createOrUpdate(ruleId, attributes) {
      const id = (0, _saved_objects_utils.getRuleExecutionSoId)(ruleId);
      const references = (0, _saved_objects_utils.getRuleExecutionSoReferences)(ruleId);
      const result = await (0, _with_security_span.withSecuritySpan)('createOrUpdateRuleExecutionSO', () => {
        return soClient.create(_saved_objects_type.RULE_EXECUTION_SO_TYPE, attributes, {
          id,
          references,
          overwrite: true
        });
      });
      return result;
    },
    async delete(ruleId) {
      try {
        const id = (0, _saved_objects_utils.getRuleExecutionSoId)(ruleId);
        await (0, _with_security_span.withSecuritySpan)('deleteRuleExecutionSO', () => {
          return soClient.delete(_saved_objects_type.RULE_EXECUTION_SO_TYPE, id);
        });
      } catch (e) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
          return;
        }
        throw e;
      }
    },
    async getOneByRuleId(ruleId) {
      try {
        const id = (0, _saved_objects_utils.getRuleExecutionSoId)(ruleId);
        return await (0, _with_security_span.withSecuritySpan)('getRuleExecutionSO', () => {
          return soClient.get(_saved_objects_type.RULE_EXECUTION_SO_TYPE, id);
        });
      } catch (e) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
          return null;
        }
        throw e;
      }
    },
    async getManyByRuleIds(ruleIds) {
      const ids = ruleIds.map(id => (0, _saved_objects_utils.getRuleExecutionSoId)(id)).map(id => ({
        id,
        type: _saved_objects_type.RULE_EXECUTION_SO_TYPE
      }));
      const response = await (0, _with_security_span.withSecuritySpan)('bulkGetRuleExecutionSOs', () => {
        return soClient.bulkGet(ids);
      });
      const result = prepopulateRuleExecutionSavedObjectsByRuleId(ruleIds);
      response.saved_objects.forEach(so => {
        // NOTE: We need to explicitly check that this saved object is not an error result and has references in it.
        // "Saved object" may not actually contain most of its properties (despite the fact that they are required
        // in its TypeScript interface), for example if it wasn't found. In this case it will look like that:
        // {
        //   id: '64b51590-a87e-5afc-9ede-906c3f3483b7',
        //   type: 'siem-detection-engine-rule-execution-info',
        //   error: {
        //     statusCode: 404,
        //     error: 'Not Found',
        //     message: 'Saved object [siem-detection-engine-rule-execution-info/64b51590-a87e-5afc-9ede-906c3f3483b7] not found'
        //   },
        //   namespaces: undefined
        // }
        const hasReferences = !so.error && so.references && Array.isArray(so.references);
        const references = hasReferences ? so.references : [];
        const ruleId = (0, _saved_objects_utils.extractRuleIdFromReferences)(references);
        if (ruleId) {
          result[ruleId] = so;
        }
        if (so.error && so.error.statusCode !== 404) {
          logger.error(so.error.message);
        }
      });
      return result;
    }
  };
};
exports.createRuleExecutionSavedObjectsClient = createRuleExecutionSavedObjectsClient;
const prepopulateRuleExecutionSavedObjectsByRuleId = ruleIds => {
  const result = {};
  ruleIds.forEach(ruleId => {
    result[ruleId] = null;
  });
  return result;
};