"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.privilegesFactory = privilegesFactory;
var _lodash = require("lodash");
var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function privilegesFactory(actions, featuresService, licenseService) {
  const featurePrivilegeBuilder = (0, _feature_privilege_builder.featurePrivilegeBuilderFactory)(actions);
  return {
    get(respectLicenseLevel = true) {
      const features = featuresService.getKibanaFeatures();
      const {
        allowSubFeaturePrivileges
      } = licenseService.getFeatures();
      const {
        hasAtLeast: licenseHasAtLeast
      } = licenseService;
      const basePrivilegeFeatures = features.filter(feature => !feature.excludeFromBasePrivileges);
      let allActions = [];
      let readActions = [];
      basePrivilegeFeatures.forEach(feature => {
        for (const {
          privilegeId,
          privilege
        } of featuresService.featurePrivilegeIterator(feature, {
          augmentWithSubFeaturePrivileges: true,
          licenseHasAtLeast,
          predicate: (pId, featurePrivilege) => !featurePrivilege.excludeFromBasePrivileges
        })) {
          const privilegeActions = featurePrivilegeBuilder.getActions(privilege, feature);
          allActions = [...allActions, ...privilegeActions];
          if (privilegeId === 'read') {
            readActions = [...readActions, ...privilegeActions];
          }
        }
      });
      allActions = (0, _lodash.uniq)(allActions);
      readActions = (0, _lodash.uniq)(readActions);
      const featurePrivileges = {};
      for (const feature of features) {
        var _feature$subFeatures;
        featurePrivileges[feature.id] = {};
        for (const featurePrivilege of featuresService.featurePrivilegeIterator(feature, {
          augmentWithSubFeaturePrivileges: true,
          licenseHasAtLeast
        })) {
          featurePrivileges[feature.id][featurePrivilege.privilegeId] = [actions.login, actions.version, ...(0, _lodash.uniq)(featurePrivilegeBuilder.getActions(featurePrivilege.privilege, feature))];
        }
        for (const featurePrivilege of featuresService.featurePrivilegeIterator(feature, {
          augmentWithSubFeaturePrivileges: false,
          licenseHasAtLeast
        })) {
          featurePrivileges[feature.id][`minimal_${featurePrivilege.privilegeId}`] = [actions.login, actions.version, ...(0, _lodash.uniq)(featurePrivilegeBuilder.getActions(featurePrivilege.privilege, feature))];
        }
        if ((!respectLicenseLevel || allowSubFeaturePrivileges) && ((_feature$subFeatures = feature.subFeatures) === null || _feature$subFeatures === void 0 ? void 0 : _feature$subFeatures.length) > 0) {
          for (const subFeaturePrivilege of featuresService.subFeaturePrivilegeIterator(feature, licenseHasAtLeast)) {
            featurePrivileges[feature.id][subFeaturePrivilege.id] = [actions.login, actions.version, ...(0, _lodash.uniq)(featurePrivilegeBuilder.getActions(subFeaturePrivilege, feature))];
          }
        }
        if (Object.keys(featurePrivileges[feature.id]).length === 0) {
          delete featurePrivileges[feature.id];
        }
      }
      return {
        features: featurePrivileges,
        global: {
          all: [actions.login, actions.version, actions.api.get('decryptedTelemetry'), actions.api.get('features'), actions.api.get('taskManager'), actions.space.manage, actions.ui.get('spaces', 'manage'), actions.ui.get('management', 'kibana', 'spaces'), actions.ui.get('catalogue', 'spaces'), actions.ui.get('enterpriseSearch', 'all'), ...allActions],
          read: [actions.login, actions.version, actions.api.get('decryptedTelemetry'), ...readActions]
        },
        space: {
          all: [actions.login, actions.version, ...allActions],
          read: [actions.login, actions.version, ...readActions]
        },
        reserved: features.reduce((acc, feature) => {
          if (feature.reserved) {
            feature.reserved.privileges.forEach(reservedPrivilege => {
              acc[reservedPrivilege.id] = [actions.version, ...(0, _lodash.uniq)(featurePrivilegeBuilder.getActions(reservedPrivilege.privilege, feature))];
            });
          }
          return acc;
        }, {})
      };
    }
  };
}