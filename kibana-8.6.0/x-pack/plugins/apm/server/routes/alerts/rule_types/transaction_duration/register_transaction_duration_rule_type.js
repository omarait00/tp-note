"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTransactionDurationRuleType = registerTransactionDurationRuleType;
var _configSchema = require("@kbn/config-schema");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _rxjs = require("rxjs");
var _formatters = require("../../../../../../observability/common/utils/formatters");
var _server = require("../../../../../../observability/server");
var _server2 = require("../../../../../../rule_registry/server");
var _common = require("../../../../../../observability/common");
var _utils = require("../../../../../../infra/server/lib/alerting/common/utils");
var _common2 = require("../../../../../../spaces/common");
var _formatters2 = require("../../../../../common/utils/formatters");
var _aggregated_transactions = require("../../../../../common/aggregated_transactions");
var _apm_rule_types = require("../../../../../common/rules/apm_rule_types");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _environment_filter_values = require("../../../../../common/environment_filter_values");
var _environment_query = require("../../../../../common/utils/environment_query");
var _transactions = require("../../../../lib/helpers/transactions");
var _get_apm_indices = require("../../../settings/apm_indices/get_apm_indices");
var _action_variables = require("../../action_variables");
var _alerting_es_client = require("../../alerting_es_client");
var _average_or_percentile_agg = require("./average_or_percentile_agg");
var _get_service_group_fields = require("../get_service_group_fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const paramsSchema = _configSchema.schema.object({
  serviceName: _configSchema.schema.string(),
  transactionType: _configSchema.schema.string(),
  windowSize: _configSchema.schema.number(),
  windowUnit: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  aggregationType: _configSchema.schema.oneOf([_configSchema.schema.literal(_apm_rule_types.AggregationType.Avg), _configSchema.schema.literal(_apm_rule_types.AggregationType.P95), _configSchema.schema.literal(_apm_rule_types.AggregationType.P99)]),
  environment: _configSchema.schema.string()
});
const ruleTypeConfig = _apm_rule_types.RULE_TYPES_CONFIG[_apm_rule_types.ApmRuleType.TransactionDuration];
function registerTransactionDurationRuleType({
  alerting,
  ruleDataClient,
  config$,
  logger,
  observability,
  basePath
}) {
  var _observability$getAle;
  const createLifecycleRuleType = (0, _server2.createLifecycleRuleTypeFactory)({
    ruleDataClient,
    logger
  });
  const ruleType = createLifecycleRuleType({
    id: _apm_rule_types.ApmRuleType.TransactionDuration,
    name: ruleTypeConfig.name,
    actionGroups: ruleTypeConfig.actionGroups,
    defaultActionGroupId: ruleTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [...((_observability$getAle = observability.getAlertDetailsConfig()) !== null && _observability$getAle !== void 0 && _observability$getAle.apm.enabled ? [_action_variables.apmActionVariables.alertDetailsUrl] : []), _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.interval, _action_variables.apmActionVariables.reason, _action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.transactionType, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.viewInAppUrl]
    },
    producer: _apm_rule_types.APM_SERVER_FEATURE_ID,
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async ({
      params: ruleParams,
      services,
      spaceId
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
      const field = (0, _transactions.getDurationFieldForTransactions)(searchAggregatedTransactions);
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
              }, ...(0, _transactions.getDocumentTypeFilterForTransactions)(searchAggregatedTransactions), ...(0, _server.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, ruleParams.serviceName, {
                queryEmptyString: false
              }), ...(0, _server.termQuery)(_elasticsearch_fieldnames.TRANSACTION_TYPE, ruleParams.transactionType, {
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
                ...(0, _average_or_percentile_agg.getMultiTermsSortOrder)(ruleParams.aggregationType)
              },
              aggs: {
                ...(0, _average_or_percentile_agg.averageOrPercentileAgg)({
                  aggregationType: ruleParams.aggregationType,
                  transactionDurationField: field
                }),
                ...(0, _get_service_group_fields.getServiceGroupFieldsAgg)()
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

      // Converts threshold to microseconds because this is the unit used on transactionDuration
      const thresholdMicroseconds = ruleParams.threshold * 1000;
      const triggeredBuckets = [];
      for (const bucket of response.aggregations.series.buckets) {
        const [serviceName, environment, transactionType] = bucket.key;
        const transactionDuration = 'avgLatency' in bucket // only true if ruleParams.aggregationType === 'avg'
        ? bucket.avgLatency.value : bucket.pctLatency.values[0].value;
        if (transactionDuration !== null && transactionDuration > thresholdMicroseconds) {
          triggeredBuckets.push({
            environment,
            serviceName,
            sourceFields: (0, _get_service_group_fields.getServiceGroupFields)(bucket),
            transactionType,
            transactionDuration
          });
        }
      }
      for (const {
        serviceName,
        environment,
        transactionType,
        transactionDuration,
        sourceFields
      } of triggeredBuckets) {
        var _getEnvironmentEsFiel;
        const environmentLabel = (0, _environment_filter_values.getEnvironmentLabel)(environment);
        const durationFormatter = (0, _formatters2.getDurationFormatter)(transactionDuration);
        const transactionDurationFormatted = durationFormatter(transactionDuration).formatted;
        const reason = (0, _apm_rule_types.formatTransactionDurationReason)({
          aggregationType: String(ruleParams.aggregationType),
          asDuration: _formatters.asDuration,
          measured: transactionDuration,
          serviceName,
          threshold: thresholdMicroseconds,
          windowSize: ruleParams.windowSize,
          windowUnit: ruleParams.windowUnit
        });
        const id = `${_apm_rule_types.ApmRuleType.TransactionDuration}_${environmentLabel}`;
        const alertUuid = getAlertUuid(id);
        const alertDetailsUrl = (0, _utils.getAlertDetailsUrl)(basePath, spaceId, alertUuid);
        const viewInAppUrl = (0, _common2.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, (0, _formatters2.getAlertUrlTransaction)(serviceName, (_getEnvironmentEsFiel = (0, _environment_filter_values.getEnvironmentEsField)(environment)) === null || _getEnvironmentEsFiel === void 0 ? void 0 : _getEnvironmentEsFiel[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT], transactionType));
        services.alertWithLifecycle({
          id,
          fields: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName,
            ...(0, _environment_filter_values.getEnvironmentEsField)(environment),
            [_elasticsearch_fieldnames.TRANSACTION_TYPE]: transactionType,
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _common.ProcessorEvent.transaction,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: transactionDuration,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: thresholdMicroseconds,
            [_ruleDataUtils.ALERT_REASON]: reason,
            ...sourceFields
          }
        }).scheduleActions(ruleTypeConfig.defaultActionGroupId, {
          alertDetailsUrl,
          environment: environmentLabel,
          interval: `${ruleParams.windowSize}${ruleParams.windowUnit}`,
          reason,
          serviceName,
          threshold: thresholdMicroseconds,
          transactionType,
          triggerValue: transactionDurationFormatted,
          viewInAppUrl
        });
      }
      return {};
    }
  });
  alerting.registerType(ruleType);
}