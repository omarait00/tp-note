"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNumberOfItems = void 0;
var _constants = require("./constants");
var _event_logger = require("./event_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNumberOfItems = async (browser, eventLogger, timeout, layout) => {
  const {
    kbnLogger
  } = eventLogger;
  const spanEnd = eventLogger.logScreenshottingEvent('get the number of visualization items on the page', _event_logger.Actions.GET_NUMBER_OF_ITEMS, 'read');
  const {
    renderComplete: renderCompleteSelector,
    itemsCountAttribute
  } = layout.selectors;
  let itemsCount;
  try {
    // the dashboard is using the `itemsCountAttribute` attribute to let us
    // know how many items to expect since gridster incrementally adds panels
    // we have to use this hint to wait for all of them
    await browser.waitForSelector(`${renderCompleteSelector},[${itemsCountAttribute}]`, {
      timeout
    }, {
      context: _constants.CONTEXT_READMETADATA
    }, kbnLogger);

    // returns the value of the `itemsCountAttribute` if it's there, otherwise
    // we just count the number of `itemSelector`: the number of items already rendered
    itemsCount = await browser.evaluate({
      fn: (selector, countAttribute) => {
        const elementWithCount = document.querySelector(`[${countAttribute}]`);
        if (elementWithCount && elementWithCount != null) {
          const count = elementWithCount.getAttribute(countAttribute);
          if (count && count != null) {
            return parseInt(count, 10);
          }
        }
        return document.querySelectorAll(selector).length;
      },
      args: [renderCompleteSelector, itemsCountAttribute]
    }, {
      context: _constants.CONTEXT_GETNUMBEROFITEMS
    }, kbnLogger);
  } catch (error) {
    kbnLogger.error(error);
    eventLogger.error(error, _event_logger.Actions.GET_NUMBER_OF_ITEMS);
    throw error;
  }
  spanEnd({
    items_count: itemsCount
  });
  return itemsCount;
};
exports.getNumberOfItems = getNumberOfItems;