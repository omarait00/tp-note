"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_ACTION_NAME = void 0;
exports.addChangePointsAction = addChangePointsAction;
exports.addChangePointsGroupAction = addChangePointsGroupAction;
exports.addChangePointsGroupHistogramAction = addChangePointsGroupHistogramAction;
exports.addChangePointsHistogramAction = addChangePointsHistogramAction;
exports.addErrorAction = addErrorAction;
exports.pingAction = pingAction;
exports.resetAllAction = resetAllAction;
exports.resetErrorsAction = resetErrorsAction;
exports.updateLoadingStateAction = updateLoadingStateAction;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const API_ACTION_NAME = {
  ADD_CHANGE_POINTS: 'add_change_points',
  ADD_CHANGE_POINTS_HISTOGRAM: 'add_change_points_histogram',
  ADD_CHANGE_POINTS_GROUP: 'add_change_point_group',
  ADD_CHANGE_POINTS_GROUP_HISTOGRAM: 'add_change_point_group_histogram',
  ADD_ERROR: 'add_error',
  PING: 'ping',
  RESET_ALL: 'reset_all',
  RESET_ERRORS: 'reset_errors',
  UPDATE_LOADING_STATE: 'update_loading_state'
};
exports.API_ACTION_NAME = API_ACTION_NAME;
function addChangePointsAction(payload) {
  return {
    type: API_ACTION_NAME.ADD_CHANGE_POINTS,
    payload
  };
}
function addChangePointsHistogramAction(payload) {
  return {
    type: API_ACTION_NAME.ADD_CHANGE_POINTS_HISTOGRAM,
    payload
  };
}
function addChangePointsGroupAction(payload) {
  return {
    type: API_ACTION_NAME.ADD_CHANGE_POINTS_GROUP,
    payload
  };
}
function addChangePointsGroupHistogramAction(payload) {
  return {
    type: API_ACTION_NAME.ADD_CHANGE_POINTS_GROUP_HISTOGRAM,
    payload
  };
}
function addErrorAction(payload) {
  return {
    type: API_ACTION_NAME.ADD_ERROR,
    payload
  };
}
function resetErrorsAction() {
  return {
    type: API_ACTION_NAME.RESET_ERRORS
  };
}
function pingAction() {
  return {
    type: API_ACTION_NAME.PING
  };
}
function resetAllAction() {
  return {
    type: API_ACTION_NAME.RESET_ALL
  };
}
function updateLoadingStateAction(payload) {
  return {
    type: API_ACTION_NAME.UPDATE_LOADING_STATE,
    payload
  };
}