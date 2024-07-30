"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BUILT_IN_ALERTS_FEATURE = void 0;
var _i18n = require("@kbn/i18n");
var _server = require("../../../../src/core/server");
var _common = require("../../transform/common");
var _rule_type = require("./rule_types/index_threshold/rule_type");
var _alert_type = require("./rule_types/geo_containment/alert_type");
var _constants = require("./rule_types/es_query/constants");
var _common2 = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TransformHealth = _common.TRANSFORM_RULE_TYPE.TRANSFORM_HEALTH;
const BUILT_IN_ALERTS_FEATURE = {
  id: _common2.STACK_ALERTS_FEATURE_ID,
  name: _i18n.i18n.translate('xpack.stackAlerts.featureRegistry.actionsFeatureName', {
    defaultMessage: 'Stack Rules'
  }),
  app: [],
  category: _server.DEFAULT_APP_CATEGORIES.management,
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: [_rule_type.ID, _alert_type.GEO_CONTAINMENT_ID, _constants.ES_QUERY_ID, TransformHealth],
  privileges: {
    all: {
      app: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      alerting: {
        rule: {
          all: [_rule_type.ID, _alert_type.GEO_CONTAINMENT_ID, _constants.ES_QUERY_ID, TransformHealth]
        },
        alert: {
          all: [_rule_type.ID, _alert_type.GEO_CONTAINMENT_ID, _constants.ES_QUERY_ID, TransformHealth]
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      api: [],
      ui: []
    },
    read: {
      app: [],
      catalogue: [],
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      alerting: {
        rule: {
          read: [_rule_type.ID, _alert_type.GEO_CONTAINMENT_ID, _constants.ES_QUERY_ID, TransformHealth]
        },
        alert: {
          read: [_rule_type.ID, _alert_type.GEO_CONTAINMENT_ID, _constants.ES_QUERY_ID, TransformHealth]
        }
      },
      savedObject: {
        all: [],
        read: []
      },
      api: [],
      ui: []
    }
  }
};
exports.BUILT_IN_ALERTS_FEATURE = BUILT_IN_ALERTS_FEATURE;