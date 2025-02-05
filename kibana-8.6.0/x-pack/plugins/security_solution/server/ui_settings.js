"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initUiSettings = void 0;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _constants = require("../common/constants");
var _rule_monitoring = require("../common/detection_engine/rule_monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This helper is used to preserve settings order in the UI
 *
 * @param settings - UI settings config
 * @returns Settings config with the order field added
 */
const orderSettings = settings => {
  return Object.fromEntries(Object.entries(settings).map(([id, setting], index) => [id, {
    ...setting,
    order: index
  }]));
};
const initUiSettings = (uiSettings, experimentalFeatures) => {
  const securityUiSettings = {
    [_constants.DEFAULT_APP_REFRESH_INTERVAL]: {
      type: 'json',
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultRefreshIntervalLabel', {
        defaultMessage: 'Time filter refresh interval'
      }),
      value: `{
  "pause": ${_constants.DEFAULT_INTERVAL_PAUSE},
  "value": ${_constants.DEFAULT_INTERVAL_VALUE}
}`,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultRefreshIntervalDescription', {
        defaultMessage: '<p>Default refresh interval for the Security time filter, in milliseconds.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        value: _configSchema.schema.number(),
        pause: _configSchema.schema.boolean()
      })
    },
    [_constants.DEFAULT_APP_TIME_RANGE]: {
      type: 'json',
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultTimeRangeLabel', {
        defaultMessage: 'Time filter period'
      }),
      value: `{
  "from": "${_constants.DEFAULT_FROM}",
  "to": "${_constants.DEFAULT_TO}"
}`,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultTimeRangeDescription', {
        defaultMessage: '<p>Default period of time in the Security time filter.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        from: _configSchema.schema.string(),
        to: _configSchema.schema.string()
      })
    },
    [_constants.DEFAULT_INDEX_KEY]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultIndexLabel', {
        defaultMessage: 'Elasticsearch indices'
      }),
      sensitive: true,
      value: _constants.DEFAULT_INDEX_PATTERN,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultIndexDescription', {
        defaultMessage: '<p>Comma-delimited list of Elasticsearch indices from which the Security app collects events.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.arrayOf(_configSchema.schema.string())
    },
    [_constants.DEFAULT_THREAT_INDEX_KEY]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultThreatIndexLabel', {
        defaultMessage: 'Threat indices'
      }),
      sensitive: true,
      value: _constants.DEFAULT_THREAT_INDEX_VALUE,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultThreatIndexDescription', {
        defaultMessage: '<p>Comma-delimited list of Threat Intelligence indices from which the Security app collects indicators.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.arrayOf(_configSchema.schema.string())
    },
    [_constants.DEFAULT_ANOMALY_SCORE]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultAnomalyScoreLabel', {
        defaultMessage: 'Anomaly threshold'
      }),
      value: 50,
      type: 'number',
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.defaultAnomalyScoreDescription', {
        defaultMessage: '<p>Value above which Machine Learning job anomalies are displayed in the Security app.</p><p>Valid values: 0 to 100.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.number()
    },
    [_constants.ENABLE_GROUPED_NAVIGATION]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableGroupedNavigation', {
        defaultMessage: 'New streamlined navigation'
      }),
      value: true,
      type: 'boolean',
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableGroupedNavigationDescription', {
        defaultMessage: '<p>Improve your experience with the new navigation organized and optimized around the most important workflows.</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: false,
      schema: _configSchema.schema.boolean()
    },
    [_constants.ENABLE_NEWS_FEED_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableNewsFeedLabel', {
        defaultMessage: 'News feed'
      }),
      value: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableNewsFeedDescription', {
        defaultMessage: '<p>Enables the News feed</p>'
      }),
      type: 'boolean',
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    },
    [_constants.DEFAULT_RULES_TABLE_REFRESH_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.rulesTableRefresh', {
        defaultMessage: 'Rules auto refresh'
      }),
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.rulesTableRefreshDescription', {
        defaultMessage: '<p>Enables auto refresh on the rules and monitoring tables, in milliseconds</p>'
      }),
      type: 'json',
      value: `{
  "on": ${_constants.DEFAULT_RULE_REFRESH_INTERVAL_ON},
  "value": ${_constants.DEFAULT_RULE_REFRESH_INTERVAL_VALUE}
}`,
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.object({
        value: _configSchema.schema.number({
          min: 60000
        }),
        on: _configSchema.schema.boolean()
      })
    },
    [_constants.NEWS_FEED_URL_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.newsFeedUrl', {
        defaultMessage: 'News feed URL'
      }),
      value: _constants.NEWS_FEED_URL_SETTING_DEFAULT,
      sensitive: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.newsFeedUrlDescription', {
        defaultMessage: '<p>News feed content will be retrieved from this URL</p>'
      }),
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.string()
    },
    [_constants.IP_REPUTATION_LINKS_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.ipReputationLinks', {
        defaultMessage: 'IP Reputation Links'
      }),
      value: _constants.IP_REPUTATION_LINKS_SETTING_DEFAULT,
      type: 'json',
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.ipReputationLinksDescription', {
        defaultMessage: 'Array of URL templates to build the list of reputation URLs to be displayed on the IP Details page.'
      }),
      sensitive: true,
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.arrayOf(_configSchema.schema.object({
        name: _configSchema.schema.string(),
        url_template: _configSchema.schema.string()
      }))
    },
    [_constants.ENABLE_CCS_READ_WARNING_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableCcsReadWarningLabel', {
        defaultMessage: 'CCS Rule Privileges Warning'
      }),
      value: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.enableCcsWarningDescription', {
        defaultMessage: '<p>Enables privilege check warnings in rules for CCS indices</p>'
      }),
      type: 'boolean',
      category: [_constants.APP_ID],
      requiresPageReload: false,
      schema: _configSchema.schema.boolean()
    },
    [_constants.SHOW_RELATED_INTEGRATIONS_SETTING]: {
      name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.showRelatedIntegrationsLabel', {
        defaultMessage: 'Related integrations'
      }),
      value: true,
      description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.showRelatedIntegrationsDescription', {
        defaultMessage: '<p>Shows related integrations on the rules and monitoring tables</p>'
      }),
      type: 'boolean',
      category: [_constants.APP_ID],
      requiresPageReload: true,
      schema: _configSchema.schema.boolean()
    },
    ...(experimentalFeatures.extendedRuleExecutionLoggingEnabled ? {
      [_constants.EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING]: {
        name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingEnabledLabel', {
          defaultMessage: 'Extended rule execution logging'
        }),
        description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingEnabledDescription', {
          defaultMessage: '<p>Enables extended rule execution logging to .kibana-event-log-* indices. Shows plain execution events on the Rule Details page.</p>'
        }),
        type: 'boolean',
        schema: _configSchema.schema.boolean(),
        value: true,
        category: [_constants.APP_ID],
        requiresPageReload: false
      },
      [_constants.EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING]: {
        name: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelLabel', {
          defaultMessage: 'Extended rule execution logging: min level'
        }),
        description: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelDescription', {
          defaultMessage: '<p>Sets minimum log level starting from which rules will write extended logs to .kibana-event-log-* indices. This affects only events of type Message, other events are being written to .kibana-event-log-* regardless of this setting and their log level.</p>'
        }),
        type: 'select',
        schema: _configSchema.schema.oneOf([_configSchema.schema.literal(_rule_monitoring.LogLevelSetting.off), _configSchema.schema.literal(_rule_monitoring.LogLevelSetting.error), _configSchema.schema.literal(_rule_monitoring.LogLevelSetting.warn), _configSchema.schema.literal(_rule_monitoring.LogLevelSetting.info), _configSchema.schema.literal(_rule_monitoring.LogLevelSetting.debug), _configSchema.schema.literal(_rule_monitoring.LogLevelSetting.trace)]),
        value: _rule_monitoring.LogLevelSetting.error,
        options: [_rule_monitoring.LogLevelSetting.off, _rule_monitoring.LogLevelSetting.error, _rule_monitoring.LogLevelSetting.warn, _rule_monitoring.LogLevelSetting.info, _rule_monitoring.LogLevelSetting.debug, _rule_monitoring.LogLevelSetting.trace],
        optionLabels: {
          [_rule_monitoring.LogLevelSetting.off]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelOff', {
            defaultMessage: 'Off'
          }),
          [_rule_monitoring.LogLevelSetting.error]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelError', {
            defaultMessage: 'Error'
          }),
          [_rule_monitoring.LogLevelSetting.warn]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelWarn', {
            defaultMessage: 'Warn'
          }),
          [_rule_monitoring.LogLevelSetting.info]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelInfo', {
            defaultMessage: 'Info'
          }),
          [_rule_monitoring.LogLevelSetting.debug]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelDebug', {
            defaultMessage: 'Debug'
          }),
          [_rule_monitoring.LogLevelSetting.trace]: _i18n.i18n.translate('xpack.securitySolution.uiSettings.extendedRuleExecutionLoggingMinLevelTrace', {
            defaultMessage: 'Trace'
          })
        },
        category: [_constants.APP_ID],
        requiresPageReload: false
      }
    } : {})
  };
  uiSettings.register(orderSettings(securityUiSettings));
};
exports.initUiSettings = initUiSettings;