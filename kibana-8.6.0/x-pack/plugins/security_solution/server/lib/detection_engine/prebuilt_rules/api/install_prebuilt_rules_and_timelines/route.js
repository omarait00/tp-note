"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installPrebuiltRulesAndTimelinesRoute = exports.createPrepackagedRules = exports.PrepackagedRulesError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _moment = _interopRequireDefault(require("moment"));
var _securitysolutionEsUtils = require("@kbn/securitysolution-es-utils");
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _prebuilt_rules = require("../../../../../../common/detection_engine/prebuilt_rules");
var _timeline = require("../../../../../../common/types/timeline");
var _get_existing_prepackaged_rules = require("../../../rule_management/logic/search/get_existing_prepackaged_rules");
var _get_latest_prebuilt_rules = require("../../logic/get_latest_prebuilt_rules");
var _create_prebuilt_rules = require("../../logic/create_prebuilt_rules");
var _update_prebuilt_rules = require("../../logic/update_prebuilt_rules");
var _get_rules_to_install = require("../../logic/get_rules_to_install");
var _get_rules_to_update = require("../../logic/get_rules_to_update");
var _rule_asset_saved_objects_client = require("../../logic/rule_asset/rule_asset_saved_objects_client");
var _utils = require("../../logic/utils");
var _install_prepackaged_timelines = require("../../../../timeline/routes/prepackaged_timelines/install_prepackaged_timelines");
var _utils2 = require("../../../routes/utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const installPrebuiltRulesAndTimelinesRoute = router => {
  router.put({
    path: _prebuilt_rules.PREBUILT_RULES_URL,
    validate: false,
    options: {
      tags: ['access:securitySolution'],
      timeout: {
        // FUNFACT: If we do not add a very long timeout what will happen
        // is that Chrome which receive a 408 error and then do a retry.
        // This retry can cause lots of connections to happen. Using a very
        // long timeout will ensure that Chrome does not do retries and saturate the connections.
        idleSocket: _moment.default.duration('1', 'hour').asMilliseconds()
      }
    }
  }, async (context, _, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    try {
      const rulesClient = (await context.alerting).getRulesClient();
      const validated = await createPrepackagedRules(await context.securitySolution, rulesClient, undefined);
      return response.ok({
        body: validated !== null && validated !== void 0 ? validated : {}
      });
    } catch (err) {
      const error = (0, _securitysolutionEsUtils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};
exports.installPrebuiltRulesAndTimelinesRoute = installPrebuiltRulesAndTimelinesRoute;
class PrepackagedRulesError extends Error {
  constructor(message, statusCode) {
    super(message);
    (0, _defineProperty2.default)(this, "statusCode", void 0);
    this.statusCode = statusCode;
  }
}
exports.PrepackagedRulesError = PrepackagedRulesError;
const createPrepackagedRules = async (context, rulesClient, exceptionsClient) => {
  var _context$getException, _prepackagedTimelines, _prepackagedTimelines2;
  const config = context.getConfig();
  const frameworkRequest = context.getFrameworkRequest();
  const savedObjectsClient = context.core.savedObjects.client;
  const siemClient = context.getAppClient();
  const exceptionsListClient = (_context$getException = context.getExceptionListClient()) !== null && _context$getException !== void 0 ? _context$getException : exceptionsClient;
  const ruleAssetsClient = (0, _rule_asset_saved_objects_client.ruleAssetSavedObjectsClientFactory)(savedObjectsClient);
  const {
    maxTimelineImportExportSize,
    prebuiltRulesFromFileSystem,
    prebuiltRulesFromSavedObjects
  } = config;
  if (!siemClient || !rulesClient) {
    throw new PrepackagedRulesError('', 404);
  }

  // This will create the endpoint list if it does not exist yet
  if (exceptionsListClient != null) {
    await exceptionsListClient.createEndpointList();
  }
  const latestPrepackagedRulesMap = await (0, _get_latest_prebuilt_rules.getLatestPrebuiltRules)(ruleAssetsClient, prebuiltRulesFromFileSystem, prebuiltRulesFromSavedObjects);
  const installedPrePackagedRules = (0, _utils.rulesToMap)(await (0, _get_existing_prepackaged_rules.getExistingPrepackagedRules)({
    rulesClient
  }));
  const rulesToInstall = (0, _get_rules_to_install.getRulesToInstall)(latestPrepackagedRulesMap, installedPrePackagedRules);
  const rulesToUpdate = (0, _get_rules_to_update.getRulesToUpdate)(latestPrepackagedRulesMap, installedPrePackagedRules);
  await (0, _create_prebuilt_rules.createPrebuiltRules)(rulesClient, rulesToInstall);
  const timeline = await (0, _install_prepackaged_timelines.installPrepackagedTimelines)(maxTimelineImportExportSize, frameworkRequest, true);
  const [prepackagedTimelinesResult, timelinesErrors] = (0, _securitysolutionIoTsUtils.validate)(timeline, _timeline.importTimelineResultSchema);
  await (0, _update_prebuilt_rules.updatePrebuiltRules)(rulesClient, savedObjectsClient, rulesToUpdate, context.getRuleExecutionLog());
  const prepackagedRulesOutput = {
    rules_installed: rulesToInstall.length,
    rules_updated: rulesToUpdate.length,
    timelines_installed: (_prepackagedTimelines = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_installed) !== null && _prepackagedTimelines !== void 0 ? _prepackagedTimelines : 0,
    timelines_updated: (_prepackagedTimelines2 = prepackagedTimelinesResult === null || prepackagedTimelinesResult === void 0 ? void 0 : prepackagedTimelinesResult.timelines_updated) !== null && _prepackagedTimelines2 !== void 0 ? _prepackagedTimelines2 : 0
  };
  const [validated, genericErrors] = (0, _securitysolutionIoTsUtils.validate)(prepackagedRulesOutput, _prebuilt_rules.InstallPrebuiltRulesAndTimelinesResponse);
  if (genericErrors != null && timelinesErrors != null) {
    throw new PrepackagedRulesError([genericErrors, timelinesErrors].filter(msg => msg != null).join(', '), 500);
  }
  return validated;
};
exports.createPrepackagedRules = createPrepackagedRules;