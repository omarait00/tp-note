"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationResultsLink = exports.deconflictSignalsAndResults = void 0;
var _constants = require("../../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getNotificationResultsLink = ({
  kibanaSiemAppUrl = _constants.APP_PATH,
  id,
  from,
  to
}) => {
  if (from == null || to == null) return '';
  return `${kibanaSiemAppUrl}/detections/rules/id/${id}?timerange=(global:(linkTo:!(timeline),timerange:(from:${from},kind:absolute,to:${to})),timeline:(linkTo:!(global),timerange:(from:${from},kind:absolute,to:${to})))`;
};
exports.getNotificationResultsLink = getNotificationResultsLink;
/**
 * Given a signals array of unknown that at least has a '_id' and '_index' this will deconflict it with a results.
 * @param signals The signals array to deconflict with results
 * @param results The results to deconflict with the signals
 * @param logger The logger to log results
 */
const deconflictSignalsAndResults = ({
  signals,
  querySignals,
  logger
}) => {
  const querySignalsFiltered = querySignals.filter(result => {
    return !signals.find(signal => {
      const {
        _id,
        _index
      } = signal;
      if (_id == null || _index == null || result._id == null || result._index == null) {
        logger.error(['Notification throttle cannot determine if we can de-conflict as either the passed in signal or the results query has a null value for either "_id" or "_index".', ' Expect possible duplications in your alerting actions.', ` Passed in signals "_id": ${_id}.`, ` Passed in signals "_index": ${_index}.`, ` Passed in query "result._id": ${result._id}.`, ` Passed in query "result._index": ${result._index}.`].join(''));
        return false;
      } else {
        if (result._id === _id && result._index === _index) {
          logger.debug(['Notification throttle removing duplicate signal and query result found of', ` "_id": ${_id},`, ` "_index": ${_index}`].join(''));
          return true;
        } else {
          return false;
        }
      }
    });
  });
  return [...signals, ...querySignalsFiltered];
};
exports.deconflictSignalsAndResults = deconflictSignalsAndResults;