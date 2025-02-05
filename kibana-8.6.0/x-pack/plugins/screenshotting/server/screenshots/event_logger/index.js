"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transactions = exports.EventLogger = exports.Actions = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));
var _uuid = _interopRequireDefault(require("uuid"));
var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
let Actions;
exports.Actions = Actions;
(function (Actions) {
  Actions["OPEN_URL"] = "open-url";
  Actions["GET_ELEMENT_POSITION_DATA"] = "get-element-position-data";
  Actions["GET_NUMBER_OF_ITEMS"] = "get-number-of-items";
  Actions["GET_RENDER_ERRORS"] = "get-render-errors";
  Actions["GET_TIMERANGE"] = "get-timerange";
  Actions["INJECT_CSS"] = "inject-css";
  Actions["REPOSITION"] = "position-elements";
  Actions["WAIT_RENDER"] = "wait-for-render";
  Actions["WAIT_VISUALIZATIONS"] = "wait-for-visualizations";
  Actions["GET_SCREENSHOT"] = "get-screenshots";
  Actions["PRINT_A4_PDF"] = "print-a4-pdf";
  Actions["ADD_IMAGE"] = "add-pdf-image";
  Actions["COMPILE"] = "compile-pdf";
})(Actions || (exports.Actions = Actions = {}));
let Transactions;
exports.Transactions = Transactions;
(function (Transactions) {
  Transactions["SCREENSHOTTING"] = "screenshot-pipeline";
  Transactions["PDF"] = "generate-pdf";
})(Transactions || (exports.Transactions = Transactions = {}));
function fillLogData(message, event, suffix, sessionId, duration) {
  let newMessage = message;
  if (suffix !== 'error') {
    newMessage = `${suffix === 'start' ? 'starting' : 'completed'}: ${message}`;
  }
  let interpretedAction;
  if (suffix === 'error') {
    interpretedAction = event.action + '-error';
  } else {
    interpretedAction = event.action + `-${suffix}`;
  }
  const logData = {
    message: newMessage,
    kibana: {
      screenshotting: {
        ...event,
        action: interpretedAction,
        session_id: sessionId
      }
    },
    event: {
      duration,
      provider: _common.PLUGIN_ID
    }
  };
  return logData;
}
function logAdapter(logger, sessionId) {
  const log = (message, suffix, event, startTime) => {
    let duration;
    if (startTime != null) {
      const start = startTime.valueOf();
      duration = new Date(Date.now()).valueOf() - start.valueOf();
    }
    const logData = fillLogData(message, event, suffix, sessionId, duration);
    logger.debug(logData.message, logData);
  };
  return log;
}

/**
 * A class to use internal state properties to log timing between actions in the screenshotting pipeline
 */
class EventLogger {
  // identifier to track all logs from one screenshotting flow

  constructor(logger, config) {
    (0, _defineProperty2.default)(this, "spans", new Map());
    (0, _defineProperty2.default)(this, "transactions", {
      'screenshot-pipeline': null,
      'generate-pdf': null
    });
    (0, _defineProperty2.default)(this, "sessionId", void 0);
    (0, _defineProperty2.default)(this, "logEvent", void 0);
    (0, _defineProperty2.default)(this, "timings", {});
    this.logger = logger;
    this.config = config;
    this.sessionId = _uuid.default.v4();
    this.logEvent = logAdapter(logger.get('events'), this.sessionId);
  }
  startTiming(a) {
    this.timings[a] = new Date(Date.now());
  }

  /**
   * @returns Logger - original logger
   */
  get kbnLogger() {
    return this.logger;
  }

  /**
   * General method for logging the beginning of any of this plugin's pipeline
   *
   * @returns {ScreenshottingEndFn}
   */
  startTransaction(action) {
    this.transactions[action] = _elasticApmNode.default.startTransaction(action, _common.PLUGIN_ID);
    const transaction = this.transactions[action];
    this.startTiming(action);
    this.logEvent(action, 'start', {
      action
    });
    return ({
      labels
    }) => {
      Object.entries(labels).forEach(([label]) => {
        const labelField = label;
        const labelValue = labels[labelField];
        transaction === null || transaction === void 0 ? void 0 : transaction.setLabel(label, labelValue, false);
      });
      transaction === null || transaction === void 0 ? void 0 : transaction.end();
      this.logEvent(action, 'complete', {
        ...labels,
        action
      }, this.timings[action]);
    };
  }

  /**
   * General event logging function
   *
   * @param {string} message
   * @param {Actions} action - action type for kibana.screenshotting.action
   * @param {TransactionType} transaction - name of the internal APM transaction in which to associate the span
   * @param {SpanTypes} type - identifier of the span type
   * @param {metricsPre} type - optional metrics to add to the "start" log of the event
   * @returns {LogEndFn} - function to log the end of the span
   */
  log(message, action, type, metricsPre = {}, transaction) {
    const txn = this.transactions[transaction];
    const span = txn === null || txn === void 0 ? void 0 : txn.startSpan(action, type);
    this.spans.set(action, span);
    this.startTiming(action);
    this.logEvent(message, 'start', {
      ...metricsPre,
      action
    });
    return (metricData = {}) => {
      span === null || span === void 0 ? void 0 : span.end();
      this.logEvent(message, 'complete', {
        ...metricsPre,
        ...metricData,
        action
      }, this.timings[action]);
    };
  }

  /**
   * Logging helper for screenshotting events
   */
  logScreenshottingEvent(message, action, type, metricsPre = {}) {
    return this.log(message, action, type, metricsPre, Transactions.SCREENSHOTTING);
  }

  /**
   * Logging helper for screenshotting events
   */
  logPdfEvent(message, action, type, metricsPre = {}) {
    return this.log(message, action, type, metricsPre, Transactions.PDF);
  }

  /**
   * Helper function to calculate the byte length of a set of captured PNG images
   */
  getByteLengthFromCaptureResults(results) {
    const totalByteLength = results.reduce((totals, {
      screenshots
    }) => totals + screenshots.reduce((byteLength, screenshot) => byteLength + screenshot.data.byteLength, 0), 0);
    return {
      byte_length: totalByteLength
    };
  }

  /**
   * Helper function to create the "metricPre" data needed to log the start
   * of a screenshot capture event.
   */
  getPixelsFromElementPosition(elementPosition) {
    const {
      width,
      height
    } = elementPosition.boundingClientRect;
    const zoom = this.config.capture.zoom;
    const pixels = width * zoom * (height * zoom);
    return {
      pixels
    };
  }

  /**
   * General error logger
   *
   * @param {ErrorAction} error: The error object that was caught
   * @param {Actions} action: The screenshotting action type
   * @returns void
   */
  error(error, action) {
    const isError = typeof error === 'object';
    const message = `Error: ${isError ? error.message : error}`;
    const errorData = {
      ...fillLogData(message, {
        action
      }, 'error', this.sessionId, undefined //
      ),

      error: {
        message: isError ? error.message : error,
        code: isError ? error.code : undefined,
        stack_trace: isError ? error.stack_trace : undefined,
        type: isError ? error.type : undefined
      }
    };
    this.logger.get('events').debug(message, errorData);
    _elasticApmNode.default.captureError(error);
  }
}
exports.EventLogger = EventLogger;