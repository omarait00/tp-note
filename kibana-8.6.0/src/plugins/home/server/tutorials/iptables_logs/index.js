"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iptablesLogsSpecProvider = iptablesLogsSpecProvider;
var _i18n = require("@kbn/i18n");
var _tutorials = require("../../services/tutorials");
var _filebeat_instructions = require("../instructions/filebeat_instructions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function iptablesLogsSpecProvider(context) {
  const moduleName = 'iptables';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'iptablesLogs',
    name: _i18n.i18n.translate('home.tutorials.iptablesLogs.nameTitle', {
      defaultMessage: 'Iptables Logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.iptablesLogs.shortDescription', {
      defaultMessage: 'Collect and parse logs from iptables and ip6tables with Filebeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.iptablesLogs.longDescription', {
      defaultMessage: 'This is a module for iptables and ip6tables logs. It parses logs received \
        over the network via syslog or from a file. Also, it understands the prefix \
        added by some Ubiquiti firewalls, which includes the rule set name, rule \
        number and the action performed on the traffic (allow/deny). \
        [Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-iptables.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/linux.svg',
    artifacts: {
      dashboards: [{
        id: 'ceefb9e0-1f51-11e9-93ed-f7e068f4aebb-ecs',
        linkLabel: _i18n.i18n.translate('home.tutorials.iptablesLogs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'Iptables Overview'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-iptables.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/iptables_logs/screenshot.webp',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms, context),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms, context),
    integrationBrowserCategories: ['network', 'security']
  };
}