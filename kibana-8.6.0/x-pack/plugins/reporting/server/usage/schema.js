"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportingSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const appCountsSchema = {
  search: {
    type: 'long'
  },
  'canvas workpad': {
    type: 'long'
  },
  dashboard: {
    type: 'long'
  },
  visualization: {
    type: 'long'
  }
};
const executionTimesSchema = {
  min: {
    type: 'long'
  },
  max: {
    type: 'long'
  },
  avg: {
    type: 'float'
  }
};
const queueTimesSchema = {
  min: {
    type: 'long'
  },
  max: {
    type: 'long'
  },
  avg: {
    type: 'float'
  }
};
const layoutCountsSchema = {
  canvas: {
    type: 'long'
  },
  print: {
    type: 'long'
  },
  preserve_layout: {
    type: 'long'
  }
};
const byAppCountsSchema = {
  csv_searchsource: appCountsSchema,
  csv_searchsource_immediate: appCountsSchema,
  PNG: appCountsSchema,
  PNGV2: appCountsSchema,
  printable_pdf: appCountsSchema,
  printable_pdf_v2: appCountsSchema
};
const sizesSchema = {
  '1.0': {
    type: 'long'
  },
  '5.0': {
    type: 'long'
  },
  '25.0': {
    type: 'long'
  },
  '50.0': {
    type: 'long'
  },
  '75.0': {
    type: 'long'
  },
  '95.0': {
    type: 'long'
  },
  '99.0': {
    type: 'long'
  }
};
const metricsPercentilesSchema = {
  '50.0': {
    type: 'long'
  },
  '75.0': {
    type: 'long'
  },
  '95.0': {
    type: 'long'
  },
  '99.0': {
    type: 'long'
  }
};
const metricsSchemaCsv = {
  csv_rows: metricsPercentilesSchema
};
const metricsSchemaPng = {
  png_cpu: metricsPercentilesSchema,
  png_memory: metricsPercentilesSchema
};
const metricsSchemaPdf = {
  pdf_cpu: metricsPercentilesSchema,
  pdf_memory: metricsPercentilesSchema,
  pdf_pages: metricsPercentilesSchema
};
const errorCodesSchemaCsv = {
  authentication_expired_error: {
    type: 'long'
  },
  queue_timeout_error: {
    type: 'long'
  },
  unknown_error: {
    type: 'long'
  },
  kibana_shutting_down_error: {
    type: 'long'
  }
};
const errorCodesSchemaPng = {
  authentication_expired_error: {
    type: 'long'
  },
  queue_timeout_error: {
    type: 'long'
  },
  unknown_error: {
    type: 'long'
  },
  kibana_shutting_down_error: {
    type: 'long'
  },
  browser_could_not_launch_error: {
    type: 'long'
  },
  browser_unexpectedly_closed_error: {
    type: 'long'
  },
  browser_screenshot_error: {
    type: 'long'
  },
  visual_reporting_soft_disabled_error: {
    type: 'long'
  },
  invalid_layout_parameters_error: {
    type: 'long'
  }
};
const errorCodesSchemaPdf = {
  pdf_worker_out_of_memory_error: {
    type: 'long'
  },
  authentication_expired_error: {
    type: 'long'
  },
  queue_timeout_error: {
    type: 'long'
  },
  unknown_error: {
    type: 'long'
  },
  kibana_shutting_down_error: {
    type: 'long'
  },
  browser_could_not_launch_error: {
    type: 'long'
  },
  browser_unexpectedly_closed_error: {
    type: 'long'
  },
  browser_screenshot_error: {
    type: 'long'
  },
  visual_reporting_soft_disabled_error: {
    type: 'long'
  },
  invalid_layout_parameters_error: {
    type: 'long'
  }
};
const availableTotalSchema = {
  available: {
    type: 'boolean'
  },
  total: {
    type: 'long'
  },
  deprecated: {
    type: 'long'
  },
  output_size: sizesSchema,
  app: appCountsSchema,
  execution_times: executionTimesSchema
};
const jobTypesSchema = {
  csv_searchsource: {
    ...availableTotalSchema,
    metrics: metricsSchemaCsv,
    error_codes: errorCodesSchemaCsv
  },
  csv_searchsource_immediate: {
    ...availableTotalSchema,
    metrics: metricsSchemaCsv,
    error_codes: errorCodesSchemaCsv
  },
  PNG: {
    ...availableTotalSchema,
    metrics: metricsSchemaPng,
    error_codes: errorCodesSchemaPng
  },
  PNGV2: {
    ...availableTotalSchema,
    metrics: metricsSchemaPng,
    error_codes: errorCodesSchemaPng
  },
  printable_pdf: {
    ...availableTotalSchema,
    layout: layoutCountsSchema,
    metrics: metricsSchemaPdf,
    error_codes: errorCodesSchemaPdf
  },
  printable_pdf_v2: {
    ...availableTotalSchema,
    layout: layoutCountsSchema,
    metrics: metricsSchemaPdf,
    error_codes: errorCodesSchemaPdf
  }
};
const rangeStatsSchema = {
  ...jobTypesSchema,
  _all: {
    type: 'long'
  },
  status: {
    completed: {
      type: 'long'
    },
    completed_with_warnings: {
      type: 'long'
    },
    failed: {
      type: 'long'
    },
    pending: {
      type: 'long'
    },
    processing: {
      type: 'long'
    }
  },
  statuses: {
    completed: byAppCountsSchema,
    completed_with_warnings: byAppCountsSchema,
    failed: byAppCountsSchema,
    pending: byAppCountsSchema,
    processing: byAppCountsSchema
  },
  output_size: sizesSchema,
  queue_times: queueTimesSchema
};
const reportingSchema = {
  ...rangeStatsSchema,
  available: {
    type: 'boolean'
  },
  enabled: {
    type: 'boolean'
  },
  last7Days: rangeStatsSchema
};
exports.reportingSchema = reportingSchema;