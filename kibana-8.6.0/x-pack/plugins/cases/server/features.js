"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCasesKibanaFeature = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
var _constants = require("../common/constants");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The order of appearance in the feature privilege page
 * under the management section. Cases should be under
 * the Actions and Connectors feature
 */

const FEATURE_ORDER = 3100;
const getCasesKibanaFeature = () => {
  const capabilities = (0, _common.createUICapabilities)();
  return {
    id: _constants.FEATURE_ID,
    name: _i18n.i18n.translate('xpack.cases.features.casesFeatureName', {
      defaultMessage: 'Cases'
    }),
    category: _server.DEFAULT_APP_CATEGORIES.management,
    app: [],
    order: FEATURE_ORDER,
    management: {
      insightsAndAlerting: [_constants.APP_ID]
    },
    cases: [_constants.APP_ID],
    privileges: {
      all: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        cases: {
          create: [_constants.APP_ID],
          read: [_constants.APP_ID],
          update: [_constants.APP_ID],
          push: [_constants.APP_ID]
        },
        management: {
          insightsAndAlerting: [_constants.APP_ID]
        },
        savedObject: {
          all: [],
          read: []
        },
        ui: capabilities.all
      },
      read: {
        api: ['casesSuggestUserProfiles', 'bulkGetUserProfiles'],
        cases: {
          read: [_constants.APP_ID]
        },
        management: {
          insightsAndAlerting: [_constants.APP_ID]
        },
        savedObject: {
          all: [],
          read: []
        },
        ui: capabilities.read
      }
    },
    subFeatures: [{
      name: _i18n.i18n.translate('xpack.cases.features.deleteSubFeatureName', {
        defaultMessage: 'Delete'
      }),
      privilegeGroups: [{
        groupType: 'independent',
        privileges: [{
          api: [],
          id: 'cases_delete',
          name: _i18n.i18n.translate('xpack.cases.features.deleteSubFeatureDetails', {
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
          ui: capabilities.delete
        }]
      }]
    }]
  };
};
exports.getCasesKibanaFeature = getCasesKibanaFeature;