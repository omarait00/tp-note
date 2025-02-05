"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.o365LogsSpecProvider = o365LogsSpecProvider;
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

function o365LogsSpecProvider(context) {
  const moduleName = 'o365';
  const platforms = ['OSX', 'DEB', 'RPM', 'WINDOWS'];
  return {
    id: 'o365Logs',
    name: _i18n.i18n.translate('home.tutorials.o365Logs.nameTitle', {
      defaultMessage: 'Office 365 Logs'
    }),
    moduleName,
    category: _tutorials.TutorialsCategory.SECURITY_SOLUTION,
    shortDescription: _i18n.i18n.translate('home.tutorials.o365Logs.shortDescription', {
      defaultMessage: 'Collect and parse logs from Office 365 with Filebeat.'
    }),
    longDescription: _i18n.i18n.translate('home.tutorials.o365Logs.longDescription', {
      defaultMessage: 'This is a module for Office 365 logs received via one of the Office 365 \
        API endpoints. It currently supports user, admin, system, and policy \
        actions and events from Office 365 and Azure AD activity logs exposed \
        by the Office 365 Management Activity API. \
        [Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.filebeat}/filebeat-module-o365.html'
      }
    }),
    euiIconType: '/plugins/home/assets/logos/o365.svg',
    artifacts: {
      dashboards: [{
        id: '712e2c00-685d-11ea-8d6a-292ef5d68366',
        linkLabel: _i18n.i18n.translate('home.tutorials.o365Logs.artifacts.dashboards.linkLabel', {
          defaultMessage: 'O365 Audit Dashboard'
        }),
        isOverview: true
      }],
      exportedFields: {
        documentationUrl: '{config.docs.beats.filebeat}/exported-fields-o365.html'
      }
    },
    completionTimeMinutes: 10,
    previewImagePath: '/plugins/home/assets/o365_logs/screenshot.webp',
    onPrem: (0, _filebeat_instructions.onPremInstructions)(moduleName, platforms, context),
    elasticCloud: (0, _filebeat_instructions.cloudInstructions)(moduleName, platforms, context),
    onPremElasticCloud: (0, _filebeat_instructions.onPremCloudInstructions)(moduleName, platforms, context),
    integrationBrowserCategories: ['security']
  };
}