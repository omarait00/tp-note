"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRuleExceptionReferencesRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionListUtils = require("@kbn/securitysolution-list-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
var _utils = require("../../../routes/utils");
var _rule_exceptions = require("../../../../../../common/detection_engine/rule_exceptions");
var _enrich_filter_with_rule_type_mappings = require("../../../rule_management/logic/search/enrich_filter_with_rule_type_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const findRuleExceptionReferencesRoute = router => {
  router.get({
    path: _rule_exceptions.DETECTION_ENGINE_RULES_EXCEPTIONS_REFERENCE_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_rule_exceptions.findExceptionReferencesOnRuleSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const {
        ids,
        namespace_types: namespaceTypes,
        list_ids: listIds
      } = request.query;
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting']);
      const rulesClient = ctx.alerting.getRulesClient();
      const listsClient = ctx.securitySolution.getExceptionListClient();
      if (ids != null && listIds != null && (ids.length !== namespaceTypes.length || ids.length !== listIds.length)) {
        return siemResponse.error({
          body: `"ids", "list_ids" and "namespace_types" need to have the same comma separated number of values. Expected "ids" length: ${ids.length} to equal "namespace_types" length: ${namespaceTypes.length} and "list_ids" length: ${listIds.length}.`,
          statusCode: 400
        });
      }
      const fetchExact = ids != null && listIds != null;
      const foundExceptionLists = await (listsClient === null || listsClient === void 0 ? void 0 : listsClient.findExceptionList({
        filter: fetchExact ? `(${listIds.map((listId, index) => `${(0, _securitysolutionListUtils.getSavedObjectType)({
          namespaceType: namespaceTypes[index]
        })}.attributes.list_id:${listId}`).join(' OR ')})` : undefined,
        namespaceType: namespaceTypes,
        page: 1,
        perPage: 10000,
        sortField: undefined,
        sortOrder: undefined
      }));
      if (foundExceptionLists == null) {
        return response.ok({
          body: {
            references: []
          }
        });
      }
      const references = await Promise.all(foundExceptionLists.data.map(async (list, index) => {
        const foundRules = await rulesClient.find({
          options: {
            perPage: 10000,
            filter: (0, _enrich_filter_with_rule_type_mappings.enrichFilterWithRuleTypeMapping)(null),
            hasReference: {
              id: list.id,
              type: (0, _securitysolutionListUtils.getSavedObjectType)({
                namespaceType: list.namespace_type
              })
            }
          }
        });
        const ruleData = foundRules.data.map(({
          name,
          id,
          params
        }) => ({
          name,
          id,
          rule_id: params.ruleId,
          exception_lists: params.exceptionsList
        }));
        return {
          [list.list_id]: {
            ...list,
            referenced_rules: ruleData
          }
        };
      }));
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)({
        references
      }, _rule_exceptions.rulesReferencedByExceptionListsSchema);
      if (errors != null) {
        return siemResponse.error({
          statusCode: 500,
          body: errors
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {
            references: []
          }
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.findRuleExceptionReferencesRoute = findRuleExceptionReferencesRoute;