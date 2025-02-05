"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUpgradeStatusRoute = registerUpgradeStatusRoute;
var _i18n = require("@kbn/i18n");
var _constants = require("../../common/constants");
var _es_deprecations_status = require("../lib/es_deprecations_status");
var _es_version_precheck = require("../lib/es_version_precheck");
var _kibana_status = require("../lib/kibana_status");
var _es_system_indices_migration = require("../lib/es_system_indices_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Note that this route is primarily intended for consumption by Cloud.
 */
function registerUpgradeStatusRoute({
  config: {
    featureSet
  },
  router,
  lib: {
    handleEsError
  }
}) {
  router.get({
    path: `${_constants.API_BASE_PATH}/status`,
    validate: false
  }, (0, _es_version_precheck.versionCheckHandlerWrapper)(async ({
    core
  }, request, response) => {
    try {
      const {
        elasticsearch: {
          client: esClient
        },
        deprecations: {
          client: deprecationsClient
        }
      } = await core;
      // Fetch ES upgrade status
      const {
        totalCriticalDeprecations: esTotalCriticalDeps
      } = await (0, _es_deprecations_status.getESUpgradeStatus)(esClient, featureSet);
      // Fetch system indices migration status
      const {
        migration_status: systemIndicesMigrationStatus,
        features
      } = await (0, _es_system_indices_migration.getESSystemIndicesMigrationStatus)(esClient.asCurrentUser);
      const notMigratedSystemIndices = features.filter(feature => feature.migration_status !== 'NO_MIGRATION_NEEDED').length;

      // Fetch Kibana upgrade status
      const {
        totalCriticalDeprecations: kibanaTotalCriticalDeps
      } = await (0, _kibana_status.getKibanaUpgradeStatus)(deprecationsClient);
      const readyForUpgrade = esTotalCriticalDeps === 0 && kibanaTotalCriticalDeps === 0 && systemIndicesMigrationStatus === 'NO_MIGRATION_NEEDED';
      const getStatusMessage = () => {
        if (readyForUpgrade) {
          return _i18n.i18n.translate('xpack.upgradeAssistant.status.allDeprecationsResolvedMessage', {
            defaultMessage: 'All deprecation warnings have been resolved.'
          });
        }
        const upgradeIssues = [];
        if (notMigratedSystemIndices) {
          upgradeIssues.push(_i18n.i18n.translate('xpack.upgradeAssistant.status.systemIndicesMessage', {
            defaultMessage: '{notMigratedSystemIndices} unmigrated system {notMigratedSystemIndices, plural, one {index} other {indices}}',
            values: {
              notMigratedSystemIndices
            }
          }));
        }
        if (esTotalCriticalDeps) {
          upgradeIssues.push(_i18n.i18n.translate('xpack.upgradeAssistant.status.esTotalCriticalDepsMessage', {
            defaultMessage: '{esTotalCriticalDeps} Elasticsearch deprecation {esTotalCriticalDeps, plural, one {issue} other {issues}}',
            values: {
              esTotalCriticalDeps
            }
          }));
        }
        if (kibanaTotalCriticalDeps) {
          upgradeIssues.push(_i18n.i18n.translate('xpack.upgradeAssistant.status.kibanaTotalCriticalDepsMessage', {
            defaultMessage: '{kibanaTotalCriticalDeps} Kibana deprecation {kibanaTotalCriticalDeps, plural, one {issue} other {issues}}',
            values: {
              kibanaTotalCriticalDeps
            }
          }));
        }
        return _i18n.i18n.translate('xpack.upgradeAssistant.status.deprecationsUnresolvedMessage', {
          defaultMessage: 'The following issues must be resolved before upgrading: {upgradeIssues}.',
          values: {
            upgradeIssues: upgradeIssues.join(', ')
          }
        });
      };
      return response.ok({
        body: {
          readyForUpgrade,
          details: getStatusMessage()
        }
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}