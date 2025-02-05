"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogstashVersionMismatchRule = void 0;
var _i18n = require("@kbn/i18n");
var _base_rule = require("./base_rule");
var _constants = require("../../common/constants");
var _enums = require("../../common/enums");
var _alert_helpers = require("./alert_helpers");
var _static_globals = require("../static_globals");
var _fetch_logstash_versions = require("../lib/alerts/fetch_logstash_versions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class LogstashVersionMismatchRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_LOGSTASH_VERSION_MISMATCH,
      name: _constants.LEGACY_RULE_DETAILS[_constants.RULE_LOGSTASH_VERSION_MISMATCH].label,
      interval: '1d',
      actionVariables: [{
        name: 'versionList',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.actionVariables.clusterHealth', {
          defaultMessage: 'The versions of Logstash running in this cluster.'
        })
      }, ...Object.values(_alert_helpers.AlertingDefaults.ALERT_TYPE.context)]
    });
    this.sanitizedRule = sanitizedRule;
  }
  async fetchData(params, esClient, clusters) {
    const logstashVersions = await (0, _fetch_logstash_versions.fetchLogstashVersions)(esClient, clusters, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return logstashVersions.map(logstashVersion => {
      return {
        shouldFire: logstashVersion.versions.length > 1,
        severity: _enums.AlertSeverity.Warning,
        meta: logstashVersion,
        clusterUuid: logstashVersion.clusterUuid,
        ccs: logstashVersion.ccs
      };
    });
  }
  getUiMessage(alertState, item) {
    const {
      versions
    } = item.meta;
    const text = _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.ui.firingMessage', {
      defaultMessage: `Multiple versions of Logstash ({versions}) running in this cluster.`,
      values: {
        versions: versions.join(', ')
      }
    });
    return {
      text
    };
  }
  async executeActions(instance, {
    alertStates
  }, item, cluster) {
    if (alertStates.length === 0) {
      return;
    }

    // Logic in the base alert assumes that all alerts will operate against multiple nodes/instances (such as a CPU alert against ES nodes)
    // However, some alerts operate on the state of the cluster itself and are only concerned with a single state
    const state = alertStates[0];
    const {
      versions
    } = state.meta;
    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.shortAction', {
      defaultMessage: 'Verify you have the same version across all nodes.'
    });
    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.fullAction', {
      defaultMessage: 'View nodes'
    });
    const globalStateLink = this.createGlobalStateLink('logstash/nodes', cluster.clusterUuid, state.ccs);
    const action = `[${fullActionText}](${globalStateLink})`;
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.firing.internalShortMessage', {
        defaultMessage: `Logstash version mismatch alert is firing for {clusterName}. {shortActionText}`,
        values: {
          clusterName: cluster.clusterName,
          shortActionText
        }
      }),
      internalFullMessage: _i18n.i18n.translate('xpack.monitoring.alerts.logstashVersionMismatch.firing.internalFullMessage', {
        defaultMessage: `Logstash version mismatch alert is firing for {clusterName}. Logstash is running {versions}. {action}`,
        values: {
          clusterName: cluster.clusterName,
          versions: versions.join(', '),
          action
        }
      }),
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      clusterName: cluster.clusterName,
      versionList: versions,
      action,
      actionPlain: shortActionText
    });
  }
}
exports.LogstashVersionMismatchRule = LogstashVersionMismatchRule;