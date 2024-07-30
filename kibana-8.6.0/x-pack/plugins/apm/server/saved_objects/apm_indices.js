"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apmIndices = void 0;
var _i18n = require("@kbn/i18n");
var _update_apm_oss_index_paths = require("./migrations/update_apm_oss_index_paths");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const apmIndices = {
  name: 'apm-indices',
  hidden: false,
  namespaceType: 'single',
  mappings: {
    dynamic: false,
    properties: {} // several fields exist, but we don't need to search or aggregate on them, so we exclude them from the mappings
  },

  management: {
    importableAndExportable: true,
    icon: 'apmApp',
    getTitle: () => _i18n.i18n.translate('xpack.apm.apmSettings.index', {
      defaultMessage: 'APM Settings - Index'
    })
  },
  migrations: {
    '7.16.0': doc => {
      const attributes = (0, _update_apm_oss_index_paths.updateApmOssIndexPaths)(doc.attributes);
      return {
        ...doc,
        attributes
      };
    },
    '8.2.0': doc => {
      // Any future changes on this structure should be also tested on migrateLegacyAPMIndicesToSpaceAware
      return {
        ...doc,
        attributes: {
          apmIndices: doc.attributes
        }
      };
    }
  }
};
exports.apmIndices = apmIndices;