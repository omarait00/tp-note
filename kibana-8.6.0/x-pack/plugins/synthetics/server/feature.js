"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uptimeFeature = void 0;
var _server = require("../../../../src/core/server");
var _private_locations = require("../common/saved_objects/private_locations");
var _plugin = require("../common/constants/plugin");
var _alerts = require("../common/constants/alerts");
var _uptime_settings = require("./legacy_uptime/lib/saved_objects/uptime_settings");
var _synthetics_monitor = require("./legacy_uptime/lib/saved_objects/synthetics_monitor");
var _service_api_key = require("./legacy_uptime/lib/saved_objects/service_api_key");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const uptimeFeature = {
  id: _plugin.PLUGIN.ID,
  name: _plugin.PLUGIN.NAME,
  order: 1000,
  category: _server.DEFAULT_APP_CATEGORIES.observability,
  app: ['uptime', 'kibana', 'synthetics'],
  catalogue: ['uptime'],
  management: {
    insightsAndAlerting: ['triggersActions']
  },
  alerting: _alerts.UPTIME_RULE_TYPES,
  privileges: {
    all: {
      app: ['uptime', 'kibana', 'synthetics'],
      catalogue: ['uptime'],
      api: ['uptime-read', 'uptime-write', 'lists-all'],
      savedObject: {
        all: [_uptime_settings.umDynamicSettings.name, _synthetics_monitor.syntheticsMonitorType, _service_api_key.syntheticsApiKeyObjectType, _private_locations.privateLocationsSavedObjectName],
        read: []
      },
      alerting: {
        rule: {
          all: _alerts.UPTIME_RULE_TYPES
        },
        alert: {
          all: _alerts.UPTIME_RULE_TYPES
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['save', 'configureSettings', 'show', 'alerting:save']
    },
    read: {
      app: ['uptime', 'kibana', 'synthetics'],
      catalogue: ['uptime'],
      api: ['uptime-read', 'lists-read'],
      savedObject: {
        all: [],
        read: [_uptime_settings.umDynamicSettings.name, _synthetics_monitor.syntheticsMonitorType, _service_api_key.syntheticsApiKeyObjectType, _private_locations.privateLocationsSavedObjectName]
      },
      alerting: {
        rule: {
          read: _alerts.UPTIME_RULE_TYPES
        },
        alert: {
          read: _alerts.UPTIME_RULE_TYPES
        }
      },
      management: {
        insightsAndAlerting: ['triggersActions']
      },
      ui: ['show', 'alerting:save']
    }
  }
};
exports.uptimeFeature = uptimeFeature;