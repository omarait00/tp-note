"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateShareToken = generateShareToken;
var _crypto = _interopRequireDefault(require("crypto"));
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Char set of 51 characters gets an even distribution for each byte of randomness
 * generated because 255 (max number) % 51 = 0.
 */
const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO0123456789';

/**
 * Generate 40 random characters of a pre-checked charset for share tokens.
 *
 * Samples:
 *
 * a7EyHf1LrK37uCx4ld3m7Lhkgl2kxuMrIn6umkjz
 * 72wq34jHgkix9noCbEKIjfmivD1pBypxmbs3wzEn
 * mtr9Eq5w06rIhDHzM73vBumL4joKjkaILK9a5ikI
 * 6cbikArFgx1gwjcBc9v3FxdGojzjdpKbCGJspCHA
 * sOi94wwygidgKozwfDnoeIhpFywMwyMkBFcd5oCi
 */
function generateShareToken() {
  return [..._crypto.default.randomBytes(40)].reduce((acc, nr) => {
    return acc + CHAR_SET[nr % CHAR_SET.length];
  }, '');
}