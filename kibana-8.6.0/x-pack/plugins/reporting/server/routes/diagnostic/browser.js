"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDiagnoseBrowser = void 0;
var _i18n = require("@kbn/i18n");
var _rxjs = require("rxjs");
var _ = require("..");
var _constants = require("../../../common/constants");
var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const logsToHelpMapFactory = docLinks => ({
  'error while loading shared libraries': _i18n.i18n.translate('xpack.reporting.diagnostic.browserMissingDependency', {
    defaultMessage: `The browser couldn't start properly due to missing system dependencies. Please see {url}`,
    values: {
      url: docLinks.links.reporting.browserSystemDependencies
    }
  }),
  'Could not find the default font': _i18n.i18n.translate('xpack.reporting.diagnostic.browserMissingFonts', {
    defaultMessage: `The browser couldn't locate a default font. Please see {url} to fix this issue.`,
    values: {
      url: docLinks.links.reporting.browserSystemDependencies
    }
  }),
  'No usable sandbox': _i18n.i18n.translate('xpack.reporting.diagnostic.noUsableSandbox', {
    defaultMessage: `Unable to use Chromium sandbox. This can be disabled at your own risk with 'xpack.screenshotting.browser.chromium.disableSandbox'. Please see {url}`,
    values: {
      url: docLinks.links.reporting.browserSandboxDependencies
    }
  })
});
const path = `${_constants.API_DIAGNOSE_URL}/browser`;
const registerDiagnoseBrowser = (reporting, logger) => {
  const {
    router
  } = reporting.getPluginSetupDeps();
  router.post({
    path: `${path}`,
    validate: {}
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (_user, _context, req, res) => {
    (0, _.incrementApiUsageCounter)(req.route.method, path, reporting.getUsageCounter());
    const {
      docLinks
    } = reporting.getPluginSetupDeps();
    const logsToHelpMap = logsToHelpMapFactory(docLinks);
    try {
      const {
        screenshotting
      } = await reporting.getPluginStartDeps();
      const logs = await (0, _rxjs.lastValueFrom)(screenshotting.diagnose());
      const knownIssues = Object.keys(logsToHelpMap);
      const boundSuccessfully = logs.includes(`DevTools listening on`);
      const help = knownIssues.reduce((helpTexts, knownIssue) => {
        const helpText = logsToHelpMap[knownIssue];
        if (logs.includes(knownIssue)) {
          helpTexts.push(helpText);
        }
        return helpTexts;
      }, []);
      const response = {
        success: boundSuccessfully && !help.length,
        help,
        logs
      };
      return res.ok({
        body: response
      });
    } catch (err) {
      logger.error(err);
      return res.custom({
        statusCode: 500
      });
    }
  }));
};
exports.registerDiagnoseBrowser = registerDiagnoseBrowser;