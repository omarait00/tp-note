"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRuleExecutionSettings = void 0;
var _with_security_span = require("../../../../../../utils/with_security_span");
var _constants = require("../../../../../../../common/constants");
var _rule_monitoring = require("../../../../../../../common/detection_engine/rule_monitoring");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const fetchRuleExecutionSettings = async (config, logger, core, savedObjectsClient) => {
  try {
    const ruleExecutionSettings = await (0, _with_security_span.withSecuritySpan)('fetchRuleExecutionSettings', async () => {
      const [coreStart] = await (0, _with_security_span.withSecuritySpan)('getCoreStartServices', () => core.getStartServices());
      const kibanaAdvancedSettings = await (0, _with_security_span.withSecuritySpan)('getKibanaAdvancedSettings', () => {
        const settingsClient = coreStart.uiSettings.asScopedToClient(savedObjectsClient);
        return settingsClient.getAll();
      });
      return getRuleExecutionSettingsFrom(config, kibanaAdvancedSettings);
    });
    return ruleExecutionSettings;
  } catch (e) {
    var _e$stack;
    const logMessage = 'Error fetching rule execution settings';
    const logReason = e instanceof Error ? (_e$stack = e.stack) !== null && _e$stack !== void 0 ? _e$stack : e.message : String(e);
    logger.error(`${logMessage}: ${logReason}`);
    return getRuleExecutionSettingsDefault(config);
  }
};
exports.fetchRuleExecutionSettings = fetchRuleExecutionSettings;
const getRuleExecutionSettingsFrom = (config, advancedSettings) => {
  const featureFlagEnabled = config.experimentalFeatures.extendedRuleExecutionLoggingEnabled;
  const advancedSettingEnabled = getSetting(advancedSettings, _constants.EXTENDED_RULE_EXECUTION_LOGGING_ENABLED_SETTING, false);
  const advancedSettingMinLevel = getSetting(advancedSettings, _constants.EXTENDED_RULE_EXECUTION_LOGGING_MIN_LEVEL_SETTING, _rule_monitoring.LogLevelSetting.off);
  return {
    extendedLogging: {
      isEnabled: featureFlagEnabled && advancedSettingEnabled,
      minLevel: advancedSettingMinLevel
    }
  };
};
const getRuleExecutionSettingsDefault = config => {
  const featureFlagEnabled = config.experimentalFeatures.extendedRuleExecutionLoggingEnabled;
  return {
    extendedLogging: {
      isEnabled: featureFlagEnabled,
      minLevel: featureFlagEnabled ? _rule_monitoring.LogLevelSetting.error : _rule_monitoring.LogLevelSetting.off
    }
  };
};
const getSetting = (settings, key, defaultValue) => {
  const setting = settings[key];
  return setting != null ? setting : defaultValue;
};