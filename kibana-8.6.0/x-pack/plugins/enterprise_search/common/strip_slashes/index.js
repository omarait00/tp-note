"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripTrailingSlash = exports.stripLeadingSlash = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Helpers for stripping trailing or leading slashes from URLs or paths
 * (usually ones that come in from React Router or API endpoints)
 */

const stripTrailingSlash = url => {
  return url && url.endsWith('/') ? url.slice(0, -1) : url;
};
exports.stripTrailingSlash = stripTrailingSlash;
const stripLeadingSlash = path => {
  return path && path.startsWith('/') ? path.substring(1) : path;
};
exports.stripLeadingSlash = stripLeadingSlash;