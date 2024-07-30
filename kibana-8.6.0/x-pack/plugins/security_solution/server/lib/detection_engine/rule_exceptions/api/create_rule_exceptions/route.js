"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleExceptionsRoute = exports.createRuleExceptions = exports.createExceptionListItems = exports.createExceptionList = exports.createAndAssociateDefaultExceptionList = void 0;
var t = _interopRequireWildcard(require("io-ts"));
var _Either = require("fp-ts/lib/Either");
var _pipeable = require("fp-ts/lib/pipeable");
var _function = require("fp-ts/lib/function");
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsListTypes = require("@kbn/securitysolution-io-ts-list-types");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _rule_exceptions = require("../../../../../../common/detection_engine/rule_exceptions");
var _read_rules = require("../../../rule_management/logic/crud/read_rules");
var _patch_rules = require("../../../rule_management/logic/crud/patch_rules");
var _check_for_default_rule_exception_list = require("../../../rule_management/logic/exceptions/check_for_default_rule_exception_list");
var _utils = require("../../../routes/utils");
var _route_validation = require("../../../../../utils/build_validation/route_validation");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createRuleExceptionsRoute = router => {
  router.post({
    path: _rule_exceptions.CREATE_RULE_EXCEPTIONS_URL,
    validate: {
      params: (0, _route_validation.buildRouteValidation)(_rule_exceptions.CreateRuleExceptionsRequestParams),
      body: (0, _route_validation.buildRouteValidation)(_rule_exceptions.CreateRuleExceptionsRequestBody)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    try {
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'licensing', 'lists']);
      const rulesClient = ctx.alerting.getRulesClient();
      const listsClient = ctx.securitySolution.getExceptionListClient();
      const {
        items
      } = request.body;
      const {
        id: ruleId
      } = request.params;

      // Check that the rule they're trying to add an exception list to exists
      const rule = await (0, _read_rules.readRules)({
        rulesClient,
        ruleId: undefined,
        id: ruleId
      });
      if (rule == null) {
        return siemResponse.error({
          statusCode: 500,
          body: `Unable to add exception to rule - rule with id:"${ruleId}" not found`
        });
      }
      const createdItems = await createRuleExceptions({
        items,
        rule,
        listsClient,
        rulesClient
      });
      const [validated, errors] = (0, _securitysolutionIoTsUtils.validate)(createdItems, t.array(_securitysolutionIoTsListTypes.exceptionListItemSchema));
      if (errors != null) {
        return siemResponse.error({
          body: errors,
          statusCode: 500
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {}
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
exports.createRuleExceptionsRoute = createRuleExceptionsRoute;
const createRuleExceptions = async ({
  items,
  rule,
  listsClient,
  rulesClient
}) => {
  const ruleDefaultLists = rule.params.exceptionsList.filter(list => list.type === _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT);

  // This should hopefully never happen, but could if we forget to add such a check to one
  // of our routes allowing the user to update the rule to have more than one default list added
  (0, _check_for_default_rule_exception_list.checkDefaultRuleExceptionListReferences)({
    exceptionLists: rule.params.exceptionsList
  });
  const [ruleDefaultList] = ruleDefaultLists;
  if (ruleDefaultList != null) {
    // check that list does indeed exist
    const exceptionListAssociatedToRule = await (listsClient === null || listsClient === void 0 ? void 0 : listsClient.getExceptionList({
      id: ruleDefaultList.id,
      listId: ruleDefaultList.list_id,
      namespaceType: ruleDefaultList.namespace_type
    }));

    // if list does exist, just need to create the items
    if (exceptionListAssociatedToRule != null) {
      return createExceptionListItems({
        items,
        defaultList: exceptionListAssociatedToRule,
        listsClient
      });
    } else {
      // This means that there was missed cleanup when this rule exception list was
      // deleted and it remained referenced on the rule. Let's remove it from the rule,
      // and update the rule's exceptions lists to include newly created default list.
      const defaultList = await createAndAssociateDefaultExceptionList({
        rule,
        rulesClient,
        listsClient,
        removeOldAssociation: true
      });
      return createExceptionListItems({
        items,
        defaultList,
        listsClient
      });
    }
  } else {
    const defaultList = await createAndAssociateDefaultExceptionList({
      rule,
      rulesClient,
      listsClient,
      removeOldAssociation: false
    });
    return createExceptionListItems({
      items,
      defaultList,
      listsClient
    });
  }
};
exports.createRuleExceptions = createRuleExceptions;
const createExceptionListItems = async ({
  items,
  defaultList,
  listsClient
}) => {
  return Promise.all(items.map(item => listsClient === null || listsClient === void 0 ? void 0 : listsClient.createExceptionListItem({
    comments: item.comments,
    description: item.description,
    entries: item.entries,
    itemId: item.item_id,
    listId: defaultList.list_id,
    meta: item.meta,
    name: item.name,
    namespaceType: defaultList.namespace_type,
    osTypes: item.os_types,
    tags: item.tags,
    type: item.type
  })));
};
exports.createExceptionListItems = createExceptionListItems;
const createExceptionList = async ({
  rule,
  listsClient
}) => {
  if (!listsClient) return null;
  const exceptionList = {
    description: `Exception list containing exceptions for rule with id: ${rule.id}`,
    meta: undefined,
    name: `Exceptions for rule - ${rule.name}`,
    namespace_type: 'single',
    tags: ['default_rule_exception_list'],
    type: _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT,
    version: 1
  };

  // The `as` defeated me. Please send help
  // if you know what's missing here.
  const validated = (0, _pipeable.pipe)(_securitysolutionIoTsListTypes.createExceptionListSchema.decode(exceptionList), (0, _Either.fold)(errors => {
    throw new Error((0, _securitysolutionIoTsUtils.formatErrors)(errors).join());
  }, _function.identity));
  const {
    description,
    list_id: listId,
    meta,
    name,
    namespace_type: namespaceType,
    tags,
    type,
    version
  } = validated;

  // create the default rule list
  return listsClient.createExceptionList({
    description,
    immutable: false,
    listId,
    meta,
    name,
    namespaceType,
    tags,
    type,
    version
  });
};
exports.createExceptionList = createExceptionList;
const createAndAssociateDefaultExceptionList = async ({
  rule,
  listsClient,
  rulesClient,
  removeOldAssociation
}) => {
  var _rule$params$exceptio;
  const exceptionListToAssociate = await createExceptionList({
    rule,
    listsClient
  });
  if (exceptionListToAssociate == null) {
    throw Error(`An error occurred creating rule default exception list`);
  }

  // The list client has no rules client context, so once we've created the exception list,
  // we need to go ahead and "attach" it to the rule.
  const existingRuleExceptionLists = (_rule$params$exceptio = rule.params.exceptionsList) !== null && _rule$params$exceptio !== void 0 ? _rule$params$exceptio : [];
  const ruleExceptionLists = removeOldAssociation ? existingRuleExceptionLists.filter(list => list.type !== _securitysolutionIoTsListTypes.ExceptionListTypeEnum.RULE_DEFAULT) : existingRuleExceptionLists;
  await (0, _patch_rules.patchRules)({
    rulesClient,
    existingRule: rule,
    nextParams: {
      ...rule.params,
      exceptions_list: [...ruleExceptionLists, {
        id: exceptionListToAssociate.id,
        list_id: exceptionListToAssociate.list_id,
        type: exceptionListToAssociate.type,
        namespace_type: exceptionListToAssociate.namespace_type
      }]
    }
  });
  return exceptionListToAssociate;
};
exports.createAndAssociateDefaultExceptionList = createAndAssociateDefaultExceptionList;