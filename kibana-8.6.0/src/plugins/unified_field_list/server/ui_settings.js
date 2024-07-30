"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUiSettings = void 0;
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

const getUiSettings = () => ({
  [_common.FIELD_EXISTENCE_SETTING]: {
    name: _i18n.i18n.translate('unifiedFieldList.advancedSettings.useFieldExistenceSampling.title', {
      defaultMessage: 'Use field existence sampling'
    }),
    value: false,
    description: _i18n.i18n.translate('unifiedFieldList.advancedSettings.useFieldExistenceSampling.description', {
      defaultMessage: 'If enabled, document sampling is used to determine field existence (available or empty) for the Lens field list instead of relying on index mappings.'
    }),
    deprecation: {
      message: _i18n.i18n.translate('unifiedFieldList.advancedSettings.useFieldExistenceSampling.deprecation', {
        defaultMessage: 'This setting is deprecated and will not be supported as of 8.6.'
      }),
      docLinksKey: 'visualizationSettings'
    },
    category: ['visualization'],
    schema: _configSchema.schema.boolean()
  }
});
exports.getUiSettings = getUiSettings;