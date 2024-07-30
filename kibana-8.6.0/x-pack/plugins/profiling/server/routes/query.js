"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCommonFilter = createCommonFilter;
var _server = require("../../../observability/server");
var _elasticsearch = require("../../common/elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createCommonFilter({
  kuery,
  timeFrom,
  timeTo
}) {
  return {
    bool: {
      filter: [...(0, _server.kqlQuery)(kuery), {
        range: {
          [_elasticsearch.ProfilingESField.Timestamp]: {
            gte: String(timeFrom),
            lt: String(timeTo),
            format: 'epoch_second',
            boost: 1.0
          }
        }
      }]
    }
  };
}