"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettingsConfig = exports.VisTypeGaugeServerPlugin = void 0;
var _i18n = require("@kbn/i18n");
var _configSchema = require("@kbn/config-schema");
var _common = require("../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const getUiSettingsConfig = () => ({
  [_common.LEGACY_GAUGE_CHARTS_LIBRARY]: {
    name: _i18n.i18n.translate('visTypeGauge.advancedSettings.visualization.legacyGaugeChartsLibrary.name', {
      defaultMessage: 'Gauge legacy charts library'
    }),
    requiresPageReload: true,
    value: true,
    description: _i18n.i18n.translate('visTypeGauge.advancedSettings.visualization.legacyGaugeChartsLibrary.description', {
      defaultMessage: 'Enables legacy charts library for gauge charts in visualize.'
    }),
    category: ['visualization'],
    schema: _configSchema.schema.boolean()
  }
});
exports.getUiSettingsConfig = getUiSettingsConfig;
class VisTypeGaugeServerPlugin {
  setup(core) {
    core.uiSettings.register(getUiSettingsConfig());
    return {};
  }
  start() {
    return {};
  }
}
exports.VisTypeGaugeServerPlugin = VisTypeGaugeServerPlugin;