"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeNestedLabel = void 0;
var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const makeNestedLabel = (aggConfig, label) => {
  const uppercaseLabel = (0, _lodash.startCase)(label);
  const customMetric = aggConfig.getParam('customMetric');
  const metricAgg = aggConfig.getParam('metricAgg');
  if (customMetric) {
    let metricLabel = customMetric.makeLabel();
    if (metricLabel.includes(`${uppercaseLabel} of `)) {
      metricLabel = metricLabel.substring(`${uppercaseLabel} of `.length);
      metricLabel = `2. ${label} of ${metricLabel}`;
    } else if (metricLabel.includes(`${label} of `)) {
      metricLabel = parseInt(metricLabel.substring(0, 1), 10) + 1 + metricLabel.substring(1);
    } else {
      metricLabel = `${uppercaseLabel} of ${metricLabel}`;
    }
    return metricLabel;
  }
  const metric = aggConfig.aggConfigs.byId(metricAgg);
  if (!metric) {
    return '';
  }
  return `${uppercaseLabel} of ${metric.makeLabel()}`;
};
exports.makeNestedLabel = makeNestedLabel;