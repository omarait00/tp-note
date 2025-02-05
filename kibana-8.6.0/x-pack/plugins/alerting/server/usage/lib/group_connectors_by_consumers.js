"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupConnectorsByConsumers = groupConnectorsByConsumers;
var _replace_dots_with_underscores = require("./replace_dots_with_underscores");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function groupConnectorsByConsumers(consumers) {
  return consumers.reduce((acc, consumer) => {
    return {
      ...acc,
      [consumer.key]: consumer.actions.connector_types.buckets.reduce((accBucket, bucket) => {
        return {
          ...accBucket,
          [(0, _replace_dots_with_underscores.replaceDotSymbols)(bucket.key)]: bucket.doc_count
        };
      }, {})
    };
  }, {});
}