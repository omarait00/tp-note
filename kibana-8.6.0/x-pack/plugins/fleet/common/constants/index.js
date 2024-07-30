"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  SO_SEARCH_LIMIT: true,
  ES_SEARCH_LIMIT: true,
  FLEET_SERVER_INDICES_VERSION: true,
  FLEET_SERVER_ARTIFACTS_INDEX: true,
  FLEET_SERVER_SERVERS_INDEX: true,
  FLEET_SERVER_INDICES: true,
  INTEGRATIONS_PLUGIN_ID: true,
  PLUGIN_ID: true
};
exports.FLEET_SERVER_SERVERS_INDEX = exports.FLEET_SERVER_INDICES_VERSION = exports.FLEET_SERVER_INDICES = exports.FLEET_SERVER_ARTIFACTS_INDEX = exports.ES_SEARCH_LIMIT = void 0;
Object.defineProperty(exports, "INTEGRATIONS_PLUGIN_ID", {
  enumerable: true,
  get: function () {
    return _plugin.INTEGRATIONS_PLUGIN_ID;
  }
});
Object.defineProperty(exports, "PLUGIN_ID", {
  enumerable: true,
  get: function () {
    return _plugin.PLUGIN_ID;
  }
});
exports.SO_SEARCH_LIMIT = void 0;
var _plugin = require("./plugin");
var _routes = require("./routes");
Object.keys(_routes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _routes[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _routes[key];
    }
  });
});
var _agent = require("./agent");
Object.keys(_agent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _agent[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _agent[key];
    }
  });
});
var _agent_policy = require("./agent_policy");
Object.keys(_agent_policy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _agent_policy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _agent_policy[key];
    }
  });
});
var _package_policy = require("./package_policy");
Object.keys(_package_policy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _package_policy[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _package_policy[key];
    }
  });
});
var _epm = require("./epm");
Object.keys(_epm).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _epm[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _epm[key];
    }
  });
});
var _output = require("./output");
Object.keys(_output).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _output[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _output[key];
    }
  });
});
var _enrollment_api_key = require("./enrollment_api_key");
Object.keys(_enrollment_api_key).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _enrollment_api_key[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _enrollment_api_key[key];
    }
  });
});
var _settings = require("./settings");
Object.keys(_settings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _settings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _settings[key];
    }
  });
});
var _preconfiguration = require("./preconfiguration");
Object.keys(_preconfiguration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _preconfiguration[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _preconfiguration[key];
    }
  });
});
var _download_source = require("./download_source");
Object.keys(_download_source).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _download_source[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _download_source[key];
    }
  });
});
var _fleet_server_policy_config = require("./fleet_server_policy_config");
Object.keys(_fleet_server_policy_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fleet_server_policy_config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fleet_server_policy_config[key];
    }
  });
});
var _authz = require("./authz");
Object.keys(_authz).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authz[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authz[key];
    }
  });
});
var _file_storage = require("./file_storage");
Object.keys(_file_storage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _file_storage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _file_storage[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// TODO: This is the default `index.max_result_window` ES setting, which dictates
// the maximum amount of results allowed to be returned from a search. It's possible
// for the actual setting to differ from the default. Can we retrieve the real
// setting in the future?
const SO_SEARCH_LIMIT = 10000;
exports.SO_SEARCH_LIMIT = SO_SEARCH_LIMIT;
const ES_SEARCH_LIMIT = 10000;
exports.ES_SEARCH_LIMIT = ES_SEARCH_LIMIT;
const FLEET_SERVER_INDICES_VERSION = 1;
exports.FLEET_SERVER_INDICES_VERSION = FLEET_SERVER_INDICES_VERSION;
const FLEET_SERVER_ARTIFACTS_INDEX = '.fleet-artifacts';
exports.FLEET_SERVER_ARTIFACTS_INDEX = FLEET_SERVER_ARTIFACTS_INDEX;
const FLEET_SERVER_SERVERS_INDEX = '.fleet-servers';
exports.FLEET_SERVER_SERVERS_INDEX = FLEET_SERVER_SERVERS_INDEX;
const FLEET_SERVER_INDICES = ['.fleet-actions', '.fleet-actions-results', '.fleet-agents', FLEET_SERVER_ARTIFACTS_INDEX, '.fleet-enrollment-api-keys', '.fleet-policies', '.fleet-policies-leader', FLEET_SERVER_SERVERS_INDEX];
exports.FLEET_SERVER_INDICES = FLEET_SERVER_INDICES;