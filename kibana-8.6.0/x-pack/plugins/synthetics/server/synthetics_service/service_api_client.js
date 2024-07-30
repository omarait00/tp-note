"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ServiceAPIClient = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _axios = _interopRequireDefault(require("axios"));
var _rxjs = require("rxjs");
var _operators = require("rxjs/operators");
var https = _interopRequireWildcard(require("https"));
var _serverHttpTools = require("@kbn/server-http-tools");
var _monitor_upgrade_sender = require("../routes/telemetry/monitor_upgrade_sender");
var _convert_to_data_stream = require("./formatters/convert_to_data_stream");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const TEST_SERVICE_USERNAME = 'localKibanaIntegrationTestsUser';
class ServiceAPIClient {
  constructor(logger, config, server) {
    (0, _defineProperty2.default)(this, "username", void 0);
    (0, _defineProperty2.default)(this, "authorization", void 0);
    (0, _defineProperty2.default)(this, "locations", void 0);
    (0, _defineProperty2.default)(this, "logger", void 0);
    (0, _defineProperty2.default)(this, "config", void 0);
    (0, _defineProperty2.default)(this, "stackVersion", void 0);
    (0, _defineProperty2.default)(this, "server", void 0);
    this.config = config;
    const {
      username,
      password
    } = config !== null && config !== void 0 ? config : {};
    this.username = username;
    this.stackVersion = server.stackVersion;
    if (username && password) {
      this.authorization = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    } else {
      this.authorization = '';
    }
    this.logger = logger;
    this.locations = [];
    this.server = server;
  }
  getHttpsAgent(targetUrl) {
    var _this$config;
    const parsedTargetUrl = new URL(targetUrl);
    const rejectUnauthorized = parsedTargetUrl.hostname !== 'localhost' || !this.server.isDev;
    const baseHttpsAgent = new https.Agent({
      rejectUnauthorized
    });
    const config = (_this$config = this.config) !== null && _this$config !== void 0 ? _this$config : {};

    // If using basic-auth, ignore certificate configs
    if (this.authorization) return baseHttpsAgent;
    if (config.tls && config.tls.certificate && config.tls.key) {
      const tlsConfig = new _serverHttpTools.SslConfig(config.tls);
      return new https.Agent({
        rejectUnauthorized,
        cert: tlsConfig.certificate,
        key: tlsConfig.key
      });
    }
    return baseHttpsAgent;
  }
  async post(data) {
    return this.callAPI('PUT', data);
  }
  async put(data) {
    return this.callAPI('PUT', data);
  }
  async delete(data) {
    return this.callAPI('DELETE', data);
  }
  async runOnce(data) {
    return this.callAPI('POST', {
      ...data,
      runOnce: true
    });
  }
  addVersionHeader(req) {
    req.headers = {
      ...req.headers,
      'x-kibana-version': this.stackVersion
    };
    return req;
  }
  async checkAccountAccessStatus() {
    if (this.authorization) {
      // in case username/password is provided, we assume it's always allowed
      return {
        allowed: true,
        signupUrl: null
      };
    }
    if (this.locations.length > 0) {
      // get a url from a random location
      const url = this.locations[Math.floor(Math.random() * this.locations.length)].url;

      /* url is required for service locations, but omitted for private locations.
      /* this.locations is only service locations */
      const httpsAgent = this.getHttpsAgent(url);
      if (httpsAgent) {
        try {
          const {
            data
          } = await (0, _axios.default)(this.addVersionHeader({
            method: 'GET',
            url: url + '/allowed',
            httpsAgent
          }));
          const {
            allowed,
            signupUrl
          } = data;
          return {
            allowed,
            signupUrl
          };
        } catch (e) {
          this.logger.error(e);
        }
      }
    }
    return {
      allowed: false,
      signupUrl: null
    };
  }
  async callAPI(method, {
    monitors: allMonitors,
    output,
    runOnce,
    isEdit
  }) {
    if (this.username === TEST_SERVICE_USERNAME) {
      // we don't want to call service while local integration tests are running
      return;
    }
    const callServiceEndpoint = (monitors, url) => {
      // don't need to pass locations to heartbeat
      const monitorsStreams = monitors.map(({
        locations,
        ...rest
      }) => (0, _convert_to_data_stream.convertToDataStreamFormat)(rest));
      return (0, _axios.default)(this.addVersionHeader({
        method,
        url: url + (runOnce ? '/run' : '/monitors'),
        data: {
          monitors: monitorsStreams,
          output,
          stack_version: this.stackVersion,
          is_edit: isEdit
        },
        headers: this.authorization ? {
          Authorization: this.authorization
        } : undefined,
        httpsAgent: this.getHttpsAgent(url)
      }));
    };
    const pushErrors = [];
    const promises = [];
    this.locations.forEach(({
      id,
      url
    }) => {
      const locMonitors = allMonitors.filter(({
        locations
      }) => locations === null || locations === void 0 ? void 0 : locations.find(loc => loc.id === id && loc.isServiceManaged));
      if (locMonitors.length > 0) {
        promises.push((0, _rxjs.from)(callServiceEndpoint(locMonitors, url)).pipe((0, _operators.tap)(result => {
          this.logger.debug(result.data);
          this.logger.debug(`Successfully called service with method ${method} with ${allMonitors.length} monitors `);
        }), (0, _operators.catchError)(err => {
          var _err$response, _err$response$data$re, _err$response2, _err$response2$data, _err$response3, _err$response3$data, _err$response4, _err$response4$data;
          pushErrors.push({
            locationId: id,
            error: (_err$response = err.response) === null || _err$response === void 0 ? void 0 : _err$response.data
          });
          const reason = (_err$response$data$re = (_err$response2 = err.response) === null || _err$response2 === void 0 ? void 0 : (_err$response2$data = _err$response2.data) === null || _err$response2$data === void 0 ? void 0 : _err$response2$data.reason) !== null && _err$response$data$re !== void 0 ? _err$response$data$re : '';
          err.message = `Failed to call service location ${url} with method ${method} with ${allMonitors.length} monitors:  ${err.message}, ${reason}`;
          this.logger.error(err);
          (0, _monitor_upgrade_sender.sendErrorTelemetryEvents)(this.logger, this.server.telemetry, {
            reason: (_err$response3 = err.response) === null || _err$response3 === void 0 ? void 0 : (_err$response3$data = _err$response3.data) === null || _err$response3$data === void 0 ? void 0 : _err$response3$data.reason,
            message: err.message,
            type: 'syncError',
            code: err.code,
            status: (_err$response4 = err.response) === null || _err$response4 === void 0 ? void 0 : (_err$response4$data = _err$response4.data) === null || _err$response4$data === void 0 ? void 0 : _err$response4$data.status,
            url,
            stackVersion: this.server.stackVersion
          });
          // we don't want to throw an unhandled exception here
          return (0, _rxjs.of)(true);
        })));
      }
    });
    await (0, _rxjs.forkJoin)(promises).toPromise();
    return pushErrors;
  }
}
exports.ServiceAPIClient = ServiceAPIClient;