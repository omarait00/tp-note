"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getESUpgradeStatus = getESUpgradeStatus;
var _es_indices_state_check = require("./es_indices_state_check");
var _es_system_indices_migration = require("./es_system_indices_migration");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function getESUpgradeStatus(dataClient, featureSet) {
  const deprecations = await dataClient.asCurrentUser.migration.deprecations();
  const getCombinedDeprecations = async () => {
    const indices = await getCombinedIndexInfos(deprecations, dataClient);
    const systemIndices = await (0, _es_system_indices_migration.getESSystemIndicesMigrationStatus)(dataClient.asCurrentUser);
    const systemIndicesList = (0, _es_system_indices_migration.convertFeaturesToIndicesArray)(systemIndices.features);
    return Object.keys(deprecations).reduce((combinedDeprecations, deprecationType) => {
      if (deprecationType === 'index_settings') {
        // We need to exclude all index related deprecations for system indices since
        // they are resolved separately through the system indices upgrade section in
        // the Overview page.
        const withoutSystemIndices = indices.filter(index => !systemIndicesList.includes(index.index));
        combinedDeprecations = combinedDeprecations.concat(withoutSystemIndices);
      } else {
        const deprecationsByType = deprecations[deprecationType];
        const enrichedDeprecationInfo = deprecationsByType.map(({
          details,
          level,
          message,
          url,
          // @ts-expect-error @elastic/elasticsearch _meta not available yet in MigrationDeprecationInfoResponse
          _meta: metadata,
          // @ts-expect-error @elastic/elasticsearch resolve_during_rolling_upgrade not available yet in MigrationDeprecationInfoResponse
          resolve_during_rolling_upgrade: resolveDuringUpgrade
        }) => {
          return {
            details,
            message,
            url,
            type: deprecationType,
            isCritical: level === 'critical',
            resolveDuringUpgrade,
            correctiveAction: getCorrectiveAction(message, metadata)
          };
        }).filter(({
          correctiveAction,
          type
        }) => {
          /**
           * This disables showing the ML deprecations in the UA if `featureSet.mlSnapshots`
           * is set to `false`.
           *
           * This config should be set to true only on the `x.last` versions, or when
           * the constant `MachineLearningField.MIN_CHECKED_SUPPORTED_SNAPSHOT_VERSION`
           * is incremented to something higher than 7.0.0 in the Elasticsearch code.
           */
          if (!featureSet.mlSnapshots) {
            if (type === 'ml_settings' || (correctiveAction === null || correctiveAction === void 0 ? void 0 : correctiveAction.type) === 'mlSnapshot') {
              return false;
            }
          }

          /**
           * This disables showing the reindexing deprecations in the UA if
           * `featureSet.reindexCorrectiveActions` is set to `false`.
           */
          if (!featureSet.reindexCorrectiveActions && (correctiveAction === null || correctiveAction === void 0 ? void 0 : correctiveAction.type) === 'reindex') {
            return false;
          }
          return true;
        });
        combinedDeprecations = combinedDeprecations.concat(enrichedDeprecationInfo);
      }
      return combinedDeprecations;
    }, []);
  };
  const combinedDeprecations = await getCombinedDeprecations();
  const criticalWarnings = combinedDeprecations.filter(({
    isCritical
  }) => isCritical === true);
  return {
    totalCriticalDeprecations: criticalWarnings.length,
    deprecations: combinedDeprecations
  };
}

// Reformats the index deprecations to an array of deprecation warnings extended with an index field.
const getCombinedIndexInfos = async (deprecations, dataClient) => {
  const indices = Object.keys(deprecations.index_settings).reduce((indexDeprecations, indexName) => {
    return indexDeprecations.concat(deprecations.index_settings[indexName].map(({
      details,
      message,
      url,
      level,
      // @ts-expect-error @elastic/elasticsearch _meta not available yet in MigrationDeprecationInfoResponse
      _meta: metadata,
      // @ts-expect-error @elastic/elasticsearch resolve_during_rolling_upgrade not available yet in MigrationDeprecationInfoResponse
      resolve_during_rolling_upgrade: resolveDuringUpgrade
    }) => ({
      details,
      message,
      url,
      index: indexName,
      type: 'index_settings',
      isCritical: level === 'critical',
      correctiveAction: getCorrectiveAction(message, metadata, indexName),
      resolveDuringUpgrade
    })));
  }, []);
  const indexNames = indices.map(({
    index
  }) => index);

  // If we have found deprecation information for index/indices
  // check whether the index is open or closed.
  if (indexNames.length) {
    const indexStates = await (0, _es_indices_state_check.esIndicesStateCheck)(dataClient.asCurrentUser, indexNames);
    indices.forEach(indexData => {
      var _indexData$corrective;
      if (((_indexData$corrective = indexData.correctiveAction) === null || _indexData$corrective === void 0 ? void 0 : _indexData$corrective.type) === 'reindex') {
        indexData.correctiveAction.blockerForReindexing = indexStates[indexData.index] === 'closed' ? 'index-closed' : undefined;
      }
    });
  }
  return indices;
};
const getCorrectiveAction = (message, metadata, indexName) => {
  var _metadata$actions, _metadata$actions2;
  const indexSettingDeprecation = metadata === null || metadata === void 0 ? void 0 : (_metadata$actions = metadata.actions) === null || _metadata$actions === void 0 ? void 0 : _metadata$actions.find(action => action.action_type === 'remove_settings' && indexName);
  const clusterSettingDeprecation = metadata === null || metadata === void 0 ? void 0 : (_metadata$actions2 = metadata.actions) === null || _metadata$actions2 === void 0 ? void 0 : _metadata$actions2.find(action => action.action_type === 'remove_settings' && typeof indexName === 'undefined');
  const requiresReindexAction = /Index created before/.test(message);
  const requiresIndexSettingsAction = Boolean(indexSettingDeprecation);
  const requiresClusterSettingsAction = Boolean(clusterSettingDeprecation);
  const requiresMlAction = /[Mm]odel snapshot/.test(message);
  if (requiresReindexAction) {
    return {
      type: 'reindex'
    };
  }
  if (requiresIndexSettingsAction) {
    return {
      type: 'indexSetting',
      deprecatedSettings: indexSettingDeprecation.objects
    };
  }
  if (requiresClusterSettingsAction) {
    return {
      type: 'clusterSetting',
      deprecatedSettings: clusterSettingDeprecation.objects
    };
  }
  if (requiresMlAction) {
    const {
      snapshot_id: snapshotId,
      job_id: jobId
    } = metadata;
    return {
      type: 'mlSnapshot',
      snapshotId,
      jobId
    };
  }
};