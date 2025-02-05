"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOAuthTokenPackageParams = void 0;
var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getOAuthTokenPackageParams = rawCookieHeader => {
  // In the future the token package will be stored in the login session. For now it's in a cookie.

  if (!rawCookieHeader) {
    return {};
  }

  /**
   * A request can have multiple cookie headers and each header can hold multiple cookies.
   * Within a header, cookies are separated by '; '. Here we are splitting out the individual
   * cookies from the header(s) and looking for the specific one that holds our token package.
   */

  const cookieHeaders = Array.isArray(rawCookieHeader) ? rawCookieHeader : [rawCookieHeader];
  let tokenPackage;
  cookieHeaders.flatMap(rawHeader => rawHeader.split('; ')).forEach(rawCookie => {
    const [cookieName, cookieValue] = rawCookie.split('=');
    if (cookieName === _constants.ENTERPRISE_SEARCH_KIBANA_COOKIE) tokenPackage = cookieValue;
  });
  if (tokenPackage) {
    return {
      token_package: tokenPackage
    };
  } else {
    return {};
  }
};
exports.getOAuthTokenPackageParams = getOAuthTokenPackageParams;