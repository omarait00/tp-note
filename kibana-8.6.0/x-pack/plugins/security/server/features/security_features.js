"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityFeatures = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const userManagementFeature = {
  id: 'users',
  management: {
    security: ['users']
  },
  catalogue: ['security'],
  privileges: [{
    requiredClusterPrivileges: ['manage_security'],
    ui: ['save']
  }, {
    requiredClusterPrivileges: ['read_security'],
    ui: []
  }]
};
const rolesManagementFeature = {
  id: 'roles',
  management: {
    security: ['roles']
  },
  catalogue: ['security'],
  privileges: [{
    requiredClusterPrivileges: ['manage_security'],
    ui: ['save']
  }, {
    requiredClusterPrivileges: ['read_security'],
    ui: []
  }]
};
const apiKeysManagementFeature = {
  id: 'api_keys',
  management: {
    security: ['api_keys']
  },
  catalogue: ['security'],
  privileges: [{
    requiredClusterPrivileges: ['manage_api_key'],
    ui: ['save']
  }, {
    requiredClusterPrivileges: ['manage_own_api_key'],
    ui: ['save']
  }, {
    requiredClusterPrivileges: ['read_security'],
    ui: []
  }]
};
const roleMappingsManagementFeature = {
  id: 'role_mappings',
  management: {
    security: ['role_mappings']
  },
  catalogue: ['security'],
  privileges: [{
    requiredClusterPrivileges: ['manage_security'],
    ui: []
  }]
};
const securityFeatures = [userManagementFeature, rolesManagementFeature, apiKeysManagementFeature, roleMappingsManagementFeature];
exports.securityFeatures = securityFeatures;