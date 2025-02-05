"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.offsetTime = offsetTime;
exports.preprocessOffset = preprocessOffset;
var _moment = _interopRequireDefault(require("moment"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// usually reverse = false on the request, true on the response
function offsetTime(milliseconds, offset, reverse) {
  if (!offset.match(/[-+][0-9]+[mshdwMy]/g)) {
    throw new Error('Malformed `offset` at ' + offset);
  }
  const parts = offset.match(/[-+]|[0-9]+|[mshdwMy]/g);
  let add = parts[0] === '+';
  add = reverse ? !add : add;
  const mode = add ? 'add' : 'subtract';
  const momentObj = (0, _moment.default)(milliseconds)[mode](parts[1], parts[2]);
  return momentObj.valueOf();
}
function timeRangeErrorMsg(offset) {
  return `Malformed timerange offset, expecting "timerange:<number>", received: ${offset}`;
}

/*
 * Calculate offset when parameter is requesting a relative offset based on requested time range.
 *
 * @param {string} offset - offset parameter value
 * @param {number} from - kibana global time 'from' in milliseconds
 * @param {number} to - kibana global time 'to' in milliseconds
 */
function preprocessOffset(offset, from, to) {
  if (!offset.startsWith('timerange')) {
    return offset;
  }
  const parts = offset.split(':');
  if (parts.length === 1) {
    throw new Error(timeRangeErrorMsg(offset));
  }
  const factor = parseFloat(parts[1]);
  if (isNaN(factor)) {
    throw new Error(timeRangeErrorMsg(offset));
  }
  if (factor >= 0) {
    throw new Error('Malformed timerange offset, factor must be negative number.');
  }
  const deltaSeconds = (to - from) / 1000;
  const processedOffset = Math.round(deltaSeconds * factor);
  return `${processedOffset}s`;
}