"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setToolbarAutohideAction = exports.setScrubberVisibleAction = exports.setPageAction = exports.setAutoplayIntervalAction = exports.setAutoplayAction = exports.CanvasShareableActions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
/**
 * This enumeration applies a strong type to all of the actions that can be
 * triggered from the interface.
 */
let CanvasShareableActions;
exports.CanvasShareableActions = CanvasShareableActions;
(function (CanvasShareableActions) {
  CanvasShareableActions["SET_WORKPAD"] = "SET_WORKPAD";
  CanvasShareableActions["SET_PAGE"] = "SET_PAGE";
  CanvasShareableActions["SET_SCRUBBER_VISIBLE"] = "SET_SCRUBBER_VISIBLE";
  CanvasShareableActions["SET_AUTOPLAY"] = "SET_AUTOPLAY";
  CanvasShareableActions["SET_AUTOPLAY_INTERVAL"] = "SET_AUTOPLAY_INTERVAL";
  CanvasShareableActions["SET_TOOLBAR_AUTOHIDE"] = "SET_TOOLBAR_AUTOHIDE";
})(CanvasShareableActions || (exports.CanvasShareableActions = CanvasShareableActions = {}));
const createAction = (type, payload) => ({
  type,
  payload
});

/**
 * Set the current page to display
 * @param page The zero-indexed page to display.
 */
const setPageAction = page => createAction(CanvasShareableActions.SET_PAGE, {
  page
});

/**
 * Set the visibility of the page scrubber.
 * @param visible True if it should be visible, false otherwise.
 */
exports.setPageAction = setPageAction;
const setScrubberVisibleAction = visible => {
  return createAction(CanvasShareableActions.SET_SCRUBBER_VISIBLE, {
    visible
  });
};

/**
 * Set whether the slides should automatically advance.
 * @param autoplay True if it should automatically advance, false otherwise.
 */
exports.setScrubberVisibleAction = setScrubberVisibleAction;
const setAutoplayAction = isEnabled => createAction(CanvasShareableActions.SET_AUTOPLAY, {
  isEnabled
});

/**
 * Set the interval in which slide will advance.  This is a `string` identical to
 * that used in Canvas proper: `1m`, `2s`, etc.
 * @param autoplay The interval in which slides should advance.
 */
exports.setAutoplayAction = setAutoplayAction;
const setAutoplayIntervalAction = interval => createAction(CanvasShareableActions.SET_AUTOPLAY_INTERVAL, {
  interval
});

/**
 * Set if the toolbar should be hidden if the mouse is not within the bounds of the
 * Canvas Shareable Workpad.
 * @param autohide True if the toolbar should hide, false otherwise.
 */
exports.setAutoplayIntervalAction = setAutoplayIntervalAction;
const setToolbarAutohideAction = isAutohide => createAction(CanvasShareableActions.SET_TOOLBAR_AUTOHIDE, {
  isAutohide
});
exports.setToolbarAutohideAction = setToolbarAutohideAction;
const actions = {
  setPageAction,
  setScrubberVisibleAction,
  setAutoplayAction,
  setAutoplayIntervalAction,
  setToolbarAutohideAction
};

/**
 * Strongly-types the correlation between an `action` and its return.
 */