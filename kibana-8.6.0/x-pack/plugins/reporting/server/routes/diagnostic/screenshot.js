"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDiagnoseScreenshot = void 0;
var _i18n = require("@kbn/i18n");
var _rxjs = require("rxjs");
var _server = require("../../../../../../src/core/server");
var _constants = require("../../../common/constants");
var _common = require("../../export_types/common");
var _get_absolute_url = require("../../export_types/common/get_absolute_url");
var _authorized_user_pre_routing = require("../lib/authorized_user_pre_routing");
var _ = require("..");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const path = `${_constants.API_DIAGNOSE_URL}/screenshot`;
const registerDiagnoseScreenshot = (reporting, logger) => {
  const setupDeps = reporting.getPluginSetupDeps();
  const {
    router
  } = setupDeps;
  router.post({
    path,
    validate: {}
  }, (0, _authorized_user_pre_routing.authorizedUserPreRouting)(reporting, async (_user, _context, req, res) => {
    (0, _.incrementApiUsageCounter)(req.route.method, path, reporting.getUsageCounter());
    const config = reporting.getConfig();
    const [basePath, protocol, hostname, port] = [config.kbnConfig.get('server', 'basePath'), config.get('kibanaServer', 'protocol'), config.get('kibanaServer', 'hostname'), config.get('kibanaServer', 'port')];
    const getAbsoluteUrl = (0, _get_absolute_url.getAbsoluteUrlFactory)({
      basePath,
      protocol,
      hostname,
      port
    });
    const hashUrl = getAbsoluteUrl({
      path: '/',
      hash: '',
      search: ''
    });

    // Hack the layout to make the base/login page work
    const layout = {
      dimensions: {
        width: 1440,
        height: 2024
      },
      selectors: {
        screenshot: `.${_server.APP_WRAPPER_CLASS}`,
        renderComplete: `.${_server.APP_WRAPPER_CLASS}`,
        itemsCountAttribute: 'data-test-subj="kibanaChrome"',
        timefilterDurationAttribute: 'data-test-subj="kibanaChrome"'
      }
    };
    return (0, _rxjs.lastValueFrom)((0, _common.generatePngObservable)(reporting, logger, {
      layout,
      request: req,
      browserTimezone: 'America/Los_Angeles',
      urls: [hashUrl]
    })
    // Pipe is required to ensure that we can subscribe to it
    .pipe()).then(screenshot => {
      // NOTE: the screenshot could be returned as a string using `data:image/png;base64,` + results.buffer.toString('base64')
      if (screenshot.warnings.length) {
        return res.ok({
          body: {
            success: false,
            help: [],
            logs: screenshot.warnings
          }
        });
      }
      return res.ok({
        body: {
          success: true,
          help: [],
          logs: ''
        }
      });
    }).catch(error => res.ok({
      body: {
        success: false,
        help: [_i18n.i18n.translate('xpack.reporting.diagnostic.screenshotFailureMessage', {
          defaultMessage: `We couldn't screenshot your Kibana install.`
        })],
        logs: error.message
      }
    }));
  }));
};
exports.registerDiagnoseScreenshot = registerDiagnoseScreenshot;