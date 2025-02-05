"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.integrations = void 0;
exports.registerExternalIntegrations = registerExternalIntegrations;
var _i18n = require("@kbn/i18n");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const integrations = [{
  id: 'esf',
  title: _i18n.i18n.translate('customIntegrations.placeholders.EsfTitle', {
    defaultMessage: 'AWS Serverless Application Repository'
  }),
  icon: 'logo_esf.svg',
  description: _i18n.i18n.translate('customIntegrations.placeholders.EsfDescription', {
    defaultMessage: 'Collect logs using AWS Lambda application available in AWS Serverless Application Repository.'
  }),
  docUrlTemplate: `https://serverlessrepo.aws.amazon.com/applications/eu-central-1/267093732750/elastic-serverless-forwarder`,
  categories: ['aws', 'custom']
}];
exports.integrations = integrations;
function registerExternalIntegrations(core, registry, branch) {
  integrations.forEach(integration => {
    const icons = [];
    if (integration.euiIconName) {
      icons.push({
        type: 'eui',
        src: integration.euiIconName
      });
    } else if (integration.icon) {
      icons.push({
        type: 'svg',
        src: core.http.basePath.prepend(`/plugins/${_common.PLUGIN_ID}/assets/placeholders/${integration.icon}`)
      });
    }
    registry.registerCustomIntegration({
      uiInternalPath: '',
      id: `placeholder.${integration.id}`,
      title: integration.title,
      description: integration.description,
      type: 'ui_link',
      shipper: 'placeholders',
      uiExternalLink: integration.docUrlTemplate,
      isBeta: false,
      icons,
      categories: integration.categories
    });
  });
}