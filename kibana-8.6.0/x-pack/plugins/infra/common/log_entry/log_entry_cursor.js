"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logEntryCursorRT = exports.logEntryBeforeCursorRT = exports.logEntryAroundCursorRT = exports.logEntryAfterCursorRT = exports.getLogEntryCursorFromHit = void 0;
var rt = _interopRequireWildcard(require("io-ts"));
var _runtime_types = require("../runtime_types");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const logEntryCursorRT = rt.type({
  time: rt.number,
  tiebreaker: rt.number
});
exports.logEntryCursorRT = logEntryCursorRT;
const logEntryBeforeCursorRT = rt.type({
  before: rt.union([logEntryCursorRT, rt.literal('last')])
});
exports.logEntryBeforeCursorRT = logEntryBeforeCursorRT;
const logEntryAfterCursorRT = rt.type({
  after: rt.union([logEntryCursorRT, rt.literal('first')])
});
exports.logEntryAfterCursorRT = logEntryAfterCursorRT;
const logEntryAroundCursorRT = rt.type({
  center: logEntryCursorRT
});
exports.logEntryAroundCursorRT = logEntryAroundCursorRT;
const getLogEntryCursorFromHit = hit => (0, _runtime_types.decodeOrThrow)(logEntryCursorRT)({
  time: hit.sort[0],
  tiebreaker: hit.sort[1]
});
exports.getLogEntryCursorFromHit = getLogEntryCursorFromHit;