"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commonlyUsedRanges = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const commonlyUsedRanges = [{
  start: 'now-30m',
  end: 'now',
  label: 'Last 30 minutes'
}, {
  start: 'now-1h',
  end: 'now',
  label: 'Last hour'
}, {
  start: 'now-24h',
  end: 'now',
  label: 'Last 24 hours'
}, {
  start: 'now-1w',
  end: 'now',
  label: 'Last 7 days'
}, {
  start: 'now-30d',
  end: 'now',
  label: 'Last 30 days'
}];
exports.commonlyUsedRanges = commonlyUsedRanges;