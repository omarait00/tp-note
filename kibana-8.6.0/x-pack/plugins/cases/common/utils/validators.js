"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInvalidTag = exports.areTotalAssigneesInvalid = void 0;
var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isInvalidTag = value => value.trim() === '';
exports.isInvalidTag = isInvalidTag;
const areTotalAssigneesInvalid = assignees => {
  if (assignees == null) {
    return false;
  }
  return assignees.length > _constants.MAX_ASSIGNEES_PER_CASE;
};
exports.areTotalAssigneesInvalid = areTotalAssigneesInvalid;