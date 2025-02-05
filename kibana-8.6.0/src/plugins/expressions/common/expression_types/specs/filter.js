"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Represents an object that is a Filter.
 */

const filter = {
  name: 'filter',
  from: {
    null: () => {
      return {
        type: 'filter',
        filterType: 'filter',
        // Any meta data you wish to pass along.
        meta: {},
        // And filters. If you need an "or", create a filter type for it.
        and: []
      };
    }
  }
};
exports.filter = filter;