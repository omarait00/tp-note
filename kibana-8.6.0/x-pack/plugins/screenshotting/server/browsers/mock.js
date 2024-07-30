"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockBrowserDriver = createMockBrowserDriver;
exports.createMockBrowserDriverFactory = createMockBrowserDriverFactory;
var _rxjs = require("rxjs");
var _constants = require("../screenshots/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const selectors = {
  renderComplete: 'renderedSelector',
  itemsCountAttribute: 'itemsSelector',
  screenshot: 'screenshotSelector',
  timefilterDurationAttribute: 'timefilterDurationSelector',
  toastHeader: 'toastHeaderSelector'
};
function getElementsPositionAndAttributes(title, description) {
  return [{
    position: {
      boundingClientRect: {
        top: 0,
        left: 0,
        width: 800,
        height: 600
      },
      scroll: {
        x: 0,
        y: 0
      }
    },
    attributes: {
      title,
      description
    }
  }];
}
function createMockBrowserDriver() {
  const evaluate = jest.fn(async (_, {
    context
  }) => {
    switch (context) {
      case _constants.CONTEXT_DEBUG:
      case _constants.CONTEXT_SKIPTELEMETRY:
      case _constants.CONTEXT_INJECTCSS:
      case _constants.CONTEXT_WAITFORRENDER:
      case _constants.CONTEXT_GETRENDERERRORS:
        return;
      case _constants.CONTEXT_GETNUMBEROFITEMS:
        return 1;
      case _constants.CONTEXT_GETTIMERANGE:
        return 'Default GetTimeRange Result';
      case _constants.CONTEXT_ELEMENTATTRIBUTES:
        return getElementsPositionAndAttributes('Default Mock Title', 'Default ');
    }
    throw new Error(context);
  });
  const screenshot = jest.fn(async () => Buffer.from('screenshot'));
  const waitForSelector = jest.fn(async selectorArg => {
    const {
      renderComplete,
      itemsCountAttribute,
      toastHeader
    } = selectors;
    if (selectorArg === `${renderComplete},[${itemsCountAttribute}]`) {
      return true;
    }
    if (selectorArg === toastHeader) {
      return _rxjs.NEVER.toPromise();
    }
    throw new Error(selectorArg);
  });
  return {
    evaluate,
    screenshot,
    waitForSelector,
    isPageOpen: jest.fn(),
    open: jest.fn(),
    setViewport: jest.fn(async () => {}),
    waitFor: jest.fn()
  };
}
function createMockBrowserDriverFactory(driver) {
  return {
    createPage: jest.fn(() => (0, _rxjs.of)({
      driver: driver !== null && driver !== void 0 ? driver : createMockBrowserDriver(),
      error$: _rxjs.NEVER,
      close: () => (0, _rxjs.of)({})
    })),
    diagnose: jest.fn(() => (0, _rxjs.of)('message'))
  };
}