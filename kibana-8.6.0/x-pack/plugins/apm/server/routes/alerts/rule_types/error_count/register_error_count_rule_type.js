"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerErrorCountRuleType = registerErrorCountRuleType;
var _configSchema = require("@kbn/config-schema");
var _rxjs = require("rxjs");
var _ruleDataUtils = require("@kbn/rule-data-utils");
var _server = require("../../../../../../rule_registry/server");
var _server2 = require("../../../../../../observability/server");
var _common = require("../../../../../../observability/common");
var _utils = require("../../../../../../infra/server/lib/alerting/common/utils");
var _common2 = require("../../../../../../spaces/common");
var _environment_filter_values = require("../../../../../common/environment_filter_values");
var _formatters = require("../../../../../common/utils/formatters");
var _apm_rule_types = require("../../../../../common/rules/apm_rule_types");
var _elasticsearch_fieldnames = require("../../../../../common/elasticsearch_fieldnames");
var _environment_query = require("../../../../../common/utils/environment_query");
var _get_apm_indices = require("../../../settings/apm_indices/get_apm_indices");
var _action_variables = require("../../action_variables");
var _alerting_es_client = require("../../alerting_es_client");
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
  serviceName: _configSchema.schema.maybe(_configSchema.schema.string()),
  environment: _configSchema.schema.string()
});
const ruleTypeConfig = _apm_rule_types.RULE_TYPES_CONFIG[_apm_rule_types.ApmRuleType.ErrorCount];
function registerErrorCountRuleType({
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
    id: _apm_rule_types.ApmRuleType.ErrorCount,
    name: ruleTypeConfig.name,
    actionGroups: ruleTypeConfig.actionGroups,
    defaultActionGroupId: ruleTypeConfig.defaultActionGroupId,
    validate: {
      params: paramsSchema
    },
    actionVariables: {
      context: [...((_observability$getAle = observability.getAlertDetailsConfig()) !== null && _observability$getAle !== void 0 && _observability$getAle.apm.enabled ? [_action_variables.apmActionVariables.alertDetailsUrl] : []), _action_variables.apmActionVariables.environment, _action_variables.apmActionVariables.interval, _action_variables.apmActionVariables.reason, _action_variables.apmActionVariables.serviceName, _action_variables.apmActionVariables.threshold, _action_variables.apmActionVariables.triggerValue, _action_variables.apmActionVariables.viewInAppUrl]
    },
    producer: _apm_rule_types.APM_SERVER_FEATURE_ID,
    minimumLicenseRequired: 'basic',
    isExportable: true,
    executor: async ({
      params: ruleParams,
      services,
      spaceId
    }) => {
      var _response$aggregation, _response$aggregation2;
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
      const searchParams = {
        index: indices.error,
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
              }, {
                term: {
                  [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _common.ProcessorEvent.error
                }
              }, ...(0, _server2.termQuery)(_elasticsearch_fieldnames.SERVICE_NAME, ruleParams.serviceName, {
                queryEmptyString: false
              }), ...(0, _environment_query.environmentQuery)(ruleParams.environment)]
            }
          },
          aggs: {
            error_counts: {
              multi_terms: {
                terms: [{
                  field: _elasticsearch_fieldnames.SERVICE_NAME
                }, {
                  field: _elasticsearch_fieldnames.SERVICE_ENVIRONMENT,
                  missing: _environment_filter_values.ENVIRONMENT_NOT_DEFINED.value
                }],
                size: 1000,
                order: {
                  _count: 'desc'
                }
              },
              aggs: (0, _get_service_group_fields.getServiceGroupFieldsAgg)()
            }
          }
        }
      };
      const response = await (0, _alerting_es_client.alertingEsClient)({
        scopedClusterClient,
        params: searchParams
      });
      const errorCountResults = (_response$aggregation = (_response$aggregation2 = response.aggregations) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.error_counts.buckets.map(bucket => {
        const [serviceName, environment] = bucket.key;
        return {
          serviceName,
          environment,
          errorCount: bucket.doc_count,
          sourceFields: (0, _get_service_group_fields.getServiceGroupFields)(bucket)
        };
      })) !== null && _response$aggregation !== void 0 ? _response$aggregation : [];
      errorCountResults.filter(result => result.errorCount >= ruleParams.threshold).forEach(result => {
        var _getEnvironmentEsFiel;
        const {
          serviceName,
          environment,
          errorCount,
          sourceFields
        } = result;
        const alertReason = (0, _apm_rule_types.formatErrorCountReason)({
          serviceName,
          threshold: ruleParams.threshold,
          measured: errorCount,
          windowSize: ruleParams.windowSize,
          windowUnit: ruleParams.windowUnit
        });
        const id = [_apm_rule_types.ApmRuleType.ErrorCount, serviceName, environment].filter(name => name).join('_');
        const relativeViewInAppUrl = (0, _formatters.getAlertUrlErrorCount)(serviceName, (_getEnvironmentEsFiel = (0, _environment_filter_values.getEnvironmentEsField)(environment)) === null || _getEnvironmentEsFiel === void 0 ? void 0 : _getEnvironmentEsFiel[_elasticsearch_fieldnames.SERVICE_ENVIRONMENT]);
        const viewInAppUrl = (0, _common2.addSpaceIdToPath)(basePath.publicBaseUrl, spaceId, relativeViewInAppUrl);
        const alertUuid = getAlertUuid(id);
        const alertDetailsUrl = (0, _utils.getAlertDetailsUrl)(basePath, spaceId, alertUuid);
        services.alertWithLifecycle({
          id,
          fields: {
            [_elasticsearch_fieldnames.SERVICE_NAME]: serviceName,
            ...(0, _environment_filter_values.getEnvironmentEsField)(environment),
            [_elasticsearch_fieldnames.PROCESSOR_EVENT]: _common.ProcessorEvent.error,
            [_ruleDataUtils.ALERT_EVALUATION_VALUE]: errorCount,
            [_ruleDataUtils.ALERT_EVALUATION_THRESHOLD]: ruleParams.threshold,
            [_ruleDataUtils.ALERT_REASON]: alertReason,
            ...sourceFields
          }
        }).scheduleActions(ruleTypeConfig.defaultActionGroupId, {
          alertDetailsUrl,
          environment: (0, _environment_filter_values.getEnvironmentLabel)(environment),
          interval: `${ruleParams.windowSize}${ruleParams.windowUnit}`,
          reason: alertReason,
          serviceName,
          threshold: ruleParams.threshold,
          triggerValue: errorCount,
          viewInAppUrl
        });
      });
      return {};
    }
  }));
}