"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildOSSFeatures = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildOSSFeatures = ({
  savedObjectTypes,
  includeReporting
}) => {
  return [{
    id: 'discover',
    name: _i18n.i18n.translate('xpack.features.discoverFeatureName', {
      defaultMessage: 'Discover'
    }),
    management: {
      kibana: ['search_sessions'],
      ...(includeReporting ? {
        insightsAndAlerting: ['reporting']
      } : {})
    },
    order: 100,
    category: _server.DEFAULT_APP_CATEGORIES.kibana,
    app: ['discover', 'kibana'],
    catalogue: ['discover'],
    alerting: ['.es-query'],
    privileges: {
      all: {
        app: ['discover', 'kibana'],
        api: ['fileUpload:analyzeFile'],
        catalogue: ['discover'],
        savedObject: {
          all: ['search', 'query'],
          read: ['index-pattern']
        },
        ui: ['show', 'save', 'saveQuery'],
        alerting: {
          rule: {
            all: ['.es-query']
          },
          alert: {
            all: ['.es-query']
          }
        }
      },
      read: {
        app: ['discover', 'kibana'],
        catalogue: ['discover'],
        savedObject: {
          all: [],
          read: ['index-pattern', 'search', 'query']
        },
        ui: ['show'],
        alerting: {
          rule: {
            all: ['.es-query']
          },
          alert: {
            all: ['.es-query']
          }
        }
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.features.ossFeatures.discoverShortUrlSubFeatureName', {
        defaultMessage: 'Short URLs'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          id: 'url_create',
          name: _i18n.i18n.translate('xpack.features.ossFeatures.discoverCreateShortUrlPrivilegeName', {
            defaultMessage: 'Create Short URLs'
          }),
          includeIn: 'all',
          savedObject: {
            all: ['url'],
            read: []
          },
          ui: ['createShortUrl']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.features.ossFeatures.discoverSearchSessionsFeatureName', {
        defaultMessage: 'Store Search Sessions'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          id: 'store_search_session',
          name: _i18n.i18n.translate('xpack.features.ossFeatures.discoverStoreSearchSessionsPrivilegeName', {
            defaultMessage: 'Store Search Sessions'
          }),
          includeIn: 'all',
          savedObject: {
            all: ['search-session'],
            read: []
          },
          ui: ['storeSearchSession'],
          management: {
            kibana: ['search_sessions']
          },
          api: ['store_search_session']
        }]
      }]
    }, ...(includeReporting ? [reportingFeatures.discoverReporting] : [])]
  }, {
    id: 'visualize',
    name: _i18n.i18n.translate('xpack.features.visualizeFeatureName', {
      defaultMessage: 'Visualize Library'
    }),
    management: {
      ...(includeReporting ? {
        insightsAndAlerting: ['reporting']
      } : {})
    },
    order: 700,
    category: _server.DEFAULT_APP_CATEGORIES.kibana,
    app: ['visualize', 'lens', 'kibana'],
    catalogue: ['visualize'],
    privileges: {
      all: {
        app: ['visualize', 'lens', 'kibana'],
        catalogue: ['visualize'],
        savedObject: {
          all: ['visualization', 'query', 'lens'],
          read: ['index-pattern', 'search', 'tag']
        },
        ui: ['show', 'delete', 'save', 'saveQuery']
      },
      read: {
        app: ['visualize', 'lens', 'kibana'],
        catalogue: ['visualize'],
        savedObject: {
          all: [],
          read: ['index-pattern', 'search', 'visualization', 'query', 'lens', 'tag']
        },
        ui: ['show']
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.features.ossFeatures.visualizeShortUrlSubFeatureName', {
        defaultMessage: 'Short URLs'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          id: 'url_create',
          name: _i18n.i18n.translate('xpack.features.ossFeatures.visualizeCreateShortUrlPrivilegeName', {
            defaultMessage: 'Create Short URLs'
          }),
          includeIn: 'all',
          savedObject: {
            all: ['url'],
            read: []
          },
          ui: ['createShortUrl']
        }]
      }]
    }, ...(includeReporting ? [reportingFeatures.visualizeReporting] : [])]
  }, {
    id: 'dashboard',
    name: _i18n.i18n.translate('xpack.features.dashboardFeatureName', {
      defaultMessage: 'Dashboard'
    }),
    management: {
      kibana: ['search_sessions'],
      ...(includeReporting ? {
        insightsAndAlerting: ['reporting']
      } : {})
    },
    order: 200,
    category: _server.DEFAULT_APP_CATEGORIES.kibana,
    app: ['dashboards', 'kibana'],
    catalogue: ['dashboard'],
    privileges: {
      all: {
        app: ['dashboards', 'kibana'],
        catalogue: ['dashboard'],
        savedObject: {
          all: ['dashboard', 'query'],
          read: ['index-pattern', 'search', 'visualization', 'canvas-workpad', 'lens', 'map', 'tag']
        },
        ui: ['createNew', 'show', 'showWriteControls', 'saveQuery']
      },
      read: {
        app: ['dashboards', 'kibana'],
        catalogue: ['dashboard'],
        savedObject: {
          all: [],
          read: ['index-pattern', 'search', 'visualization', 'canvas-workpad', 'lens', 'map', 'dashboard', 'query', 'tag']
        },
        ui: ['show']
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.features.ossFeatures.dashboardShortUrlSubFeatureName', {
        defaultMessage: 'Short URLs'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          id: 'url_create',
          name: _i18n.i18n.translate('xpack.features.ossFeatures.dashboardCreateShortUrlPrivilegeName', {
            defaultMessage: 'Create Short URLs'
          }),
          includeIn: 'all',
          savedObject: {
            all: ['url'],
            read: []
          },
          ui: ['createShortUrl']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.features.ossFeatures.dashboardSearchSessionsFeatureName', {
        defaultMessage: 'Store Search Sessions'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          id: 'store_search_session',
          name: _i18n.i18n.translate('xpack.features.ossFeatures.dashboardStoreSearchSessionsPrivilegeName', {
            defaultMessage: 'Store Search Sessions'
          }),
          includeIn: 'all',
          savedObject: {
            all: ['search-session'],
            read: []
          },
          ui: ['storeSearchSession'],
          management: {
            kibana: ['search_sessions']
          },
          api: ['store_search_session']
        }]
      }]
    }, ...(includeReporting ? [reportingFeatures.dashboardReporting] : [])]
  }, {
    id: 'dev_tools',
    name: _i18n.i18n.translate('xpack.features.devToolsFeatureName', {
      defaultMessage: 'Dev Tools'
    }),
    order: 1300,
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: ['dev_tools', 'kibana'],
    catalogue: ['console', 'searchprofiler', 'grokdebugger'],
    privileges: {
      all: {
        app: ['dev_tools', 'kibana'],
        catalogue: ['console', 'searchprofiler', 'grokdebugger'],
        api: ['console'],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['show', 'save']
      },
      read: {
        app: ['dev_tools', 'kibana'],
        catalogue: ['console', 'searchprofiler', 'grokdebugger'],
        api: ['console'],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['show']
      }
    },
    privilegesTooltip: _i18n.i18n.translate('xpack.features.devToolsPrivilegesTooltip', {
      defaultMessage: 'User should also be granted the appropriate Elasticsearch cluster and index privileges'
    })
  }, {
    id: 'advancedSettings',
    name: _i18n.i18n.translate('xpack.features.advancedSettingsFeatureName', {
      defaultMessage: 'Advanced Settings'
    }),
    order: 1500,
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: ['kibana'],
    catalogue: ['advanced_settings'],
    management: {
      kibana: ['settings']
    },
    privileges: {
      all: {
        app: ['kibana'],
        catalogue: ['advanced_settings'],
        management: {
          kibana: ['settings']
        },
        savedObject: {
          all: ['config'],
          read: []
        },
        ui: ['save']
      },
      read: {
        app: ['kibana'],
        catalogue: ['advanced_settings'],
        management: {
          kibana: ['settings']
        },
        savedObject: {
          all: [],
          read: []
        },
        ui: []
      }
    }
  }, {
    id: 'indexPatterns',
    name: _i18n.i18n.translate('xpack.features.dataViewFeatureName', {
      defaultMessage: 'Data View Management'
    }),
    order: 1600,
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: ['kibana'],
    catalogue: ['indexPatterns'],
    management: {
      kibana: ['indexPatterns']
    },
    privileges: {
      all: {
        app: ['kibana'],
        catalogue: ['indexPatterns'],
        management: {
          kibana: ['indexPatterns']
        },
        savedObject: {
          all: ['index-pattern'],
          read: []
        },
        ui: ['save']
      },
      read: {
        app: ['kibana'],
        catalogue: ['indexPatterns'],
        management: {
          kibana: ['indexPatterns']
        },
        savedObject: {
          all: [],
          read: ['index-pattern']
        },
        ui: []
      }
    }
  }, {
    id: 'savedObjectsManagement',
    name: _i18n.i18n.translate('xpack.features.savedObjectsManagementFeatureName', {
      defaultMessage: 'Saved Objects Management'
    }),
    order: 1700,
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: ['kibana'],
    catalogue: ['saved_objects'],
    management: {
      kibana: ['objects']
    },
    privileges: {
      all: {
        app: ['kibana'],
        catalogue: ['saved_objects'],
        management: {
          kibana: ['objects']
        },
        api: ['copySavedObjectsToSpaces'],
        savedObject: {
          all: [...savedObjectTypes],
          read: []
        },
        ui: ['read', 'edit', 'delete', 'copyIntoSpace', 'shareIntoSpace']
      },
      read: {
        app: ['kibana'],
        catalogue: ['saved_objects'],
        management: {
          kibana: ['objects']
        },
        api: ['copySavedObjectsToSpaces'],
        savedObject: {
          all: [],
          read: [...savedObjectTypes]
        },
        ui: ['read']
      }
    }
  }];
};
exports.buildOSSFeatures = buildOSSFeatures;
const reportingPrivilegeGroupName = _i18n.i18n.translate('xpack.features.ossFeatures.reporting.reportingTitle', {
  defaultMessage: 'Reporting'
});
const reportingFeatures = {
  discoverReporting: {
    name: reportingPrivilegeGroupName,
    privilegeGroups: [{
      groupType: 'independent',
      privileges: [{
        id: 'generate_report',
        name: _i18n.i18n.translate('xpack.features.ossFeatures.reporting.discoverGenerateCSV', {
          defaultMessage: 'Generate CSV reports'
        }),
        includeIn: 'all',
        savedObject: {
          all: [],
          read: []
        },
        management: {
          insightsAndAlerting: ['reporting']
        },
        api: ['generateReport'],
        ui: ['generateCsv']
      }]
    }]
  },
  dashboardReporting: {
    name: reportingPrivilegeGroupName,
    privilegeGroups: [{
      groupType: 'independent',
      privileges: [{
        id: 'generate_report',
        name: _i18n.i18n.translate('xpack.features.ossFeatures.reporting.dashboardGenerateScreenshot', {
          defaultMessage: 'Generate PDF or PNG reports'
        }),
        includeIn: 'all',
        minimumLicense: 'gold',
        savedObject: {
          all: [],
          read: []
        },
        management: {
          insightsAndAlerting: ['reporting']
        },
        api: ['generateReport'],
        ui: ['generateScreenshot']
      }, {
        id: 'download_csv_report',
        name: _i18n.i18n.translate('xpack.features.ossFeatures.reporting.dashboardDownloadCSV', {
          defaultMessage: 'Download CSV reports from Saved Search panels'
        }),
        includeIn: 'all',
        savedObject: {
          all: [],
          read: []
        },
        management: {
          insightsAndAlerting: ['reporting']
        },
        api: ['downloadCsv'],
        ui: ['downloadCsv']
      }]
    }]
  },
  visualizeReporting: {
    name: reportingPrivilegeGroupName,
    privilegeGroups: [{
      groupType: 'independent',
      privileges: [{
        id: 'generate_report',
        name: _i18n.i18n.translate('xpack.features.ossFeatures.reporting.visualizeGenerateScreenshot', {
          defaultMessage: 'Generate PDF or PNG reports'
        }),
        includeIn: 'all',
        minimumLicense: 'gold',
        savedObject: {
          all: [],
          read: []
        },
        management: {
          insightsAndAlerting: ['reporting']
        },
        api: ['generateReport'],
        ui: ['generateScreenshot']
      }]
    }]
  }
};