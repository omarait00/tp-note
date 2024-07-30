"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClassificationFeatureImportanceBaseline = isClassificationFeatureImportanceBaseline;
exports.isClassificationTotalFeatureImportance = isClassificationTotalFeatureImportance;
exports.isRegressionFeatureImportanceBaseline = isRegressionFeatureImportanceBaseline;
exports.isRegressionTotalFeatureImportance = isRegressionTotalFeatureImportance;
var _mlIsPopulatedObject = require("@kbn/ml-is-populated-object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function isClassificationTotalFeatureImportance(summary) {
  return summary.classes !== undefined;
}
function isRegressionTotalFeatureImportance(summary) {
  return summary.importance !== undefined;
}
function isClassificationFeatureImportanceBaseline(baselineData) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(baselineData, ['classes']) && Array.isArray(baselineData.classes);
}
function isRegressionFeatureImportanceBaseline(baselineData) {
  return (0, _mlIsPopulatedObject.isPopulatedObject)(baselineData, ['baseline']);
}