"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitByEverything = splitByEverything;
var _helpers = require("../../helpers");
var _fields_utils = require("../../../../../common/fields_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

function splitByEverything(req, panel, series) {
  return next => doc => {
    if (series.split_mode === 'everything' || series.split_mode === 'terms' && !(0, _fields_utils.getFieldsForTerms)(series.terms_field).length) {
      (0, _helpers.overwrite)(doc, `aggs.${series.id}.filter.match_all`, {});
    }
    return next(doc);
  };
}