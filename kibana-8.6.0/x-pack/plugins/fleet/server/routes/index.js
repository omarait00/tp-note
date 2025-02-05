"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerAgentAPIRoutes", {
  enumerable: true,
  get: function () {
    return _agent.registerAPIRoutes;
  }
});
Object.defineProperty(exports, "registerAgentPolicyRoutes", {
  enumerable: true,
  get: function () {
    return _agent_policy.registerRoutes;
  }
});
Object.defineProperty(exports, "registerAppRoutes", {
  enumerable: true,
  get: function () {
    return _app.registerRoutes;
  }
});
Object.defineProperty(exports, "registerDataStreamRoutes", {
  enumerable: true,
  get: function () {
    return _data_streams.registerRoutes;
  }
});
Object.defineProperty(exports, "registerDownloadSourcesRoutes", {
  enumerable: true,
  get: function () {
    return _download_source.registerRoutes;
  }
});
Object.defineProperty(exports, "registerEPMRoutes", {
  enumerable: true,
  get: function () {
    return _epm.registerRoutes;
  }
});
Object.defineProperty(exports, "registerEnrollmentApiKeyRoutes", {
  enumerable: true,
  get: function () {
    return _enrollment_api_key.registerRoutes;
  }
});
Object.defineProperty(exports, "registerFleetServerHostRoutes", {
  enumerable: true,
  get: function () {
    return _fleet_server_policy_config.registerRoutes;
  }
});
Object.defineProperty(exports, "registerHealthCheckRoutes", {
  enumerable: true,
  get: function () {
    return _health_check.registerRoutes;
  }
});
Object.defineProperty(exports, "registerOutputRoutes", {
  enumerable: true,
  get: function () {
    return _output.registerRoutes;
  }
});
Object.defineProperty(exports, "registerPackagePolicyRoutes", {
  enumerable: true,
  get: function () {
    return _package_policy.registerRoutes;
  }
});
Object.defineProperty(exports, "registerPreconfigurationRoutes", {
  enumerable: true,
  get: function () {
    return _preconfiguration.registerRoutes;
  }
});
Object.defineProperty(exports, "registerSettingsRoutes", {
  enumerable: true,
  get: function () {
    return _settings.registerRoutes;
  }
});
Object.defineProperty(exports, "registerSetupRoutes", {
  enumerable: true,
  get: function () {
    return _setup.registerRoutes;
  }
});
var _agent_policy = require("./agent_policy");
var _package_policy = require("./package_policy");
var _data_streams = require("./data_streams");
var _epm = require("./epm");
var _setup = require("./setup");
var _agent = require("./agent");
var _enrollment_api_key = require("./enrollment_api_key");
var _output = require("./output");
var _settings = require("./settings");
var _app = require("./app");
var _preconfiguration = require("./preconfiguration");
var _download_source = require("./download_source");
var _health_check = require("./health_check");
var _fleet_server_policy_config = require("./fleet_server_policy_config");