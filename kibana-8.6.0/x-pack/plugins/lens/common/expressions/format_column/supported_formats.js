"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportedFormats = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const supportedFormats = {
  number: {
    formatId: 'number',
    decimalsToPattern: (decimals = 2) => {
      if (decimals === 0) {
        return `0,0`;
      }
      return `0,0.${'0'.repeat(decimals)}`;
    }
  },
  percent: {
    formatId: 'percent',
    decimalsToPattern: (decimals = 2) => {
      if (decimals === 0) {
        return `0,0%`;
      }
      return `0,0.${'0'.repeat(decimals)}%`;
    }
  },
  bytes: {
    formatId: 'bytes',
    decimalsToPattern: (decimals = 2) => {
      if (decimals === 0) {
        return `0,0b`;
      }
      return `0,0.${'0'.repeat(decimals)}b`;
    }
  },
  bits: {
    formatId: 'number',
    decimalsToPattern: (decimals = 2) => {
      if (decimals === 0) {
        return `0,0bitd`;
      }
      return `0,0.${'0'.repeat(decimals)}bitd`;
    }
  }
};
exports.supportedFormats = supportedFormats;