"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformFindAlerts = exports.transformAlertsToRules = exports.transform = exports.swapActionIds = exports.migrateLegacyActionsIds = exports.getTupleDuplicateErrorsAndUniqueRules = exports.getInvalidConnectors = exports.getIdError = exports.getIdBulkError = exports.convertAlertSuppressionToSnake = exports.convertAlertSuppressionToCamel = void 0;
var _fp = require("lodash/fp");
var _pMap = _interopRequireDefault(require("p-map"));
var _uuid = _interopRequireDefault(require("uuid"));
var _rule_schema = require("../../rule_schema");
var _utils = require("../../routes/utils");
var _rule_converters = require("../normalization/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_CONCURRENT_SEARCHES = 10;
const getIdError = ({
  id,
  ruleId
}) => {
  if (id != null) {
    return {
      message: `id: "${id}" not found`,
      statusCode: 404
    };
  } else if (ruleId != null) {
    return {
      message: `rule_id: "${ruleId}" not found`,
      statusCode: 404
    };
  } else {
    return {
      message: 'id or rule_id should have been defined',
      statusCode: 404
    };
  }
};
exports.getIdError = getIdError;
const getIdBulkError = ({
  id,
  ruleId
}) => {
  if (id != null && ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      ruleId,
      statusCode: 404,
      message: `id: "${id}" and rule_id: "${ruleId}" not found`
    });
  } else if (id != null) {
    return (0, _utils.createBulkErrorObject)({
      id,
      statusCode: 404,
      message: `id: "${id}" not found`
    });
  } else if (ruleId != null) {
    return (0, _utils.createBulkErrorObject)({
      ruleId,
      statusCode: 404,
      message: `rule_id: "${ruleId}" not found`
    });
  } else {
    return (0, _utils.createBulkErrorObject)({
      statusCode: 404,
      message: `id or rule_id should have been defined`
    });
  }
};
exports.getIdBulkError = getIdBulkError;
const transformAlertsToRules = (rules, legacyRuleActions) => {
  return rules.map(rule => (0, _rule_converters.internalRuleToAPIResponse)(rule, null, legacyRuleActions[rule.id]));
};
exports.transformAlertsToRules = transformAlertsToRules;
const transformFindAlerts = (ruleFindResults, ruleExecutionSummariesByRuleId, legacyRuleActions) => {
  return {
    page: ruleFindResults.page,
    perPage: ruleFindResults.perPage,
    total: ruleFindResults.total,
    data: ruleFindResults.data.map(rule => {
      const executionSummary = ruleExecutionSummariesByRuleId[rule.id];
      return (0, _rule_converters.internalRuleToAPIResponse)(rule, executionSummary, legacyRuleActions[rule.id]);
    })
  };
};
exports.transformFindAlerts = transformFindAlerts;
const transform = (rule, ruleExecutionSummary, legacyRuleActions) => {
  if ((0, _rule_schema.isAlertType)(rule)) {
    return (0, _rule_converters.internalRuleToAPIResponse)(rule, ruleExecutionSummary, legacyRuleActions);
  }
  return null;
};
exports.transform = transform;
const getTupleDuplicateErrorsAndUniqueRules = (rules, isOverwrite) => {
  const {
    errors,
    rulesAcc
  } = rules.reduce((acc, parsedRule) => {
    if (parsedRule instanceof Error) {
      acc.rulesAcc.set(_uuid.default.v4(), parsedRule);
    } else {
      const {
        rule_id: ruleId
      } = parsedRule;
      if (acc.rulesAcc.has(ruleId) && !isOverwrite) {
        acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 400,
          message: `More than one rule with rule-id: "${ruleId}" found`
        }));
      }
      acc.rulesAcc.set(ruleId, parsedRule);
    }
    return acc;
  },
  // using map (preserves ordering)
  {
    errors: new Map(),
    rulesAcc: new Map()
  });
  return [Array.from(errors.values()), Array.from(rulesAcc.values())];
};

// functions copied from here
// https://github.com/elastic/kibana/blob/4584a8b570402aa07832cf3e5b520e5d2cfa7166/src/core/server/saved_objects/import/lib/check_origin_conflicts.ts#L55-L57
exports.getTupleDuplicateErrorsAndUniqueRules = getTupleDuplicateErrorsAndUniqueRules;
const createQueryTerm = input => input.replace(/\\/g, '\\\\').replace(/\"/g, '\\"');
const createQuery = (type, id) => `"${createQueryTerm(`${type}:${id}`)}" | "${createQueryTerm(id)}"`;

/**
 * Query for a saved object with a given origin id and replace the
 * id in the provided action with the _id from the query result
 * @param action
 * @param esClient
 * @returns
 */
const swapActionIds = async (action, savedObjectsClient) => {
  try {
    const search = createQuery('action', action.id);
    const foundAction = await savedObjectsClient.find({
      type: 'action',
      search,
      rootSearchFields: ['_id', 'originId']
    });
    if (foundAction.saved_objects.length === 1) {
      return {
        ...action,
        id: foundAction.saved_objects[0].id
      };
    } else if (foundAction.saved_objects.length > 1) {
      return new Error(`Found two action connectors with originId or _id: ${action.id} The upload cannot be completed unless the _id or the originId of the action connector is changed. See https://www.elastic.co/guide/en/kibana/current/sharing-saved-objects.html for more details`);
    }
    return action;
  } catch (exc) {
    return exc;
  }
};

/**
 * In 8.0 all saved objects made in a non-default space will have their
 * _id's regenerated. Security Solution rules have references to the
 * actions SO id inside the 'actions' param.
 * When users import these rules, we need to ensure any rule with
 * an action that has an old, pre-8.0 id will need to be updated
 * to point to the new _id for that action (alias_target_id)
 *
 * ex:
 * import rule.ndjson:
 * {
 *   rule_id: 'myrule_id'
 *   name: 'my favorite rule'
 *   ...
 *   actions:[{id: '1111-2222-3333-4444', group...}]
 * }
 *
 * In 8.0 the 'id' field of this action is no longer a reference
 * to the _id of the action (connector). Querying against the connector
 * endpoint for this id will yield 0 results / 404.
 *
 * The solution: If we query the .kibana index for '1111-2222-3333-4444' as an originId,
 * we should get the original connector back
 * (with the new, migrated 8.0 _id of 'xxxx-yyyy-zzzz-0000') and can then replace
 * '1111-2222-3333-4444' in the example above with 'xxxx-yyyy-zzzz-0000'
 * And the rule will then import successfully.
 * @param rules
 * @param savedObjectsClient SO client exposing hidden 'actions' SO type
 * @returns
 */
exports.swapActionIds = swapActionIds;
const migrateLegacyActionsIds = async (rules, savedObjectsClient) => {
  const isImportRule = r => !(r instanceof Error);
  const toReturn = await (0, _pMap.default)(rules, async rule => {
    if (isImportRule(rule)) {
      var _rule$actions;
      // can we swap the pre 8.0 action connector(s) id with the new,
      // post-8.0 action id (swap the originId for the new _id?)
      const newActions = await (0, _pMap.default)((_rule$actions = rule.actions) !== null && _rule$actions !== void 0 ? _rule$actions : [], action => swapActionIds(action, savedObjectsClient), {
        concurrency: MAX_CONCURRENT_SEARCHES
      });

      // were there any errors discovered while trying to migrate and swap the action connector ids?
      const [actionMigrationErrors, newlyMigratedActions] = (0, _fp.partition)(item => item instanceof Error)(newActions);
      if (actionMigrationErrors == null || actionMigrationErrors.length === 0) {
        return {
          ...rule,
          actions: newlyMigratedActions
        };
      }
      return [{
        ...rule,
        actions: newlyMigratedActions
      }, new Error(JSON.stringify((0, _utils.createBulkErrorObject)({
        ruleId: rule.rule_id,
        statusCode: 409,
        message: `${actionMigrationErrors.map(error => error.message).join(',')}`
      })))];
    }
    return rule;
  }, {
    concurrency: MAX_CONCURRENT_SEARCHES
  });
  return toReturn.flat();
};

/**
 * Given a set of rules and an actions client this will return connectors that are invalid
 * such as missing connectors and filter out the rules that have invalid connectors.
 * @param rules The rules to check for invalid connectors
 * @param actionsClient The actions client to get all the connectors.
 * @returns An array of connector errors if it found any and then the promise stream of valid and invalid connectors.
 */
exports.migrateLegacyActionsIds = migrateLegacyActionsIds;
const getInvalidConnectors = async (rules, actionsClient) => {
  let actionsFind = [];
  const reducerAccumulator = {
    errors: new Map(),
    rulesAcc: new Map()
  };
  try {
    actionsFind = await actionsClient.getAll();
  } catch (exc) {
    var _exc$output;
    if ((exc === null || exc === void 0 ? void 0 : (_exc$output = exc.output) === null || _exc$output === void 0 ? void 0 : _exc$output.statusCode) === 403) {
      reducerAccumulator.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
        statusCode: exc.output.statusCode,
        message: `You may not have actions privileges required to import rules with actions: ${exc.output.payload.message}`
      }));
    } else {
      reducerAccumulator.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
        statusCode: 404,
        message: JSON.stringify(exc)
      }));
    }
  }
  const actionIds = new Set(actionsFind.map(action => action.id));
  const {
    errors,
    rulesAcc
  } = rules.reduce((acc, parsedRule) => {
    if (parsedRule instanceof Error) {
      acc.rulesAcc.set(_uuid.default.v4(), parsedRule);
    } else {
      const {
        rule_id: ruleId,
        actions
      } = parsedRule;
      const missingActionIds = actions ? actions.flatMap(action => {
        if (!actionIds.has(action.id)) {
          return [action.id];
        } else {
          return [];
        }
      }) : [];
      if (missingActionIds.length === 0) {
        acc.rulesAcc.set(ruleId, parsedRule);
      } else {
        const errorMessage = missingActionIds.length > 1 ? 'connectors are missing. Connector ids missing are:' : 'connector is missing. Connector id missing is:';
        acc.errors.set(_uuid.default.v4(), (0, _utils.createBulkErrorObject)({
          ruleId,
          statusCode: 404,
          message: `${missingActionIds.length} ${errorMessage} ${missingActionIds.join(', ')}`
        }));
      }
    }
    return acc;
  },
  // using map (preserves ordering)
  reducerAccumulator);
  return [Array.from(errors.values()), Array.from(rulesAcc.values())];
};
exports.getInvalidConnectors = getInvalidConnectors;
const convertAlertSuppressionToCamel = input => input ? {
  groupBy: input.group_by
} : undefined;
exports.convertAlertSuppressionToCamel = convertAlertSuppressionToCamel;
const convertAlertSuppressionToSnake = input => input ? {
  group_by: input.groupBy
} : undefined;
exports.convertAlertSuppressionToSnake = convertAlertSuppressionToSnake;