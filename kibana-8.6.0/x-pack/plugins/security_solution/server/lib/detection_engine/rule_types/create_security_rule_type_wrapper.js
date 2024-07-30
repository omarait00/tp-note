"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSecurityRuleTypeWrapper = void 0;
var _lodash = require("lodash");
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _server = require("../../../../../rule_registry/server");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _exception_lists = require("../../../../../lists/server/services/exception_lists");
var _utils = require("../signals/utils");
var _constants = require("../../../../common/constants");
var _get_list_client = require("./utils/get_list_client");
var _rule_actions_legacy = require("../rule_actions_legacy");
var _utils2 = require("./utils");
var _factories = require("./factories");
var _rule_monitoring = require("../../../../common/detection_engine/rule_monitoring");
var _rule_monitoring2 = require("../rule_monitoring");
var _signal_aad_mapping = _interopRequireDefault(require("../routes/index/signal_aad_mapping.json"));
var _saved_object_references = require("../signals/saved_object_references");
var _with_security_span = require("../../../utils/with_security_span");
var _get_input_output_index = require("../signals/get_input_output_index");
var _constants2 = require("./constants");
var _build_timestamp_runtime_mapping = require("./utils/build_timestamp_runtime_mapping");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

/* eslint-disable complexity */
const createSecurityRuleTypeWrapper = ({
  lists,
  logger,
  config,
  ruleDataClient,
  ruleExecutionLoggerFactory,
  version,
  isPreview
}) => type => {
  const {
    alertIgnoreFields: ignoreFields,
    alertMergeStrategy: mergeStrategy
  } = config;
  const persistenceRuleType = (0, _server.createPersistenceRuleTypeWrapper)({
    ruleDataClient,
    logger
  });
  return persistenceRuleType({
    ...type,
    cancelAlertsOnRuleTimeout: false,
    useSavedObjectReferences: {
      extractReferences: params => (0, _saved_object_references.extractReferences)({
        logger,
        params
      }),
      injectReferences: (params, savedObjectReferences) => (0, _saved_object_references.injectReferences)({
        logger,
        params,
        savedObjectReferences
      })
    },
    async executor(options) {
      _elasticApmNode.default.setTransactionName(`${options.rule.ruleTypeId} execution`);
      return (0, _with_security_span.withSecuritySpan)('securityRuleTypeExecutor', async () => {
        const {
          executionId,
          params,
          previousStartedAt,
          startedAt,
          services,
          spaceId,
          state,
          rule
        } = options;
        let runState = state;
        let inputIndex = [];
        let runtimeMappings;
        const {
          from,
          maxSignals,
          meta,
          ruleId,
          timestampOverride,
          timestampOverrideFallbackDisabled,
          to
        } = params;
        const {
          alertWithPersistence,
          savedObjectsClient,
          scopedClusterClient,
          uiSettingsClient
        } = services;
        const searchAfterSize = Math.min(maxSignals, _constants.DEFAULT_SEARCH_AFTER_PAGE_SIZE);
        const esClient = scopedClusterClient.asCurrentUser;
        const ruleExecutionLogger = await ruleExecutionLoggerFactory({
          savedObjectsClient,
          context: {
            executionId,
            ruleId: rule.id,
            ruleUuid: params.ruleId,
            ruleName: rule.name,
            ruleType: rule.ruleTypeId,
            spaceId
          }
        });
        const completeRule = {
          ruleConfig: rule,
          ruleParams: params,
          alertId: rule.id
        };
        const {
          actions,
          name,
          schedule: {
            interval
          }
        } = completeRule.ruleConfig;
        const refresh = actions.length ? 'wait_for' : false;
        ruleExecutionLogger.debug('[+] Starting Signal Rule execution');
        ruleExecutionLogger.debug(`interval: ${interval}`);
        await ruleExecutionLogger.logStatusChange({
          newStatus: _rule_monitoring.RuleExecutionStatus.running
        });
        let result = (0, _utils2.createResultObject)(state);
        let wroteWarningStatus = false;
        let hasError = false;
        const notificationRuleParams = {
          ...params,
          name,
          id: rule.id
        };
        const primaryTimestamp = timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : _ruleDataUtils.TIMESTAMP;
        const secondaryTimestamp = primaryTimestamp !== _ruleDataUtils.TIMESTAMP && !timestampOverrideFallbackDisabled ? _ruleDataUtils.TIMESTAMP : undefined;

        // If we have a timestampOverride, we'll compute a runtime field that emits the override for each document if it exists,
        // otherwise it emits @timestamp. If we don't have a timestamp override we don't want to pay the cost of using a
        // runtime field, so we just use @timestamp directly.
        const {
          aggregatableTimestampField,
          timestampRuntimeMappings
        } = secondaryTimestamp && timestampOverride ? {
          aggregatableTimestampField: _constants2.TIMESTAMP_RUNTIME_FIELD,
          timestampRuntimeMappings: (0, _build_timestamp_runtime_mapping.buildTimestampRuntimeMapping)({
            timestampOverride
          })
        } : {
          aggregatableTimestampField: primaryTimestamp,
          timestampRuntimeMappings: undefined
        };

        /**
         * Data Views Logic
         * Use of data views is supported for all rules other than ML.
         * Rules can define both a data view and index pattern, but on execution:
         *  - Data view is used if it is defined
         *    - Rule exits early if data view defined is not found (ie: it's been deleted)
         *  - If no data view defined, falls to using existing index logic
         */
        if (!(0, _utils.isMachineLearningParams)(params)) {
          try {
            const {
              index,
              runtimeMappings: dataViewRuntimeMappings
            } = await (0, _get_input_output_index.getInputIndex)({
              index: params.index,
              services,
              version,
              logger,
              ruleId: params.ruleId,
              dataViewId: params.dataViewId
            });
            inputIndex = index !== null && index !== void 0 ? index : [];
            runtimeMappings = dataViewRuntimeMappings;
          } catch (exc) {
            const errorMessage = exc instanceof _get_input_output_index.DataViewError ? `Data View not found ${exc}` : `Check for indices to search failed ${exc}`;
            await ruleExecutionLogger.logStatusChange({
              newStatus: _rule_monitoring.RuleExecutionStatus.failed,
              message: errorMessage
            });
            return result.state;
          }
        }

        // check if rule has permissions to access given index pattern
        // move this collection of lines into a function in utils
        // so that we can use it in create rules route, bulk, etc.
        let skipExecution = false;
        try {
          if (!(0, _utils.isMachineLearningParams)(params)) {
            const privileges = await (0, _utils.checkPrivilegesFromEsClient)(esClient, inputIndex);
            wroteWarningStatus = await (0, _utils.hasReadIndexPrivileges)({
              privileges,
              ruleExecutionLogger,
              uiSettingsClient
            });
            if (!wroteWarningStatus) {
              const timestampFieldCaps = await (0, _with_security_span.withSecuritySpan)('fieldCaps', () => services.scopedClusterClient.asCurrentUser.fieldCaps({
                index: inputIndex,
                fields: secondaryTimestamp ? [primaryTimestamp, secondaryTimestamp] : [primaryTimestamp],
                include_unmapped: true,
                runtime_mappings: runtimeMappings,
                ignore_unavailable: true
              }, {
                meta: true
              }));
              const {
                wroteWarningStatus: wroteWarningStatusResult,
                foundNoIndices
              } = await (0, _utils.hasTimestampFields)({
                timestampField: primaryTimestamp,
                timestampFieldCapsResponse: timestampFieldCaps,
                inputIndices: inputIndex,
                ruleExecutionLogger
              });
              wroteWarningStatus = wroteWarningStatusResult;
              skipExecution = foundNoIndices;
            }
          }
        } catch (exc) {
          await ruleExecutionLogger.logStatusChange({
            newStatus: _rule_monitoring.RuleExecutionStatus['partial failure'],
            message: `Check privileges failed to execute ${exc}`
          });
          wroteWarningStatus = true;
        }
        const {
          tuples,
          remainingGap
        } = (0, _utils.getRuleRangeTuples)({
          startedAt,
          previousStartedAt,
          from,
          to,
          interval,
          maxSignals: maxSignals !== null && maxSignals !== void 0 ? maxSignals : _constants.DEFAULT_MAX_SIGNALS,
          ruleExecutionLogger
        });
        if (remainingGap.asMilliseconds() > 0) {
          hasError = true;
          const gapDuration = `${remainingGap.humanize()} (${remainingGap.asMilliseconds()}ms)`;
          await ruleExecutionLogger.logStatusChange({
            newStatus: _rule_monitoring.RuleExecutionStatus.failed,
            message: `${gapDuration} were not queried between this rule execution and the last execution, so signals may have been missed. Consider increasing your look behind time or adding more Kibana instances`,
            metrics: {
              executionGap: remainingGap
            }
          });
        }
        try {
          const {
            listClient,
            exceptionsClient
          } = (0, _get_list_client.getListClient)({
            esClient: services.scopedClusterClient.asCurrentUser,
            updatedByUser: rule.updatedBy,
            spaceId,
            lists,
            savedObjectClient: options.services.savedObjectsClient
          });
          const exceptionItems = await (0, _utils.getExceptions)({
            client: exceptionsClient,
            lists: params.exceptionsList
          });
          const bulkCreate = (0, _factories.bulkCreateFactory)(alertWithPersistence, refresh, ruleExecutionLogger);
          const alertTimestampOverride = isPreview ? startedAt : undefined;
          const legacySignalFields = Object.keys(_signal_aad_mapping.default);
          const wrapHits = (0, _factories.wrapHitsFactory)({
            ignoreFields: [...ignoreFields, ...legacySignalFields],
            mergeStrategy,
            completeRule,
            spaceId,
            indicesToQuery: inputIndex,
            alertTimestampOverride
          });
          const wrapSequences = (0, _factories.wrapSequencesFactory)({
            logger,
            ignoreFields: [...ignoreFields, ...legacySignalFields],
            mergeStrategy,
            completeRule,
            spaceId,
            indicesToQuery: inputIndex,
            alertTimestampOverride
          });
          const {
            filter: exceptionFilter,
            unprocessedExceptions
          } = await (0, _exception_lists.buildExceptionFilter)({
            alias: null,
            excludeExceptions: true,
            chunkSize: 10,
            lists: exceptionItems,
            listClient
          });
          if (!skipExecution) {
            for (const tuple of tuples) {
              const runResult = await type.executor({
                ...options,
                services,
                state: runState,
                runOpts: {
                  completeRule,
                  inputIndex,
                  exceptionFilter,
                  unprocessedExceptions,
                  runtimeMappings: {
                    ...runtimeMappings,
                    ...timestampRuntimeMappings
                  },
                  searchAfterSize,
                  tuple,
                  bulkCreate,
                  wrapHits,
                  wrapSequences,
                  listClient,
                  ruleDataReader: ruleDataClient.getReader({
                    namespace: options.spaceId
                  }),
                  mergeStrategy,
                  primaryTimestamp,
                  secondaryTimestamp,
                  ruleExecutionLogger,
                  aggregatableTimestampField,
                  alertTimestampOverride
                }
              });
              const createdSignals = result.createdSignals.concat(runResult.createdSignals);
              const warningMessages = result.warningMessages.concat(runResult.warningMessages);
              result = {
                bulkCreateTimes: result.bulkCreateTimes.concat(runResult.bulkCreateTimes),
                enrichmentTimes: result.enrichmentTimes.concat(runResult.enrichmentTimes),
                createdSignals,
                createdSignalsCount: createdSignals.length,
                errors: result.errors.concat(runResult.errors),
                lastLookbackDate: runResult.lastLookBackDate,
                searchAfterTimes: result.searchAfterTimes.concat(runResult.searchAfterTimes),
                state: runResult.state,
                success: result.success && runResult.success,
                warning: warningMessages.length > 0,
                warningMessages
              };
              runState = runResult.state;
            }
          } else {
            result = {
              bulkCreateTimes: [],
              enrichmentTimes: [],
              createdSignals: [],
              createdSignalsCount: 0,
              errors: [],
              searchAfterTimes: [],
              state,
              success: true,
              warning: false,
              warningMessages: []
            };
          }
          if (result.warningMessages.length) {
            await ruleExecutionLogger.logStatusChange({
              newStatus: _rule_monitoring.RuleExecutionStatus['partial failure'],
              message: (0, _rule_monitoring2.truncateList)(result.warningMessages).join()
            });
          }
          const createdSignalsCount = result.createdSignals.length;
          if (actions.length) {
            var _parseScheduleDates, _parseScheduleDates2;
            const fromInMs = (_parseScheduleDates = (0, _securitysolutionIoTsUtils.parseScheduleDates)(`now-${interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
            const toInMs = (_parseScheduleDates2 = (0, _securitysolutionIoTsUtils.parseScheduleDates)('now')) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
            const resultsLink = (0, _rule_actions_legacy.getNotificationResultsLink)({
              from: fromInMs,
              to: toInMs,
              id: rule.id,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url
            });
            ruleExecutionLogger.debug(`Found ${createdSignalsCount} signals for notification.`);
            if (completeRule.ruleConfig.throttle != null) {
              var _completeRule$ruleCon;
              // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early
              await (0, _rule_actions_legacy.scheduleThrottledNotificationActions)({
                alertInstance: services.alertFactory.create(rule.id),
                throttle: (_completeRule$ruleCon = completeRule.ruleConfig.throttle) !== null && _completeRule$ruleCon !== void 0 ? _completeRule$ruleCon : '',
                startedAt,
                id: rule.id,
                kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
                outputIndex: ruleDataClient.indexNameWithNamespace(spaceId),
                ruleId,
                esClient: services.scopedClusterClient.asCurrentUser,
                notificationRuleParams,
                signals: result.createdSignals,
                logger
              });
            } else if (createdSignalsCount) {
              const alertInstance = services.alertFactory.create(rule.id);
              (0, _rule_actions_legacy.scheduleNotificationActions)({
                alertInstance,
                signalsCount: createdSignalsCount,
                signals: result.createdSignals,
                resultsLink,
                ruleParams: notificationRuleParams
              });
            }
          }
          if (result.success) {
            ruleExecutionLogger.debug('[+] Signal Rule execution completed.');
            ruleExecutionLogger.debug(`[+] Finished indexing ${createdSignalsCount} signals into ${ruleDataClient.indexNameWithNamespace(spaceId)}`);
            if (!hasError && !wroteWarningStatus && !result.warning) {
              await ruleExecutionLogger.logStatusChange({
                newStatus: _rule_monitoring.RuleExecutionStatus.succeeded,
                message: 'Rule execution completed successfully',
                metrics: {
                  searchDurations: result.searchAfterTimes,
                  indexingDurations: result.bulkCreateTimes,
                  enrichmentDurations: result.enrichmentTimes
                }
              });
            }
            ruleExecutionLogger.debug(`[+] Finished indexing ${createdSignalsCount} ${!(0, _lodash.isEmpty)(tuples) ? `signals searched between date ranges ${JSON.stringify(tuples, null, 2)}` : ''}`);
          } else {
            await ruleExecutionLogger.logStatusChange({
              newStatus: _rule_monitoring.RuleExecutionStatus.failed,
              message: `Bulk Indexing of signals failed: ${(0, _rule_monitoring2.truncateList)(result.errors).join()}`,
              metrics: {
                searchDurations: result.searchAfterTimes,
                indexingDurations: result.bulkCreateTimes,
                enrichmentDurations: result.enrichmentTimes
              }
            });
          }
        } catch (error) {
          var _error$message;
          const errorMessage = (_error$message = error.message) !== null && _error$message !== void 0 ? _error$message : '(no error message given)';
          await ruleExecutionLogger.logStatusChange({
            newStatus: _rule_monitoring.RuleExecutionStatus.failed,
            message: `An error occurred during rule execution: message: "${errorMessage}"`,
            metrics: {
              searchDurations: result.searchAfterTimes,
              indexingDurations: result.bulkCreateTimes,
              enrichmentDurations: result.enrichmentTimes
            }
          });

          // NOTE: Since this is throttled we have to call it even on an error condition, otherwise it will "reset" the throttle and fire early
          if (actions.length && completeRule.ruleConfig.throttle != null) {
            var _completeRule$ruleCon2;
            await (0, _rule_actions_legacy.scheduleThrottledNotificationActions)({
              alertInstance: services.alertFactory.create(rule.id),
              throttle: (_completeRule$ruleCon2 = completeRule.ruleConfig.throttle) !== null && _completeRule$ruleCon2 !== void 0 ? _completeRule$ruleCon2 : '',
              startedAt,
              id: completeRule.alertId,
              kibanaSiemAppUrl: meta === null || meta === void 0 ? void 0 : meta.kibana_siem_app_url,
              outputIndex: ruleDataClient.indexNameWithNamespace(spaceId),
              ruleId,
              esClient: services.scopedClusterClient.asCurrentUser,
              notificationRuleParams,
              signals: result.createdSignals,
              logger
            });
          }
        }
        return result.state;
      });
    }
  });
};
exports.createSecurityRuleTypeWrapper = createSecurityRuleTypeWrapper;