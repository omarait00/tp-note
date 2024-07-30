"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KQLCustomTransformGenerator = void 0;
var _esQuery = require("@kbn/es-query");
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

class KQLCustomTransformGenerator extends _.TransformGenerator {
  getTransformParams(slo) {
    if (!_schema.kqlCustomIndicatorSchema.is(slo.indicator)) {
      throw new _errors.InvalidTransformError(`Cannot handle SLO of indicator type: ${slo.indicator.type}`);
    }
    return (0, _slo_transform_template.getSLOTransformTemplate)(this.buildTransformId(slo), this.buildSource(slo, slo.indicator), this.buildDestination(), this.buildCommonGroupBy(slo), this.buildAggregations(slo, slo.indicator));
  }
  buildTransformId(slo) {
    return (0, _constants.getSLOTransformId)(slo.id, slo.revision);
  }
  buildSource(slo, indicator) {
    const filter = getElastichsearchQueryOrThrow(indicator.params.query_filter);
    return {
      index: indicator.params.index,
      runtime_mappings: this.buildCommonRuntimeMappings(slo),
      query: filter
    };
  }
  buildDestination() {
    return {
      pipeline: _constants.SLO_INGEST_PIPELINE_NAME,
      index: _constants.SLO_DESTINATION_INDEX_NAME
    };
  }
  buildAggregations(slo, indicator) {
    const numerator = getElastichsearchQueryOrThrow(indicator.params.numerator);
    const denominator = getElastichsearchQueryOrThrow(indicator.params.denominator);
    return {
      'slo.numerator': {
        filter: numerator
      },
      'slo.denominator': {
        filter: denominator
      }
    };
  }
}
exports.KQLCustomTransformGenerator = KQLCustomTransformGenerator;
function getElastichsearchQueryOrThrow(kuery) {
  try {
    return (0, _esQuery.toElasticsearchQuery)((0, _esQuery.fromKueryExpression)(kuery));
  } catch (err) {
    throw new _errors.InvalidTransformError(`Invalid KQL: ${kuery}`);
  }
}