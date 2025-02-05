"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormulaFromMetric = exports.SUPPORTED_METRICS = void 0;
var _common = require("../../../../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const supportedDataTypesWithDate = ['number', 'date', 'histogram'];
const supportedDataTypes = ['number', 'histogram'];
const extendedSupportedDataTypes = ['string', 'boolean', 'number', 'number_range', 'ip', 'ip_range', 'date', 'date_range', 'murmur3'];
const SUPPORTED_METRICS = {
  avg: {
    name: 'average',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: ['number']
    }
  },
  cardinality: {
    name: 'unique_count',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: extendedSupportedDataTypes
    }
  },
  count: {
    name: 'count',
    isFullReference: false,
    isFieldRequired: false,
    supportedDataTypes: {
      default: ['number']
    }
  },
  moving_avg: {
    name: 'moving_average',
    isFullReference: true,
    isFieldRequired: true,
    supportedDataTypes: {
      default: ['number']
    }
  },
  derivative: {
    name: 'differences',
    isFullReference: true,
    isFieldRequired: true,
    supportedDataTypes: {
      default: ['number']
    }
  },
  cumulative_sum: {
    name: 'cumulative_sum',
    isFullReference: true,
    isFieldRequired: true,
    supportedDataTypes: {
      default: ['number']
    }
  },
  avg_bucket: {
    name: 'formula',
    isFullReference: true,
    isFieldRequired: true,
    isFormula: true,
    formula: 'overall_average',
    supportedDataTypes: {
      default: ['number']
    }
  },
  max_bucket: {
    name: 'formula',
    isFullReference: true,
    isFieldRequired: true,
    isFormula: true,
    formula: 'overall_max',
    supportedDataTypes: {
      default: ['number']
    }
  },
  min_bucket: {
    name: 'formula',
    isFullReference: true,
    isFieldRequired: true,
    isFormula: true,
    formula: 'overall_min',
    supportedDataTypes: {
      default: ['number']
    }
  },
  sum_bucket: {
    name: 'formula',
    isFullReference: true,
    isFieldRequired: true,
    isFormula: true,
    formula: 'overall_sum',
    supportedDataTypes: {
      default: ['number']
    }
  },
  max: {
    name: 'max',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: ['number'],
      heatmap: ['number'],
      line: ['number'],
      area: ['number'],
      histogram: ['number']
    }
  },
  min: {
    name: 'min',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypesWithDate,
      heatmap: ['number'],
      line: ['number'],
      area: ['number'],
      histogram: ['number']
    }
  },
  percentiles: {
    name: 'percentile',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  single_percentile: {
    name: 'percentile',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  percentile_ranks: {
    name: 'percentile_rank',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  single_percentile_rank: {
    name: 'percentile_rank',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  sum: {
    name: 'sum',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  top_hits: {
    name: 'last_value',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: extendedSupportedDataTypes
    }
  },
  top_metrics: {
    name: 'last_value',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: extendedSupportedDataTypes
    }
  },
  value_count: {
    name: 'count',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: extendedSupportedDataTypes
    }
  },
  std_dev: {
    name: 'standard_deviation',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  },
  median: {
    name: 'median',
    isFullReference: false,
    isFieldRequired: true,
    supportedDataTypes: {
      default: supportedDataTypes
    }
  }
};
exports.SUPPORTED_METRICS = SUPPORTED_METRICS;
const getFormulaFromMetric = metric => {
  if (metric.isFormula) {
    return metric.formula;
  }
  return metric.name;
};
exports.getFormulaFromMetric = getFormulaFromMetric;