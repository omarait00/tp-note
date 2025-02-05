"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateKibanaPrivileges = exports.transformPrivilegesToElasticsearchPrivileges = void 0;
var _constants = require("../../common/constants");
var _privilege_serializer = require("../authorization/privilege_serializer");
var _resource_serializer = require("../authorization/resource_serializer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const transformPrivilegesToElasticsearchPrivileges = (application, kibanaPrivileges = []) => {
  return kibanaPrivileges.map(({
    base,
    feature,
    spaces
  }) => {
    if (spaces.length === 1 && spaces[0] === _constants.GLOBAL_RESOURCE) {
      return {
        privileges: [...(base ? base.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeGlobalBasePrivilege(privilege)) : []), ...(feature ? Object.entries(feature).map(([featureName, featurePrivileges]) => featurePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeFeaturePrivilege(featureName, privilege))).flat() : [])],
        application,
        resources: [_constants.GLOBAL_RESOURCE]
      };
    }
    return {
      privileges: [...(base ? base.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeSpaceBasePrivilege(privilege)) : []), ...(feature ? Object.entries(feature).map(([featureName, featurePrivileges]) => featurePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeFeaturePrivilege(featureName, privilege))).flat() : [])],
      application,
      resources: spaces.map(resource => _resource_serializer.ResourceSerializer.serializeSpaceResource(resource))
    };
  });
};
exports.transformPrivilegesToElasticsearchPrivileges = transformPrivilegesToElasticsearchPrivileges;
const validateKibanaPrivileges = (kibanaFeatures, kibanaPrivileges = []) => {
  const validationErrors = kibanaPrivileges.flatMap(priv => {
    var _priv$feature;
    const forAllSpaces = priv.spaces.includes(_constants.ALL_SPACES_ID);
    return Object.entries((_priv$feature = priv.feature) !== null && _priv$feature !== void 0 ? _priv$feature : {}).flatMap(([featureId, feature]) => {
      const errors = [];
      const kibanaFeature = kibanaFeatures.find(f => f.id === featureId);
      if (!kibanaFeature) return errors;
      if (feature.includes('all')) {
        var _kibanaFeature$privil, _kibanaFeature$privil2;
        if ((_kibanaFeature$privil = kibanaFeature.privileges) !== null && _kibanaFeature$privil !== void 0 && _kibanaFeature$privil.all.disabled) {
          errors.push(`Feature [${featureId}] does not support privilege [all].`);
        }
        if ((_kibanaFeature$privil2 = kibanaFeature.privileges) !== null && _kibanaFeature$privil2 !== void 0 && _kibanaFeature$privil2.all.requireAllSpaces && !forAllSpaces) {
          errors.push(`Feature privilege [${featureId}.all] requires all spaces to be selected but received [${priv.spaces.join(',')}]`);
        }
      }
      if (feature.includes('read')) {
        var _kibanaFeature$privil3, _kibanaFeature$privil4;
        if ((_kibanaFeature$privil3 = kibanaFeature.privileges) !== null && _kibanaFeature$privil3 !== void 0 && _kibanaFeature$privil3.read.disabled) {
          errors.push(`Feature [${featureId}] does not support privilege [read].`);
        }
        if ((_kibanaFeature$privil4 = kibanaFeature.privileges) !== null && _kibanaFeature$privil4 !== void 0 && _kibanaFeature$privil4.read.requireAllSpaces && !forAllSpaces) {
          errors.push(`Feature privilege [${featureId}.read] requires all spaces to be selected but received [${priv.spaces.join(',')}]`);
        }
      }
      kibanaFeature.subFeatures.forEach(subFeature => {
        if (subFeature.requireAllSpaces && !forAllSpaces && subFeature.privilegeGroups.some(group => group.privileges.some(privilege => feature.includes(privilege.id)))) {
          errors.push(`Sub-feature privilege [${kibanaFeature.name} - ${subFeature.name}] requires all spaces to be selected but received [${priv.spaces.join(',')}]`);
        }
      });
      return errors;
    });
  });
  return {
    validationErrors
  };
};
exports.validateKibanaPrivileges = validateKibanaPrivileges;