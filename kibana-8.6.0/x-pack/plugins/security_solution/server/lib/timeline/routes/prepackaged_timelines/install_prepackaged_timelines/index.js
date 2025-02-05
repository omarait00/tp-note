"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "installPrepackagedTimelines", {
  enumerable: true,
  get: function () {
    return _helpers.installPrepackagedTimelines;
  }
});
exports.installPrepackedTimelinesRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../../common/constants");
var _utils = require("../../../../detection_engine/routes/utils");
var _helpers = require("./helpers");
var _check_timelines_status = require("../../../utils/check_timelines_status");
var _common = require("../../../utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const installPrepackedTimelinesRoute = (router, config, security) => {
  router.post({
    path: `${_constants.TIMELINE_PREPACKAGED_URL}`,
    validate: {},
    options: {
      tags: ['access:securitySolution'],
      body: {
        maxBytes: config.maxTimelineImportPayloadBytes,
        output: 'stream'
      }
    }
  }, async (context, request, response) => {
    try {
      var _validatedprepackaged, _validatedprepackaged2;
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const prepackagedTimelineStatus = await (0, _check_timelines_status.checkTimelinesStatus)(frameworkRequest);
      const [validatedprepackagedTimelineStatus, prepackagedTimelineStatusError] = (0, _securitysolutionIoTsUtils.validate)(prepackagedTimelineStatus, _check_timelines_status.checkTimelineStatusRt);
      if (prepackagedTimelineStatusError != null) {
        throw prepackagedTimelineStatusError;
      }
      const timelinesToInstalled = (_validatedprepackaged = validatedprepackagedTimelineStatus === null || validatedprepackagedTimelineStatus === void 0 ? void 0 : validatedprepackagedTimelineStatus.timelinesToInstall.length) !== null && _validatedprepackaged !== void 0 ? _validatedprepackaged : 0;
      const timelinesNotUpdated = (_validatedprepackaged2 = validatedprepackagedTimelineStatus === null || validatedprepackagedTimelineStatus === void 0 ? void 0 : validatedprepackagedTimelineStatus.timelinesToUpdate.length) !== null && _validatedprepackaged2 !== void 0 ? _validatedprepackaged2 : 0;
      let res = null;
      if (timelinesToInstalled > 0 || timelinesNotUpdated > 0) {
        res = await (0, _helpers.installPrepackagedTimelines)(config.maxTimelineImportExportSize, frameworkRequest, true);
      }
      if (res instanceof Error) {
        throw res;
      } else {
        var _res;
        return response.ok({
          body: (_res = res) !== null && _res !== void 0 ? _res : {
            success: true,
            success_count: 0,
            timelines_installed: 0,
            timelines_updated: 0,
            errors: []
          }
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.installPrepackedTimelinesRoute = installPrepackedTimelinesRoute;