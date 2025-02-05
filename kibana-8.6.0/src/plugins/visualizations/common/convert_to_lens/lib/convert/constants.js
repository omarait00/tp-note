"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIBLING_PIPELINE_AGGS = exports.PIPELINE_AGGS = exports.PARENT_PIPELINE_AGGS = void 0;
var _common = require("../../../../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const PARENT_PIPELINE_AGGS = [_common.METRIC_TYPES.CUMULATIVE_SUM, _common.METRIC_TYPES.DERIVATIVE, _common.METRIC_TYPES.MOVING_FN];
exports.PARENT_PIPELINE_AGGS = PARENT_PIPELINE_AGGS;
const SIBLING_PIPELINE_AGGS = [_common.METRIC_TYPES.AVG_BUCKET, _common.METRIC_TYPES.MAX_BUCKET, _common.METRIC_TYPES.MIN_BUCKET, _common.METRIC_TYPES.SUM_BUCKET];
exports.SIBLING_PIPELINE_AGGS = SIBLING_PIPELINE_AGGS;
const PIPELINE_AGGS = [...PARENT_PIPELINE_AGGS, ...SIBLING_PIPELINE_AGGS];
exports.PIPELINE_AGGS = PIPELINE_AGGS;