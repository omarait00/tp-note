"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerLanguageClients = registerLanguageClients;
var _common = require("../../common");
var _language_integrations = require("../../common/language_integrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function registerLanguageClients(core, registry, branch) {
  _language_integrations.languageIntegrations.forEach(integration => {
    const icons = [];
    if (integration.euiIconName) {
      icons.push({
        type: 'eui',
        src: integration.euiIconName
      });
    } else if (integration.icon) {
      icons.push({
        type: 'svg',
        src: core.http.basePath.prepend(`/plugins/${_common.PLUGIN_ID}/assets/language_clients/${integration.icon}`)
      });
    }
    registry.registerCustomIntegration({
      id: `language_client.${integration.id}`,
      title: integration.title,
      description: integration.description,
      type: 'ui_link',
      shipper: 'language_clients',
      uiInternalPath: integration.exportLanguageUiComponent ? integration === null || integration === void 0 ? void 0 : integration.integrationsAppUrl :
      // Documentation for `main` branches is still published at a `master` URL.
      integration.docUrlTemplate.replace('{branch}', branch === 'main' ? 'master' : branch),
      isBeta: false,
      icons,
      categories: ['elastic_stack', 'custom', 'language_client']
    });
  });
}