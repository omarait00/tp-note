"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PreviewTelemetryEventsSender = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _axios = _interopRequireDefault(require("axios"));
var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Preview telemetry events sender for the telemetry route.
 * @see telemetry_detection_rules_preview_route
 */
class PreviewTelemetryEventsSender {
  /** Inner composite telemetry events sender */

  /** Axios local instance */

  /** Last sent message */

  /** Logger for this class  */

  constructor(logger, composite) {
    (0, _defineProperty2.default)(this, "composite", void 0);
    (0, _defineProperty2.default)(this, "axiosInstance", _axios.default.create());
    (0, _defineProperty2.default)(this, "sentMessages", []);
    (0, _defineProperty2.default)(this, "logger", void 0);
    this.logger = logger;
    this.composite = composite;

    /**
     * Intercept the last message and save it for the preview within the lastSentMessage
     * Reject the request intentionally to stop from sending to the server
     */
    this.axiosInstance.interceptors.request.use(config => {
      (0, _helpers.tlog)(this.logger, `Intercepting telemetry', ${JSON.stringify(config.data)} and not sending data to the telemetry server`);
      const data = config.data != null ? [config.data] : [];
      this.sentMessages = [...this.sentMessages, ...data];
      return Promise.reject(new Error('Not sending to telemetry server'));
    });

    /**
     * Create a fake response for the preview on return within the error section.
     * @param error The error we don't do anything with
     * @returns The response resolved to stop the chain from continuing.
     */
    this.axiosInstance.interceptors.response.use(response => response, error => {
      // create a fake response for the preview as if the server had sent it back to us
      const okResponse = {
        data: {},
        status: 200,
        statusText: 'ok',
        headers: {},
        config: {}
      };
      return Promise.resolve(okResponse);
    });
  }
  getSentMessages() {
    return this.sentMessages;
  }
  setup(telemetryReceiver, telemetrySetup, taskManager, telemetryUsageCounter) {
    return this.composite.setup(telemetryReceiver, telemetrySetup, taskManager, telemetryUsageCounter);
  }
  getClusterID() {
    return this.composite.getClusterID();
  }
  start(telemetryStart, taskManager, receiver) {
    return this.composite.start(telemetryStart, taskManager, receiver);
  }
  stop() {
    return this.composite.stop();
  }
  async queueTelemetryEvents(events) {
    const result = this.composite.queueTelemetryEvents(events);
    await this.composite.sendIfDue(this.axiosInstance);
    return result;
  }
  getTelemetryUsageCluster() {
    return this.composite.getTelemetryUsageCluster();
  }
  isTelemetryOptedIn() {
    return this.composite.isTelemetryOptedIn();
  }
  isTelemetryServicesReachable() {
    return this.composite.isTelemetryServicesReachable();
  }
  sendIfDue(axiosInstance) {
    return this.composite.sendIfDue(axiosInstance);
  }
  processEvents(events) {
    return this.composite.processEvents(events);
  }
  async sendOnDemand(channel, toSend) {
    const result = await this.composite.sendOnDemand(channel, toSend, this.axiosInstance);
    return result;
  }
  getV3UrlFromV2(v2url, channel) {
    return this.composite.getV3UrlFromV2(v2url, channel);
  }
}
exports.PreviewTelemetryEventsSender = PreviewTelemetryEventsSender;