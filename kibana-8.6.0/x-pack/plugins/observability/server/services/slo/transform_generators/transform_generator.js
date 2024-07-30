"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TransformGenerator = void 0;
var _schema = require("../../../types/schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class TransformGenerator {
  buildCommonRuntimeMappings(slo) {
    var _slo$objective$timesl;
    return {
      'slo.id': {
        type: 'keyword',
        script: {
          source: `emit('${slo.id}')`
        }
      },
      'slo.revision': {
        type: 'long',
        script: {
          source: `emit(${slo.revision})`
        }
      },
      'slo._internal.name': {
        type: 'keyword',
        script: {
          source: `emit('${slo.name}')`
        }
      },
      'slo._internal.budgeting_method': {
        type: 'keyword',
        script: {
          source: `emit('${slo.budgeting_method}')`
        }
      },
      'slo._internal.objective.target': {
        type: 'double',
        script: {
          source: `emit(${slo.objective.target})`
        }
      },
      ...(_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method) && {
        'slo._internal.objective.timeslice_target': {
          type: 'double',
          script: {
            source: `emit(${slo.objective.timeslice_target})`
          }
        },
        'slo._internal.objective.timeslice_window': {
          type: 'keyword',
          script: {
            source: `emit('${(_slo$objective$timesl = slo.objective.timeslice_window) === null || _slo$objective$timesl === void 0 ? void 0 : _slo$objective$timesl.format()}')`
          }
        }
      }),
      'slo._internal.time_window.duration': {
        type: 'keyword',
        script: {
          source: `emit('${slo.time_window.duration.format()}')`
        }
      },
      ...(_schema.calendarAlignedTimeWindowSchema.is(slo.time_window) && {
        'slo._internal.time_window.is_rolling': {
          type: 'boolean',
          script: {
            source: `emit(false)`
          }
        }
      }),
      ...(_schema.rollingTimeWindowSchema.is(slo.time_window) && {
        'slo._internal.time_window.is_rolling': {
          type: 'boolean',
          script: {
            source: `emit(true)`
          }
        }
      })
    };
  }
  buildCommonGroupBy(slo) {
    return {
      'slo.id': {
        terms: {
          field: 'slo.id'
        }
      },
      'slo.revision': {
        terms: {
          field: 'slo.revision'
        }
      },
      'slo._internal.name': {
        terms: {
          field: 'slo._internal.name'
        }
      },
      'slo._internal.budgeting_method': {
        terms: {
          field: 'slo._internal.budgeting_method'
        }
      },
      'slo._internal.objective.target': {
        terms: {
          field: 'slo._internal.objective.target'
        }
      },
      'slo._internal.time_window.duration': {
        terms: {
          field: 'slo._internal.time_window.duration'
        }
      },
      'slo._internal.time_window.is_rolling': {
        terms: {
          field: 'slo._internal.time_window.is_rolling'
        }
      },
      ...(_schema.timeslicesBudgetingMethodSchema.is(slo.budgeting_method) && {
        'slo._internal.objective.timeslice_target': {
          terms: {
            field: 'slo._internal.objective.timeslice_target'
          }
        },
        'slo._internal.objective.timeslice_window': {
          terms: {
            field: 'slo._internal.objective.timeslice_window'
          }
        }
      }),
      '@timestamp': {
        date_histogram: {
          field: '@timestamp',
          calendar_interval: '1m'
        }
      }
    };
  }
}
exports.TransformGenerator = TransformGenerator;