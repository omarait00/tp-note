"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const sleep = {
  name: 'sleep',
  args: {
    time: {
      aliases: ['_'],
      help: 'Time in milliseconds for how long to sleep',
      types: ['number']
    }
  },
  help: '',
  fn: async (input, args, context) => {
    await new Promise(r => setTimeout(r, args.time));
    return input;
  }
};
exports.sleep = sleep;