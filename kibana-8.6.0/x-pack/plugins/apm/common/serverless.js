"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServerlessFunctionNameFromId = getServerlessFunctionNameFromId;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Gets the serverless function name from serverless id.
 * Serverless id example: arn:aws:lambda:us-west-2:123456789012:function:my-function
 * The function name is the last part after "function:"
 */
const serverlessIdRegex = /function:(.*)/;
function getServerlessFunctionNameFromId(serverlessId) {
  const match = serverlessIdRegex.exec(serverlessId);
  return match ? match[1] : serverlessId;
}