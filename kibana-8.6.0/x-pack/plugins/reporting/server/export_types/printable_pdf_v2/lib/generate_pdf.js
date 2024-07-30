"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePdfObservable = generatePdfObservable;
var _operators = require("rxjs/operators");
var _get_full_redirect_app_url = require("../../common/v2/get_full_redirect_app_url");
var _pdf_tracker = require("../../common/pdf_tracker");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function generatePdfObservable(reporting, job, locatorParams, options) {
  const tracker = (0, _pdf_tracker.getTracker)();
  tracker.startScreenshots();

  /**
   * For each locator we get the relative URL to the redirect app
   */
  const urls = locatorParams.map(locator => [(0, _get_full_redirect_app_url.getFullRedirectAppUrl)(reporting.getConfig(), job.spaceId, job.forceNow), locator]);
  const screenshots$ = reporting.getScreenshots({
    ...options,
    urls
  }).pipe((0, _operators.tap)(({
    metrics
  }) => {
    if (metrics.cpu) {
      tracker.setCpuUsage(metrics.cpu);
    }
    if (metrics.memory) {
      tracker.setMemoryUsage(metrics.memory);
    }
  }), (0, _operators.mergeMap)(async ({
    data: buffer,
    errors,
    metrics,
    renderErrors
  }) => {
    tracker.endScreenshots();
    const warnings = [];
    if (errors) {
      warnings.push(...errors.map(error => error.message));
    }
    if (renderErrors) {
      warnings.push(...renderErrors);
    }
    return {
      buffer,
      metrics,
      warnings
    };
  }));
  return screenshots$;
}