"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionErrorRateRuleType = registerTransactionErrorRateRuleType;
var _configSchema = require("@kbn/config-schema");
var _rxjs = require("rxjs");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _server = require("../../../../../../rule_registry/server");
var _formatters = require("../../../../../../observability/common/utils/formatters");
var _server2 = require("../../../../../../observability/server");
var _common = require("../../../../../../spaces/common");
var _common2 = require("../../../../../../observability/common");
var _utils = require("../../../../../../infra/server/lib/alerting/common/utils");
var _environment_filter_values = require("../../../../../common/environment_filter_values");
var _formatters2 = require("../../../../../common/utils/formatters");
var _apm_rule_types = require("../../../../../common/rules/apm_rule_types");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _event_outcome = require("../../../../../common/event_outcome");
var _environment_query = require("../../../../../common/utils/environment_query");
var _get_apm_indices = require("../../../settings/apm_indices/get_apm_indices");
var _action_variables = require("../../action_variables");
var _alerting_es_client = require("../../alerting_es_client");
var _aggregated_transactions = require("../../../../../common/aggregated_transactions");
var _transactions = require("../../../../lib/helpers/transactions");
var _get_service_group_fields = require("../get_service_group_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramsSchema = _configSchema.schema.object({
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  transactionType: _configSchema.schema.maybe(_configSchema.schema.string()),
  serviceName: _configSchema.schema.maybe(_configSchema.schema.string()),
  environment: _configSchema.schema.string()
});
const ruleTypeConfig = _apm_rule_types.RULE_TYPES_CONFIG[_apm_rule_types.ApmRuleType.TransactionErrorRate];
function registerTransactionErrorRateRuleType({
  alerting,
  basePath,
  config$,
  logger,
  observability,
  ruleDataClient
}) {
  var _observability$getAle;
  const createLifecycleRuleType = (0, _server.createLifecycleRuleTypeFactory)({
    ruleDataClient,
    logger
  });
  alerting.registerType(createLifecycleRuleType({
    id: _apm_rule_types.ApmRuleType.TransactionErrorRate,
    name: ruleTypeConfig.name,
    actionGroups: ruleTypeConfig.actionGroups,
    defaultActionGroupId: ruleTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [...((_observability$getAle = observability.getAlertDetailsConfig()) !== null && _observability$getAle !== void 0 && _observability$getAle.apm.enabled ? [_action_variables.apmActionVariables.alertDetailsUrl] : []), _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.interval, _action_variables.apmActionVariables.reason, _action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.viewInAppUrl]
    },
    producer: _apm_rule_types.APM_SERVER_FEATURE_ID,
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async ({
      services,
      spaceId,
      params: ruleParams
    }) => {
      const config = await (0, _rxjs.firstValueFrom)(config$);
      const {
        getAlertUuid,
        savedObjectsClient,
        scopedClusterClient
      } = services;
      const indices = await (0, _get_apm_indices.getApmIndices)({
        config,
        savedObjectsClient
      });

      // only query transaction events when set to 'never',
      // to prevent (likely) unnecessary blocking request
      // in rule execution
      const searchAggregatedTransactions = config.searchAggregatedTransactions !== _aggregated_transactions.SearchAggregatedTransactionSetting.never;
      const index = searchAggregatedTransactions ? indices.metric : indices.transaction;
      const searchParams = {
        index,
        body: {
          track_total_hits: false,
          size: 0,
          query: {
            bool: {
              filter: [{
                range: {
                  '@timestamp': {
                    gte: `now-${ruleParams.windowSize}${ruleParams.windowUnit}`
                  }
                }
              }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), {
                terms: {
                  [_elasticsearch_fieldnames.EVENT_OUTCOME]: [_event_outcome.EventOutcome.failure, _event_outcome.EventOutcome.success]
                }
              }, ...(0, _server2.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, ruleParams.serviceName, {
                queryEmptyString: false
              }), ...(0, _server2.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, ruleParams.transactionType, {
                queryEmptyString: false
              }), ...(0, _environment_query.environmentQuery)(ruleParams.environment)]
            }
          },
          aggs: {
            series: {
              multi_terms: {
                terms: [{
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }, {
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                  missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value
                }, {
                  field: _elasticsearch_fieldnames.TRANSACTION_TYPE
                }],
                size: 1000,
                order: {
                  _count: 'desc'
                }
              },
              aggs: {
                outcomes: {
                  terms: {
                    field: _elasticsearch_fieldnames.EVENT_OUTCOME
                  },
                  aggs: (0, _get_service_group_fields.getServiceGroupFieldsAgg)()
                }
              }
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)({
        scopedClusterClient,
        params: searchParams
      });
      if (!response.aggregations) {
        return {};
      }
      const results = [];
      for (const bucket of response.aggregations.series.buckets) {
        var _failedOutcomeBucket$, _bucket$outcomes$buck, _bucket$outcomes$buck2;
        const [serviceName, environment, transactionType] = bucket.key;
        const failedOutcomeBucket = bucket.outcomes.buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.failure);
        const failed = (_failedOutcomeBucket$ = failedOutcomeBucket === null || failedOutcomeBucket === void 0 ? void 0 : failedOutcomeBucket.doc_count) !== null && _failedOutcomeBucket$ !== void 0 ? _failedOutcomeBucket$ : 0;
        const succesful = (_bucket$outcomes$buck = (_bucket$outcomes$buck2 = bucket.outcomes.buckets.find(outcomeBucket => outcomeBucket.key === _event_outcome.EventOutcome.success)) === null || _bucket$outcomes$buck2 === void 0 ? void 0 : _bucket$outcomes$buck2.doc_count) !== null && _bucket$outcomes$buck !== void 0 ? _bucket$outcomes$buck : 0;
        const errorRate = failed / (failed + succesful) * 100;
        if (errorRate >= ruleParams.threshold) {
          results.push({
            serviceName,
            environment,
            transactionType,
            errorRate,
            sourceFields: (0, _get_service_group_fields.getServiceGroupFields)(failedOutcomeBucket)
          });
        }
      }
      results.forEach(result => {
        var _getEnvironmentEsFiel;
        const {
          serviceName,
          environment,
          transactionType,
          errorRate,
          sourceFields
        } = result;
        const reasonMessage = (0, _apm_rule_types.formatTransactionErrorRateReason)({
          threshold: ruleParams.threshold,
          measured: errorRate,
          asPercent: _formatters.asPercent,
          serviceName,
          windowSize: ruleParams.windowSize,
          windowUnit: ruleParams.windowUnit
        });
        const id = [_apm_rule_types.ApmRuleType.TransactionErrorRate, serviceName, transactionType, environment].filter(name => name).join('_');
        const alertUuid = getAlertUuid(id);
        const alertDetailsUrl = (0, _utils.getAlertDetailsUrl)(basePath, spaceId, alertUuid);
        const relativeViewInAppUrl = (0, _formatters2.getAlertUrlTransaction)(serviceName, (_getEnvironmentEsFiel = (0, _environment_filter_values.getEnvironmentEsField)(environment)) === null || _getEnvironmentEsFiel === void 0 ? void 0 : _getEnvironmentEsFiel[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT], transactionType);
        const viewInAppUrl = (0, _common.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, relativeViewInAppUrl);
        services.alertWithLifecycle({
          id,
          fields: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName,
            ...(0, _environment_filter_values.getEnvironmentEsField)(environment),
            [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType,
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _common2.ProcessorEvent.transaction,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: errorRate,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: ruleParams.threshold,
            [_ruleDataUtils.ALERT_REASON]: reasonMessage,
            ...sourceFields
          }
        }).scheduleActions(ruleTypeConfig.defaultActionGroupId, {
          alertDetailsUrl,
          environment: (0, _environment_filter_values.getEnvironmentLabel)(environment),
          interval: `${ruleParams.windowSize}${ruleParams.windowUnit}`,
          reason: reasonMessage,
          serviceName,
          threshold: ruleParams.threshold,
          transactionType,
          triggerValue: (0, _formatters2.asDecimalOrInteger)(errorRate),
          viewInAppUrl
        });
      });
      return {};
    }
  }));
}