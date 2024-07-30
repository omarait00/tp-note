"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockScreenshots = createMockScreenshots;
var _rxjs = require("rxjs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createMockScreenshots() {
  return {
    getScreenshots: jest.fn(({
      format,
      urls
    }) => {
      switch (format) {
        case 'pdf':
          return (0, _rxjs.of)({
            metrics: {
              pages: 1
            },
            data: Buffer.from('screenshot'),
            errors: [],
            renderErrors: []
          });
        default:
          return (0, _rxjs.of)({
            results: urls.map(() => ({
              timeRange: null,
              screenshots: [{
                data: Buffer.from('screenshot'),
                description: null,
                title: null
              }]
            }))
          });
      }
    })
  };
}