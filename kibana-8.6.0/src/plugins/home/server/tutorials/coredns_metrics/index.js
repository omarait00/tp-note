"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.corednsMetricsSpecProvider = corednsMetricsSpecProvider;
var _i18n = require("@kbn/i18n");
var _tutorials = require("../../services/tutorials");
var _metricbeat_instructions = require("../instructions/metricbeat_instructions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function corednsMetricsSpecProvider(context) {
  const moduleName = 'coredns';
  return {
    id: 'corednsMetrics',
    name: _i18n.i18n.translate('home.tutorials.corednsMetrics.nameTitle', {
      defaultMessage: 'CoreDNS Metrics'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.METRICS,
    shortDescription: _i18n.i18n.translate('home.tutorials.corednsMetrics.shortDescription', {
      defaultMessage: 'Collect metrics from CoreDNS servers with Metricbeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.corednsMetrics.longDescription', {
      defaultMessage: 'The `coredns` Metricbeat module fetches metrics from CoreDNS. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-coredns.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/coredns.svg',
    artifacts: {
      application: {
        label: _i18n.i18n.translate('home.tutorials.corednsMetrics.artifacts.application.label', {
          defaultMessage: 'Discover'
        }),
        path: '/app/discover#/'
      },
      dashboards: [],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-coredns.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/coredns_metrics/screenshot.webp',
    onPrem: (0, _metricbeat_instructions.onPremInstructions)(moduleName, context),
    elasticCloud: (0, _metricbeat_instructions.cloudInstructions)(moduleName, context),
    onPremElasticCloud: (0, _metricbeat_instructions.onPremCloudInstructions)(moduleName, context),
    integrationBrowserCategories: ['security', 'network', 'web']
  };
}