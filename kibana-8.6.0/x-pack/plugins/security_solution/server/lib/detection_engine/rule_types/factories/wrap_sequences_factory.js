"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSequencesFactory = void 0;
var _build_alert_group_from_sequence = require("./utils/build_alert_group_from_sequence");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const wrapSequencesFactory = ({
  logger,
  completeRule,
  ignoreFields,
  mergeStrategy,
  spaceId,
  indicesToQuery,
  alertTimestampOverride
}) => (sequences, buildReasonMessage) => sequences.reduce((acc, sequence) => [...acc, ...(0, _build_alert_group_from_sequence.buildAlertGroupFromSequence)(logger, sequence, completeRule, mergeStrategy, spaceId, buildReasonMessage, indicesToQuery, alertTimestampOverride)], []);
exports.wrapSequencesFactory = wrapSequencesFactory;