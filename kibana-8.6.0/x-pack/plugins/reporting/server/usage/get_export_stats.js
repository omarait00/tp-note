"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportStats = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const jobTypeIsDeprecated = jobType => _constants.DEPRECATED_JOB_TYPES.includes(jobType);
const defaultTotalsForFeature = {
  total: 0,
  deprecated: 0,
  app: {
    'canvas workpad': 0,
    search: 0,
    visualization: 0,
    dashboard: 0
  },
  output_size: ['1.0', '5.0', '25.0', '50.0', '75.0', '95.0', '99.0'].reduce((sps, p) => ({
    ...sps,
    [p]: null
  }), {}),
  layout: {
    canvas: 0,
    print: 0,
    preserve_layout: 0
  },
  execution_times: {
    min: null,
    max: null,
    avg: null
  }
};
const jobTypeIsPdf = jobType => {
  return jobType === 'printable_pdf' || jobType === 'printable_pdf_v2';
};
const metricsPercentiles = ['50.0', '75.0', '95.0', '99.0'].reduce((mps, p) => ({
  ...mps,
  [p]: null
}), {});
const metricsSets = {
  csv: {
    csv_rows: metricsPercentiles
  },
  png: {
    png_cpu: metricsPercentiles,
    png_memory: metricsPercentiles
  },
  pdf: {
    pdf_cpu: metricsPercentiles,
    pdf_memory: metricsPercentiles,
    pdf_pages: metricsPercentiles
  }
};
const metricsForFeature = {
  csv_searchsource: metricsSets.csv,
  csv_searchsource_immediate: metricsSets.csv,
  PNG: metricsSets.png,
  PNGV2: metricsSets.png,
  printable_pdf: metricsSets.pdf,
  printable_pdf_v2: metricsSets.pdf
};
const isAvailable = (featureAvailability, feature) => !!featureAvailability[feature];
function getAvailableTotalForFeature(jobType, exportType, featureAvailability) {
  // if the type itself is deprecated, all jobs are deprecated, otherwise only some of them might be
  const deprecated = jobTypeIsDeprecated(exportType) ? jobType === null || jobType === void 0 ? void 0 : jobType.total : (jobType === null || jobType === void 0 ? void 0 : jobType.deprecated) || 0;

  // merge given stats with defaults
  const availableTotal = {
    available: isAvailable(featureAvailability, exportType),
    total: (jobType === null || jobType === void 0 ? void 0 : jobType.total) || 0,
    deprecated,
    output_size: {
      ...defaultTotalsForFeature.output_size,
      ...(jobType === null || jobType === void 0 ? void 0 : jobType.output_size)
    },
    metrics: {
      ...metricsForFeature[exportType],
      ...(jobType === null || jobType === void 0 ? void 0 : jobType.metrics)
    },
    app: {
      ...defaultTotalsForFeature.app,
      ...(jobType === null || jobType === void 0 ? void 0 : jobType.app)
    },
    error_codes: jobType === null || jobType === void 0 ? void 0 : jobType.error_codes,
    execution_times: jobType === null || jobType === void 0 ? void 0 : jobType.execution_times,
    layout: jobTypeIsPdf(exportType) ? {
      ...defaultTotalsForFeature.layout,
      ...(jobType === null || jobType === void 0 ? void 0 : jobType.layout)
    } : undefined
  };
  return availableTotal;
}

/*
 * Decorates range stats (stats for last day, last 7 days, etc) with feature
 * availability booleans, and zero-filling for unused features
 *
 * This function builds the result object for all export types found in the
 * Reporting data, even if the type is unknown to this Kibana instance.
 */
const getExportStats = (rangeStatsInput, featureAvailability, exportTypesHandler) => {
  if (!rangeStatsInput) {
    return {};
  }
  const {
    _all: rangeAll,
    status: rangeStatus,
    statuses: rangeStatusByApp,
    output_size: outputSize,
    queue_times: queueTimes,
    ...rangeStats
  } = rangeStatsInput;

  // combine the known types with any unknown type found in reporting data
  const statsForExportType = exportTypesHandler.getJobTypes().reduce((accum, exportType) => ({
    ...accum,
    [exportType]: getAvailableTotalForFeature(rangeStats[exportType], exportType, featureAvailability)
  }), {});
  const resultStats = {
    ...statsForExportType,
    _all: rangeAll || 0,
    status: {
      completed: 0,
      failed: 0,
      ...rangeStatus
    },
    statuses: rangeStatusByApp,
    output_size: outputSize,
    queue_times: queueTimes
  };
  return resultStats;
};
exports.getExportStats = getExportStats;