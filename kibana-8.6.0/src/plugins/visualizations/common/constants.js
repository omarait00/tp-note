"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VisualizeConstants = exports.VISUALIZE_ENABLE_LABS_SETTING = exports.VISUALIZE_EMBEDDABLE_TYPE = exports.VISUALIZE_APP_NAME = exports.SUPPORTED_AGGREGATIONS = exports.STATE_STORAGE_KEY = exports.SAVED_OBJECTS_PER_PAGE_SETTING = exports.SAVED_OBJECTS_LIMIT_SETTING = exports.LegendSizeToPixels = exports.LegendSize = exports.GLOBAL_STATE_STORAGE_KEY = exports.DEFAULT_LEGEND_SIZE = void 0;
var _common = require("../../data/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const VISUALIZE_ENABLE_LABS_SETTING = 'visualize:enableLabs';
exports.VISUALIZE_ENABLE_LABS_SETTING = VISUALIZE_ENABLE_LABS_SETTING;
const SAVED_OBJECTS_LIMIT_SETTING = 'savedObjects:listingLimit';
exports.SAVED_OBJECTS_LIMIT_SETTING = SAVED_OBJECTS_LIMIT_SETTING;
const SAVED_OBJECTS_PER_PAGE_SETTING = 'savedObjects:perPage';
exports.SAVED_OBJECTS_PER_PAGE_SETTING = SAVED_OBJECTS_PER_PAGE_SETTING;
const VISUALIZE_EMBEDDABLE_TYPE = 'visualization';
exports.VISUALIZE_EMBEDDABLE_TYPE = VISUALIZE_EMBEDDABLE_TYPE;
const STATE_STORAGE_KEY = '_a';
exports.STATE_STORAGE_KEY = STATE_STORAGE_KEY;
const GLOBAL_STATE_STORAGE_KEY = '_g';
exports.GLOBAL_STATE_STORAGE_KEY = GLOBAL_STATE_STORAGE_KEY;
const VISUALIZE_APP_NAME = 'visualize';
exports.VISUALIZE_APP_NAME = VISUALIZE_APP_NAME;
const VisualizeConstants = {
  VISUALIZE_BASE_PATH: '/app/visualize',
  LANDING_PAGE_PATH: '/',
  WIZARD_STEP_1_PAGE_PATH: '/new',
  WIZARD_STEP_2_PAGE_PATH: '/new/configure',
  CREATE_PATH: '/create',
  EDIT_PATH: '/edit',
  EDIT_BY_VALUE_PATH: '/edit_by_value',
  APP_ID: 'visualize'
};
exports.VisualizeConstants = VisualizeConstants;
let LegendSize;
exports.LegendSize = LegendSize;
(function (LegendSize) {
  LegendSize["AUTO"] = "auto";
  LegendSize["SMALL"] = "small";
  LegendSize["MEDIUM"] = "medium";
  LegendSize["LARGE"] = "large";
  LegendSize["EXTRA_LARGE"] = "xlarge";
})(LegendSize || (exports.LegendSize = LegendSize = {}));
const LegendSizeToPixels = {
  [LegendSize.AUTO]: undefined,
  [LegendSize.SMALL]: 80,
  [LegendSize.MEDIUM]: 130,
  [LegendSize.LARGE]: 180,
  [LegendSize.EXTRA_LARGE]: 230
};
exports.LegendSizeToPixels = LegendSizeToPixels;
const DEFAULT_LEGEND_SIZE = LegendSize.MEDIUM;
exports.DEFAULT_LEGEND_SIZE = DEFAULT_LEGEND_SIZE;
const SUPPORTED_AGGREGATIONS = [...Object.values(_common.METRIC_TYPES), ...Object.values(_common.BUCKET_TYPES)];
exports.SUPPORTED_AGGREGATIONS = SUPPORTED_AGGREGATIONS;