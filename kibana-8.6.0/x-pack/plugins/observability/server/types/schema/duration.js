"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.durationType = void 0;
var _Either = require("fp-ts/lib/Either");
var t = _interopRequireWildcard(require("io-ts"));
var _duration = require("../../domain/models/duration");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const durationType = new t.Type('Duration', input => input instanceof _duration.Duration, (input, context) => _Either.either.chain(t.string.validate(input, context), value => {
  try {
    const decoded = new _duration.Duration(parseInt(value.slice(0, -1), 10), value.slice(-1));
    return t.success(decoded);
  } catch (err) {
    return t.failure(input, context);
  }
}), duration => duration.format());
exports.durationType = durationType;