"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pivot = void 0;
var _lodash = require("lodash");
var _helpers = require("../../helpers");
var _fields_utils = require("../../../../../common/fields_utils");
var _basic_aggs = require("../../../../../common/basic_aggs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const pivot = ({
  req,
  panel
}) => next => doc => {
  const {
    sort
  } = req.body.state;
  const pivotIds = (0, _fields_utils.getFieldsForTerms)(panel.pivot_id);
  const termsType = pivotIds.length > 1 ? 'multi_terms' : 'terms';
  if (pivotIds.length) {
    var _panel$pivot_rows;
    if (termsType === 'multi_terms') {
      (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.terms`, pivotIds.map(item => ({
        field: item
      })));
    } else {
      (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.field`, pivotIds[0]);
    }
    (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.size`, (_panel$pivot_rows = panel.pivot_rows) !== null && _panel$pivot_rows !== void 0 ? _panel$pivot_rows : 10);
    if (sort) {
      const series = panel.series.find(item => item.id === sort.column);
      const metric = series && (0, _lodash.last)(series.metrics);
      if (metric && metric.type === 'count') {
        (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.order`, {
          _count: sort.order
        });
      } else if (metric && series && _basic_aggs.basicAggs.includes(metric.type)) {
        const sortAggKey = `${metric.id}-SORT`;
        const fn = _helpers.bucketTransform[metric.type];
        const bucketPath = (0, _helpers.getBucketsPath)(metric.id, series.metrics).replace(metric.id, sortAggKey);
        (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.order`, {
          [bucketPath]: sort.order
        });
        (0, _helpers.overwrite)(doc, `aggs.pivot.aggs`, {
          [sortAggKey]: fn(metric)
        });
      } else {
        (0, _helpers.overwrite)(doc, `aggs.pivot.${termsType}.order`, {
          _key: (0, _lodash.get)(sort, 'order', 'asc')
        });
      }
    }
  } else {
    (0, _helpers.overwrite)(doc, 'aggs.pivot.filter.match_all', {});
  }
  return next(doc);
};
exports.pivot = pivot;