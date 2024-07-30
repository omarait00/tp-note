"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeControlOrdersZeroBased = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const makeControlOrdersZeroBased = input => {
  if (input.panels && typeof input.panels === 'object' && Object.keys(input.panels).length > 0 && !Object.values(input.panels).find(panel => {
    var _panel$order;
    return ((_panel$order = panel.order) !== null && _panel$order !== void 0 ? _panel$order : 0) === 0;
  })) {
    // 0th element could not be found. Reorder all panels from 0;
    const newPanels = Object.values(input.panels).sort((a, b) => a.order > b.order ? 1 : -1).map((panel, index) => {
      panel.order = index;
      return panel;
    }).reduce((acc, currentPanel) => {
      acc[currentPanel.explicitInput.id] = currentPanel;
      return acc;
    }, {});
    input.panels = newPanels;
  }
  return input;
};
exports.makeControlOrdersZeroBased = makeControlOrdersZeroBased;