"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toInt = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * NOTE: The toInt() formatter does _not_ play well if we enter the "e" letter in a "number" input
 * as it does not trigger an "onChange" event.
 * I searched if it was a bug and found this thread (https://github.com/facebook/react/pull/7359#event-1017024857)
 * We will need to investigate this a little further.
 *
 * @param value The string value to convert to number
 */
const toInt = value => parseFloat(value);
exports.toInt = toInt;