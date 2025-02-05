"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RangeKey = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const id = Symbol('id');
class RangeKey {
  findCustomLabel(from, to, ranges) {
    var _find;
    return (_find = (ranges || []).find(range => (from == null && range.from == null || range.from === from) && (to == null && range.to == null || range.to === to))) === null || _find === void 0 ? void 0 : _find.label;
  }
  constructor(bucket, allRanges) {
    (0, _defineProperty2.default)(this, id, void 0);
    (0, _defineProperty2.default)(this, "gte", void 0);
    (0, _defineProperty2.default)(this, "lt", void 0);
    (0, _defineProperty2.default)(this, "label", void 0);
    this.gte = bucket.from == null ? -Infinity : bucket.from;
    this.lt = bucket.to == null ? +Infinity : bucket.to;
    this.label = this.findCustomLabel(bucket.from, bucket.to, allRanges);
    this[id] = RangeKey.idBucket(bucket);
  }
  static idBucket(bucket) {
    return `from:${bucket.from},to:${bucket.to}`;
  }
  toString() {
    return this[id];
  }
}
exports.RangeKey = RangeKey;