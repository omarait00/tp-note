"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrebuiltRulesAndTimelinesStatusRoute = void 0;
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _utils = require("../../../routes/utils");
var _prebuilt_rules = require("../../../../../../common/detection_engine/prebuilt_rules");
var _get_existing_prepackaged_rules = require("../../../rule_management/logic/search/get_existing_prepackaged_rules");
var _find_rules = require("../../../rule_management/logic/search/find_rules");
var _get_latest_prebuilt_rules = require("../../logic/get_latest_prebuilt_rules");
var _get_rules_to_install = require("../../logic/get_rules_to_install");
var _get_rules_to_update = require("../../logic/get_rules_to_update");
var _rule_asset_saved_objects_client = require("../../logic/rule_asset/rule_asset_saved_objects_client");
var _utils2 = require("../../logic/utils");
var _common = require("../../../../timeline/utils/common");
var _check_timelines_status = require("../../../../timeline/utils/check_timelines_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getPrebuiltRulesAndTimelinesStatusRoute = (router, config, security) => {
  router.get({
    path: _prebuilt_rules.PREBUILT_RULES_STATUS_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const ctx = await context.resolve(['core', 'alerting']);
    const savedObjectsClient = ctx.core.savedObjects.client;
    const rulesClient = ctx.alerting.getRulesClient();
    const ruleAssetsClient = (0, _rule_asset_saved_objects_client.ruleAssetSavedObjectsClientFactory)(savedObjectsClient);
    try {
      var _validatedPrebuiltTim, _validatedPrebuiltTim2, _validatedPrebuiltTim3;
      const latestPrebuiltRules = await (0, _get_latest_prebuilt_rules.getLatestPrebuiltRules)(ruleAssetsClient, config.prebuiltRulesFromFileSystem, config.prebuiltRulesFromSavedObjects);
      const customRules = await (0, _find_rules.findRules)({
        rulesClient,
        perPage: 1,
        page: 1,
        sortField: 'enabled',
        sortOrder: 'desc',
        filter: 'alert.attributes.params.immutable: false',
        fields: undefined
      });
      const installedPrebuiltRules = (0, _utils2.rulesToMap)(await (0, _get_existing_prepackaged_rules.getExistingPrepackagedRules)({
        rulesClient
      }));
      const rulesToInstall = (0, _get_rules_to_install.getRulesToInstall)(latestPrebuiltRules, installedPrebuiltRules);
      const rulesToUpdate = (0, _get_rules_to_update.getRulesToUpdate)(latestPrebuiltRules, installedPrebuiltRules);
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const prebuiltTimelineStatus = await (0, _check_timelines_status.checkTimelinesStatus)(frameworkRequest);
      const [validatedPrebuiltTimelineStatus] = (0, _securitysolutionIoTsUtils.validate)(prebuiltTimelineStatus, _check_timelines_status.checkTimelineStatusRt);
      const responseBody = {
        rules_custom_installed: customRules.total,
        rules_installed: installedPrebuiltRules.size,
        rules_not_installed: rulesToInstall.length,
        rules_not_updated: rulesToUpdate.length,
        timelines_installed: (_validatedPrebuiltTim = validatedPrebuiltTimelineStatus === null || validatedPrebuiltTimelineStatus === void 0 ? void 0 : validatedPrebuiltTimelineStatus.prepackagedTimelines.length) !== null && _validatedPrebuiltTim !== void 0 ? _validatedPrebuiltTim : 0,
        timelines_not_installed: (_validatedPrebuiltTim2 = validatedPrebuiltTimelineStatus === null || validatedPrebuiltTimelineStatus === void 0 ? void 0 : validatedPrebuiltTimelineStatus.timelinesToInstall.length) !== null && _validatedPrebuiltTim2 !== void 0 ? _validatedPrebuiltTim2 : 0,
        timelines_not_updated: (_validatedPrebuiltTim3 = validatedPrebuiltTimelineStatus === null || validatedPrebuiltTimelineStatus === void 0 ? void 0 : validatedPrebuiltTimelineStatus.timelinesToUpdate.length) !== null && _validatedPrebuiltTim3 !== void 0 ? _validatedPrebuiltTim3 : 0
      };
      const [validatedBody, validationError] = (0, _securitysolutionIoTsUtils.validate)(responseBody, _prebuilt_rules.GetPrebuiltRulesAndTimelinesStatusResponse);
      if (validationError != null) {
        return siemResponse.error({
          statusCode: 500,
          body: validationError
        });
      } else {
        return response.ok({
          body: validatedBody !== null && validatedBody !== void 0 ? validatedBody : {}
        });
      }
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.getPrebuiltRulesAndTimelinesStatusRoute = getPrebuiltRulesAndTimelinesStatusRoute;