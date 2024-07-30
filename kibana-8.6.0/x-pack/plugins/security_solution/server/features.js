"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaPrivilegesFeaturePrivileges = exports.getCasesKibanaFeature = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
var _common = require("../../../../src/plugins/data_views/common");
var _common2 = require("../../cases/common");
var _constants = require("../common/constants");
var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getCasesKibanaFeature = () => {
  const casesCapabilities = (0, _common2.createUICapabilities)();
  return {
    id: _constants.CASES_FEATURE_ID,
    name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionCaseTitle', {
      defaultMessage: 'Cases'
    }),
    order: 1100,
    category: _server.DEFAULT_APP_CATEGORIES.security,
    app: [_constants.CASES_FEATURE_ID, 'kibana'],
    catalogue: [_constants.APP_ID],
    cases: [_constants.APP_ID],
    privileges: {
      all: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        app: [_constants.CASES_FEATURE_ID, 'kibana'],
        catalogue: [_constants.APP_ID],
        cases: {
          create: [_constants.APP_ID],
          read: [_constants.APP_ID],
          update: [_constants.APP_ID],
          push: [_constants.APP_ID]
        },
        savedObject: {
          all: [],
          read: []
        },
        ui: casesCapabilities.all
      },
      read: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        app: [_constants.CASES_FEATURE_ID, 'kibana'],
        catalogue: [_constants.APP_ID],
        cases: {
          read: [_constants.APP_ID]
        },
        savedObject: {
          all: [],
          read: []
        },
        ui: casesCapabilities.read
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.deleteSubFeatureName', {
        defaultMessage: 'Delete'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          api: [],
          id: 'cases_delete',
          name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.deleteSubFeatureDetails', {
            defaultMessage: 'Delete cases and comments'
          }),
          includeIn: 'all',
          savedObject: {
            all: [],
            read: []
          },
          cases: {
            delete: [_constants.APP_ID]
          },
          ui: casesCapabilities.delete
        }]
      }]
    }]
  };
};

// Same as the plugin id defined by Cloud Security Posture
exports.getCasesKibanaFeature = getCasesKibanaFeature;
const CLOUD_POSTURE_APP_ID = 'csp';
// Same as the saved-object type for rules defined by Cloud Security Posture
const CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE = 'csp_rule';
const responseActionSubFeatures = [{
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.responseActionsHistory.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Response Actions History access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.responseActionsHistory', {
    defaultMessage: 'Response Actions History'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeActionsLogManagement`, `${_constants.APP_ID}-readActionsLogManagement`],
      id: 'actions_log_management_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeActionsLogManagement', 'readActionsLogManagement']
    }, {
      api: [`${_constants.APP_ID}-readActionsLogManagement`],
      id: 'actions_log_management_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readActionsLogManagement']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.hostIsolation.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Host Isolation access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.hostIsolation', {
    defaultMessage: 'Host Isolation'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeHostIsolation`],
      id: 'host_isolation_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeHostIsolation']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.processOperations.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Process Operations access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.processOperations', {
    defaultMessage: 'Process Operations'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeProcessOperations`],
      id: 'process_operations_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeProcessOperations']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.fileOperations.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for File Operations access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistr.subFeatures.fileOperations', {
    defaultMessage: 'File Operations'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeFileOperations`],
      id: 'file_operations_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeFileOperations']
    }]
  }]
}];
const subFeatures = [{
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.endpointList.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Endpoint List access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.endpointList', {
    defaultMessage: 'Endpoint List'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeEndpointList`, `${_constants.APP_ID}-readEndpointList`],
      id: 'endpoint_list_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeEndpointList', 'readEndpointList']
    }, {
      api: [`${_constants.APP_ID}-readEndpointList`],
      id: 'endpoint_list_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readEndpointList']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.trustedApplications.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Trusted Applications access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.trustedApplications', {
    defaultMessage: 'Trusted Applications'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeTrustedApplications`, `${_constants.APP_ID}-readTrustedApplications`],
      id: 'trusted_applications_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeTrustedApplications', 'readTrustedApplications']
    }, {
      api: [`${_constants.APP_ID}-readTrustedApplications`],
      id: 'trusted_applications_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readTrustedApplications']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.hostIsolationExceptions.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Host Isolation Exceptions access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.hostIsolationExceptions', {
    defaultMessage: 'Host Isolation Exceptions'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeHostIsolationExceptions`, `${_constants.APP_ID}-readHostIsolationExceptions`],
      id: 'host_isolation_exceptions_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeHostIsolationExceptions', 'readHostIsolationExceptions']
    }, {
      api: [`${_constants.APP_ID}-readHostIsolationExceptions`],
      id: 'host_isolation_exceptions_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readHostIsolationExceptions']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.blockList.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Blocklist access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.blockList', {
    defaultMessage: 'Blocklist'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeBlocklist`, `${_constants.APP_ID}-readBlocklist`],
      id: 'blocklist_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeBlocklist', 'readBlocklist']
    }, {
      api: [`${_constants.APP_ID}-readBlocklist`],
      id: 'blocklist_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readBlocklist']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.eventFilters.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Event Filters access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.eventFilters', {
    defaultMessage: 'Event Filters'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writeEventFilters`, `${_constants.APP_ID}-readEventFilters`],
      id: 'event_filters_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writeEventFilters', 'readEventFilters']
    }, {
      api: [`${_constants.APP_ID}-readEventFilters`],
      id: 'event_filters_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readEventFilters']
    }]
  }]
}, {
  requireAllSpaces: true,
  privilegesTooltip: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.policyManagement.privilegesTooltip', {
    defaultMessage: 'All Spaces is required for Policy Management access.'
  }),
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.subFeatures.policyManagement', {
    defaultMessage: 'Policy Management'
  }),
  privilegeGroups: [{
    groupType: 'mutually_exclusive',
    privileges: [{
      api: [`${_constants.APP_ID}-writePolicyManagement`, `${_constants.APP_ID}-readPolicyManagement`],
      id: 'policy_management_all',
      includeIn: 'none',
      name: 'All',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['writePolicyManagement', 'readPolicyManagement']
    }, {
      api: [`${_constants.APP_ID}-readPolicyManagement`],
      id: 'policy_management_read',
      includeIn: 'none',
      name: 'Read',
      savedObject: {
        all: [],
        read: []
      },
      ui: ['readPolicyManagement']
    }]
  }]
}, ...responseActionSubFeatures];
function getSubFeatures(experimentalFeatures) {
  let filteredSubFeatures = [];
  if (experimentalFeatures.endpointRbacEnabled) {
    filteredSubFeatures = subFeatures;
  } else if (experimentalFeatures.endpointRbacV1Enabled) {
    filteredSubFeatures = responseActionSubFeatures;
  }
  if (!experimentalFeatures.responseActionGetFileEnabled) {
    filteredSubFeatures = filteredSubFeatures.filter(subFeat => {
      return subFeat.name !== 'File Operations';
    });
  }
  return filteredSubFeatures;
}
const getKibanaPrivilegesFeaturePrivileges = (ruleTypes, experimentalFeatures) => ({
  id: _constants.SERVER_APP_ID,
  name: _i18n.i18n.translate('xpack.securitySolution.featureRegistry.linkSecuritySolutionTitle', {
    defaultMessage: 'Security'
  }),
  order: 1100,
  category: _server.DEFAULT_APP_CATEGORIES.security,
  app: [_constants.APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
  catalogue: [_constants.APP_ID],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: ruleTypes,
  privileges: {
    all: {
      app: [_constants.APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
      catalogue: [_constants.APP_ID],
      api: [_constants.APP_ID, 'lists-all', 'lists-read', 'lists-summary', 'rac', 'cloud-security-posture-all', 'cloud-security-posture-read'],
      savedObject: {
        all: ['alert', 'exception-list', 'exception-list-agnostic', _common.DATA_VIEW_SAVED_OBJECT_TYPE, ..._saved_objects.savedObjectTypes, CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE],
        read: []
      },
      alerting: {
        rule: {
          all: ruleTypes
        },
        alert: {
          all: ruleTypes
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'crud']
    },
    read: {
      app: [_constants.APP_ID, CLOUD_POSTURE_APP_ID, 'kibana'],
      catalogue: [_constants.APP_ID],
      api: [_constants.APP_ID, 'lists-read', 'rac', 'cloud-security-posture-read'],
      savedObject: {
        all: [],
        read: ['exception-list', 'exception-list-agnostic', _common.DATA_VIEW_SAVED_OBJECT_TYPE, ..._saved_objects.savedObjectTypes, CLOUD_POSTURE_SAVED_OBJECT_RULE_TYPE]
      },
      alerting: {
        rule: {
          read: ruleTypes
        },
        alert: {
          all: ruleTypes
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show']
    }
  },
  subFeatures: getSubFeatures(experimentalFeatures)
});
exports.getKibanaPrivilegesFeaturePrivileges = getKibanaPrivilegesFeaturePrivileges;