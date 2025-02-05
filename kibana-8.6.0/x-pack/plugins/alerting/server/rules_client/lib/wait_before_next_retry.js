"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitBeforeNextRetry = exports.randomDelayMs = exports.getExponentialDelayMultiplier = exports.RETRY_IF_CONFLICTS_DELAY = exports.RETRY_IF_CONFLICTS_ATTEMPTS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const RETRY_IF_CONFLICTS_ATTEMPTS = 2;

// milliseconds to wait before retrying when conflicts occur
// note: we considered making this random, to help avoid a stampede, but
// with 1 retry it probably doesn't matter, and adding randomness could
// make it harder to diagnose issues
exports.RETRY_IF_CONFLICTS_ATTEMPTS = RETRY_IF_CONFLICTS_ATTEMPTS;
const RETRY_IF_CONFLICTS_DELAY = 250;
exports.RETRY_IF_CONFLICTS_DELAY = RETRY_IF_CONFLICTS_DELAY;
const randomDelayMs = Math.floor(Math.random() * 100);
exports.randomDelayMs = randomDelayMs;
const getExponentialDelayMultiplier = retries => 1 + (RETRY_IF_CONFLICTS_ATTEMPTS - retries) ** 2;

/**
 * exponential delay before retry with adding random delay
 */
exports.getExponentialDelayMultiplier = getExponentialDelayMultiplier;
const waitBeforeNextRetry = async retries => {
  const exponentialDelayMultiplier = getExponentialDelayMultiplier(retries);
  await new Promise(resolve => setTimeout(resolve, RETRY_IF_CONFLICTS_DELAY * exponentialDelayMultiplier + randomDelayMs));
};
exports.waitBeforeNextRetry = waitBeforeNextRetry;