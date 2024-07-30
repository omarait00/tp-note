"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME = exports.FactoryQueryType = exports.BARCHART_AGGREGATION_NAME = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME = 'threatIntelligenceSearchStrategy';
exports.THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME = THREAT_INTELLIGENCE_SEARCH_STRATEGY_NAME;
const BARCHART_AGGREGATION_NAME = 'barchartAggregation';

/**
 * Used inside custom search strategy
 */
exports.BARCHART_AGGREGATION_NAME = BARCHART_AGGREGATION_NAME;
let FactoryQueryType;
exports.FactoryQueryType = FactoryQueryType;
(function (FactoryQueryType) {
  FactoryQueryType["IndicatorGrid"] = "indicatorGrid";
  FactoryQueryType["Barchart"] = "barchart";
})(FactoryQueryType || (exports.FactoryQueryType = FactoryQueryType = {}));