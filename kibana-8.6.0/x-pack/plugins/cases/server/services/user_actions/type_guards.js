"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isStringArray = exports.isAssigneesArray = void 0;
var _lodash = require("lodash");
var _assignee = require("../../../common/api/cases/assignee");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isStringArray = value => {
  return Array.isArray(value) && value.every(val => (0, _lodash.isString)(val));
};
exports.isStringArray = isStringArray;
const isAssigneesArray = value => {
  return _assignee.CaseAssigneesRt.is(value);
};
exports.isAssigneesArray = isAssigneesArray;