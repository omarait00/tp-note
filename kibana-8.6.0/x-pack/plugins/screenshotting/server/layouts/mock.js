"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockLayout = createMockLayout;
var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createMockLayout() {
  const layout = (0, _.createLayout)({
    id: 'preserve_layout',
    dimensions: {
      height: 100,
      width: 100
    },
    zoom: 1
  });
  layout.selectors = {
    renderComplete: 'renderedSelector',
    itemsCountAttribute: 'itemsSelector',
    screenshot: 'screenshotSelector',
    renderError: '[dataRenderErrorSelector]',
    renderErrorAttribute: 'dataRenderErrorSelector',
    timefilterDurationAttribute: 'timefilterDurationSelector'
  };
  return layout;
}