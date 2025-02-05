"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserDisplayName = getUserDisplayName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * A set of fields describing Kibana user.
 */

/**
 * Set of available name-related fields to pick as display name.
 */

/**
 * Determines the display name for the provided user information.
 * @param params Set of available user's name-related fields.
 */
function getUserDisplayName(params) {
  return params.full_name || params.email || params.username;
}