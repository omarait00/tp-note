"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KibanaVersionMismatchRule = void 0;
var _i18n = require("@kbn/i18n");
var _base_rule = require("./base_rule");
var _constants = require("../../common/constants");
var _enums = require("../../common/enums");
var _alert_helpers = require("./alert_helpers");
var _static_globals = require("../static_globals");
var _fetch_kibana_versions = require("../lib/alerts/fetch_kibana_versions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class KibanaVersionMismatchRule extends _base_rule.BaseRule {
  constructor(sanitizedRule) {
    super(sanitizedRule, {
      id: _constants.RULE_KIBANA_VERSION_MISMATCH,
      name: _constants.LEGACY_RULE_DETAILS[_constants.RULE_KIBANA_VERSION_MISMATCH].label,
      interval: '1d',
      actionVariables: [{
        name: 'versionList',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.actionVariables.clusterHealth', {
          defaultMessage: 'The versions of Kibana running in this cluster.'
        })
      }, {
        name: 'clusterName',
        description: _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.actionVariables.clusterName', {
          defaultMessage: 'The cluster to which the instances belong.'
        })
      }, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.internalShortMessage, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.internalFullMessage, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.state, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.action, _alert_helpers.AlertingDefaults.ALERT_TYPE.context.actionPlain]
    });
    this.sanitizedRule = sanitizedRule;
  }
  async fetchData(params, esClient, clusters) {
    const kibanaVersions = await (0, _fetch_kibana_versions.fetchKibanaVersions)(esClient, clusters, _static_globals.Globals.app.config.ui.max_bucket_size, params.filterQuery);
    return kibanaVersions.map(kibanaVersion => {
      return {
        shouldFire: kibanaVersion.versions.length > 1,
        severity: _enums.AlertSeverity.Warning,
        meta: kibanaVersion,
        clusterUuid: kibanaVersion.clusterUuid,
        ccs: kibanaVersion.ccs
      };
    });
  }
  getUiMessage(alertState, item) {
    const {
      versions
    } = item.meta;
    const text = _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.ui.firingMessage', {
      defaultMessage: `Multiple versions of Kibana ({versions}) running in this cluster.`,
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
    const shortActionText = _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.shortAction', {
      defaultMessage: 'Verify you have the same version across all instances.'
    });
    const fullActionText = _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.fullAction', {
      defaultMessage: 'View instances'
    });
    const globalStateLink = this.createGlobalStateLink('kibana/instances', cluster.clusterUuid, state.ccs);
    const action = `[${fullActionText}](${globalStateLink})`;
    const internalFullMessage = _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.firing.internalFullMessage', {
      defaultMessage: `Kibana version mismatch alert is firing for {clusterName}. Kibana is running {versions}. {action}`,
      values: {
        clusterName: cluster.clusterName,
        versions: versions.join(', '),
        action
      }
    });
    instance.scheduleActions('default', {
      internalShortMessage: _i18n.i18n.translate('xpack.monitoring.alerts.kibanaVersionMismatch.firing.internalShortMessage', {
        defaultMessage: `Kibana version mismatch alert is firing for {clusterName}. {shortActionText}`,
        values: {
          clusterName: cluster.clusterName,
          shortActionText
        }
      }),
      internalFullMessage,
      state: _alert_helpers.AlertingDefaults.ALERT_STATE.firing,
      clusterName: cluster.clusterName,
      versionList: versions,
      action,
      actionPlain: shortActionText
    });
  }
}
exports.KibanaVersionMismatchRule = KibanaVersionMismatchRule;