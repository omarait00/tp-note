"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApmTransactionErrorRateTransformGenerator = void 0;
var _errors = require("../../../errors");
var _schema = require("../../../types/schema");
var _slo_transform_template = require("../../../assets/transform_templates/slo_transform_template");
var _ = require(".");
var _constants = require("../../../assets/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const APM_SOURCE_INDEX = 'metrics-apm*';
const ALLOWED_STATUS_CODES = ['2xx', '3xx', '4xx', '5xx'];
const DEFAULT_GOOD_STATUS_CODES = ['2xx', '3xx', '4xx'];
class ApmTransactionErrorRateTransformGenerator extends _.TransformGenerator {
  getTransformParams(slo) {
    if (!_schema.apmTransactionErrorRateIndicatorSchema.is(slo.indicator)) {
      throw new _errors.InvalidTransformError(`Cannot handle SLO of indicator type: ${slo.indicator.type}`);
    }
    return (0, _slo_transform_template.getSLOTransformTemplate)(this.buildTransformId(slo), this.buildSource(slo, slo.indicator), this.buildDestination(), this.buildCommonGroupBy(slo), this.buildAggregations(slo, slo.indicator));
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
  buildAggregations(slo, indicator) {
    const goodStatusCodesFilter = this.getGoodStatusCodesFilter(indicator.params.good_status_codes);
    return {
      'slo.numerator': {
        filter: {
          bool: {
            should: goodStatusCodesFilter
          }
        }
      },
      'slo.denominator': {
        value_count: {
          field: 'transaction.duration.histogram'
        }
      }
    };
  }
  getGoodStatusCodesFilter(goodStatusCodes) {
    let statusCodes = goodStatusCodes === null || goodStatusCodes === void 0 ? void 0 : goodStatusCodes.filter(code => ALLOWED_STATUS_CODES.includes(code));
    if (statusCodes === undefined || statusCodes.length === 0) {
      statusCodes = DEFAULT_GOOD_STATUS_CODES;
    }
    return statusCodes.map(code => ({
      match: {
        'transaction.result': `HTTP ${code}`
      }
    }));
  }
}
exports.ApmTransactionErrorRateTransformGenerator = ApmTransactionErrorRateTransformGenerator;