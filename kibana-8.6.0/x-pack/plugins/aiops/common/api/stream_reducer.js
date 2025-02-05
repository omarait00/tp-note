"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = void 0;
exports.streamReducer = streamReducer;
var _explain_log_rate_spikes = require("./explain_log_rate_spikes");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const initialState = {
  ccsWarning: false,
  changePoints: [],
  changePointsGroups: [],
  errors: [],
  loaded: 0,
  loadingState: ''
};
exports.initialState = initialState;
function streamReducer(state, action) {
  if (Array.isArray(action)) {
    return action.reduce(streamReducer, state);
  }
  switch (action.type) {
    case _explain_log_rate_spikes.API_ACTION_NAME.ADD_CHANGE_POINTS:
      return {
        ...state,
        changePoints: [...state.changePoints, ...action.payload]
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.ADD_CHANGE_POINTS_HISTOGRAM:
      const changePoints = state.changePoints.map(cp => {
        const cpHistogram = action.payload.find(h => h.fieldName === cp.fieldName && h.fieldValue === cp.fieldValue);
        if (cpHistogram) {
          cp.histogram = cpHistogram.histogram;
        }
        return cp;
      });
      return {
        ...state,
        changePoints
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.ADD_CHANGE_POINTS_GROUP:
      return {
        ...state,
        changePointsGroups: action.payload
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.ADD_CHANGE_POINTS_GROUP_HISTOGRAM:
      const changePointsGroups = state.changePointsGroups.map(cpg => {
        const cpHistogram = action.payload.find(h => h.id === cpg.id);
        if (cpHistogram) {
          cpg.histogram = cpHistogram.histogram;
        }
        return cpg;
      });
      return {
        ...state,
        changePointsGroups
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, action.payload]
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.RESET_ERRORS:
      return {
        ...state,
        errors: []
      };
    case _explain_log_rate_spikes.API_ACTION_NAME.RESET_ALL:
      return initialState;
    case _explain_log_rate_spikes.API_ACTION_NAME.UPDATE_LOADING_STATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}