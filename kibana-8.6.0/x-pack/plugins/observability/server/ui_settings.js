"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiSettings = void 0;
var _configSchema = require("@kbn/config-schema");
var _i18n = require("@kbn/i18n");
var _common = require("../common");
var _ui_settings_keys = require("../common/ui_settings_keys");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const technicalPreviewLabel = _i18n.i18n.translate('xpack.observability.uiSettings.technicalPreviewLabel', {
  defaultMessage: 'technical preview'
});
function feedbackLink({
  href
}) {
  return `<a href="${href}" target="_blank" rel="noopener noreferrer">${_i18n.i18n.translate('xpack.observability.uiSettings.giveFeedBackLabel', {
    defaultMessage: 'Give feedback'
  })}</a>`;
}
/**
 * uiSettings definitions for Observability.
 */
const uiSettings = {
  [_ui_settings_keys.enableNewSyntheticsView]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableNewSyntheticsViewExperimentName', {
      defaultMessage: 'Enable new synthetic monitoring application'
    }),
    value: false,
    description: _i18n.i18n.translate('xpack.observability.enableNewSyntheticsViewExperimentDescriptionBeta', {
      defaultMessage: '{technicalPreviewLabel} Enable new synthetic monitoring application in observability. Refresh the page to apply the setting.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`
      }
    }),
    schema: _configSchema.schema.boolean(),
    requiresPageReload: true
  },
  [_ui_settings_keys.enableInspectEsQueries]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableInspectEsQueriesExperimentName', {
      defaultMessage: 'Inspect ES queries'
    }),
    value: false,
    description: _i18n.i18n.translate('xpack.observability.enableInspectEsQueriesExperimentDescription', {
      defaultMessage: 'Inspect Elasticsearch queries in API responses.'
    }),
    schema: _configSchema.schema.boolean(),
    requiresPageReload: true
  },
  [_ui_settings_keys.maxSuggestions]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.maxSuggestionsUiSettingName', {
      defaultMessage: 'Maximum suggestions'
    }),
    value: 100,
    description: _i18n.i18n.translate('xpack.observability.maxSuggestionsUiSettingDescription', {
      defaultMessage: 'Maximum number of suggestions fetched in autocomplete selection boxes.'
    }),
    schema: _configSchema.schema.number()
  },
  [_ui_settings_keys.enableComparisonByDefault]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableComparisonByDefault', {
      defaultMessage: 'Comparison feature'
    }),
    value: true,
    description: _i18n.i18n.translate('xpack.observability.enableComparisonByDefaultDescription', {
      defaultMessage: 'Enable the comparison feature in APM app'
    }),
    schema: _configSchema.schema.boolean()
  },
  [_ui_settings_keys.defaultApmServiceEnvironment]: {
    category: [_common.observabilityFeatureId],
    sensitive: true,
    name: _i18n.i18n.translate('xpack.observability.defaultApmServiceEnvironment', {
      defaultMessage: 'Default service environment'
    }),
    description: _i18n.i18n.translate('xpack.observability.defaultApmServiceEnvironmentDescription', {
      defaultMessage: 'Set the default environment for the APM app. When left empty, data from all environments will be displayed by default.'
    }),
    value: '',
    schema: _configSchema.schema.string()
  },
  [_ui_settings_keys.apmProgressiveLoading]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmProgressiveLoading', {
      defaultMessage: 'Use progressive loading of selected APM views'
    }),
    description: _i18n.i18n.translate('xpack.observability.apmProgressiveLoadingDescription', {
      defaultMessage: '{technicalPreviewLabel} Whether to load data progressively for APM views. Data may be requested with a lower sampling rate first, with lower accuracy but faster response times, while the unsampled data loads in the background',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`
      }
    }),
    value: _common.ProgressiveLoadingQuality.off,
    schema: _configSchema.schema.oneOf([_configSchema.schema.literal(_common.ProgressiveLoadingQuality.off), _configSchema.schema.literal(_common.ProgressiveLoadingQuality.low), _configSchema.schema.literal(_common.ProgressiveLoadingQuality.medium), _configSchema.schema.literal(_common.ProgressiveLoadingQuality.high)]),
    requiresPageReload: false,
    type: 'select',
    options: [_common.ProgressiveLoadingQuality.off, _common.ProgressiveLoadingQuality.low, _common.ProgressiveLoadingQuality.medium, _common.ProgressiveLoadingQuality.high],
    optionLabels: {
      [_common.ProgressiveLoadingQuality.off]: _i18n.i18n.translate('xpack.observability.apmProgressiveLoadingQualityOff', {
        defaultMessage: 'Off'
      }),
      [_common.ProgressiveLoadingQuality.low]: _i18n.i18n.translate('xpack.observability.apmProgressiveLoadingQualityLow', {
        defaultMessage: 'Low sampling rate (fastest, least accurate)'
      }),
      [_common.ProgressiveLoadingQuality.medium]: _i18n.i18n.translate('xpack.observability.apmProgressiveLoadingQualityMedium', {
        defaultMessage: 'Medium sampling rate'
      }),
      [_common.ProgressiveLoadingQuality.high]: _i18n.i18n.translate('xpack.observability.apmProgressiveLoadingQualityHigh', {
        defaultMessage: 'High sampling rate (slower, most accurate)'
      })
    },
    showInLabs: true
  },
  [_ui_settings_keys.apmServiceInventoryOptimizedSorting]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmServiceInventoryOptimizedSorting', {
      defaultMessage: 'Optimize services list load performance in APM'
    }),
    description: _i18n.i18n.translate('xpack.observability.apmServiceInventoryOptimizedSortingDescription', {
      defaultMessage: '{technicalPreviewLabel} Default APM Service Inventory and Storage Explorer pages sort (for Services without Machine Learning applied) to sort by Service Name. {feedbackLink}.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`,
        feedbackLink: feedbackLink({
          href: 'https://ela.st/feedback-apm-page-performance'
        })
      }
    }),
    schema: _configSchema.schema.boolean(),
    value: false,
    requiresPageReload: false,
    type: 'boolean',
    showInLabs: true
  },
  [_ui_settings_keys.apmServiceGroupMaxNumberOfServices]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.serviceGroupMaxServicesUiSettingName', {
      defaultMessage: 'Maximum services in a service group'
    }),
    value: 500,
    description: _i18n.i18n.translate('xpack.observability.serviceGroupMaxServicesUiSettingDescription', {
      defaultMessage: 'Limit the number of services in a given service group'
    }),
    schema: _configSchema.schema.number({
      min: 1
    })
  },
  [_ui_settings_keys.apmTraceExplorerTab]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmTraceExplorerTab', {
      defaultMessage: 'APM Trace Explorer'
    }),
    description: _i18n.i18n.translate('xpack.observability.apmTraceExplorerTabDescription', {
      defaultMessage: '{technicalPreviewLabel} Enable the APM Trace Explorer feature, that allows you to search and inspect traces with KQL or EQL. {feedbackLink}.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`,
        feedbackLink: feedbackLink({
          href: 'https://ela.st/feedback-trace-explorer'
        })
      }
    }),
    schema: _configSchema.schema.boolean(),
    value: false,
    requiresPageReload: true,
    type: 'boolean',
    showInLabs: true
  },
  [_ui_settings_keys.apmLabsButton]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmLabs', {
      defaultMessage: 'Enable labs button in APM'
    }),
    description: _i18n.i18n.translate('xpack.observability.apmLabsDescription', {
      defaultMessage: 'This flag determines if the viewer has access to the Labs button, a quick way to enable and disable technical preview features in APM.'
    }),
    schema: _configSchema.schema.boolean(),
    value: false,
    requiresPageReload: true,
    type: 'boolean'
  },
  [_ui_settings_keys.enableInfrastructureHostsView]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableInfrastructureHostsView', {
      defaultMessage: 'Infrastructure Hosts view'
    }),
    value: false,
    description: _i18n.i18n.translate('xpack.observability.enableInfrastructureHostsViewDescription', {
      defaultMessage: '{technicalPreviewLabel} Enable the Hosts view in the Infrastructure app. {feedbackLink}.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`,
        feedbackLink: feedbackLink({
          href: 'https://ela.st/feedback-host-observability'
        })
      }
    }),
    schema: _configSchema.schema.boolean()
  },
  [_ui_settings_keys.enableAwsLambdaMetrics]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableAwsLambdaMetrics', {
      defaultMessage: 'AWS Lambda Metrics'
    }),
    description: _i18n.i18n.translate('xpack.observability.enableAwsLambdaMetricsDescription', {
      defaultMessage: '{technicalPreviewLabel} Display Amazon Lambda metrics in the service metrics tab. {feedbackLink}',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`,
        feedbackLink: feedbackLink({
          href: 'https://ela.st/feedback-aws-lambda'
        })
      }
    }),
    schema: _configSchema.schema.boolean(),
    value: true,
    requiresPageReload: true,
    type: 'boolean',
    showInLabs: true
  },
  [_ui_settings_keys.enableAgentExplorerView]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableAgentExplorer', {
      defaultMessage: 'Agent explorer'
    }),
    description: _i18n.i18n.translate('xpack.observability.enableAgentExplorerDescription', {
      defaultMessage: '{technicalPreviewLabel} Enables Agent explorer view.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`
      }
    }),
    schema: _configSchema.schema.boolean(),
    value: false,
    requiresPageReload: true,
    type: 'boolean',
    showInLabs: true
  },
  [_ui_settings_keys.apmAWSLambdaPriceFactor]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmAWSLambdaPricePerGbSeconds', {
      defaultMessage: 'AWS lambda price factor'
    }),
    type: 'json',
    value: JSON.stringify({
      x86_64: 0.0000166667,
      arm: 0.0000133334
    }, null, 2),
    description: _i18n.i18n.translate('xpack.observability.apmAWSLambdaPricePerGbSecondsDescription', {
      defaultMessage: 'Price per Gb-second.'
    }),
    schema: _configSchema.schema.object({
      arm: _configSchema.schema.number(),
      x86_64: _configSchema.schema.number()
    })
  },
  [_ui_settings_keys.apmAWSLambdaRequestCostPerMillion]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.apmAWSLambdaRequestCostPerMillion', {
      defaultMessage: 'AWS lambda price per 1M requests'
    }),
    value: 0.2,
    schema: _configSchema.schema.number({
      min: 0
    })
  },
  [_ui_settings_keys.enableCriticalPath]: {
    category: [_common.observabilityFeatureId],
    name: _i18n.i18n.translate('xpack.observability.enableCriticalPath', {
      defaultMessage: 'Critical path'
    }),
    description: _i18n.i18n.translate('xpack.observability.enableCriticalPathDescription', {
      defaultMessage: '{technicalPreviewLabel} Optionally display the critical path of a trace.',
      values: {
        technicalPreviewLabel: `<em>[${technicalPreviewLabel}]</em>`
      }
    }),
    schema: _configSchema.schema.boolean(),
    value: false,
    requiresPageReload: true,
    type: 'boolean',
    showInLabs: true
  }
};
exports.uiSettings = uiSettings;