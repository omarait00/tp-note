"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerFeatures = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../../src/core/server");
var _types = require("../../common/types");
var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerFeatures = features => {
  features.registerKibanaFeature({
    id: _common.PLUGIN_ID,
    name: _i18n.i18n.translate('xpack.osquery.features.osqueryFeatureName', {
      defaultMessage: 'Osquery'
    }),
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: [_common.PLUGIN_ID, 'kibana'],
    catalogue: [_common.PLUGIN_ID],
    order: 2300,
    privileges: {
      all: {
        api: [`${_common.PLUGIN_ID}-read`, `${_common.PLUGIN_ID}-write`],
        app: [_common.PLUGIN_ID, 'kibana'],
        catalogue: [_common.PLUGIN_ID],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['read', 'write']
      },
      read: {
        api: [`${_common.PLUGIN_ID}-read`],
        app: [_common.PLUGIN_ID, 'kibana'],
        catalogue: [_common.PLUGIN_ID],
        savedObject: {
          all: [],
          read: []
        },
        ui: ['read']
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.osquery.features.liveQueriesSubFeatureName', {
        defaultMessage: 'Live queries'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writeLiveQueries`, `${_common.PLUGIN_ID}-readLiveQueries`],
          id: 'live_queries_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['writeLiveQueries', 'readLiveQueries']
        }, {
          api: [`${_common.PLUGIN_ID}-readLiveQueries`],
          id: 'live_queries_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['readLiveQueries']
        }]
      }, {
        groupType: 'independent',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-runSavedQueries`],
          id: 'run_saved_queries',
          name: _i18n.i18n.translate('xpack.osquery.features.runSavedQueriesPrivilegeName', {
            defaultMessage: 'Run Saved queries'
          }),
          includeIn: 'all',
          savedObject: {
            all: [],
            read: []
          },
          ui: ['runSavedQueries']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.osquery.features.savedQueriesSubFeatureName', {
        defaultMessage: 'Saved queries'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writeSavedQueries`, `${_common.PLUGIN_ID}-readSavedQueries`],
          id: 'saved_queries_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [_types.savedQuerySavedObjectType],
            read: ['tag']
          },
          ui: ['writeSavedQueries', 'readSavedQueries']
        }, {
          api: [`${_common.PLUGIN_ID}-readSavedQueries`],
          id: 'saved_queries_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: [_types.savedQuerySavedObjectType, 'tag']
          },
          ui: ['readSavedQueries']
        }]
      }]
    }, {
      name: _i18n.i18n.translate('xpack.osquery.features.packsSubFeatureName', {
        defaultMessage: 'Packs'
      }),
      privilegeGroups: [{
        groupType: 'mutually_exclusive',
        privileges: [{
          api: [`${_common.PLUGIN_ID}-writePacks`, `${_common.PLUGIN_ID}-readPacks`],
          id: 'packs_all',
          includeIn: 'all',
          name: 'All',
          savedObject: {
            all: [_types.packSavedObjectType, _types.packAssetSavedObjectType],
            read: ['tag']
          },
          ui: ['writePacks', 'readPacks']
        }, {
          api: [`${_common.PLUGIN_ID}-readPacks`],
          id: 'packs_read',
          includeIn: 'read',
          name: 'Read',
          savedObject: {
            all: [],
            read: [_types.packSavedObjectType, 'tag']
          },
          ui: ['readPacks']
        }]
      }]
    }]
  });
};
exports.registerFeatures = registerFeatures;