"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUserChangeDetails = canUserChangeDetails;
exports.canUserChangePassword = canUserChangePassword;
exports.canUserHaveProfile = canUserHaveProfile;
exports.isUserAnonymous = isUserAnonymous;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REALMS_ELIGIBLE_FOR_PASSWORD_CHANGE = ['reserved', 'native'];

/**
 * An Elasticsearch realm that was used to resolve and authenticate the user.
 */

function isUserAnonymous(user) {
  return user.authentication_provider.type === 'anonymous';
}

/**
 * All users are supposed to have profiles except anonymous users and users authenticated
 * via authentication HTTP proxies.
 * @param user Authenticated user information.
 */
function canUserHaveProfile(user) {
  return !isUserAnonymous(user) && user.authentication_provider.type !== 'http';
}
function canUserChangePassword(user) {
  return REALMS_ELIGIBLE_FOR_PASSWORD_CHANGE.includes(user.authentication_realm.type) && !isUserAnonymous(user);
}
function canUserChangeDetails(user, capabilities) {
  return user.authentication_realm.type === 'native' && capabilities.management.security.users;
}