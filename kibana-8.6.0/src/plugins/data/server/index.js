"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DEFAULT_QUERY_LANGUAGE", {
  enumerable: true,
  get: function () {
    return _common.DEFAULT_QUERY_LANGUAGE;
  }
});
Object.defineProperty(exports, "DataView", {
  enumerable: true,
  get: function () {
    return _common.DataView;
  }
});
Object.defineProperty(exports, "DataViewsCommonService", {
  enumerable: true,
  get: function () {
    return _common.DataViewsService;
  }
});
Object.defineProperty(exports, "ES_FIELD_TYPES", {
  enumerable: true,
  get: function () {
    return _common.ES_FIELD_TYPES;
  }
});
Object.defineProperty(exports, "ES_SEARCH_STRATEGY", {
  enumerable: true,
  get: function () {
    return _common.ES_SEARCH_STRATEGY;
  }
});
Object.defineProperty(exports, "IndexPatternsFetcher", {
  enumerable: true,
  get: function () {
    return _data_views.IndexPatternsFetcher;
  }
});
Object.defineProperty(exports, "KBN_FIELD_TYPES", {
  enumerable: true,
  get: function () {
    return _common.KBN_FIELD_TYPES;
  }
});
Object.defineProperty(exports, "METRIC_TYPES", {
  enumerable: true,
  get: function () {
    return _common.METRIC_TYPES;
  }
});
Object.defineProperty(exports, "NoSearchIdInSessionError", {
  enumerable: true,
  get: function () {
    return _search.NoSearchIdInSessionError;
  }
});
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.DataServerPlugin;
  }
});
Object.defineProperty(exports, "SearchSessionService", {
  enumerable: true,
  get: function () {
    return _search.SearchSessionService;
  }
});
Object.defineProperty(exports, "UI_SETTINGS", {
  enumerable: true,
  get: function () {
    return _common.UI_SETTINGS;
  }
});
exports.exporters = exports.config = void 0;
Object.defineProperty(exports, "getCapabilitiesForRollupIndices", {
  enumerable: true,
  get: function () {
    return _data_views.getCapabilitiesForRollupIndices;
  }
});
Object.defineProperty(exports, "getEsQueryConfig", {
  enumerable: true,
  get: function () {
    return _common.getEsQueryConfig;
  }
});
Object.defineProperty(exports, "getRequestAbortedSignal", {
  enumerable: true,
  get: function () {
    return _lib.getRequestAbortedSignal;
  }
});
Object.defineProperty(exports, "getTime", {
  enumerable: true,
  get: function () {
    return _common.getTime;
  }
});
Object.defineProperty(exports, "parseInterval", {
  enumerable: true,
  get: function () {
    return _common.parseInterval;
  }
});
exports.plugin = plugin;
exports.search = void 0;
Object.defineProperty(exports, "shimHitsTotal", {
  enumerable: true,
  get: function () {
    return _search.shimHitsTotal;
  }
});
var _config = require("../config");
var _plugin = require("./plugin");
var _common = require("../common");
var _lib = require("./lib");
var _data_views = require("./data_views");
var _config_deprecations = require("./config_deprecations");
var _search = require("./search");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Exporters (CSV)
 */

const exporters = {
  datatableToCSV: _common.datatableToCSV,
  CSV_MIME_TYPE: _common.CSV_MIME_TYPE
};

/*
 * Index patterns:
 */
exports.exporters = exporters;
// Search namespace
const search = {
  aggs: {
    CidrMask: _common.CidrMask,
    dateHistogramInterval: _common.dateHistogramInterval,
    IpAddress: _common.IpAddress,
    parseInterval: _common.parseInterval,
    calcAutoIntervalLessThan: _common.calcAutoIntervalLessThan
  }
};

/**
 * Types to be shared externally
 * @public
 */
exports.search = search;
/**
 * Static code to be shared externally
 * @public
 */

function plugin(initializerContext) {
  return new _plugin.DataServerPlugin(initializerContext);
}
const config = {
  deprecations: _config_deprecations.configDeprecationProvider,
  exposeToBrowser: {
    search: true
  },
  schema: _config.configSchema
};
exports.config = config;