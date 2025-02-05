"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualReportingSoftDisabledError = exports.UnknownError = exports.ReportingError = exports.QueueTimeoutError = exports.PdfWorkerOutOfMemoryError = exports.KibanaShuttingDownError = exports.InvalidLayoutParametersError = exports.DisallowedOutgoingUrl = exports.BrowserUnexpectedlyClosedError = exports.BrowserScreenshotError = exports.BrowserCouldNotLaunchError = exports.AuthenticationExpiredError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class ReportingError extends Error {
  /**
   * A string that uniquely brands an error type. This is used to power telemetry
   * about reporting failures.
   *
   * @note Convention for codes: lower-case, snake-case and end in `_error`.
   */

  constructor(details) {
    super();
    this.details = details;
  }
  get message() {
    const prefix = `ReportingError`;
    return this.details ? `${prefix}(code: ${this.code}) "${this.details}"` : `${prefix}(code: ${this.code})`;
  }
  toString() {
    return this.message;
  }
}

/**
 * While validating the page layout parameters for a screenshot type report job
 */
exports.ReportingError = ReportingError;
class InvalidLayoutParametersError extends ReportingError {
  get code() {
    return InvalidLayoutParametersError.code;
  }
}

/**
 * While loading requests in the Kibana app, a URL was encountered that the network policy did not allow.
 */
exports.InvalidLayoutParametersError = InvalidLayoutParametersError;
(0, _defineProperty2.default)(InvalidLayoutParametersError, "code", 'invalid_layout_parameters_error');
class DisallowedOutgoingUrl extends ReportingError {
  get code() {
    return DisallowedOutgoingUrl.code;
  }
}

/**
 * While performing some reporting action, like fetching data from ES, our
 * access token expired.
 */
exports.DisallowedOutgoingUrl = DisallowedOutgoingUrl;
(0, _defineProperty2.default)(DisallowedOutgoingUrl, "code", 'disallowed_outgoing_url_error');
class AuthenticationExpiredError extends ReportingError {
  get code() {
    return AuthenticationExpiredError.code;
  }
}
exports.AuthenticationExpiredError = AuthenticationExpiredError;
(0, _defineProperty2.default)(AuthenticationExpiredError, "code", 'authentication_expired_error');
class QueueTimeoutError extends ReportingError {
  get code() {
    return QueueTimeoutError.code;
  }
}

/**
 * An unknown error has occurred. See details.
 */
exports.QueueTimeoutError = QueueTimeoutError;
(0, _defineProperty2.default)(QueueTimeoutError, "code", 'queue_timeout_error');
class UnknownError extends ReportingError {
  get code() {
    return UnknownError.code;
  }
}
exports.UnknownError = UnknownError;
(0, _defineProperty2.default)(UnknownError, "code", 'unknown_error');
class PdfWorkerOutOfMemoryError extends ReportingError {
  get code() {
    return PdfWorkerOutOfMemoryError.code;
  }
  humanFriendlyMessage() {
    return _i18n.i18n.translate('xpack.reporting.common.pdfWorkerOutOfMemoryErrorMessage', {
      defaultMessage: `Can't generate a PDF due to insufficient memory. Try making a smaller PDF and retrying this report.`
    });
  }
}
exports.PdfWorkerOutOfMemoryError = PdfWorkerOutOfMemoryError;
(0, _defineProperty2.default)(PdfWorkerOutOfMemoryError, "code", 'pdf_worker_out_of_memory_error');
class BrowserCouldNotLaunchError extends ReportingError {
  get code() {
    return BrowserCouldNotLaunchError.code;
  }
  humanFriendlyMessage() {
    return _i18n.i18n.translate('xpack.reporting.common.browserCouldNotLaunchErrorMessage', {
      defaultMessage: `Can't generate screenshots because the browser did not launch. See the server logs for more information.`
    });
  }
}
exports.BrowserCouldNotLaunchError = BrowserCouldNotLaunchError;
(0, _defineProperty2.default)(BrowserCouldNotLaunchError, "code", 'browser_could_not_launch_error');
class BrowserUnexpectedlyClosedError extends ReportingError {
  get code() {
    return BrowserUnexpectedlyClosedError.code;
  }
}
exports.BrowserUnexpectedlyClosedError = BrowserUnexpectedlyClosedError;
(0, _defineProperty2.default)(BrowserUnexpectedlyClosedError, "code", 'browser_unexpectedly_closed_error');
class BrowserScreenshotError extends ReportingError {
  get code() {
    return BrowserScreenshotError.code;
  }
}
exports.BrowserScreenshotError = BrowserScreenshotError;
(0, _defineProperty2.default)(BrowserScreenshotError, "code", 'browser_screenshot_error');
class KibanaShuttingDownError extends ReportingError {
  get code() {
    return KibanaShuttingDownError.code;
  }
}

/**
 * Special error case that should only occur on Cloud when trying to generate
 * a report on a Kibana instance that is too small to be running Chromium.
 */
exports.KibanaShuttingDownError = KibanaShuttingDownError;
(0, _defineProperty2.default)(KibanaShuttingDownError, "code", 'kibana_shutting_down_error');
class VisualReportingSoftDisabledError extends ReportingError {
  get code() {
    return VisualReportingSoftDisabledError.code;
  }
  humanFriendlyMessage() {
    return _i18n.i18n.translate('xpack.reporting.common.cloud.insufficientSystemMemoryError', {
      defaultMessage: `Can't generate this report due to insufficient memory.`
    });
  }
}
exports.VisualReportingSoftDisabledError = VisualReportingSoftDisabledError;
(0, _defineProperty2.default)(VisualReportingSoftDisabledError, "code", 'visual_reporting_soft_disabled_error');