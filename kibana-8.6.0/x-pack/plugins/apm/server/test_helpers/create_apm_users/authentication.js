"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.users = exports.customRoles = exports.ApmUsername = exports.ApmCustomRolename = exports.APM_TEST_PASSWORD = void 0;
var _privilege_type = require("../../../common/privilege_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let ApmUsername;
exports.ApmUsername = ApmUsername;
(function (ApmUsername) {
  ApmUsername["noAccessUser"] = "no_access_user";
  ApmUsername["viewerUser"] = "viewer";
  ApmUsername["editorUser"] = "editor";
  ApmUsername["apmAnnotationsWriteUser"] = "apm_annotations_write_user";
  ApmUsername["apmReadUserWithoutMlAccess"] = "apm_read_user_without_ml_access";
  ApmUsername["apmManageOwnAgentKeys"] = "apm_manage_own_agent_keys";
  ApmUsername["apmManageOwnAndCreateAgentKeys"] = "apm_manage_own_and_create_agent_keys";
  ApmUsername["apmMonitorClusterAndIndices"] = "apm_monitor_cluster_and_indices";
})(ApmUsername || (exports.ApmUsername = ApmUsername = {}));
let ApmCustomRolename;
exports.ApmCustomRolename = ApmCustomRolename;
(function (ApmCustomRolename) {
  ApmCustomRolename["apmReadUserWithoutMlAccess"] = "apm_read_user_without_ml_access";
  ApmCustomRolename["apmAnnotationsWriteUser"] = "apm_annotations_write_user";
  ApmCustomRolename["apmManageOwnAgentKeys"] = "apm_manage_own_agent_keys";
  ApmCustomRolename["apmManageOwnAndCreateAgentKeys"] = "apm_manage_own_and_create_agent_keys";
  ApmCustomRolename["apmMonitorClusterAndIndices"] = "apm_monitor_cluster_and_indices";
})(ApmCustomRolename || (exports.ApmCustomRolename = ApmCustomRolename = {}));
const customRoles = {
  [ApmCustomRolename.apmReadUserWithoutMlAccess]: {
    elasticsearch: {
      cluster: [],
      indices: [{
        names: ['apm-*'],
        privileges: ['read', 'view_index_metadata']
      }]
    },
    kibana: [{
      base: [],
      feature: {
        apm: ['read']
      },
      spaces: ['*']
    }]
  },
  [ApmCustomRolename.apmAnnotationsWriteUser]: {
    elasticsearch: {
      cluster: [],
      indices: [{
        names: ['observability-annotations'],
        privileges: ['read', 'view_index_metadata', 'index', 'manage', 'create_index', 'create_doc']
      }]
    }
  },
  [ApmCustomRolename.apmManageOwnAgentKeys]: {
    elasticsearch: {
      cluster: ['manage_own_api_key']
    }
  },
  [ApmCustomRolename.apmManageOwnAndCreateAgentKeys]: {
    applications: [{
      application: 'apm',
      privileges: [_privilege_type.PrivilegeType.AGENT_CONFIG, _privilege_type.PrivilegeType.EVENT],
      resources: ['*']
    }]
  },
  [ApmCustomRolename.apmMonitorClusterAndIndices]: {
    elasticsearch: {
      indices: [{
        names: ['traces-apm*', 'logs-apm*', 'metrics-apm*', 'apm-*'],
        privileges: ['monitor']
      }],
      cluster: ['monitor']
    }
  }
};
exports.customRoles = customRoles;
const users = {
  [ApmUsername.noAccessUser]: {},
  [ApmUsername.viewerUser]: {
    builtInRoleNames: ['viewer']
  },
  [ApmUsername.editorUser]: {
    builtInRoleNames: ['editor']
  },
  [ApmUsername.apmReadUserWithoutMlAccess]: {
    customRoleNames: [ApmCustomRolename.apmReadUserWithoutMlAccess]
  },
  [ApmUsername.apmAnnotationsWriteUser]: {
    builtInRoleNames: ['editor'],
    customRoleNames: [ApmCustomRolename.apmAnnotationsWriteUser]
  },
  [ApmUsername.apmManageOwnAgentKeys]: {
    builtInRoleNames: ['editor'],
    customRoleNames: [ApmCustomRolename.apmManageOwnAgentKeys]
  },
  [ApmUsername.apmManageOwnAndCreateAgentKeys]: {
    builtInRoleNames: ['editor'],
    customRoleNames: [ApmCustomRolename.apmManageOwnAgentKeys, ApmCustomRolename.apmManageOwnAndCreateAgentKeys]
  },
  [ApmUsername.apmMonitorClusterAndIndices]: {
    builtInRoleNames: ['viewer'],
    customRoleNames: [ApmCustomRolename.apmMonitorClusterAndIndices]
  }
};
exports.users = users;
const APM_TEST_PASSWORD = 'changeme';
exports.APM_TEST_PASSWORD = APM_TEST_PASSWORD;