"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApmTransactionDurationTransformGenerator = void 0;
var _errors = require("../../../errors");
var _schema = require("../../../types/schema");
var _constants = require("../../../assets/constants");
var _slo_transform_template = require("../../../assets/transform_templates/slo_transform_template");
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const APM_SOURCE_INDEX = 'metrics-apm*';
class ApmTransactionDurationTransformGenerator extends _.TransformGenerator {
  getTransformParams(slo) {
    if (!_schema.apmTransactionDurationIndicatorSchema.is(slo.indicator)) {
      throw new _errors.InvalidTransformError(`Cannot handle SLO of indicator type: ${slo.indicator.type}`);
    }
    return (0, _slo_transform_template.getSLOTransformTemplate)(this.buildTransformId(slo), this.buildSource(slo, slo.indicator), this.buildDestination(), this.buildCommonGroupBy(slo), this.buildAggregations(slo.indicator));
  }
  buildTransformId(slo) {
    return (0, _constants.getSLOTransformId)(slo.id, slo.revision);
  }
  buildSource(slo, indicator) {
    const queryFilter = [];
    if (indicator.params.service !== _schema.ALL_VALUE) {
      queryFilter.push({
        match: {
          'service.name': indicator.params.service
        }
      });
    }
    if (indicator.params.environment !== _schema.ALL_VALUE) {
      queryFilter.push({
        match: {
          'service.environment': indicator.params.environment
        }
      });
    }
    if (indicator.params.transaction_name !== _schema.ALL_VALUE) {
      queryFilter.push({
        match: {
          'transaction.name': indicator.params.transaction_name
        }
      });
    }
    if (indicator.params.transaction_type !== _schema.ALL_VALUE) {
      queryFilter.push({
        match: {
          'transaction.type': indicator.params.transaction_type
        }
      });
    }
    return {
      index: APM_SOURCE_INDEX,
      runtime_mappings: this.buildCommonRuntimeMappings(slo),
      query: {
        bool: {
          filter: [{
            match: {
              'transaction.root': true
            }
          }, ...queryFilter]
        }
      }
    };
  }
  buildDestination() {
    return {
      pipeline: _constants.SLO_INGEST_PIPELINE_NAME,
      index: _constants.SLO_DESTINATION_INDEX_NAME
    };
  }
  buildAggregations(indicator) {
    const truncatedThreshold = Math.trunc(indicator.params['threshold.us']);
    return {
      _numerator: {
        range: {
          field: 'transaction.duration.histogram',
          ranges: [{
            to: truncatedThreshold
          }]
        }
      },
      'slo.numerator': {
        bucket_script: {
          buckets_path: {
            numerator: `_numerator['*-${truncatedThreshold}.0']>_count`
          },
          script: 'params.numerator'
        }
      },
      'slo.denominator': {
        value_count: {
          field: 'transaction.duration.histogram'
        }
      }
    };
  }
}
exports.ApmTransactionDurationTransformGenerator = ApmTransactionDurationTransformGenerator;