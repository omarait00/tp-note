"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licenseCheck = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const licenseCheck = license => {
  if (license === undefined) {
    return {
      message: 'Missing license information',
      statusCode: 400
    };
  }
  if (!license.hasAtLeast('basic')) {
    return {
      message: 'License not supported',
      statusCode: 401
    };
  }
  if (license.isActive === false) {
    return {
      message: 'License not active',
      statusCode: 403
    };
  }
  return {
    message: 'License is valid and active',
    statusCode: 200
  };
};
exports.licenseCheck = licenseCheck;