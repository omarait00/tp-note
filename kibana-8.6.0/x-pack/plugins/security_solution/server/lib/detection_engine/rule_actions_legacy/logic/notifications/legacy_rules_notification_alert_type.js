"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legacyRulesNotificationAlertType = void 0;
var _securitysolutionIoTsUtils = require("@kbn/securitysolution-io-ts-utils");
var _constants = require("../../../../../../common/constants");
var _legacy_types = require("./legacy_types");
var _siem_rule_action_groups = require("../../../signals/siem_rule_action_groups");
var _schedule_notification_actions = require("./schedule_notification_actions");
var _utils = require("./utils");
var _get_signals = require("./get_signals");
var _legacy_extract_references = require("./legacy_saved_object_references/legacy_extract_references");
var _legacy_inject_references = require("./legacy_saved_object_references/legacy_inject_references");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

// eslint-disable-next-line no-restricted-imports

/**
 * @deprecated Once we are confident all rules relying on side-car actions SO's have been migrated to SO references we should remove this function
 */
const legacyRulesNotificationAlertType = ({
  logger
}) => ({
  id: _constants.LEGACY_NOTIFICATIONS_ID,
  name: 'Security Solution notification (Legacy)',
  actionGroups: _siem_rule_action_groups.siemRuleActionGroups,
  defaultActionGroupId: 'default',
  producer: _constants.SERVER_APP_ID,
  validate: {
    params: _legacy_types.legacyRulesNotificationParams
  },
  useSavedObjectReferences: {
    extractReferences: params => (0, _legacy_extract_references.legacyExtractReferences)({
      logger,
      params
    }),
    injectReferences: (params, savedObjectReferences) => (0, _legacy_inject_references.legacyInjectReferences)({
      logger,
      params,
      savedObjectReferences
    })
  },
  minimumLicenseRequired: 'basic',
  isExportable: false,
  async executor({
    startedAt,
    previousStartedAt,
    rule: {
      id: ruleId
    },
    services,
    params,
    spaceId
  }) {
    var _parseScheduleDates, _parseScheduleDates2, _results$hits$total$v, _results$hits$total, _ruleAlertParams$meta;
    const ruleAlertSavedObject = await services.savedObjectsClient.get('alert', params.ruleAlertId);
    if (!ruleAlertSavedObject.attributes.params) {
      logger.error([`Security Solution notification (Legacy) saved object for alert ${params.ruleAlertId} was not found with`, `id: "${ruleId}".`, `space id: "${spaceId}"`, 'This indicates a dangling (Legacy) notification alert.', 'You should delete this rule through "Kibana UI -> Stack Management -> Rules and Connectors" to remove this error message.'].join(' '));
      return;
    }
    logger.warn(['Security Solution notification (Legacy) system still active for alert with', `name: "${ruleAlertSavedObject.attributes.name}"`, `description: "${ruleAlertSavedObject.attributes.params.description}"`, `id: "${ruleAlertSavedObject.id}".`, `space id: "${spaceId}"`, 'Editing or updating this rule through "Kibana UI -> Security -> Alerts -> Manage Rules"', 'will auto-migrate the rule to the new notification system and remove this warning message.'].join(' '));
    const {
      params: ruleAlertParams,
      name: ruleName
    } = ruleAlertSavedObject.attributes;
    const ruleParams = {
      ...ruleAlertParams,
      name: ruleName,
      id: ruleAlertSavedObject.id
    };
    const fromInMs = (_parseScheduleDates = (0, _securitysolutionIoTsUtils.parseScheduleDates)(previousStartedAt ? previousStartedAt.toISOString() : `now-${ruleAlertSavedObject.attributes.schedule.interval}`)) === null || _parseScheduleDates === void 0 ? void 0 : _parseScheduleDates.format('x');
    const toInMs = (_parseScheduleDates2 = (0, _securitysolutionIoTsUtils.parseScheduleDates)(startedAt.toISOString())) === null || _parseScheduleDates2 === void 0 ? void 0 : _parseScheduleDates2.format('x');
    const results = await (0, _get_signals.getSignals)({
      from: fromInMs,
      to: toInMs,
      size: _constants.DEFAULT_RULE_NOTIFICATION_QUERY_SIZE,
      index: ruleParams.outputIndex,
      ruleId: ruleParams.ruleId,
      esClient: services.scopedClusterClient.asCurrentUser
    });
    const signals = results.hits.hits.map(hit => hit._source);
    const signalsCount = typeof results.hits.total === 'number' ? results.hits.total : (_results$hits$total$v = (_results$hits$total = results.hits.total) === null || _results$hits$total === void 0 ? void 0 : _results$hits$total.value) !== null && _results$hits$total$v !== void 0 ? _results$hits$total$v : 0;
    const resultsLink = (0, _utils.getNotificationResultsLink)({
      from: fromInMs,
      to: toInMs,
      id: ruleAlertSavedObject.id,
      kibanaSiemAppUrl: (_ruleAlertParams$meta = ruleAlertParams.meta) === null || _ruleAlertParams$meta === void 0 ? void 0 : _ruleAlertParams$meta.kibana_siem_app_url
    });
    logger.debug(`Security Solution notification (Legacy) found ${signalsCount} signals using signal rule name: "${ruleParams.name}", id: "${params.ruleAlertId}", rule_id: "${ruleParams.ruleId}" in "${ruleParams.outputIndex}" index`);
    if (signalsCount !== 0) {
      const alertInstance = services.alertFactory.create(ruleId);
      (0, _schedule_notification_actions.scheduleNotificationActions)({
        alertInstance,
        signalsCount,
        resultsLink,
        ruleParams,
        signals
      });
    }
  }
});
exports.legacyRulesNotificationAlertType = legacyRulesNotificationAlertType;