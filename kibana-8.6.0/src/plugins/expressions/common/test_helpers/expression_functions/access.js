"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.access = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const access = {
  name: 'access',
  help: 'Access key on input object or return the input, if it is not an object',
  args: {
    key: {
      aliases: ['_'],
      help: 'Key on input object',
      types: ['string']
    }
  },
  fn: (input, {
    key
  }, context) => {
    return !input ? input : typeof input === 'object' ? input[key] : input;
  }
};
exports.access = access;