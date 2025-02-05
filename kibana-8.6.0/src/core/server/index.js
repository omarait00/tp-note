"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "APP_WRAPPER_CLASS", {
  enumerable: true,
  get: function () {
    return _coreApplicationCommon.APP_WRAPPER_CLASS;
  }
});
Object.defineProperty(exports, "CoreKibanaRequest", {
  enumerable: true,
  get: function () {
    return _coreHttpRouterServerInternal.CoreKibanaRequest;
  }
});
Object.defineProperty(exports, "CspConfig", {
  enumerable: true,
  get: function () {
    return _coreHttpServerInternal.CspConfig;
  }
});
Object.defineProperty(exports, "DEFAULT_APP_CATEGORIES", {
  enumerable: true,
  get: function () {
    return _coreApplicationCommon.DEFAULT_APP_CATEGORIES;
  }
});
Object.defineProperty(exports, "ElasticsearchConfig", {
  enumerable: true,
  get: function () {
    return _coreElasticsearchServerInternal.ElasticsearchConfig;
  }
});
Object.defineProperty(exports, "EventLoopDelaysMonitor", {
  enumerable: true,
  get: function () {
    return _coreMetricsCollectorsServerInternal.EventLoopDelaysMonitor;
  }
});
Object.defineProperty(exports, "PluginType", {
  enumerable: true,
  get: function () {
    return _coreBaseCommon.PluginType;
  }
});
Object.defineProperty(exports, "SavedObjectTypeRegistry", {
  enumerable: true,
  get: function () {
    return _coreSavedObjectsBaseServerInternal.SavedObjectTypeRegistry;
  }
});
Object.defineProperty(exports, "SavedObjectsClient", {
  enumerable: true,
  get: function () {
    return _coreSavedObjectsApiServerInternal.SavedObjectsClient;
  }
});
Object.defineProperty(exports, "SavedObjectsErrorHelpers", {
  enumerable: true,
  get: function () {
    return _coreSavedObjectsUtilsServer.SavedObjectsErrorHelpers;
  }
});
Object.defineProperty(exports, "SavedObjectsUtils", {
  enumerable: true,
  get: function () {
    return _coreSavedObjectsUtilsServer.SavedObjectsUtils;
  }
});
Object.defineProperty(exports, "ServiceStatusLevels", {
  enumerable: true,
  get: function () {
    return _coreStatusCommon.ServiceStatusLevels;
  }
});
Object.defineProperty(exports, "bootstrap", {
  enumerable: true,
  get: function () {
    return _coreRootServerInternal.bootstrap;
  }
});
exports.config = void 0;
Object.defineProperty(exports, "kibanaResponseFactory", {
  enumerable: true,
  get: function () {
    return _coreHttpRouterServerInternal.kibanaResponseFactory;
  }
});
Object.defineProperty(exports, "mergeSavedObjectMigrationMaps", {
  enumerable: true,
  get: function () {
    return _coreSavedObjectsUtilsServer.mergeSavedObjectMigrationMaps;
  }
});
Object.defineProperty(exports, "pollEsNodesVersion", {
  enumerable: true,
  get: function () {
    return _coreElasticsearchServerInternal.pollEsNodesVersion;
  }
});
Object.defineProperty(exports, "validBodyOutput", {
  enumerable: true,
  get: function () {
    return _coreHttpServer.validBodyOutput;
  }
});
var _coreLoggingServerInternal = require("@kbn/core-logging-server-internal");
var _coreElasticsearchServerInternal = require("@kbn/core-elasticsearch-server-internal");
var _coreRootServerInternal = require("@kbn/core-root-server-internal");
var _coreHttpServerInternal = require("@kbn/core-http-server-internal");
var _coreHttpRouterServerInternal = require("@kbn/core-http-router-server-internal");
var _coreHttpServer = require("@kbn/core-http-server");
var _coreBaseCommon = require("@kbn/core-base-common");
var _coreSavedObjectsUtilsServer = require("@kbn/core-saved-objects-utils-server");
var _coreSavedObjectsBaseServerInternal = require("@kbn/core-saved-objects-base-server-internal");
var _coreSavedObjectsApiServerInternal = require("@kbn/core-saved-objects-api-server-internal");
var _coreMetricsCollectorsServerInternal = require("@kbn/core-metrics-collectors-server-internal");
var _coreApplicationCommon = require("@kbn/core-application-common");
var _coreStatusCommon = require("@kbn/core-status-common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * The Kibana Core APIs for server-side plugins.
 *
 * A plugin requires a `kibana.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */

/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
const config = {
  elasticsearch: {
    schema: _coreElasticsearchServerInternal.configSchema
  },
  logging: {
    appenders: _coreLoggingServerInternal.appendersSchema
  }
};

/**
 * Public version of RequestHandler, default-scoped to {@link RequestHandlerContext}
 * See [@link RequestHandler}
 * @public
 */
exports.config = config;