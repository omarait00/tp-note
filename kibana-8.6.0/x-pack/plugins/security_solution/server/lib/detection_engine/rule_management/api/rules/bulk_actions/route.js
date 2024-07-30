"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.performBulkActionRoute = exports.migrateRuleActions = void 0;
var _lodash = require("lodash");
var _moment = _interopRequireDefault(require("moment"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _common = require("../../../../../../../../../../src/plugins/kibana_utils/common");
var _constants = require("../../../../../../../common/constants");
var _request_schema = require("../../../../../../../common/detection_engine/rule_management/api/rules/bulk_actions/request_schema");
var _route_validation = require("../../../../../../utils/build_validation/route_validation");
var _route_limited_concurrency_tag = require("../../../../../../utils/route_limited_concurrency_tag");
var _promise_pool = require("../../../../../../utils/promise_pool");
var _authz = require("../../../../../machine_learning/authz");
var _delete_rules = require("../../../logic/crud/delete_rules");
var _duplicate_rule = require("../../../logic/actions/duplicate_rule");
var _duplicate_exceptions = require("../../../logic/actions/duplicate_exceptions");
var _find_rules = require("../../../logic/search/find_rules");
var _read_rules = require("../../../logic/crud/read_rules");
var _get_export_by_object_ids = require("../../../logic/export/get_export_by_object_ids");
var _utils = require("../../../../routes/utils");
var _rule_converters = require("../../../normalization/rule_converters");
var _legacy_action_migration = require("../../../logic/rule_actions/legacy_action_migration");
var _bulk_edit_rules = require("../../../logic/bulk_actions/bulk_edit_rules");
var _validations = require("../../../logic/bulk_actions/validations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

const MAX_RULES_TO_PROCESS_TOTAL = 10000;
const MAX_ERROR_MESSAGE_LENGTH = 1000;
const MAX_ROUTE_CONCURRENCY = 5;
const normalizeErrorResponse = errors => {
  const errorsMap = new Map();
  errors.forEach(errorObj => {
    let message;
    let statusCode = 500;
    let errorCode;
    let rule;
    // transform different error types (PromisePoolError<string> | PromisePoolError<RuleAlertType> | BulkOperationError)
    // to one common used in NormalizedRuleError
    if ('rule' in errorObj) {
      rule = errorObj.rule;
      message = errorObj.message;
    } else {
      const {
        error,
        item
      } = errorObj;
      const transformedError = error instanceof Error ? (0, _securitysolutionEsUtils.transformError)(error) : {
        message: String(error),
        statusCode: 500
      };
      errorCode = error === null || error === void 0 ? void 0 : error.errorCode;
      message = transformedError.message;
      statusCode = transformedError.statusCode;
      // The promise pool item is either a rule ID string or a rule object. We have
      // string IDs when we fail to fetch rules. Rule objects come from other
      // situations when we found a rule but failed somewhere else.
      rule = typeof item === 'string' ? {
        id: item
      } : {
        id: item.id,
        name: item.name
      };
    }
    if (errorsMap.has(message)) {
      var _errorsMap$get;
      (_errorsMap$get = errorsMap.get(message)) === null || _errorsMap$get === void 0 ? void 0 : _errorsMap$get.rules.push(rule);
    } else {
      errorsMap.set(message, {
        message: (0, _lodash.truncate)(message, {
          length: MAX_ERROR_MESSAGE_LENGTH
        }),
        status_code: statusCode,
        err_code: errorCode,
        rules: [rule]
      });
    }
  });
  return Array.from(errorsMap, ([_, normalizedError]) => normalizedError);
};
const buildBulkResponse = (response, {
  isDryRun = false,
  errors = [],
  updated = [],
  created = [],
  deleted = []
}) => {
  const numSucceeded = updated.length + created.length + deleted.length;
  const numFailed = errors.length;
  const summary = {
    failed: numFailed,
    succeeded: numSucceeded,
    total: numSucceeded + numFailed
  };

  // if response is for dry_run, empty lists of rules returned, as rules are not actually updated and stored within ES
  // thus, it's impossible to return reliably updated/duplicated/deleted rules
  const results = isDryRun ? {
    updated: [],
    created: [],
    deleted: []
  } : {
    updated: updated.map(rule => (0, _rule_converters.internalRuleToAPIResponse)(rule)),
    created: created.map(rule => (0, _rule_converters.internalRuleToAPIResponse)(rule)),
    deleted: deleted.map(rule => (0, _rule_converters.internalRuleToAPIResponse)(rule))
  };
  if (numFailed > 0) {
    return response.custom({
      headers: {
        'content-type': 'application/json'
      },
      body: Buffer.from(JSON.stringify({
        message: summary.succeeded > 0 ? 'Bulk edit partially failed' : 'Bulk edit failed',
        status_code: 500,
        attributes: {
          errors: normalizeErrorResponse(errors),
          results,
          summary
        }
      })),
      statusCode: 500
    });
  }
  return response.ok({
    body: {
      success: true,
      rules_count: summary.total,
      attributes: {
        results,
        summary
      }
    }
  });
};
const fetchRulesByQueryOrIds = async ({
  query,
  ids,
  rulesClient,
  abortSignal
}) => {
  if (ids) {
    return (0, _promise_pool.initPromisePool)({
      concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
      items: ids,
      executor: async id => {
        const rule = await (0, _read_rules.readRules)({
          id,
          rulesClient,
          ruleId: undefined
        });
        if (rule == null) {
          throw Error('Rule not found');
        }
        return rule;
      },
      abortSignal
    });
  }
  const {
    data,
    total
  } = await (0, _find_rules.findRules)({
    rulesClient,
    perPage: MAX_RULES_TO_PROCESS_TOTAL,
    filter: query,
    page: undefined,
    sortField: undefined,
    sortOrder: undefined,
    fields: undefined
  });
  if (total > MAX_RULES_TO_PROCESS_TOTAL) {
    throw new _securitysolutionEsUtils.BadRequestError(`More than ${MAX_RULES_TO_PROCESS_TOTAL} rules matched the filter query. Try to narrow it down.`);
  }
  return {
    results: data.map(rule => ({
      item: rule.id,
      result: rule
    })),
    errors: []
  };
};

/**
 * Helper method to migrate any legacy actions a rule may have. If no actions or no legacy actions
 * no migration is performed.
 * @params rulesClient
 * @params savedObjectsClient
 * @params rule - rule to be migrated
 * @returns The migrated rule
 */
const migrateRuleActions = async ({
  rulesClient,
  savedObjectsClient,
  rule
}) => {
  const migratedRule = await (0, _legacy_action_migration.legacyMigrate)({
    rulesClient,
    savedObjectsClient,
    rule
  });

  // This should only be hit if `rule` passed into `legacyMigrate`
  // is `null` or `rule.id` is null which right now, as typed, should not occur
  // but catching if does, in which case something upstream would be breaking down
  if (migratedRule == null) {
    throw new Error(`An error occurred processing rule with id:${rule.id}`);
  }
  return migratedRule;
};
exports.migrateRuleActions = migrateRuleActions;
const performBulkActionRoute = (router, ml, logger) => {
  router.post({
    path: _constants.DETECTION_ENGINE_RULES_BULK_ACTION,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_request_schema.PerformBulkActionRequestBody),
      query: (0, _route_validation.buildRouteValidation)(_request_schema.PerformBulkActionRequestQuery)
    },
    options: {
      tags: ['access:securitySolution', (0, _route_limited_concurrency_tag.routeLimitedConcurrencyTag)(MAX_ROUTE_CONCURRENCY)],
      timeout: {
        idleSocket: _moment.default.duration(15, 'minutes').asMilliseconds()
      }
    }
  }, async (context, request, response) => {
    const {
      body
    } = request;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    if (body !== null && body !== void 0 && body.ids && body.ids.length > _constants.RULES_TABLE_MAX_PAGE_SIZE) {
      return siemResponse.error({
        body: `More than ${_constants.RULES_TABLE_MAX_PAGE_SIZE} ids sent for bulk edit action.`,
        statusCode: 400
      });
    }
    if (body !== null && body !== void 0 && body.ids && body.query !== undefined) {
      return siemResponse.error({
        body: `Both query and ids are sent. Define either ids or query in request payload.`,
        statusCode: 400
      });
    }
    const isDryRun = request.query.dry_run === 'true';

    // dry run is not supported for export, as it doesn't change ES state and has different response format(exported JSON file)
    if (isDryRun && body.action === _request_schema.BulkActionType.export) {
      return siemResponse.error({
        body: `Export action doesn't support dry_run mode`,
        statusCode: 400
      });
    }
    const abortController = new AbortController();

    // subscribing to completed$, because it handles both cases when request was completed and aborted.
    // when route is finished by timeout, aborted$ is not getting fired
    request.events.completed$.subscribe(() => abortController.abort());
    try {
      var _ctx$lists;
      const ctx = await context.resolve(['core', 'securitySolution', 'alerting', 'licensing', 'lists']);
      const rulesClient = ctx.alerting.getRulesClient();
      const ruleExecutionLog = ctx.securitySolution.getRuleExecutionLog();
      const exceptionsClient = (_ctx$lists = ctx.lists) === null || _ctx$lists === void 0 ? void 0 : _ctx$lists.getExceptionListClient();
      const savedObjectsClient = ctx.core.savedObjects.client;
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: ctx.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      const query = body.query !== '' ? body.query : undefined;

      // handling this action before switch statement as bulkEditRules fetch rules within
      // rulesClient method, hence there is no need to use fetchRulesByQueryOrIds utility
      if (body.action === _request_schema.BulkActionType.edit && !isDryRun) {
        const {
          rules,
          errors
        } = await (0, _bulk_edit_rules.bulkEditRules)({
          rulesClient,
          filter: query,
          ids: body.ids,
          actions: body.edit,
          mlAuthz
        });

        // migrate legacy rule actions
        const migrationOutcome = await (0, _promise_pool.initPromisePool)({
          concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
          items: rules,
          executor: async rule => {
            // actions only get fired when rule running, so we should be fine to migrate only enabled
            if (rule.enabled) {
              return migrateRuleActions({
                rulesClient,
                savedObjectsClient,
                rule
              });
            } else {
              return rule;
            }
          },
          abortSignal: abortController.signal
        });
        return buildBulkResponse(response, {
          updated: migrationOutcome.results.filter(({
            result
          }) => result).map(({
            result
          }) => result),
          errors: [...errors, ...migrationOutcome.errors]
        });
      }
      const fetchRulesOutcome = await fetchRulesByQueryOrIds({
        rulesClient,
        query,
        ids: body.ids,
        abortSignal: abortController.signal
      });
      const rules = fetchRulesOutcome.results.map(({
        result
      }) => result);
      let bulkActionOutcome;
      let updated = [];
      let created = [];
      let deleted = [];
      switch (body.action) {
        case _request_schema.BulkActionType.enable:
          bulkActionOutcome = await (0, _promise_pool.initPromisePool)({
            concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
            items: rules,
            executor: async rule => {
              await (0, _validations.validateBulkEnableRule)({
                mlAuthz,
                rule
              });

              // during dry run only validation is getting performed and rule is not saved in ES, thus return early
              if (isDryRun) {
                return rule;
              }
              const migratedRule = await migrateRuleActions({
                rulesClient,
                savedObjectsClient,
                rule
              });
              if (!migratedRule.enabled) {
                await rulesClient.enable({
                  id: migratedRule.id
                });
              }
              return {
                ...migratedRule,
                enabled: true
              };
            },
            abortSignal: abortController.signal
          });
          updated = bulkActionOutcome.results.map(({
            result
          }) => result).filter(rule => rule !== null);
          break;
        case _request_schema.BulkActionType.disable:
          bulkActionOutcome = await (0, _promise_pool.initPromisePool)({
            concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
            items: rules,
            executor: async rule => {
              await (0, _validations.validateBulkDisableRule)({
                mlAuthz,
                rule
              });

              // during dry run only validation is getting performed and rule is not saved in ES, thus return early
              if (isDryRun) {
                return rule;
              }
              const migratedRule = await migrateRuleActions({
                rulesClient,
                savedObjectsClient,
                rule
              });
              if (migratedRule.enabled) {
                await rulesClient.disable({
                  id: migratedRule.id
                });
              }
              return {
                ...migratedRule,
                enabled: false
              };
            },
            abortSignal: abortController.signal
          });
          updated = bulkActionOutcome.results.map(({
            result
          }) => result).filter(rule => rule !== null);
          break;
        case _request_schema.BulkActionType.delete:
          bulkActionOutcome = await (0, _promise_pool.initPromisePool)({
            concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
            items: rules,
            executor: async rule => {
              // during dry run return early for delete, as no validations needed for this action
              if (isDryRun) {
                return null;
              }
              const migratedRule = await migrateRuleActions({
                rulesClient,
                savedObjectsClient,
                rule
              });
              await (0, _delete_rules.deleteRules)({
                ruleId: migratedRule.id,
                rulesClient,
                ruleExecutionLog
              });
              return null;
            },
            abortSignal: abortController.signal
          });
          deleted = bulkActionOutcome.results.map(({
            item
          }) => item).filter(rule => rule !== null);
          break;
        case _request_schema.BulkActionType.duplicate:
          bulkActionOutcome = await (0, _promise_pool.initPromisePool)({
            concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
            items: rules,
            executor: async rule => {
              await (0, _validations.validateBulkDuplicateRule)({
                mlAuthz,
                rule
              });

              // during dry run only validation is getting performed and rule is not saved in ES, thus return early
              if (isDryRun) {
                return rule;
              }
              const migratedRule = await migrateRuleActions({
                rulesClient,
                savedObjectsClient,
                rule
              });
              let shouldDuplicateExceptions = true;
              if (body.duplicate !== undefined) {
                shouldDuplicateExceptions = body.duplicate.include_exceptions;
              }
              const duplicateRuleToCreate = await (0, _duplicate_rule.duplicateRule)({
                rule: migratedRule
              });
              const createdRule = await rulesClient.create({
                data: duplicateRuleToCreate
              });

              // we try to create exceptions after rule created, and then update rule
              const exceptions = shouldDuplicateExceptions ? await (0, _duplicate_exceptions.duplicateExceptions)({
                ruleId: rule.params.ruleId,
                exceptionLists: rule.params.exceptionsList,
                exceptionsClient
              }) : [];
              const updatedRule = await rulesClient.update({
                id: createdRule.id,
                data: {
                  ...duplicateRuleToCreate,
                  params: {
                    ...duplicateRuleToCreate.params,
                    exceptionsList: exceptions
                  }
                }
              });

              // TODO: figureout why types can't return just updatedRule
              return {
                ...createdRule,
                ...updatedRule
              };
            },
            abortSignal: abortController.signal
          });
          created = bulkActionOutcome.results.map(({
            result
          }) => result).filter(rule => rule !== null);
          break;
        case _request_schema.BulkActionType.export:
          const exported = await (0, _get_export_by_object_ids.getExportByObjectIds)(rulesClient, exceptionsClient, savedObjectsClient, rules.map(({
            params
          }) => ({
            rule_id: params.ruleId
          })), logger);
          const responseBody = `${exported.rulesNdjson}${exported.exceptionLists}${exported.exportDetails}`;
          return response.ok({
            headers: {
              'Content-Disposition': `attachment; filename="rules_export.ndjson"`,
              'Content-Type': 'application/ndjson'
            },
            body: responseBody
          });

        // will be processed only when isDryRun === true
        // during dry run only validation is getting performed and rule is not saved in ES
        case _request_schema.BulkActionType.edit:
          bulkActionOutcome = await (0, _promise_pool.initPromisePool)({
            concurrency: _constants.MAX_RULES_TO_UPDATE_IN_PARALLEL,
            items: rules,
            executor: async rule => {
              await (0, _validations.dryRunValidateBulkEditRule)({
                mlAuthz,
                rule,
                edit: body.edit
              });
              return rule;
            },
            abortSignal: abortController.signal
          });
          updated = bulkActionOutcome.results.map(({
            result
          }) => result).filter(rule => rule !== null);
      }
      if (abortController.signal.aborted === true) {
        throw new _common.AbortError('Bulk action was aborted');
      }
      return buildBulkResponse(response, {
        updated,
        deleted,
        created,
        errors: [...fetchRulesOutcome.errors, ...bulkActionOutcome.errors],
        isDryRun
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.performBulkActionRoute = performBulkActionRoute;